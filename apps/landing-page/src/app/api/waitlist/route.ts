import { NextResponse, type NextRequest } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { waitlistSubscribers } from '@/lib/db/schema';
import { buildInsiderUrl, isAllowedOrigin } from '@/lib/site';
import { waitlistSubmitSchema } from '@/lib/schemas';
import {
  getClientIp,
  waitlistEmailLimiter,
  waitlistIpLimiter,
} from '@/lib/ratelimit';
import {
  intakeToKit,
  kitAddTagsToSubscriber,
  kitFormSubscribe,
  kitUpdateSubscriberFields,
} from '@/lib/kit';
import { signCookieJwt, signMagicToken } from '@/lib/tokens';
import { setInsiderCookie } from '@/lib/cookies';
import { trackServer } from '@/lib/analytics';

export const runtime = 'nodejs';

const KIT_FORM_ID = process.env.KIT_FORM_ID;

function retryAfter(reset: number): Record<string, string> {
  const seconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return { 'Retry-After': String(seconds) };
}

export async function POST(req: NextRequest) {
  // (a) Origin check — same-origin direct POSTs send no Origin header (null) and are allowed.
  const origin = req.headers.get('origin');
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  // (b) Parse + honeypot.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const parsed = waitlistSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_input' }, { status: 400 });
  }
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: false, error: 'invalid_input' }, { status: 400 });
  }

  const email = parsed.data.email.trim();
  const emailLower = email.toLowerCase();
  const ip = getClientIp(req);
  const userAgent = req.headers.get('user-agent') ?? '';

  // (c) IP rate limit.
  const ipRl = await waitlistIpLimiter.limit(ip);
  if (!ipRl.success) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: retryAfter(ipRl.reset) },
    );
  }

  // (d) Per-email rate limit.
  const emailRl = await waitlistEmailLimiter.limit(emailLower);
  if (!emailRl.success) {
    return NextResponse.json(
      { ok: false, error: 'rate_limited' },
      { status: 429, headers: retryAfter(emailRl.reset) },
    );
  }

  // (e) Upsert by email_lower. RETURNING gives us the canonical row (publicId, version).
  // Intake answers, if present, are stored as JSONB; a later submission with new
  // answers overwrites the prior payload.
  const now = new Date();
  const intake = parsed.data.intake ?? null;
  console.log('[waitlist] intake', {
    present: !!intake,
    region: intake?.region ?? null,
  });
  const [row] = await db
    .insert(waitlistSubscribers)
    .values({
      email,
      emailLower,
      consentGiven: true,
      consentIp: ip,
      consentUserAgent: userAgent.slice(0, 1000),
      consentAt: now,
      source: 'landing-v8',
      intake,
    })
    .onConflictDoUpdate({
      target: waitlistSubscribers.emailLower,
      set: {
        email,
        consentGiven: true,
        consentIp: ip,
        consentUserAgent: userAgent.slice(0, 1000),
        consentAt: now,
        updatedAt: now,
        ...(intake ? { intake } : {}),
      },
    })
    .returning();

  // (f) Subscribe via Kit's v4 API. The insider_url field is written BEFORE
  // the form attach so the welcome-sequence merge tag always sees it. This
  // lets the automation's wait step run at zero.
  if (!KIT_FORM_ID) {
    console.error('[waitlist] KIT_FORM_ID is not set — DB row persisted, Kit subscribe skipped');
    return NextResponse.json({ ok: true, insider: false });
  }

  const token = signMagicToken(row.publicId, row.magicLinkVersion);
  let kitResult: { subscriberId: string; state: string };
  try {
    kitResult = await kitFormSubscribe({
      email,
      formId: KIT_FORM_ID,
      fields: { insider_url: buildInsiderUrl(token) },
    });
  } catch (err) {
    console.error('[waitlist] kitFormSubscribe failed; webhook will reconcile', err);
    return NextResponse.json({ ok: true, insider: false, pending: true });
  }

  // (g) Persist Kit subscriber id + bump unlock counters so the existing
  // /api/insider/unlock magic-link path stays consistent (signup is just an
  // immediate auto-unlock). Match the same updates the unlock route makes.
  await db
    .update(waitlistSubscribers)
    .set({
      kitSubscriberId: kitResult.subscriberId,
      unlockCount: sql`${waitlistSubscribers.unlockCount} + 1`,
      lastUnlockAt: now,
      updatedAt: now,
    })
    .where(eq(waitlistSubscribers.id, row.id));

  // (h) Tag the subscriber. Always add the `waitlist-signup` marker — Kit's
  // "Joins a form" trigger does not fire reliably when subscribers are
  // attached via the v4 API, so the welcome automation triggers on this
  // tag instead. This also covers the direct-signup path (no intake).
  // Intake-derived tags + fields are added on top for segmentation when
  // intake is present. All tag/field writes are non-fatal — the
  // subscriber and welcome email are already in flight.
  try {
    await kitAddTagsToSubscriber(kitResult.subscriberId, ['waitlist-signup']);
  } catch (err) {
    console.error('[waitlist] signup tag write failed', err);
  }
  if (intake) {
    const { tags, fields } = intakeToKit(intake);
    if (Object.keys(fields).length > 0) {
      try {
        await kitUpdateSubscriberFields(kitResult.subscriberId, fields);
      } catch (err) {
        console.error('[waitlist] intake fields write failed', err);
      }
    }
    if (tags.length > 0) {
      try {
        await kitAddTagsToSubscriber(kitResult.subscriberId, tags);
      } catch (err) {
        console.error('[waitlist] intake tags write failed', err);
      }
    }
  }

  // (i) Sign the insider cookie and attach it to the response so the browser
  // can go straight to /insider after submit. The magic link in the welcome
  // email keeps working for revisits from other devices.
  const jwt = await signCookieJwt({
    sid: kitResult.subscriberId,
    pid: row.publicId,
  });
  const res = NextResponse.json({ ok: true, insider: true });
  setInsiderCookie(res, jwt);

  // (j) Fire the same analytics event the magic-link unlock does, with a
  // source tag so we can distinguish.
  await trackServer('insider_unlock', {
    kit_id: kitResult.subscriberId,
    source: 'signup',
  });

  return res;
}
