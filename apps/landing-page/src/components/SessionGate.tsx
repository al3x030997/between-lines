'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getMockSession } from '@/lib/mock-session';

export function SessionGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const session = getMockSession();
    if (!session) {
      router.replace('/');
      return;
    }
    setAuthed(true);
  }, [router]);

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
