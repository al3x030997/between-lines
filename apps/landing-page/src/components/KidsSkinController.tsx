'use client';

import { useEffect } from 'react';
import { applyKidsSkin } from '@/lib/theme';
import { useMockSession } from '@/lib/useMockSession';

/**
 * Applies the bright kids skin (html[data-kids='on']) whenever the active
 * profile is a kid, and clears it otherwise. Runs as a client effect because
 * the pre-hydration THEME_INIT_SCRIPT can't see the mock session — a one-frame
 * flash on first paint is acceptable for this mock. Clears the skin on unmount
 * so it never leaks onto the landing pages outside the (reader) group.
 */
export function KidsSkinController() {
  const { session, ready } = useMockSession();
  const isKid = ready ? session?.isKid ?? false : false;

  useEffect(() => {
    applyKidsSkin(isKid);
    return () => applyKidsSkin(false);
  }, [isKid]);

  return null;
}
