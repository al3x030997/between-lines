import type { NextResponse } from 'next/server';

export const INSIDER_COOKIE = 'bl_insider';

const ONE_HUNDRED_EIGHTY_DAYS = 60 * 60 * 24 * 180;

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ONE_HUNDRED_EIGHTY_DAYS,
  };
}

export function setInsiderCookie(res: NextResponse, jwt: string) {
  res.cookies.set(INSIDER_COOKIE, jwt, cookieOptions());
}

export function clearInsiderCookie(res: NextResponse) {
  res.cookies.set(INSIDER_COOKIE, '', { ...cookieOptions(), maxAge: 0 });
}
