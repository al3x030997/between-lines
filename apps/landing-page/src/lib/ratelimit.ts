// Do not import this module from middleware.ts — the Upstash client requires
// the Node runtime, and middleware runs on Edge.
//
// Vercel's Upstash KV integration injects KV_REST_API_URL / KV_REST_API_TOKEN,
// not the UPSTASH_REDIS_REST_* names that Redis.fromEnv() looks for. We wire
// the client explicitly and lazily so the module can be imported at build
// time without env vars present.

import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let _redis: Redis | null = null;
function redis(): Redis {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      'Upstash KV env vars missing. Expected KV_REST_API_URL + KV_REST_API_TOKEN.',
    );
  }
  _redis = new Redis({ url, token });
  return _redis;
}

function buildLimiter(opts: {
  limiter: ConstructorParameters<typeof Ratelimit>[0]['limiter'];
  prefix: string;
}) {
  let _l: Ratelimit | null = null;
  return {
    limit: (key: string) => {
      if (!_l) {
        _l = new Ratelimit({
          redis: redis(),
          limiter: opts.limiter,
          analytics: false,
          prefix: opts.prefix,
        });
      }
      return _l.limit(key);
    },
  };
}

export const waitlistIpLimiter = buildLimiter({
  limiter: Ratelimit.slidingWindow(20, '10 m'),
  prefix: 'rl:waitlist:ip',
});

export const waitlistEmailLimiter = buildLimiter({
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'rl:waitlist:email',
});

export const unlockLimiter = buildLimiter({
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'rl:unlock:ip',
});

export const webhookLimiter = buildLimiter({
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  prefix: 'rl:webhook',
});

// Use Vercel's trusted IP source. Do NOT trust the leftmost x-forwarded-for —
// it's client-controlled. NextRequest.ip is populated by Vercel at the edge;
// x-real-ip is the fallback for non-Vercel environments.
export function getClientIp(req: NextRequest): string {
  return req.ip ?? req.headers.get('x-real-ip') ?? 'unknown';
}
