import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/SiteNav';
import { getWriterProfile } from '@/lib/mock-writers';
import { WriterProfileView } from '@/components/profile/WriterProfileView';
import Footer from '../v8/sections/Footer';

export const metadata: Metadata = {
  title: 'Write — BetweenReads',
  description:
    'A writer profile on BetweenReads: what you are writing, who you write for, the books and authors that made you, and the readers you are looking for.',
};

// The example writer the public /write showcase renders (matches the in-app
// writer profile builder).
const SHOWCASE_HANDLE = 'midnightdraftsman';

// Logged-out /write: a standalone, ungated writer-profile showcase in the
// marketing hero brand. It carries the canonical site nav (SiteNav) and none of
// the gated in-app reader chrome — the real Studio lives behind the session gate
// at /studio. Read-only: the profile is presented as a sample, so no Edit
// affordances render (editable={false}). The same profile body powers the
// editable in-app route at /writer/[handle].
export default function WritePage() {
  const profile = getWriterProfile(SHOWCASE_HANDLE);
  if (!profile) notFound();

  return (
    <>
      <SiteNav activeHref="/write" />
      <main className="br-pf-page">
        <WriterProfileView profile={profile} editable={false} />
      </main>
      <Footer />
    </>
  );
}
