import type { Metadata } from 'next';
import { getAllBooks } from '@/lib/mock-books';
import WriteReviewClient, { type WriteReviewBook } from './WriteReviewClient';

type PageProps = {
  searchParams?: {
    book?: string | string[];
  };
};

export const metadata: Metadata = {
  title: 'Write a Review - BetweenReads',
  description:
    'Rate a book, add it to a shelf, and write a reader review on BetweenReads. Mock review form for the preview app.',
};

export default function WriteReviewPage({ searchParams }: PageProps) {
  const initialBookSlug = Array.isArray(searchParams?.book)
    ? searchParams?.book[0]
    : searchParams?.book;

  const books: WriteReviewBook[] = getAllBooks().map((book) => ({
    slug: book.slug,
    title: book.title,
    author: book.author,
    category: book.category,
    cover: book.cover,
    coverIsDark: book.coverIsDark,
    tags: book.tags,
    blurb: book.blurb,
    format: book.format,
    wordsLabel: book.wordsLabel ?? book.words.toLocaleString(),
    estRead: book.estRead,
    readerPicks: book.readerPicks,
  }));

  return <WriteReviewClient books={books} initialBookSlug={initialBookSlug} />;
}
