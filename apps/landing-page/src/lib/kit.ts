import { createHmac, timingSafeEqual } from 'node:crypto';
import type { IntakePayload } from './schemas';

// Kit (ConvertKit) wrapper. All server-to-server calls go through the v4 API
// at api.kit.com/v4 with the X-Kit-Api-Key header. The public hosted-form
// endpoint (app.kit.com/forms/{id}/subscriptions) is not used: it silently
// no-ops POSTs that don't carry the ck.5.js anti-bot fingerprint, returning
// 302 to look like success while creating nothing.

const KIT_BASE = 'https://api.kit.com/v4';

function apiKey(): string {
  const k = process.env.KIT_API_KEY;
  if (!k) throw new Error('KIT_API_KEY is not set');
  return k;
}

function authHeaders(): Record<string, string> {
  return {
    'X-Kit-Api-Key': apiKey(),
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

// Subscribe an email to a Kit form via the v4 API. Kit's v4 has no single-
// call form-subscribe endpoint, so we do it in three steps:
//   1. POST /v4/subscribers           -> create the subscriber, returns id
//   2. PUT  /v4/subscribers/{id}      -> write custom fields (insider_url)
//   3. POST /v4/forms/{form}/subscribers/{id} -> attach to form
// Field write happens BEFORE form attach so the welcome email's merge tags
// always see a populated insider_url. Kit's "Joins a form" trigger does
// NOT fire reliably for v4 API attaches (it fires for hosted-form and
// manual adds only), so the welcome automation is wired to trigger on the
// `waitlist-signup` tag instead — see api/waitlist/route.ts step (h).
// State is always "active" — the v4 API bypasses double opt-in; GDPR
// consent is captured on our own form.
export async function kitFormSubscribe(params: {
  email: string;
  formId: string;
  fields?: Record<string, string>;
}): Promise<{ subscriberId: string; state: string }> {
  const { email, formId, fields } = params;

  const createRes = await fetch(`${KIT_BASE}/subscribers`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email_address: email }),
  });
  if (!createRes.ok) {
    const body = await createRes.text().catch(() => '');
    throw new Error(
      `kitFormSubscribe (create) failed: ${createRes.status} ${body.slice(0, 500)}`,
    );
  }
  const createData: unknown = await createRes.json().catch(() => ({}));
  const sub =
    (createData as { subscriber?: { id?: unknown; state?: unknown } }).subscriber ??
    (createData as { id?: unknown; state?: unknown });
  if (!sub || sub.id == null) {
    throw new Error('kitFormSubscribe: create response missing subscriber.id');
  }
  const subscriberId = String(sub.id);
  const state = typeof sub.state === 'string' ? sub.state : 'unknown';

  if (fields && Object.keys(fields).length > 0) {
    await kitUpdateSubscriberFields(subscriberId, fields);
  }

  const attachUrl = `${KIT_BASE}/forms/${encodeURIComponent(formId)}/subscribers/${encodeURIComponent(subscriberId)}`;
  const attachRes = await fetch(attachUrl, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!attachRes.ok) {
    const body = await attachRes.text().catch(() => '');
    throw new Error(
      `kitFormSubscribe (attach) failed: ${attachRes.status} ${body.slice(0, 500)}`,
    );
  }

  return { subscriberId, state };
}

