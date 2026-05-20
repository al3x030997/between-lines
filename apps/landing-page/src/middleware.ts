import { NextResponse, type NextRequest } from 'next/server';
import { INSIDER_COOKIE } from '@/lib/cookies';
import { verifyCookieJwt } from '@/lib/jwt';

export const config = {
  matcher: ['/insider/:path*'],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(INSIDER_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/?u=gate', req.url));
  }
  const payload = await verifyCookieJwt(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/?u=gate', req.url));
  }

  // Forward the subscriber id to the downstream server component via REQUEST
  // headers. Setting it on the response would leak the id to the browser.
  const forwarded = new Headers(req.headers);
  forwarded.set('x-bl-sid', payload.sid);
  return NextResponse.next({ request: { headers: forwarded } });
}
