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

// The writer Studio at /write. Public via SessionGate PUBLIC_EXACT: a visitor
// with no session lands straight in the editor in guest mode (a blank "Untitled"
// work, demo author's library behind the Your Library tab) with the sign-up
// nudge layer and bright landing skin; a logged-in writer gets their own Studio.
export default function WritePage() {
  return (
    <Suspense fallback={<Splash />}>
      <GuestPlaygroundController />
      <GuestStudioGate />
    </Suspense>
  );
}
