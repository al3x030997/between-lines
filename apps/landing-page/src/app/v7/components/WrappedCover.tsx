'use client';

import type { ReactNode } from 'react';

export type WrappedBook = {
  id: string;
  genre: string;
  firstLine: string;
  authorRedacted: string;
  dropDate: string;
  /** Two-color CSS gradient string used as the cover beneath the kraft wrap */
  coverGradient: string;
};

type Props = {
  book: WrappedBook;
  index: number;
  onClick?: () => void;
  decoration?: ReactNode;
};

export function WrappedCover({ book, index, onClick, decoration }: Props) {
  const label = `${book.genre} manuscript, drops ${book.dropDate}. Click to request access.`;
  return (
    <button type="button" className="v7-wrap" onClick={onClick} aria-label={label}>
      <span className="v7-wrap-cover" style={{ background: book.coverGradient }} aria-hidden="true" />
      <span className="v7-wrap-paper" aria-hidden="true">
        <span className="v7-wrap-twine v7-wrap-twine-v" />
        <span className="v7-wrap-twine v7-wrap-twine-h" />
        <span className="v7-wrap-knot" />
      </span>
      <span className="v7-wrap-content">
        <span className="v7-wrap-genre">{book.genre}</span>
        <span className="v7-wrap-line">&ldquo;{book.firstLine}&rdquo;</span>
        <span className="v7-wrap-meta">
          <span className="v7-wrap-by">
            by <span className="v7-wrap-by-redact">{book.authorRedacted}</span>
          </span>
          <span className="v7-wrap-no">№{String(index + 1).padStart(2, '0')}</span>
        </span>
      </span>
      <span className="v7-wrap-tag" aria-hidden="true">
        <span className="v7-wrap-tag-string" />
        <span className="v7-wrap-tag-card">Untitled · {book.dropDate}</span>
      </span>
      {decoration}
    </button>
  );
}
