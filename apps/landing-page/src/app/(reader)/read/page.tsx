import { GuestPlaygroundController } from '@/components/GuestPlaygroundController';
import { GuestDiscoverGate } from '@/components/read/GuestDiscoverGate';

// Logged-out reader playground: the real Discover screen in guest mode, with
// the sign-up nudge layer and the "build your reader page" starter. Reachable
// without a session via SessionGate PUBLIC_EXACT; a logged-in reader who lands
// here gets their full member Discover instead (the gate flips guest off).
export default function ReadPlaygroundPage() {
  return (
    <>
      <GuestPlaygroundController />
      <GuestDiscoverGate />
    </>
  );
}
