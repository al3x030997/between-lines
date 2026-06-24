'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useGuestNudge } from '@/components/SignupNudge';

/**
 * The conversion centerpiece of the logged-out /read playground. Sits where a
 * member's profile block would and lets a guest *start building their reader
 * page*: pick a few genres (which re-sorts the Discover rails live — the parent
 * owns that state), set a one-tap "line", and watch the page fill in. The draft
 * is mirrored to localStorage and carried into /start so onboarding feels
 * continuous rather than a reset.
 */

// Same vocabulary as the sidebar Genre filters (FilterSidebar FILTERS) so a
// guest's picks line up 1:1 with book tags used for the live re-sort.
export const STARTER_GENRES = [
  'Fantasy',
  'Literary Fiction',
  'Mystery',
  'Romance',
  'Sci-fi',
  'Thriller',
  'Historical',
  'Horror',
  'Young Adult',
] as const;

const MY_LINES = [
  'I read to feel less alone.',
  'Give me a slow burn and a long night.',
  'I fall for a voice before a plot.',
  'I want to be undone by the last page.',
];

const DRAFT_KEY = 'br_guest_reader_draft';

export type ReaderDraft = {
  genres: string[];
  myLine: string | null;
  nowReading: { title: string; author: string } | null;
};

export function buildStartHref(draft: ReaderDraft): string {
  const params = new URLSearchParams({ mode: 'reader' });
  if (draft.genres.length) params.set('genres', draft.genres.join(','));
  if (draft.myLine) params.set('line', draft.myLine);
  return `/start?${params.toString()}`;
}

export function GuestReaderStarter({
  genres,
  onToggleGenre,
  myLine,
  onPickLine,
  nowReading,
}: {
  genres: string[];
  onToggleGenre: (genre: string) => void;
  myLine: string | null;
  onPickLine: (line: string | null) => void;
  nowReading: { title: string; author: string } | null;
}) {
  const { requestSignup } = useGuestNudge();

  const draft: ReaderDraft = { genres, myLine, nowReading };

  // Mirror the draft so the choices survive the hop to /start (and any future
  // onboarding step that wants to pre-fill from it).
  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* storage unavailable — the querystring still carries the picks */
    }
  }, [genres, myLine, nowReading]);

  const filled =
    (genres.length > 0 ? 1 : 0) + (myLine ? 1 : 0) + (nowReading ? 1 : 0);
  const pct = Math.round((filled / 3) * 100);

  return (
    <section className="br-grs" aria-label="Start your reader page">
      <header className="br-grs-head">
        <span className="br-grs-avatar" aria-hidden="true">
          {myLine ? '✦' : '+'}
        </span>
        <div className="br-grs-head-text">
          <span className="br-grs-eyebrow">Your reader page</span>
          <h3 className="br-grs-title">Start building it as you browse</h3>
        </div>
      </header>

      <div className="br-grs-progress" aria-hidden="true">
        <div className="br-grs-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="br-grs-progress-label">{pct}% there</p>

      <div className="br-grs-field">
        <span className="br-grs-label">Pick a few you love</span>
        <div className="br-grs-chips">
          {STARTER_GENRES.map((g) => {
            const on = genres.includes(g);
            return (
              <button
                key={g}
                type="button"
                className={`br-grs-chip ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => onToggleGenre(g)}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      <div className="br-grs-field">
        <span className="br-grs-label">Now reading</span>
        {nowReading ? (
          <div className="br-grs-now">
            <span className="br-grs-now-title">{nowReading.title}</span>
            <span className="br-grs-now-author">{nowReading.author}</span>
          </div>
        ) : (
          <p className="br-grs-ghost">Open a sample and it lands here.</p>
        )}
      </div>

      <div className="br-grs-field">
        <span className="br-grs-label">My line</span>
        <div className="br-grs-lines">
          {MY_LINES.map((line) => {
            const on = myLine === line;
            return (
              <button
                key={line}
                type="button"
                className={`br-grs-line ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => onPickLine(on ? null : line)}
              >
                “{line}”
              </button>
            );
          })}
        </div>
      </div>

      <Link href={buildStartHref(draft)} className="br-grs-cta">
        {filled > 0 ? 'Sign up to keep your page' : 'Create your free reader page'}
      </Link>
      <button
        type="button"
        className="br-grs-aspire"
        onClick={() => requestSignup('profile')}
      >
        See a finished reader page →
      </button>
    </section>
  );
}
