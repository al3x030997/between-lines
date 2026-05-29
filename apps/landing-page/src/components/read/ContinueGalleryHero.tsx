'use client';

import Link from 'next/link';
import { useMockSession } from '@/lib/useMockSession';
import type { Book } from '@/lib/mock-books';

function firstSentence(html: string | undefined, fallback: string): string {
  if (!html) return fallback;
  const stripped = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const match = stripped.match(/^(.+?[.!?])(\s|$)/);
  return (match?.[1] ?? stripped.slice(0, 200)).trim();
}

type Props = {
  book: Book;
  progress: number;
  totalInProgress: number;
  invites: number;
};

export function ContinueGalleryHero({ book, progress, totalInProgress, invites }: Props) {
  const { session } = useMockSession();
  const firstName = (session?.user ?? 'reader').split(/\s+/)[0] ?? 'reader';

  const chapterIndex = Math.min(
    book.chapters.length - 1,
    Math.max(0, Math.floor((book.chapters.length * progress) / 100)),
  );
  const currentChapter = book.chapters[chapterIndex];
  const excerptSource = book.chapters.find((c) => c.body)?.body ?? book.blurb;
  const excerpt = firstSentence(excerptSource, book.blurb);
  const remaining = Math.max(0, book.chapters.length - chapterIndex - 1);
  const remainingLabel = remaining > 0 ? `${remaining} chapter${remaining === 1 ? '' : 's'} left` : 'final chapter';

  return (
    <section className="br-gallery-hero br-gallery-hero-continue" aria-labelledby="br-read-hero-title">
      <div className="br-gallery-hero-copy">
        <p className="br-gallery-overline">Continue reading · Welcome back, {firstName}</p>
        <h1 id="br-read-hero-title">{book.title}</h1>
        <p className="br-gallery-dek">
          {currentChapter ? (
            <>
              <em>Chapter {currentChapter.num} — {currentChapter.title}.</em>{' '}
            </>
          ) : null}
          &ldquo;{excerpt}&rdquo;
        </p>

        <div className="br-gallery-progress-line" aria-label={`${progress}% complete`}>
          <span className="br-gallery-progress-bar" aria-hidden="true">
            <span className="br-gallery-progress-fill" style={{ width: `${progress}%` }} />
          </span>
          <span className="br-gallery-progress-meta">
            {progress}% · {remainingLabel}
          </span>
        </div>

        <div className="br-gallery-hero-actions">
          <Link href={`/read/${book.slug}`} className="br-gallery-primary">
            Continue reading →
          </Link>
          {totalInProgress > 1 ? (
            <Link
              href="/read?shelf=continue"
              className="br-gallery-secondary"
            >
              View all {totalInProgress} in progress
            </Link>
          ) : null}
        </div>

        <div className="br-gallery-stats" aria-label="Reader snapshot">
          <span>
            <strong>{totalInProgress}</strong>
            in progress
          </span>
          <span>
            <strong>{invites}</strong>
            betweenlines invite{invites === 1 ? '' : 's'}
          </span>
          <span>
            <strong>by {book.author.split(' ').slice(-1)[0]}</strong>
            now reading
          </span>
        </div>
      </div>

      <Link className="br-gallery-hero-feature" href={`/read/${book.slug}`} aria-label={`Continue reading ${book.title}`}>
        <span className="br-gallery-feature-art" style={{ background: book.cover }} />
        <span className="br-gallery-feature-progress" aria-hidden="true">
          <span className="br-gallery-feature-progress-fill" style={{ width: `${progress}%` }} />
        </span>
        <span className="br-gallery-feature-glass">
          <span className="br-gallery-feature-label">Currently reading</span>
          <span className="br-gallery-feature-title">{book.title}</span>
          <span className="br-gallery-feature-author">by {book.author}</span>
          <span className="br-gallery-feature-blurb">
            {currentChapter
              ? `Chapter ${currentChapter.num} of ${book.chapters.length} · ${currentChapter.title}`
              : book.blurb}
          </span>
        </span>
      </Link>
    </section>
  );
}
