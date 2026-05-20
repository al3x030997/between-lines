import { NextResponse, type NextRequest } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { waitlistSubscribers } from '@/lib/db/schema';
import { isAllowedOrigin, buildInsiderUrl } from '@/lib/site';
import { waitlistSubmitSchema } from '@/lib/schemas';
import {
  getClientIp,
  waitlistEmailLimiter,
  waitlistIpLimiter,
} from '@/lib/ratelimit';
import { signMagicToken } from '@/lib/tokens';
import { kitSubscribe, kitUpdateSubscriberFields } from '@/lib/kit';

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

  // (f) Kit subscribe. If Kit is down, persist our row and return ok=true with a pending hint —
  // the webhook will reconcile when Kit catches up.
  if (!KIT_FORM_ID) {
    console.error('[waitlist] KIT_FORM_ID is not set — DB row persisted, Kit subscribe skipped');
    return OK;
  }

  let kitResult: Awaited<ReturnType<typeof kitSubscribe>> | null = null;
  try {
    kitResult = await kitSubscribe({ email, formId: KIT_FORM_ID });
  } catch (err) {
    console.error('[waitlist] kitSubscribe failed; webhook will reconcile', err);
    return NextResponse.json({ ok: true, pending: true });
  }

  // (g) Persist kit_subscriber_id + write insider_url to the subscriber's Kit field.
  try {
    await db
      .update(waitlistSubscribers)
      .set({ kitSubscriberId: kitResult.subscriberId, updatedAt: new Date() })
      .where(sql`${waitlistSubscribers.id} = ${row.id}`);

    const token = signMagicToken(row.publicId, row.magicLinkVersion);
    await kitUpdateSubscriberFields(kitResult.subscriberId, {
      insider_url: buildInsiderUrl(token),
    });
  } catch (err) {
    // Non-fatal — the 10-minute welcome-sequence delay gives the webhook room to re-fill.
    console.error('[waitlist] insider_url field write failed; webhook will retry', err);
  }

  // (h) Identical 200 response shape for insert and update paths (no enumeration via timing).
  return OK;
}
