import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Book } from '@/lib/mock-books';
import { BookPoster } from './BookPoster';

export function GalleryRail({
  title,
  kicker,
  books,
  ranked = false,
  action,
  inProgressMap,
}: {
  title: string;
  kicker: string;
  books: Book[];
  ranked?: boolean;
  /** Override the default "Open first" link. Pass `null` to omit the action. */
  action?: ReactNode | null;
  /** Render thin progress overlays for books found in this slug→percent map. */
  inProgressMap?: Record<string, number>;
}) {
  if (books.length === 0) return null;

  const id = `gallery-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const defaultAction =
    action === undefined ? (
      <Link href={`/read/${books[0]!.slug}`} className="br-gallery-rail-link">
        Open first
      </Link>
    ) : action;

  return (
    <section className="br-gallery-rail" aria-labelledby={id}>
      <div className="br-gallery-rail-head">
        <div>
          <p className="br-gallery-kicker">{kicker}</p>
          <h2 id={id}>{title}</h2>
        </div>
        {defaultAction}
      </div>
      <div className="br-gallery-track">
        {books.map((book, index) => (
          <BookPoster
            key={book.slug}
            book={book}
            rank={ranked ? index + 1 : undefined}
            progress={inProgressMap?.[book.slug]}
          />
        ))}
      </div>
    </section>
  );
}
