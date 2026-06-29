'use client';

import { Suspense, useEffect } from 'react';
import { SiteNav } from '@/components/SiteNav';
import { WriteShell } from '@/components/write/WriteShell';
import { applyLightTheme } from '@/lib/theme';

/**
 * The logged-out /write landing page: the marketing site's top nav over a
 * light, chromeless writing editor. A visitor lands straight in a blank
 * "Untitled" work and can start typing; the Save / Preview / Publish actions
 * and the persistent guest bar nudge them to sign up.
 *
 * Self-contained marketing page (mirrors the top-level /read library): it lives
 * outside the gated (reader) route group, brings its own SiteNav, and forces the
 * light landing skin so none of the dark in-app reader chrome appears.
 */
export function GuestWriteEditor() {
  // Marketing pages are locked to light; force it here so the editor renders in
  // the bright landing skin even if a stored reader preference is dark.
  useEffect(() => {
    applyLightTheme();
  }, []);

  return (
    <>
      <SiteNav activeHref="/write" />
      {/* WriteShell reads useSearchParams(), which Next requires inside a
          Suspense boundary on a statically-rendered page. */}
      <Suspense fallback={<div style={{ minHeight: 'calc(100vh - 65px)' }} aria-hidden />}>
        <WriteShell guest landing />
      </Suspense>
    </>
  );
}
