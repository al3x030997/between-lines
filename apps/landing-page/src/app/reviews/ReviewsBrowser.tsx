'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import Footer from '../v8/sections/Footer';
import { REVIEWS, starsFor, type Review } from '../v8/sections/reviewsData';

type Audience = 'all' | 'young';

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

export default function ReviewsBrowser() {
  const [audience, setAudience] = useState<Audience>('all');

  const shown = useMemo(
    () => REVIEWS.filter((r) => (audience === 'young' ? r.young : !r.young)),
    [audience],
  );

  return (
    <main className="br-reviewspage">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <SiteNav />

      <header className="rev-masthead">
        <h1 className="rev-title">Recommendations you can’t buy</h1>
        <p className="rev-sub">
          No sponsored slots, no algorithm deciding what you see. Just books our readers and
          booksellers genuinely pressed into each other’s hands.
        </p>

        <div className="rev-toggle" role="group" aria-label="Filter reviews by audience">
          <button
            type="button"
            className="rev-tab"
            aria-pressed={audience === 'all'}
            onClick={() => setAudience('all')}
          >
            All
          </button>
          <button
            type="button"
            className="rev-tab"
            aria-pressed={audience === 'young'}
            onClick={() => setAudience('young')}
          >
            Young Readers
          </button>
        </div>
      </header>

      <section className="rev-list" aria-label="Community reviews">
        {shown.map((r) => (
          <ReviewCard key={`${r.book}-${r.reviewer}`} r={r} />
        ))}
      </section>

      <section className="rev-cta">
        <p className="rev-cta-lead">Have a book worth reviewing?</p>
        <Link href="/betweenreviews" className="rev-cta-link">
          Write a review →
        </Link>
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

/* === Audience toggle (segmented pill) === */
.rev-toggle {
  display: inline-flex;
  margin-top: clamp(26px, 4vw, 38px);
  border: 1px solid var(--theme-border-subtle);
  border-radius: 999px;
  background: var(--theme-surface);
  overflow: hidden;
}
.rev-tab {
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--theme-text);
  padding: 10px 24px;
  transition: background 160ms ease, color 160ms ease;
}
.rev-tab + .rev-tab { border-left: 1px solid var(--theme-border-subtle); }
.rev-tab[aria-pressed='true'] {
  background: var(--theme-text);
  color: var(--theme-page);
}
.rev-tab:hover:not([aria-pressed='true']) { background: var(--theme-surface-muted); }

/* === Review list (single column, Goodreads-style) === */
.rev-list {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 clamp(22px, 5vw, 40px);
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(18px, 2.5vw, 26px);
  align-items: start;
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

/* === Closing CTA === */
.rev-cta {
  max-width: 1040px;
  margin: clamp(36px, 5vw, 56px) auto 0;
  padding: clamp(40px, 6vw, 64px) clamp(22px, 5vw, 40px) clamp(64px, 9vw, 96px);
  text-align: center;
}
.rev-cta-lead {
  font-family: var(--br-font-serif);
  font-size: 16px;
  color: var(--theme-text-muted);
  margin: 0 0 10px;
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

.br-reviewspage :where(button, a):focus-visible {
  outline: 2px solid var(--theme-accent-strong);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .rev-card { transition: none; }
}
`;
