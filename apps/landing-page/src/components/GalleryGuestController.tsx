'use client';

import { useEffect } from 'react';
import { applyGalleryGuestSkin } from '@/lib/theme';
import { useMockSession } from '@/lib/useMockSession';

/**
 * Applies the light, landing-matching gallery skin (html[data-gallery-guest='on'])
 * whenever there is no active session, so logged-out visitors arriving from the
 * marketing "Read" CTA see the gallery in the bright paper/ink/yellow landing
 * aesthetic. Logged-in readers keep the dark cinematic gallery. Runs as a client
 * effect because the mock session lives in localStorage; gating on `ready` means
 * logged-in users never flash the light skin (a logged-out user may see one frame
 * of dark first — the same accepted tradeoff as KidsSkinController). Clears the
 * skin on unmount so it never leaks onto other reader pages.
 */
export function GalleryGuestController() {
  const { session, ready } = useMockSession();
  const isGuest = ready && !session;

  useEffect(() => {
    applyGalleryGuestSkin(isGuest);
    return () => applyGalleryGuestSkin(false);
  }, [isGuest]);

  return null;
}
