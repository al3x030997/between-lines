import { NextResponse, type NextRequest } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { waitlistSubscribers } from '@/lib/db/schema';
import { siteUrl } from '@/lib/site';
import { getClientIp, unlockLimiter } from '@/lib/ratelimit';
import { signCookieJwt, verifyMagicToken } from '@/lib/tokens';
import { setInsiderCookie } from '@/lib/cookies';
import { trackServer } from '@/lib/analytics';

export const runtime = 'nodejs';

function redirect(reason: 'ratelimited' | 'invalid' | 'pending') {
  return NextResponse.redirect(new URL(`/?u=${reason}`, siteUrl()));
}

export async function GET(req: NextRequest) {
  // (a) Rate limit.
  const rl = await unlockLimiter.limit(getClientIp(req));
  if (!rl.success) {
    return redirect('ratelimited');
  }

  // (b) Token check.
  const token = req.nextUrl.searchParams.get('t');
  if (!token) return redirect('invalid');
  const verified = verifyMagicToken(token);
  if (!verified) return redirect('invalid');

  // (c) DB lookup: must match publicId + magicLinkVersion + status='active'.
  const [row] = await db
    .select()
    .from(waitlistSubscribers)
    .where(eq(waitlistSubscribers.publicId, verified.publicId))
    .limit(1);

  if (!row || row.magicLinkVersion !== verified.version || row.status !== 'active') {
    return redirect('pending');
  }
  if (!row.kitSubscriberId) {
    // Edge case: confirmed but our row never recorded the Kit id. Treat as pending
    // so the operator can investigate.
    return redirect('pending');
  }

  // (d) Sign cookie + (e) bump counters.
  const jwt = await signCookieJwt({ sid: row.kitSubscriberId, pid: row.publicId });
  await db
    .update(waitlistSubscribers)
    .set({
      unlockCount: sql`${waitlistSubscribers.unlockCount} + 1`,
      lastUnlockAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(waitlistSubscribers.id, row.id));

  // (f) Server-side analytics.
  await trackServer('insider_unlock', { kit_id: row.kitSubscriberId });

  // (g) Redirect to /insider with cookie attached.
  const res = NextResponse.redirect(new URL('/insider', siteUrl()));
  setInsiderCookie(res, jwt);
  return res;
}
