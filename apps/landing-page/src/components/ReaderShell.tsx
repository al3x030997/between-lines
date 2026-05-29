'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FeedbackPanel } from './FeedbackPanel';
import { QuietOverlay } from './QuietOverlay';

const MIN_FONT = 14;
const MAX_FONT = 24;
const WIDE_KEY = 'br-reader-wide';

type Props = {
  bookSlug: string;
  bookTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterBody: string;
  /** Total chapters in the book — for the chapter meta line */
  chapterCount: number;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
};

export function ReaderShell({
  bookSlug,
  bookTitle,
  chapterNumber,
  chapterTitle,
  chapterBody,
  chapterCount,
  prev,
  next,
}: Props) {
  const [fontSize, setFontSize] = useState(18);
  const [quiet, setQuiet] = useState(false);
  const [wide, setWide] = useState(false);
  const [progress, setProgress] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  const adjust = useCallback((delta: number) => {
    setFontSize((v) => Math.min(MAX_FONT, Math.max(MIN_FONT, v + delta)));
  }, []);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(WIDE_KEY) === '1') setWide(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(WIDE_KEY, wide ? '1' : '0');
    } catch {}
  }, [wide]);

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
            className={`br-rctrl-btn br-width-toggle ${wide ? 'is-on' : ''}`}
            onClick={() => setWide((v) => !v)}
            aria-pressed={wide}
            aria-label={wide ? 'Use narrow reading column' : 'Use wider reading column'}
          >
            <svg
              viewBox="0 0 20 14"
              aria-hidden="true"
              focusable="false"
              className="br-width-toggle-icon"
            >
              <path
                d="M5 7h10M5 7l3-3M5 7l3 3M15 7l-3-3M15 7l-3 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {wide ? 'Narrow' : 'Wide'}
          </button>
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

      <main className={`br-read-wrap ${wide ? 'is-wide' : ''}`}>
        <div className="br-chapter-eyebrow">{bookTitle}</div>
        <h1 className="br-chapter-title">
          Chapter {chapterNumber} — {chapterTitle}
        </h1>
        <div className="br-chapter-meta">
          Chapter {chapterNumber} of {chapterCount}
        </div>

        <Link
          href={prev ? `/read/${bookSlug}/${prev.slug}` : `/read/${bookSlug}`}
          className="br-prev-ch"
          style={{ textDecoration: 'none' }}
        >
          <span className="br-prev-arrow" aria-hidden="true">
            ←
          </span>
          <div>
            <div className="br-prev-ch-lbl">
              {prev ? 'Previous chapter' : 'Back to'}
            </div>
            <div className="br-prev-ch-title">
              {prev ? prev.title : `${bookTitle} — book preview`}
            </div>
          </div>
        </Link>

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
