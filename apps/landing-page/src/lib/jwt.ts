// Edge-compatible JWT helpers for the insider cookie. Pure jose; no node:crypto.
import { SignJWT, jwtVerify } from 'jose';

export type InsiderJwtPayload = {
  sid: string;
  pid: string;
};

const ONE_HUNDRED_EIGHTY_DAYS = '180d';

function cookieSecretBytes(): Uint8Array {
  const s = process.env.COOKIE_JWT_SECRET;
  if (!s) throw new Error('COOKIE_JWT_SECRET is not set');
  return new TextEncoder().encode(s);
}

export async function signCookieJwt(payload: InsiderJwtPayload): Promise<string> {
  return new SignJWT({ sid: payload.sid, pid: payload.pid })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(ONE_HUNDRED_EIGHTY_DAYS)
    .sign(cookieSecretBytes());
}

export async function verifyCookieJwt(
  token: string,
): Promise<InsiderJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, cookieSecretBytes(), {
      algorithms: ['HS256'],
    });
    if (typeof payload.sid !== 'string' || typeof payload.pid !== 'string') {
      return null;
    }
    return { sid: payload.sid, pid: payload.pid };
  } catch {
    return null;
  }
}
