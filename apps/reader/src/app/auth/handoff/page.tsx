'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setMockSession } from '@/lib/mock-session';

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
    const rc = Number.parseInt(params.get('rc') ?? '142', 10) || 142;
    const tierParam = params.get('tier');
    const tier = tierParam === 'Member' ? 'Member' : 'Reader';

    setMockSession({ user, rc, tier });
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
