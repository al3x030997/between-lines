import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { waitlistSubscribers } from '@/lib/db/schema';
import { isAllowedOrigin } from '@/lib/site';
import { intakeSchema } from '@/lib/schemas';
import { getClientIp, waitlistIpLimiter } from '@/lib/ratelimit';
import {
  intakeToKit,
  kitAddTagsToSubscriber,
  kitUpdateSubscriberFields,
} from '@/lib/kit';
import { verifyCookieJwt } from '@/lib/tokens';
import { INSIDER_COOKIE } from '@/lib/cookies';

export const runtime = 'nodejs';

const bodySchema = z.object({ intake: intakeSchema });

// Post-email enrichment. The email step already created the subscriber, set the
// insider cookie, and saved a partial intake. Here we attach the fuller answers
// to that same subscriber — authed by the cookie, so we skip the per-email rate
// limiter and never re-subscribe / re-send the welcome email.
export async function POST(req: NextRequest) {
  // (a) Origin check — same as the main waitlist route.
  const origin = req.headers.get('origin');
  if (!isAllowedOrigin(origin)) {
    return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  // (b) Auth by insider cookie. pid = publicId, sid = kitSubscriberId.
  const token = req.cookies.get(INSIDER_COOKIE)?.value;
  const claims = token ? await verifyCookieJwt(token) : null;
  if (!claims) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // (c) IP rate limit only (no email limiter — the cookie is the identity here).
  const ip = getClientIp(req);
  const ipRl = await waitlistIpLimiter.limit(ip);
  if (!ipRl.success) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
  }

  // (d) Parse + validate.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_input' }, { status: 400 });
  }
  const intake = parsed.data.intake;

  // (e) Overwrite the intake JSONB on the subscriber the cookie points at.
  const now = new Date();
  const [row] = await db
    .update(waitlistSubscribers)
    .set({ intake, updatedAt: now })
    .where(eq(waitlistSubscribers.publicId, claims.pid))
    .returning();

  if (!row) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  // (f) Mirror to Kit (fields + tags). Non-fatal — the DB row is the source of
  // truth and is already updated. Reuses the same mapping as /api/waitlist.
  const kitId = row.kitSubscriberId ?? claims.sid;
  if (kitId) {
    const { tags, fields } = intakeToKit(intake);
    if (Object.keys(fields).length > 0) {
      try {
        await kitUpdateSubscriberFields(kitId, fields);
      } catch (err) {
        console.error('[waitlist/intake] field write failed', err);
      }
    }
    if (tags.length > 0) {
      try {
        await kitAddTagsToSubscriber(kitId, tags);
      } catch (err) {
        console.error('[waitlist/intake] tag write failed', err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
