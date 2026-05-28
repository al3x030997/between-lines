'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FeedbackPanel } from './FeedbackPanel';
import { QuietOverlay } from './QuietOverlay';

const MIN_FONT = 14;
const MAX_FONT = 24;

type Props = {
  bookSlug: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterBody: string;
  /** Total chapters in the book — for the chapter meta line */
  chapterCount: number;
  next?: { slug: string; title: string };
};

export function ReaderShell({
  bookSlug,
  bookTitle,
  chapterNumber,
  chapterTitle,
  chapterBody,
  chapterCount,
  next,
}: Props) {
  const [fontSize, setFontSize] = useState(18);
  const [quiet, setQuiet] = useState(false);
  const [progress, setProgress] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  const adjust = useCallback((delta: number) => {
    setFontSize((v) => Math.min(MAX_FONT, Math.max(MIN_FONT, v + delta)));
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max <= 0) {
          setProgress(0);
          return;
        }
        setProgress(Math.min(100, (window.scrollY / max) * 100));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="br-read-topbar">
        <Link href={`/read/${bookSlug}`} className="br-read-back">
          ← {bookTitle}
        </Link>
        <div className="br-read-ch-title">
          Chapter {chapterNumber} — {chapterTitle}
        </div>
        <div className="br-read-ctrl">
          <div className="br-fc" role="group" aria-label="Font size">
            <button
              type="button"
              className="br-fc-btn"
              onClick={() => adjust(-1)}
              aria-label="Decrease font size"
              disabled={fontSize <= MIN_FONT}
            >
              A−
            </button>
            <span className="br-fc-num" aria-live="polite">
              {fontSize}
            </span>
            <button
              type="button"
              className="br-fc-btn"
              onClick={() => adjust(1)}
              aria-label="Increase font size"
              disabled={fontSize >= MAX_FONT}
            >
              A+
            </button>
          </div>
          <button
            type="button"
            className="br-rctrl-btn"
            onClick={() => setQuiet(true)}
            aria-label="Enter quiet reading mode"
          >
            ☾ Quiet
          </button>
        </div>
      </div>

      <div className="br-progress" aria-hidden="true">
        <div className="br-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <main className="br-read-wrap">
        <div className="br-chapter-eyebrow">{bookTitle}</div>
        <h1 className="br-chapter-title">
          Chapter {chapterNumber} — {chapterTitle}
        </h1>
        <div className="br-chapter-meta">
          Chapter {chapterNumber} of {chapterCount}
        </div>
        <article
          ref={textRef}
          className="br-chapter-text"
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: chapterBody }}
        />

        <FeedbackPanel />

        {next ? (
          <Link href={`/read/${bookSlug}/${next.slug}`} className="br-next-ch" style={{ textDecoration: 'none' }}>
            <div>
              <div className="br-next-ch-lbl">Next chapter</div>
              <div className="br-next-ch-title">{next.title}</div>
            </div>
            <span className="br-next-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        ) : null}
      </main>

      <QuietOverlay
        open={quiet}
        onClose={() => setQuiet(false)}
        chapterTitle={`Chapter ${chapterNumber} — ${chapterTitle}`}
        bookTitle={bookTitle}
        body={chapterBody}
      />
    </>
  );
}
