'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ACCOUNT_PROFILES, sessionForAccountProfile } from '@/lib/account-profiles';
import { setMockSession } from '@/lib/mock-session';

function Splash() {
  return (
    <main className="br-handoff">
      <div className="br-handoff-wordmark">
        <span>Between</span>Reads
      </div>
      <div className="br-handoff-rule" />
      <div className="br-handoff-msg br-handoff-dots">Opening your library</div>
    </main>
  );
}

function HandoffInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    // Resolve the signed-in identity from the sign-in params (falling back to the
    // first profile) and go straight to the reader library — no account picker step.
    const requestedUser = params.get('u');
    const profile =
      ACCOUNT_PROFILES.find((p) => p.user === requestedUser) ?? ACCOUNT_PROFILES[0];
    if (profile) {
      setMockSession(sessionForAccountProfile(profile));
    }
    router.replace('/library');
  }, [params, router]);

  return <Splash />;
}

export default function HandoffPage() {
  return (
    <Suspense fallback={<Splash />}>
      <HandoffInner />
    </Suspense>
  );
}
