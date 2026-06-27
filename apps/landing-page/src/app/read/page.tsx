import type { Metadata } from 'next';
import { ReaderProfilePage } from '@/components/read/ReaderProfilePage';

export const metadata: Metadata = {
  title: 'Reader Profile — BetweenReads',
  description: 'A reader profile on BetweenReads.',
};

// Logged-out /read: a standalone reader-profile page, self-contained with its
// own chrome and no surrounding app navigation.
export default function ReadPage() {
  return <ReaderProfilePage />;
}
