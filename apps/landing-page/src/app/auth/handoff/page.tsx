'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setMockSession, type Role } from '@/lib/mock-session';

function Splash({ message }: { message: string }) {
  return (
    <main className="br-handoff">
      <div className="br-handoff-wordmark">
        <span>Between</span>Reads
      </div>
      <div className="br-handoff-rule" />
      <div className="br-handoff-msg br-handoff-dots">{message}</div>
    </main>
  );
}

function HandoffInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const user = params.get('u') ?? 'Sarah M.';
    const handle = params.get('h') ?? undefined;
    const rc = Number.parseInt(params.get('rc') ?? '142', 10) || 142;
    const sc = Number.parseInt(params.get('sc') ?? '75', 10) || 75;
    const tierParam = params.get('tier');
    const tier = tierParam === 'Member' ? 'Member' : 'Reader';

    const rolesParam = params.get('roles');
    let roles: Role[] = ['reader', 'writer'];
    if (rolesParam) {
      const parts = rolesParam.split(',').map((s) => s.trim());
      const next: Role[] = [];
      for (const p of parts) {
        if ((p === 'reader' || p === 'writer') && !next.includes(p)) next.push(p);
      }
      if (next.length > 0) roles = next;
    } else if (params.get('writer') === '0') {
      roles = ['reader'];
    }

    setMockSession({ user, handle, rc, sc, tier, roles });
    router.replace('/read');
  }, [params, router]);

  return <Splash message="Signing you in" />;
}

export default function HandoffPage() {
  return (
    <Suspense fallback={<Splash message="Opening your reading" />}>
      <HandoffInner />
    </Suspense>
  );
}
