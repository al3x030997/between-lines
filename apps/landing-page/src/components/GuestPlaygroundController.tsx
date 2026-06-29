'use client';

import { useEffect } from 'react';
import { applyGuestPlaygroundSkin } from '@/lib/theme';
import { useMockSession } from '@/lib/useMockSession';

/**
 * Applies the bright landing skin (html[data-guest-play='on']) on the logged-out
 * /write playground whenever there is no active session, so guests
 * meet the real Studio screen in the paper/ink/yellow landing
 * aesthetic rather than the dark reader theme. Logged-in readers who land here
 * keep their chosen theme. Mirrors GalleryGuestController: gating on `ready`
 * keeps members from flashing the light skin, and the skin is cleared on unmount
 * so it never leaks onto other reader pages.
 */
export function GuestPlaygroundController() {
  const { session, ready } = useMockSession();
  const isGuest = ready && !session;

  useEffect(() => {
    applyGuestPlaygroundSkin(isGuest);
    return () => applyGuestPlaygroundSkin(false);
  }, [isGuest]);

  return null;
}
