'use client';

import { useMockSession } from '@/lib/useMockSession';
import { WriteShell } from '@/components/write/WriteShell';

/**
 * Client boundary for the /write playground: a visitor with no session gets the
 * guest Studio (demo data + nudges); a logged-in writer gets their own Studio.
 * Waits for `ready` so members never flash the guest view.
 */
export function GuestStudioGate() {
  const { session, ready } = useMockSession();
  if (!ready) return null;
  return <WriteShell guest={!session} />;
}