export async function kitUpdateSubscriberFields(
  subscriberId: string,
  fields: Record<string, string>,
): Promise<void> {
  const url = `${KIT_BASE}/subscribers/${encodeURIComponent(subscriberId)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `kitUpdateSubscriberFields failed: ${res.status} ${body.slice(0, 500)}`,
    );
  }
}

// --- Tag management ------------------------------------------------------
//
// Kit's API requires tag IDs, not names. We list the account's tags once per
// process lifetime, cache the name->id mapping, and create missing tags on
// demand. The cache lives for the lifetime of the serverless instance.

let _tagCache: Map<string, string> | null = null;

async function loadTagCache(): Promise<Map<string, string>> {
  if (_tagCache) return _tagCache;
  const res = await fetch(`${KIT_BASE}/tags?per_page=500`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`kit list tags failed: ${res.status} ${body.slice(0, 500)}`);
  }
  const data: unknown = await res.json().catch(() => ({}));
  const tags = ((data as { tags?: Array<{ id: unknown; name: unknown }> }).tags ?? [])
    .filter((t) => t && typeof t.name === 'string' && t.id != null);
  _tagCache = new Map(tags.map((t) => [String(t.name), String(t.id)]));
  return _tagCache;
}

async function resolveTagId(name: string): Promise<string> {
  const cache = await loadTagCache();
  const existing = cache.get(name);
  if (existing) return existing;

  const res = await fetch(`${KIT_BASE}/tags`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`kit create tag failed: ${res.status} ${body.slice(0, 500)}`);
  }
  const data: unknown = await res.json().catch(() => ({}));
  const tag = (data as { tag?: { id?: unknown } }).tag ?? (data as { id?: unknown });
  if (!tag || tag.id == null) {
    throw new Error('kit create tag: response missing tag.id');
  }
  const id = String(tag.id);
  cache.set(name, id);
  return id;
}

export async function kitAddTagsToSubscriber(
  subscriberId: string,
  tagNames: string[],
): Promise<void> {
  for (const name of tagNames) {
    const tagId = await resolveTagId(name);
    const res = await fetch(
      `${KIT_BASE}/tags/${encodeURIComponent(tagId)}/subscribers/${encodeURIComponent(subscriberId)}`,
      { method: 'POST', headers: authHeaders() },
    );
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(
        `kit add tag "${name}" failed: ${res.status} ${body.slice(0, 500)}`,
      );
    }
  }
}

// --- Intake → Kit translation -------------------------------------------
//
// Tags drive Kit's segment tool. Custom fields are for personalising email
// content. Keep the tag list focused (high-signal: region, intent, club,
// audience, genres, submission type) and put everything else into fields.

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function intakeToKit(intake: IntakePayload): {
  tags: string[];
  fields: Record<string, string>;
} {
  const tags: string[] = [];
  const fields: Record<string, string> = {};

  if (intake.region === 'reader') {
    const a = intake.answers;
    tags.push('audience-reader', `intent-${intake.intent}`);
    if (a.club) tags.push('reader-club');
    if (a.audience) tags.push(`read-audience-${slug(a.audience)}`);
    for (const g of a.genres) tags.push(`genre-${slug(g)}`);
    for (const l of a.lengths) tags.push(`reader-length-${slug(l)}`);
    if (a.reaction) tags.push(`reaction-${slug(a.reaction)}`);

    fields.region = 'reader';
    fields.intent = intake.intent;
    fields.reader_audience = a.audience ?? '';
    fields.reader_genres = a.genres.join(', ');
    fields.reader_lengths = a.lengths.join(', ');
    fields.reader_devices = a.devices.join(', ');
    fields.reader_modes = a.modes.join(', ');
    fields.reader_whens = a.whens.join(', ');
    fields.reader_reaction = a.reaction ?? '';
    fields.reader_club = a.club ? 'yes' : 'no';
  } else {
    const a = intake.answers;
    tags.push('audience-writer');
    if (a.submission) tags.push(`submission-${slug(a.submission)}`);
    for (const f of a.feedback) tags.push(`writer-feedback-${slug(f)}`);
    if (a.warningsMode === 'list') {
      for (const w of a.warnings) tags.push(`writer-warning-${slug(w)}`);
    }

    fields.region = 'writer';
    fields.writer_submission = a.submission ?? '';
    fields.writer_feedback = a.feedback.join(', ');
    fields.writer_warnings_mode = a.warningsMode ?? '';
    fields.writer_warnings =
      a.warningsMode === 'none' ? 'none' : a.warnings.join(', ');
    fields.writer_filename = a.fileName ?? '';
    fields.writer_filesize = a.fileSize != null ? String(a.fileSize) : '';
  }

  return { tags, fields };
}

export function kitVerifyWebhook(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  if (!signatureHeader) return false;
  const secret = process.env.KIT_WEBHOOK_SECRET;
  if (!secret) throw new Error('KIT_WEBHOOK_SECRET is not set');

  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const provided = signatureHeader.trim().replace(/^sha256=/, '');

  const a = Buffer.from(expected, 'hex');
  let b: Buffer;
  try {
    b = Buffer.from(provided, 'hex');
  } catch {
    return false;
  }
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
