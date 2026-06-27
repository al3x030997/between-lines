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
    if (a.betaPool) tags.push('reader-beta-pool');
    if (a.newsletter) tags.push('reader-newsletter');
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
    fields.reader_beta_pool = a.betaPool ? 'yes' : 'no';
    fields.reader_club = a.club ? 'yes' : 'no';
    fields.reader_newsletter = a.newsletter ? 'yes' : 'no';
    fields.reader_favorite_books = a.favoriteBooks.join(' | ');

    // v12 4-role pop-up: richer "Discover" answers.
    const d = a.discover;
    if (d) {
      if (d.bookLove?.title) fields.reader_book_love = d.bookLove.title;
      if (d.bookLove?.author) fields.reader_book_love_author = d.bookLove.author;
      if (d.bookLove?.why) fields.reader_book_love_why = d.bookLove.why;
      if (d.formats?.length) {
        fields.reader_formats = d.formats.join(', ');
        for (const f of d.formats) tags.push(`reader-format-${slug(f)}`);
      }
      if (d.goals?.length) {
        fields.reader_goals = d.goals.join(', ');
        for (const g of d.goals) tags.push(`reader-goal-${slug(g)}`);
      }
      if (d.goalsOther) fields.reader_goals_other = d.goalsOther;
    }
  } else {
    const a = intake.answers;
    tags.push('audience-writer');
    if (a.practice) tags.push(`practice-${a.practice}`);
    if (a.journey) tags.push(`journey-${a.journey}`);
    if (a.pubRoute) tags.push(`pub-route-${a.pubRoute}`);
    if (a.pubRoute === 'traditional' && a.agentStage) {
      tags.push(`agent-stage-${a.agentStage}`);
    }
    if (a.manuscriptStage) tags.push(`ms-stage-${a.manuscriptStage}`);
    if (a.targetLength) tags.push(`target-length-${a.targetLength}`);
    if (a.language) tags.push(`language-${a.language}`);

    const primaryGenres = [
      ...a.genre.fictionPrimary,
      ...a.genre.nonfictionPrimary,
    ].slice(0, 3);
    for (const g of primaryGenres) tags.push(`genre-${slug(g)}`);
    if (a.genre.openToAll) tags.push('genre-open-to-all');

    for (const goal of a.goals.selected) {
      tags.push(`goal-${slug(goal)}`);
    }
    if (a.goals.buildAgentList.mode) {
      tags.push(`agent-list-mode-${a.goals.buildAgentList.mode}`);
    }
    if (a.goals.uploadSample.wantHelp != null) {
      tags.push(`help-wanted-${a.goals.uploadSample.wantHelp ? 'yes' : 'no'}`);
    }
    for (const tier of a.goals.uploadSample.helpKit.aiTierInterest) {
      tags.push(`ai-tier-${tier}`);
    }
    if (a.betaPool) tags.push('writer-beta-pool');
    if (!a.pod) tags.push('writer-pod-opt-out');
    if (a.giveaways === true) tags.push('writer-giveaways-yes');
    if (a.platform) tags.push(`writer-platform-${a.platform}`);

    fields.region = 'writer';
    fields.writer_practice = a.practice ?? '';
    fields.writer_genre_focus = a.genre.focus ?? '';
    fields.writer_genre_fiction = a.genre.fictionPrimary.join(', ');
    fields.writer_genre_nonfiction = a.genre.nonfictionPrimary.join(', ');
    fields.writer_genre_open_to_all = a.genre.openToAll ? 'yes' : 'no';
    fields.writer_journey = a.journey ?? '';
    fields.writer_awards = a.awards;
    fields.writer_working_on = a.workingOn ?? '';
    fields.writer_pub_route = a.pubRoute ?? '';
    fields.writer_agent_stage = a.agentStage ?? '';
    fields.writer_manuscript_stage = a.manuscriptStage ?? '';
    fields.writer_language = a.language ?? '';
    fields.writer_giveaways =
      a.giveaways == null ? '' : a.giveaways ? 'yes' : 'no';
    fields.writer_target_length = a.targetLength ?? '';
    fields.writer_submissions = a.submissions ?? '';
    fields.writer_timeline = a.timeline ?? '';
    fields.writer_month_goal = a.monthGoal ?? '';
    fields.writer_fav_books = a.favoriteBooks.join(' | ');
    fields.writer_platform = a.platform ?? '';
    fields.writer_beta_pool = a.betaPool ? 'yes' : 'no';
    fields.writer_pod = a.pod ? 'yes' : 'no';
    fields.writer_goals = a.goals.selected.join(', ');
    fields.writer_agent_list_mode = a.goals.buildAgentList.mode ?? '';
    fields.writer_agent_list_filename = a.goals.buildAgentList.list?.name ?? '';
    fields.writer_agent_list_filesize =
      a.goals.buildAgentList.list?.size != null
        ? String(a.goals.buildAgentList.list.size)
        : '';
    fields.writer_sample_filename = a.goals.uploadSample.sample?.name ?? '';
    fields.writer_sample_filesize =
      a.goals.uploadSample.sample?.size != null
        ? String(a.goals.uploadSample.sample.size)
        : '';
    fields.writer_help_wanted =
      a.goals.uploadSample.wantHelp == null
        ? ''
        : a.goals.uploadSample.wantHelp
        ? 'yes'
        : 'no';
    fields.writer_synopsis_filename =
      a.goals.uploadSample.helpKit.synopsis?.name ?? '';
    fields.writer_pitch_filename =
      a.goals.uploadSample.helpKit.pitch?.name ?? '';
    fields.writer_query_filename =
      a.goals.uploadSample.helpKit.queryLetter?.name ?? '';
    fields.writer_ai_tier_interest =
      a.goals.uploadSample.helpKit.aiTierInterest.join(', ');
    fields.writer_also_choose = a.goals.uploadSample.alsoChoose.join(', ');

    // v12 4-role pop-up: creator answers (writer / poet / illustrator). The
    // role is carried by `practice` (prose / poetry / illustration) above.
    const c = a.creator;
    if (c) {
      if (c.stage) {
        fields.creator_stage = c.stage;
        tags.push(`creator-stage-${c.stage}`);
      }
      if (c.credits.length) {
        fields.creator_credits = c.credits.join(', ');
        for (const cr of c.credits) tags.push(`creator-credit-${slug(cr)}`);
      }
      if (c.bio) fields.creator_bio = c.bio;
      if (c.links.length) fields.creator_links = c.links.join(' | ');
      if (c.goals.length) {
        fields.creator_goals = c.goals.join(', ');
        for (const g of c.goals) tags.push(`creator-goal-${slug(g)}`);
      }
      if (c.goalsOther) fields.creator_goals_other = c.goalsOther;
      // Writers may attach up to two works. New payloads carry `works`; legacy
      // payloads carry a singular `work` — normalise to an array either way.
      const works = c.works ?? (c.work ? [c.work] : []);
      works.forEach((w, i) => {
        // First work keeps the original field names; extras get a numbered suffix.
        const p = i === 0 ? 'creator_work' : `creator_work_${i + 1}`;
        fields[`${p}_title`] = w.title;
        fields[`${p}_genres`] = w.genres.join(', ');
        fields[`${p}_moods`] = w.moods.join(', ');
        fields[`${p}_format`] = w.format ?? '';
        for (const g of w.genres.slice(0, 3)) tags.push(`genre-${slug(g)}`);
      });
      if (c.poetry) {
        fields.creator_poetry_forms = c.poetry.forms.join(', ');
        fields.creator_poetry_moods = c.poetry.moods.join(', ');
        fields.creator_poetry_themes = c.poetry.themes.join(', ');
        for (const f of c.poetry.forms) tags.push(`poetry-form-${slug(f)}`);
      }
      if (c.illustration) {
        fields.creator_illo_mediums = c.illustration.mediums.join(', ');
        fields.creator_illo_styles = c.illustration.styles.join(', ');
        fields.creator_illo_uses = c.illustration.uses.join(', ');
        for (const m of c.illustration.mediums) tags.push(`illo-medium-${slug(m)}`);
      }
    }
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
