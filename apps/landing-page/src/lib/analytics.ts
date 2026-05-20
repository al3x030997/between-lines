// Server-side event tracking. Vercel Analytics custom events require the Pro
// tier; on the free tier the `track()` import resolves but events are dropped.
// We always emit a structured log so events are recoverable from Vercel logs
// regardless of plan tier.

import { track as vercelTrack } from '@vercel/analytics/server';

export type ServerEvent =
  | 'waitlist_confirm'
  | 'insider_unlock';

export async function trackServer(
  event: ServerEvent,
  props?: Record<string, string | number | boolean | null>,
): Promise<void> {
  console.log(JSON.stringify({ event, ...(props ?? {}) }));
  try {
    await vercelTrack(event, props);
  } catch (err) {
    // Don't let analytics failure break the request.
    console.error('[analytics] vercel track failed', err);
  }
}
