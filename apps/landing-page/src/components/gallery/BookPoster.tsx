import Link from 'next/link';
import type { Book } from '@/lib/mock-books';

function hasBadge(book: Book, kind: string): boolean {
  return book.badges.some((badge) => badge.kind === kind);
}

function bookMeta(book: Book): string {
  const readerPicks = book.readerPicks ? `${book.readerPicks} Reader Picks` : null;
  return [book.category, readerPicks ?? book.estRead].filter(Boolean).join(' / ');
}

export function BookPoster({
  book,
  rank,
  progress,
}: {
  book: Book;
  rank?: number;
  progress?: number;
}) {
  const badge = hasBadge(book, 'bl')
    ? 'BetweenLines Pick'
    : hasBadge(book, 'rp')
      ? 'Reader Pick'
      : hasBadge(book, 'mp')
        ? 'Member Pick'
        : 'Featured';

  return (
    <Link className="br-gallery-poster" href={`/read/${book.slug}`}>
      <span className="br-gallery-poster-cover" style={{ background: book.cover }}>
        {rank ? <span className="br-gallery-rank">{rank}</span> : null}
        <span className="br-gallery-poster-badge">{badge}</span>
        {typeof progress === 'number' ? (
          <span className="br-gallery-poster-progress" aria-hidden="true">
            <span className="br-gallery-poster-progress-fill" style={{ width: `${progress}%` }} />
          </span>
        ) : null}
      </span>
      <span className="br-gallery-poster-body">
        <span className="br-gallery-poster-title">{book.title}</span>
        <span className="br-gallery-poster-author">{book.author}</span>
        <span className="br-gallery-poster-meta">
          {typeof progress === 'number' ? `${progress}% read` : bookMeta(book)}
        </span>
      </span>
    </Link>
  );
}
