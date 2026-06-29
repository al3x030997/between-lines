import type { Metadata } from 'next';
import { GuestWriteEditor } from '@/components/write/GuestWriteEditor';

export const metadata: Metadata = {
  title: 'Write — BetweenReads',
  description: 'Start writing on BetweenReads. Open a blank page, draft your first chapter, and sign up free to keep it.',
};

// Logged-out /write: a standalone marketing page in the light landing brand —
// the marketing SiteNav over a chromeless writing editor, so a visitor can try
// the editor and be nudged to sign up. The full writer Studio (WriteShell
// without `landing`) lives behind sign-up; it isn't routed here.
export default function WritePage() {
  return <GuestWriteEditor />;
}
