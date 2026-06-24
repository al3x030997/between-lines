'use client';

import { useMockSession } from '@/lib/useMockSession';
import { DiscoverExperience } from '@/components/read/DiscoverExperience';

/**
 * Client boundary for the /read playground: a visitor with no session gets the
 * guest Discover (nudges + "build your reader page"); a logged-in reader gets
 * their full member Discover. We wait for `ready` so members never flash the
 * guest view (and the guest skin from GuestPlaygroundController stays in sync).
 */
export function GuestDiscoverGate() {
  const { session, ready } = useMockSession();
  if (!ready) return null;
  return <DiscoverExperience guest={!session} />;
}
