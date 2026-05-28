'use client';

import { useEffect, useState } from 'react';
import { getReaderProfile, type ReaderProfile } from '@/lib/mock-readers';
import { useMockSession } from '@/lib/useMockSession';
import { ReaderProfileView } from '@/components/profile/ReaderProfileView';

export default function MyProfilePage() {
  const { session, ready } = useMockSession();
  const [profile, setProfile] = useState<ReaderProfile | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!session) return;
    setProfile(getReaderProfile(session.handle) ?? null);
  }, [ready, session]);

  if (!ready || !session) {
    return (
      <main className="br-handoff">
        <div className="br-handoff-wordmark"><span>Between</span>Reads</div>
        <div className="br-handoff-rule" />
        <div className="br-handoff-msg br-handoff-dots">Opening your profile</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="br-pf-page">
        <section className="br-pf-section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h1 className="br-pf-display-name" style={{ marginBottom: 12 }}>{session.user}</h1>
          <p className="br-pf-bio" style={{ fontFamily: 'var(--br-font-serif)', fontStyle: 'italic', fontSize: 15 }}>
            Your reader profile hasn't been set up yet. When it is, this is where you'll meet yourself.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="br-pf-page">
      <ReaderProfileView profile={profile} editable={true} />
    </main>
  );
}
