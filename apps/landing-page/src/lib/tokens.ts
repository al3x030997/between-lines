// Node-only magic-link token helpers. Uses node:crypto for HMAC, so this module
// must NOT be imported from middleware.ts (Edge runtime). Edge-safe JWT helpers
// live in ./jwt.ts.

import { createHmac, timingSafeEqual } from 'node:crypto';

function b64uEncode(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64url');
}

function b64uDecode(input: string): Buffer {
  return Buffer.from(input, 'base64url');
}

function magicSecret(): string {
  const s = process.env.MAGIC_LINK_SECRET;
  if (!s) throw new Error('MAGIC_LINK_SECRET is not set');
  return s;
}

function hmacB64u(payload: string): string {
  return createHmac('sha256', magicSecret()).update(payload).digest('base64url');
}

export function signMagicToken(publicId: string, version: number): string {
  const payload = `${publicId}:${version}`;
  const sig = hmacB64u(payload);
  return `${b64uEncode(publicId)}.${b64uEncode(String(version))}.${sig}`;
}

export function verifyMagicToken(
  token: string,
): { publicId: string; version: number } | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [pidB64, verB64, sig] = parts;

  let publicId: string;
  let versionStr: string;
  try {
    publicId = b64uDecode(pidB64).toString('utf8');
    versionStr = b64uDecode(verB64).toString('utf8');
  } catch {
    return null;
  }

  const version = Number.parseInt(versionStr, 10);
  if (!Number.isInteger(version) || version < 1) return null;

  const expected = hmacB64u(`${publicId}:${version}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return { publicId, version };
}

// Re-exports kept here for backwards-compatibility — call sites that need the
// cookie JWT should prefer importing directly from './jwt'.
export { signCookieJwt, verifyCookieJwt, type InsiderJwtPayload } from './jwt';
