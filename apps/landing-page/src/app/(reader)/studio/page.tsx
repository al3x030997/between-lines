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

// The writer Studio. Public via SessionGate PUBLIC_EXACT: a visitor with no
// session gets the real Studio in guest mode (demo author's works) with the
// sign-up nudge layer and bright landing skin; a logged-in writer gets their own
// Studio. (The decoupled /write page is now the public writer-profile showcase,
// not the editor.)
export default function StudioPage() {
  return (
    <Suspense fallback={<Splash />}>
      <GuestPlaygroundController />
      <GuestStudioGate />
    </Suspense>
  );
}
