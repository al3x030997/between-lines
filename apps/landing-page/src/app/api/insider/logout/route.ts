import { NextResponse, type NextRequest } from 'next/server';
import { clearInsiderCookie } from '@/lib/cookies';
import { siteUrl } from '@/lib/site';

export const runtime = 'nodejs';

export async function POST(_req: NextRequest) {
  const res = NextResponse.redirect(new URL('/', siteUrl()), { status: 303 });
  clearInsiderCookie(res);
  return res;
}
