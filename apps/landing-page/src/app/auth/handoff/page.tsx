'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AccountProfilePicker } from '@/components/AccountProfilePicker';
import {
  ACCOUNT_PROFILES,
  sessionForAccountProfile,
  type AccountProfile,
} from '@/lib/account-profiles';
import { setMockSession } from '@/lib/mock-session';

function Splash() {
  return (
    <main className="br-handoff">
      <div className="br-handoff-wordmark">
        <span>Between</span>Reads
      </div>
      <div className="br-handoff-rule" />
      <div className="br-handoff-msg br-handoff-dots">Opening your accounts</div>
    </main>
  );
}

function HandoffInner() {
  const router = useRouter();
  const params = useSearchParams();
  const currentUser = params.get('u') ?? ACCOUNT_PROFILES[0]?.user ?? null;

  function openReaderApp(profile: AccountProfile) {
    setMockSession(sessionForAccountProfile(profile));
    router.replace('/read');
  }

  return (
    <main className="br-acct-page">
      <div className="br-acct-backdrop" aria-hidden="true" />
      <AccountProfilePicker
        currentUser={currentUser}
        headingAs="h1"
        onAddAccount={() => router.replace('/')}
        onManageProfiles={() => router.replace('/')}
        onSelectProfile={openReaderApp}
      />
    </main>
  );
}

export default function HandoffPage() {
  return (
    <Suspense fallback={<Splash />}>
      <HandoffInner />
    </Suspense>
  );
}
