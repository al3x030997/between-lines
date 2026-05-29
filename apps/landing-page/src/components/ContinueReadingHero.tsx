'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBook } from '@/lib/mock-books';

const CONTINUE_SLUG = 'the-quiet-hours';
const CONTINUE_PROGRESS = 38;

type Variant = 'hero' | 'strip';

type Props = {
  variant?: Variant;
  onSeeAll?: () => void;
  totalInProgress?: number;
};

function firstSentence(html: string | undefined, fallback: string): string {
  if (!html) return fallback;
  const stripped = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const match = stripped.match(/^(.+?[.!?])(\s|$)/);
  return (match?.[1] ?? stripped.slice(0, 160)).trim();
}

export function ContinueReadingHero({ variant = 'hero', onSeeAll, totalInProgress }: Props = {}) {
  const router = useRouter();
  const book = getBook(CONTINUE_SLUG);

  if (variant === 'strip') {
    if (!book) {
      return (
        <div className="br-continue-strip is-empty" role="region" aria-label="Continue reading">
          <span className="br-continue-eyebrow">Pick up where you left off</span>
          <Link href="#br-sec-featured" className="br-continue-strip-empty-link">
            Start something new →
          </Link>
        </div>
      );
    }
    const coverStyle: React.CSSProperties = { background: book.cover };
    const isDark = book.coverIsDark === true;
    const showAll = onSeeAll && (totalInProgress ?? 0) > 1;
    return (
      <div className="br-continue-strip" role="region" aria-label="Continue reading">
        <div className="br-continue-strip-cover" style={coverStyle} aria-hidden="true">
          <div className="br-cover-inner">
            <div className={`br-cover-title ${isDark ? 'is-dark' : ''}`}>{book.title}</div>
            <div className={`br-cover-rule ${isDark ? 'is-dark' : ''}`} />
            <div className={`br-cover-author ${isDark ? 'is-dark' : ''}`}>{book.author}</div>
          </div>
        </div>
        <div className="br-continue-strip-meta">
          <div className="br-continue-strip-eyebrow-row">
            <span className="br-continue-eyebrow">Continue · {book.author}</span>
            {showAll ? (
              <button
                type="button"
                className="br-continue-strip-all"
                onClick={onSeeAll}
              >
                View all {totalInProgress} →
              </button>
            ) : null}
          </div>
          <div className="br-continue-strip-title">{book.title}</div>
          <div className="br-continue-strip-progress">
            <div className="br-continue-bar" aria-hidden="true">
              <div className="br-continue-bar-fill" style={{ width: `${CONTINUE_PROGRESS}%` }} />
            </div>
            <span className="br-continue-strip-pct">{CONTINUE_PROGRESS}%</span>
          </div>
        </div>
        <button
          type="button"
          className="br-btn br-btn-primary br-continue-strip-cta"
          onClick={() => router.push(`/read/${book.slug}`)}
        >
          Continue →
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="br-read-hero is-empty" role="region" aria-label="Continue reading">
        <div className="br-read-hero-body">
          <span className="br-read-hero-eyebrow">Pick up where you left off</span>
          <p className="br-read-hero-excerpt">Nothing started yet. Open a book and we'll remember the line you stopped on.</p>
          <Link href="#br-sec-featured" className="br-btn br-btn-primary br-read-hero-cta">
            Browse the shelf →
          </Link>
        </div>
      </div>
    );
  }

  const coverStyle: React.CSSProperties = { background: book.cover };
  const isDark = book.coverIsDark === true;

  const chapterIndex = Math.min(
    book.chapters.length - 1,
    Math.max(0, Math.floor((book.chapters.length * CONTINUE_PROGRESS) / 100)),
  );
  const currentChapter = book.chapters[chapterIndex];
  const excerptSource = book.chapters.find((c) => c.body)?.body ?? book.blurb;
  const excerpt = firstSentence(excerptSource, book.blurb);
  const totalRemaining = book.chapters.length - chapterIndex - 1;
  const showAll = onSeeAll && (totalInProgress ?? 0) > 1;

  return (
    <>
      <div className="br-read-hero" role="region" aria-label="Continue reading">
        <div className="br-read-hero-cover" style={coverStyle} aria-hidden="true">
          <div className="br-cover-inner">
            <div className={`br-cover-title ${isDark ? 'is-dark' : ''}`}>{book.title}</div>
            <div className={`br-cover-rule ${isDark ? 'is-dark' : ''}`} />
            <div className={`br-cover-author ${isDark ? 'is-dark' : ''}`}>{book.author}</div>
          </div>
        </div>

        <div className="br-read-hero-body">
          <span className="br-read-hero-eyebrow">
            {currentChapter ? <>Chapter {currentChapter.num} · {currentChapter.title}</> : 'Continue reading'}
          </span>
          <h2 className="br-read-hero-title">{book.title}</h2>
          <div className="br-read-hero-author">by {book.author}</div>
          <p className="br-read-hero-excerpt">&ldquo;{excerpt}&rdquo;</p>

          <div className="br-read-hero-progress" aria-label={`${CONTINUE_PROGRESS}% complete`}>
            <div className="br-continue-bar" aria-hidden="true">
              <div className="br-continue-bar-fill" style={{ width: `${CONTINUE_PROGRESS}%` }} />
            </div>
            <span className="br-read-hero-progress-meta">
              {CONTINUE_PROGRESS}% · {totalRemaining > 0 ? `${totalRemaining} chapters left` : 'final chapter'}
            </span>
          </div>

          <button
            type="button"
            className="br-btn br-btn-primary br-read-hero-cta"
            onClick={() => router.push(`/read/${book.slug}`)}
          >
            Continue →
          </button>
        </div>
      </div>

      {showAll ? (
        <button type="button" className="br-read-hero-seeall" onClick={onSeeAll}>
          View all {totalInProgress} in progress →
        </button>
      ) : null}
    </>
  );
}

export function ContinueReadingStrip(props: { onSeeAll?: () => void; totalInProgress?: number } = {}) {
  return <ContinueReadingHero variant="strip" {...props} />;
}
