import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { waitlistSubscribers } from '@/lib/db/schema';
import { buildInsiderUrl, isAllowedOrigin } from '@/lib/site';
import { waitlistSubmitSchema } from '@/lib/schemas';
import {
  getClientIp,
  waitlistEmailLimiter,
  waitlistIpLimiter,
} from '@/lib/ratelimit';
import { kitFormSubscribe } from '@/lib/kit';
import { signMagicToken } from '@/lib/tokens';

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

  // (f) Subscribe via Kit's v4 API. The insider_url field is written BEFORE
  // the form attach so the welcome-sequence merge tag always sees it. This
  // lets the automation's wait step run at zero.
  if (!KIT_FORM_ID) {
    console.error('[waitlist] KIT_FORM_ID is not set — DB row persisted, Kit subscribe skipped');
    return OK;
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
    return NextResponse.json({ ok: true, pending: true });
  }

  // (g) Persist Kit subscriber id so future field updates / unsubscribe
  // webhooks can match by id rather than by email_lower.
  await db
    .update(waitlistSubscribers)
    .set({ kitSubscriberId: kitResult.subscriberId, updatedAt: now })
    .where(eq(waitlistSubscribers.id, row.id));

  // (h) Identical 200 response shape for insert and update paths (no enumeration via timing).
  return OK;
}
