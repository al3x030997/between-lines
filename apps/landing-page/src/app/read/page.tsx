import type { Metadata } from 'next';
import { PublicLibrary } from '@/components/read/PublicLibrary';

export const metadata: Metadata = {
  title: 'Read — BetweenReads',
  description: 'Browse our first books and free classics. Read on BetweenReads.',
};

// Logged-out /read: a standalone, ungated library/gallery in the marketing hero
// brand. Self-contained chrome (SiteNav + its own BROWSE sidebar); none of the
// gated in-app reader navigation. (The former reader-profile builder lives on in
// components/read/ReaderProfilePage.tsx, no longer routed here.)
export default function ReadPage() {
  return <PublicLibrary />;
}
