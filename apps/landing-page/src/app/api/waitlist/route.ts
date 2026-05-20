import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db/client';
import { waitlistSubscribers } from '@/lib/db/schema';
import { isAllowedOrigin } from '@/lib/site';
import { waitlistSubmitSchema } from '@/lib/schemas';
import {
  getClientIp,
  waitlistEmailLimiter,
  waitlistIpLimiter,
} from '@/lib/ratelimit';
import { kitFormSubscribe } from '@/lib/kit';

export const runtime = 'nodejs';

const KIT_FORM_ID = process.env.KIT_FORM_ID;

const OK = NextResponse.json({ ok: true });

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
  const now = new Date();
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
      },
    })
    .returning();

  // (f) Subscribe via Kit's hosted-form endpoint. Kit's v4 API does not expose
  // a working form-subscribe endpoint for our form type, but the public hosted-
  // form submit URL (what the embed widget posts to) works without auth.
  // No subscriber id comes back here — the webhook handler picks the user up
  // by email_lower on subscriber.subscriber_activate and fills in
  // kit_subscriber_id + insider_url at that point. The 10-minute delay on the
  // welcome-sequence automation gives the webhook room to reconcile.
  if (!KIT_FORM_ID) {
    console.error('[waitlist] KIT_FORM_ID is not set — DB row persisted, Kit subscribe skipped');
    return OK;
  }

  // Suppress unused-variable warning — `row` is still useful for future
  // synchronous reconciliation paths if Kit ever exposes a subscriber id here.
  void row;

  try {
    await kitFormSubscribe({ email, formId: KIT_FORM_ID });
  } catch (err) {
    console.error('[waitlist] kitFormSubscribe failed; webhook will reconcile', err);
    return NextResponse.json({ ok: true, pending: true });
  }

  // (g) Identical 200 response shape for insert and update paths (no enumeration via timing).
  return OK;
}
