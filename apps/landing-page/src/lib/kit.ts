import { createHmac, timingSafeEqual } from 'node:crypto';

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
//   3. POST /v4/forms/{form}/subscribers/{id} -> attach to form, fires the
//      "Subscribes to Form" automation
// Field write happens BEFORE form attach so the automation's merge tags
// always see a populated insider_url when the welcome email renders. This
// lets us drop the safety-net wait step in Kit's automation to zero.
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
