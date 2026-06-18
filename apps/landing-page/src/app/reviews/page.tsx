import type { Metadata } from 'next';
import ReviewsBrowser from './ReviewsBrowser';

export const metadata: Metadata = {
  title: 'Reviews — BetweenReads',
  description:
    'Honest, reader-first book reviews from the BetweenReads community — what people are reading, loving and pressing into each other’s hands.',
};

export default function ReviewsPage() {
  return <ReviewsBrowser />;
}
