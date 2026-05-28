import { Suspense } from 'react';
import { WriteShell } from '@/components/write/WriteShell';

function Splash() {
  return (
    <main className="br-handoff">
      <div className="br-handoff-wordmark"><span>Between</span>Reads</div>
      <div className="br-handoff-rule" />
      <div className="br-handoff-msg br-handoff-dots">Opening the writing room</div>
    </main>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<Splash />}>
      <WriteShell />
    </Suspense>
  );
}
