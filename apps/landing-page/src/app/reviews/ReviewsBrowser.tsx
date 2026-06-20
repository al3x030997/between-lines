'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SiteNav } from '@/components/SiteNav';
import Footer from '../v8/sections/Footer';
import { REVIEWS, starsFor, type Review } from '../v8/sections/reviewsData';

function StarIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.4l2.92 6.31 6.83.86-5.04 4.66 1.33 6.77L12 17.9l-6.04 3.1 1.33-6.77L2.25 9.57l6.83-.86L12 2.4z" />
    </svg>
  );
}

function Stars({ score }: { score: string }) {
  const { full, half } = starsFor(score);
  const out5 = Number(score) / 2;
  return (
    <span className="rev-stars" role="img" aria-label={`${out5} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        if (i < full) return <StarIcon key={i} className="rev-star rev-star-full" />;
        if (i === full && half) {
          return (
            <span key={i} className="rev-star rev-star-half">
              <StarIcon className="rev-star-empty" />
              <StarIcon className="rev-star-full rev-star-half-clip" />
            </span>
          );
        }
        return <StarIcon key={i} className="rev-star rev-star-empty" />;
      })}
    </span>
  );
}

function initialOf(name: string) {
  const cleaned = name.replace(/^the\s+/i, '');
  return cleaned.charAt(0).toUpperCase();
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="rev-card">
      <header className="rev-card-head">
        <span className="rev-avatar" aria-hidden="true">
          {initialOf(r.reviewer)}
        </span>
        <span className="rev-byline">
          <span className="rev-reviewer">{r.reviewer}</span>
          <span className="rev-rated">
            rated it <Stars score={r.score} />
          </span>
        </span>
      </header>

      <h2 className="rev-book">{r.book}</h2>

      <p className="rev-quote">{r.quote}</p>

      {r.forWho && <p className="rev-for">For: {r.forWho}</p>}

      {r.tags.length > 0 && (
        <div className="rev-shelves">
          {r.tags.map((t) => (
            <span className="rev-shelf" key={t}>
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

const GOODREADS_STEPS = [
  {
    n: "1",
    head: "Open Goodreads on desktop",
    body: "The export tool is only available on the full website — not the mobile app.",
  },
  {
    n: "2",
    head: "Go to My Books",
    body: "Click My Books in the top navigation bar to open your library.",
  },
  {
    n: "3",
    head: "Find Import and export",
    body: "In the left sidebar, scroll down to the Tools section and click Import and export.",
  },
  {
    n: "4",
    head: "Click Export Library",
    body: "Hit the Export Library button. Larger libraries can take a minute or two to prepare.",
  },
  {
    n: "5",
    head: "Download the CSV",
    body: "When the file is ready, a download link appears below the button. Save it to your computer.",
  },
  {
    n: "6",
    head: "Come back here",
    body: "Upload your CSV and we’ll bring in your ratings, shelves, and reviews automatically.",
  },
];

function GoodreadsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="gr-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gr-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="gr-modal">
        <button className="gr-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="gr-modal-head">
          <p className="gr-eyebrow">Import</p>
          <h2 id="gr-modal-title">Get your Goodreads library</h2>
          <p className="gr-modal-sub">
            Goodreads lets you export your full library as a CSV file. Takes about two minutes —
            desktop browser only.
          </p>
        </div>

        <ol className="gr-steps">
          {GOODREADS_STEPS.map((step) => (
            <li key={step.n} className="gr-step">
              <span className="gr-step-n" aria-hidden="true">{step.n}</span>
              <div>
                <strong className="gr-step-head">{step.head}</strong>
                <p className="gr-step-body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="gr-modal-foot">
          <p className="gr-foot-note">
            Your export includes ratings, shelves, dates read, and any reviews you’ve written.{" "}
            <a
              className="gr-help-link"
              href="https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Goodreads guide →
            </a>
          </p>
          <button className="gr-upload-btn" disabled>
            Upload CSV — coming soon
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsBrowser() {
  const [showGoodreadsModal, setShowGoodreadsModal] = useState(false);

  return (
    <main className="br-reviewspage">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <SiteNav />

      {showGoodreadsModal ? (
        <GoodreadsModal onClose={() => setShowGoodreadsModal(false)} />
      ) : null}

      <header className="rev-masthead">
        <h1 className="rev-title">Recommendations you can’t buy</h1>
        <p className="rev-sub">
          No sponsored slots, no algorithm deciding what you see. Just books our readers and
          booksellers genuinely pressed into each other’s hands.
        </p>

        <div className="rev-masthead-cta">
          <p className="rev-cta-lead">Have a book worth reviewing?</p>
          <Link href="/write_review" className="rev-cta-link">
            Write a review →
          </Link>
          <button
            className="rev-goodreads-btn"
            type="button"
            onClick={() => setShowGoodreadsModal(true)}
          >
            Import from Goodreads
          </button>
        </div>
      </header>

      <section className="rev-list" aria-label="Community reviews">
        {REVIEWS.map((r) => (
          <ReviewCard key={`${r.book}-${r.reviewer}`} r={r} />
        ))}
      </section>

      <section className="rev-closing" aria-label="Join BetweenReads">
        <div className="rev-closing-inner">
          <p className="rev-closing-eyebrow">Reader-first, always</p>
          <h2 className="rev-closing-title">
            Find your next favourite book — recommended by real readers.
          </h2>
          <p className="rev-closing-sub">
            Free, ad-free, and curated by humans. No ranked feed, no pay-to-play — just books
            worth pressing into someone’s hands.
          </p>
          <div className="rev-closing-actions">
            <Link href="/?join=reader" className="rev-closing-cta">
              Start reading free
            </Link>
            <Link href="/write_review" className="rev-closing-cta-ghost">
              Write a review →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

const CSS = `
.br-reviewspage {
  min-height: 100vh;
  background: var(--theme-page);
  color: var(--theme-text);
  font-family: var(--br-font-sans);
  transition: background-color 320ms ease, color 320ms ease;
}

/* === Masthead === */
.rev-masthead {
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 88px) clamp(22px, 5vw, 40px) clamp(28px, 4vw, 40px);
  text-align: center;
}
.rev-title {
  font-family: var(--br-font-display);
  font-size: clamp(34px, 5.6vw, 56px);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.02;
  margin: 0;
  text-wrap: balance;
}
.rev-sub {
  margin: 16px auto 0;
  max-width: 52ch;
  font-size: var(--bl-hero-lede-size);
  line-height: var(--bl-hero-lede-line-height);
  color: var(--theme-text-muted);
}

/* === Masthead CTA === */
.rev-masthead-cta {
  margin-top: clamp(26px, 4vw, 38px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* === Review list (single column, Goodreads-style) === */
.rev-list {
  max-width: 760px;
  margin: 0 auto clamp(64px, 9vw, 112px);
  padding: 0 clamp(22px, 5vw, 40px);
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(18px, 2.5vw, 26px);
  align-items: start;
}

/* === Closing CTA band (black + yellow gradient) === */
.rev-closing {
  position: relative;
  overflow: hidden;
  background: #0b0b0c;
  color: #fff8e1;
  padding: clamp(64px, 10vw, 132px) clamp(22px, 5vw, 40px);
}
.rev-closing::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 140% at 50% -10%, rgba(250, 218, 70, 0.32) 0%, rgba(250, 218, 70, 0.08) 38%, transparent 64%),
    linear-gradient(180deg, rgba(250, 218, 70, 0.10) 0%, transparent 46%);
  pointer-events: none;
}
.rev-closing-inner {
  position: relative;
  max-width: 820px;
  margin: 0 auto;
  text-align: center;
}
.rev-closing-eyebrow {
  font-family: var(--br-font-display);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #fada46;
  margin: 0 0 18px;
}
.rev-closing-title {
  font-family: var(--br-font-display);
  font-size: clamp(32px, 5.4vw, 60px);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.03em;
  margin: 0;
  text-wrap: balance;
  background: linear-gradient(180deg, #fff8e1 0%, #fada46 120%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.rev-closing-sub {
  font-family: var(--br-font-serif);
  font-size: clamp(16px, 1.8vw, 19px);
  line-height: 1.6;
  color: rgba(255, 248, 225, 0.72);
  max-width: 54ch;
  margin: 20px auto 0;
  text-wrap: pretty;
}
.rev-closing-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(14px, 2vw, 22px);
  margin-top: clamp(28px, 4vw, 40px);
}
.rev-closing-cta {
  font-family: var(--br-font-display);
  font-size: clamp(16px, 1.7vw, 19px);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #0b0b0c;
  background: #fada46;
  padding: 15px 30px;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 12px 34px rgba(250, 218, 70, 0.28);
  transition: transform 200ms cubic-bezier(.22, 1, .36, 1), box-shadow 200ms ease, background-color 200ms ease;
}
.rev-closing-cta:hover {
  transform: translateY(-2px);
  background: #ffe65c;
  box-shadow: 0 18px 44px rgba(250, 218, 70, 0.4);
}
.rev-closing-cta-ghost {
  font-family: var(--br-font-display);
  font-size: clamp(15px, 1.6vw, 18px);
  font-weight: 700;
  color: #fff8e1;
  text-decoration: none;
  padding: 14px 8px;
  border-bottom: 2px solid rgba(250, 218, 70, 0.5);
  transition: color 180ms ease, border-color 180ms ease;
}
.rev-closing-cta-ghost:hover {
  color: #fada46;
  border-color: #fada46;
}
.rev-card {
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-subtle);
  border-radius: 16px;
  padding: clamp(22px, 3.4vw, 30px);
  transition:
    border-color 220ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 220ms cubic-bezier(.22, 1, .36, 1),
    transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.rev-card:hover {
  border-color: var(--theme-border);
  box-shadow: 0 14px 32px rgb(var(--theme-shadow-rgb) / 0.14);
  transform: translateY(-2px);
}

.rev-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.rev-avatar {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--theme-accent-soft);
  border: 1px solid var(--theme-accent);
  color: var(--theme-text);
  font-family: var(--br-font-display);
  font-weight: 800;
  font-size: 17px;
}
.rev-byline {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.rev-reviewer {
  font-size: 14px;
  font-weight: 700;
  color: var(--theme-text);
}
.rev-rated {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: var(--theme-text-muted);
}

/* === Stars === */
.rev-stars { display: inline-flex; align-items: center; gap: 2px; }
.rev-star { width: 16px; height: 16px; display: inline-block; }
.rev-star-full { fill: var(--theme-accent-strong); }
.rev-star-empty { fill: color-mix(in srgb, var(--theme-text) 16%, transparent); }
.rev-star-half { position: relative; width: 16px; height: 16px; }
.rev-star-half .rev-star-empty { position: absolute; inset: 0; }
.rev-star-half-clip { position: absolute; inset: 0; clip-path: inset(0 50% 0 0); }

.rev-book {
  font-family: var(--br-font-display);
  font-size: clamp(23px, 3vw, 28px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.01em;
  margin: 16px 0 0;
}
.rev-quote {
  font-family: var(--br-font-serif);
  font-size: 16px;
  line-height: 1.62;
  color: var(--theme-text-muted);
  border-left: 3px solid var(--theme-accent);
  padding-left: 16px;
  margin: 12px 0 0;
}
.rev-for {
  font-family: var(--br-font-serif);
  font-style: italic;
  font-size: 13.5px;
  color: var(--theme-text-faint);
  margin: 14px 0 0;
}
.rev-shelves {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 14px;
}
.rev-shelf {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 11px;
  border: 1px solid var(--theme-accent);
  border-radius: 999px;
  background: var(--theme-accent-soft);
  color: var(--theme-text);
}

/* === Write-a-review CTA (in masthead) === */
.rev-cta-lead {
  font-family: var(--br-font-serif);
  font-size: 16px;
  color: var(--theme-text-muted);
  margin: 0;
}
.rev-cta-link {
  font-family: var(--br-font-display);
  font-size: clamp(20px, 2.6vw, 26px);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--theme-text);
  text-decoration: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.12em;
  text-decoration-color: var(--theme-accent);
  transition: color 180ms ease;
}
.rev-cta-link:hover { color: var(--theme-accent-strong); }

.rev-goodreads-btn {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  border: none;
  border-radius: 999px;
  background: #0b0b0c;
  color: #fff;
  font: inherit;
  font-family: var(--br-font-display);
  font-size: clamp(15px, 1.8vw, 18px);
  font-weight: 800;
  padding: 14px 28px;
  cursor: pointer;
  transition: background 180ms ease, transform 180ms ease;
}
.rev-goodreads-btn:hover {
  background: #2a2a2c;
  transform: translateY(-1px);
}

/* === Goodreads import modal === */
.gr-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.54);
  display: grid;
  place-items: center;
  padding: clamp(16px, 4vw, 40px);
  backdrop-filter: blur(3px);
}
.gr-modal {
  position: relative;
  background: var(--theme-surface, #fff);
  color: var(--theme-text, #1a1a1a);
  border: 1px solid var(--theme-border-subtle, rgba(0,0,0,0.1));
  border-radius: 16px;
  width: min(580px, 100%);
  max-height: 90dvh;
  overflow-y: auto;
  padding: clamp(28px, 5vw, 44px);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.28);
}
.gr-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  border: 1px solid var(--theme-border-subtle, rgba(0,0,0,0.12));
  border-radius: 50%;
  background: transparent;
  color: var(--theme-text-muted, #666);
  font-size: 13px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 160ms ease, color 160ms ease;
}
.gr-close:hover {
  background: var(--theme-accent-soft, rgba(0,0,0,0.06));
  color: var(--theme-text, #1a1a1a);
}
.gr-eyebrow {
  font-family: var(--br-font-display);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #e9722e;
  margin: 0 0 10px;
}
.gr-modal-head h2 {
  font-family: var(--br-font-display);
  font-size: clamp(26px, 3.5vw, 34px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin: 0;
}
.gr-modal-sub {
  font-family: var(--br-font-serif);
  font-size: 16px;
  line-height: 1.55;
  color: var(--theme-text-muted, #666);
  margin: 10px 0 0;
  max-width: 46ch;
}
.gr-steps {
  list-style: none;
  margin: 28px 0 0;
  padding: 0;
  display: grid;
  gap: 0;
}
.gr-step {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 14px;
  padding: 16px 0;
  border-top: 1px solid var(--theme-border-subtle, rgba(0,0,0,0.08));
}
.gr-step:last-child {
  border-bottom: 1px solid var(--theme-border-subtle, rgba(0,0,0,0.08));
}
.gr-step-n {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: color-mix(in srgb, #e9722e 12%, transparent);
  border: 1.5px solid color-mix(in srgb, #e9722e 30%, transparent);
  color: #e9722e;
  font-family: var(--br-font-display);
  font-size: 13px;
  font-weight: 900;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}
.gr-step-head {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: var(--theme-text, #1a1a1a);
  margin-bottom: 3px;
}
.gr-step-body {
  margin: 0;
  font-family: var(--br-font-serif);
  font-size: 14px;
  line-height: 1.55;
  color: var(--theme-text-muted, #666);
}
.gr-modal-foot {
  margin-top: 24px;
  display: grid;
  gap: 14px;
}
.gr-foot-note {
  font-family: var(--br-font-serif);
  font-size: 13px;
  color: var(--theme-text-faint, #999);
  margin: 0;
}
.gr-help-link {
  color: #e9722e;
  text-decoration: none;
  font-weight: 700;
  white-space: nowrap;
}
.gr-help-link:hover {
  text-decoration: underline;
}
.gr-upload-btn {
  width: 100%;
  border: 1.5px dashed var(--theme-border-subtle, rgba(0,0,0,0.15));
  border-radius: 10px;
  background: var(--theme-accent-soft, rgba(0,0,0,0.03));
  color: var(--theme-text-faint, #aaa);
  font: inherit;
  font-family: var(--br-font-display);
  font-size: 15px;
  font-weight: 800;
  padding: 16px;
  cursor: not-allowed;
  opacity: 0.6;
}

.br-reviewspage :where(button, a):focus-visible {
  outline: 2px solid var(--theme-accent-strong);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .rev-card,
  .rev-closing-cta { transition: none; }
  .rev-closing-cta:hover { transform: none; }
}
`;
