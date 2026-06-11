'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import IntakeFlow from '../v12/intake/IntakeFlow';
import { SiteNav } from '@/components/SiteNav';

/**
 * Dedicated intake page. The onboarding flow lives here on its own route so it
 * is isolated from the marketing sections — there is nothing to scroll past,
 * and clicking the brand in SiteNav returns to the home hero.
 *
 * IntakeFlow's CSS references the `--v6-*` aliases that the home variant defines
 * on `.v12-root`; we redefine the same aliases on `.start-root` so the flow
 * looks identical here.
 */

const START_CSS = `
.start-root {
  --v6-accent: var(--theme-accent);
  --v6-accent-soft: var(--theme-accent-soft);
  --v6-text: var(--theme-text);
  --v6-text-strong: var(--theme-text);
  --v6-text-muted: var(--theme-text-muted);
  --v6-surface: var(--theme-hero);
  --v6-divider: var(--theme-border);
  --v6-ease: cubic-bezier(.22, 1, .36, 1);
  min-height: 100vh;
  background: var(--theme-page);
  font-family: 'Outfit', system-ui, sans-serif;
  color: var(--theme-text);
}
.start-intake-wrap {
  max-width: 880px;
  margin: 0 auto;
  padding: clamp(28px, 6vh, 64px) clamp(20px, 4vw, 40px) 96px;
}
`;

function StartIntake() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get('mode') === 'writer' ? 'writer' : 'reader';
  return (
    <div className="start-intake-wrap">
      <IntakeFlow initialMode={mode} onBack={() => router.push('/')} />
    </div>
  );
}

export default function StartPage() {
  return (
    <main className="start-root">
      <style dangerouslySetInnerHTML={{ __html: START_CSS }} />
      <SiteNav />
      <Suspense fallback={null}>
        <StartIntake />
      </Suspense>
    </main>
  );
}
