import { Suspense } from 'react';
import { GuestPlaygroundController } from '@/components/GuestPlaygroundController';
import { GuestStudioGate } from '@/components/write/GuestStudioGate';

function Splash() {
  return (
    <main className="br-handoff">
      <div className="br-handoff-wordmark"><span>Between</span>Reads</div>
      <div className="br-handoff-rule" />
      <div className="br-handoff-msg br-handoff-dots">Opening the writing room</div>
    </main>
  );
}

// Logged-out writer playground: the real Studio in guest mode (demo author's
// works) with the sign-up nudge layer. Public via SessionGate PUBLIC_EXACT; a
// logged-in writer who lands here gets their own Studio.
export default function WritePlaygroundPage() {
  return (
    <Suspense fallback={<Splash />}>
      <GuestPlaygroundController />
      <GuestStudioGate />
    </Suspense>
  );
}
