'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBook } from '@/lib/mock-books';

const CONTINUE_SLUG = 'the-quiet-hours';
const CONTINUE_PROGRESS = 38;

type Variant = 'hero' | 'strip';

export function ContinueReadingHero({ variant = 'hero' }: { variant?: Variant } = {}) {
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
          <span className="br-continue-eyebrow">Continue · {book.author}</span>
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

  if (!book) return null;

  const coverStyle: React.CSSProperties = { background: book.cover };
  const isDark = book.coverIsDark === true;

  return (
    <div className="br-continue" role="region" aria-label="Continue reading">
      <div className="br-continue-cover" style={coverStyle}>
        <div className="br-cover-inner">
          <div className={`br-cover-title ${isDark ? 'is-dark' : ''}`}>{book.title}</div>
          <div className={`br-cover-rule ${isDark ? 'is-dark' : ''}`} />
          <div className={`br-cover-author ${isDark ? 'is-dark' : ''}`}>{book.author}</div>
        </div>
      </div>

      <div className="br-continue-body">
        <span className="br-continue-eyebrow">Continue reading</span>
        <h3 className="br-continue-title">{book.title}</h3>
        <div className="br-continue-author">{book.author}</div>
        <div className="br-continue-meta">{book.format}</div>
      </div>

      <div className="br-continue-progress">
        <div className="br-continue-percent">{CONTINUE_PROGRESS}% complete</div>
        <div className="br-continue-bar" aria-hidden="true">
          <div className="br-continue-bar-fill" style={{ width: `${CONTINUE_PROGRESS}%` }} />
        </div>
      </div>

      <button
        type="button"
        className="br-btn br-btn-primary br-continue-cta"
        onClick={() => router.push(`/read/${book.slug}`)}
      >
        Continue reading →
      </button>
    </div>
  );
}

export function ContinueReadingStrip() {
  return <ContinueReadingHero variant="strip" />;
}
