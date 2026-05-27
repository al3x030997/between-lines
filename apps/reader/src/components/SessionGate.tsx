'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { getMockSession } from '@/lib/mock-session';

function landingUrl(): string {
  return process.env.NEXT_PUBLIC_LANDING_URL ?? 'http://localhost:3000';
}

export function SessionGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const session = getMockSession();
    if (!session) {
      window.location.href = landingUrl();
      return;
    }
    setAuthed(true);
  }, []);

  if (authed === null) {
    return (
      <div className="br-handoff">
        <div className="br-handoff-wordmark">
          <span>Between</span>Reads
        </div>
        <div className="br-handoff-rule" />
        <div className="br-handoff-msg br-handoff-dots">Opening your reading</div>
      </div>
    );
  }

  return <>{children}</>;
}
