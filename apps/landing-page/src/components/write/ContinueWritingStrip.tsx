'use client';

import type { CSSProperties } from 'react';
import type { WriterLibraryWork } from '@/lib/mock-writers';

type Props = {
  work: WriterLibraryWork | undefined;
  authorName: string;
  onContinue: () => void;
  onStart: () => void;
  onSeeAll?: () => void;
  totalActive?: number;
};

export function ContinueWritingStrip({
  work,
  authorName,
  onContinue,
  onStart,
  onSeeAll,
  totalActive,
}: Props) {
  if (!work) {
    return (
      <div className="br-write-continue-strip is-empty" role="region" aria-label="Continue writing">
        <span className="br-continue-eyebrow">Pick up where you left off</span>
        <button type="button" className="br-write-continue-empty-link" onClick={onStart}>
          Start your first work →
        </button>
      </div>
    );
  }

  const coverStyle: CSSProperties = { background: work.cover };
  const isDark = work.coverIsDark === true;
  const showAll = onSeeAll && (totalActive ?? 0) > 1;
  const chapterLine = work.totalChapters > 0
    ? `Ch ${Math.min(work.publishedChapters + 1, work.totalChapters)} of ${work.totalChapters}`
    : 'New chapter';

  return (
    <div className="br-write-continue-strip" role="region" aria-label="Continue writing">
      <div className="br-write-continue-strip-cover" style={coverStyle} aria-hidden="true">
        <div className="br-cover-inner">
          <div className={`br-cover-title ${isDark ? 'is-dark' : ''}`}>{work.title}</div>
          <div className={`br-cover-rule ${isDark ? 'is-dark' : ''}`} />
          <div className={`br-cover-author ${isDark ? 'is-dark' : ''}`}>{authorName}</div>
        </div>
      </div>
      <div className="br-write-continue-strip-meta">
        <div className="br-write-continue-strip-eyebrow-row">
          <span className="br-continue-eyebrow">Continue writing · {chapterLine}</span>
          {showAll ? (
            <button
              type="button"
              className="br-write-continue-strip-all"
              onClick={onSeeAll}
            >
              View all {totalActive} →
            </button>
          ) : null}
        </div>
        <div className="br-write-continue-strip-title">{work.title}</div>
      </div>
      <button
        type="button"
        className="br-btn br-btn-primary br-write-continue-strip-cta"
        onClick={onContinue}
      >
        Continue writing →
      </button>
    </div>
  );
}
