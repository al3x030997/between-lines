'use client';

import { useEffect, useMemo, useState } from 'react';

type Review = {
  book: string;
  reviewer: string;
  score: string;
  quote: string;
  more?: boolean;
  tags: string[];
  forWho?: string;
  young: boolean;
};

// Reviewer-voice cards — written the way someone would actually log a book on Goodreads.
const REVIEWS: Review[] = [
  {
    book: 'The Quiet Hours',
    reviewer: 'The Wandering Owl',
    score: '9',
    quote:
      "Went in expecting a slow character study and got something that quietly took me apart. Marsh's restraint is the whole point — every unsaid thing lands harder than a confession would. I finished it in two sittings and just sat there afterwards.",
    more: true,
    tags: ['Stayed with me', 'Quiet devastation', 'Read in one sitting'],
    forWho: 'Readers who loved The Remains of the Day',
    young: false,
  },
  {
    book: 'The Glass Meridian',
    reviewer: 'James K.',
    score: '8',
    quote:
      "Climate fiction that never once feels like homework. The science lives inside the characters instead of being lectured at you, and by the end I cared more about Mara than about being right.",
    tags: ["Couldn't put it down", 'Smarter than it lets on'],
    forWho: 'Readers drawn to quiet speculative fiction',
    young: false,
  },
  {
    book: 'Salt & the Sea Between',
    reviewer: 'MarginNotes',
    score: '9',
    quote:
      "A whole love story told in letters that never get sent, and somehow the silences say more than the sentences do. I kept stopping to reread paragraphs out loud. Structurally it shouldn't work this well and yet here we are.",
    more: true,
    tags: ['Wrecked me', 'Unforgettable structure', 'Buying copies for friends'],
    forWho: 'Readers who loved Letters to a Young Poet',
    young: false,
  },
  {
    book: 'Before the Frost',
    reviewer: 'Tom W.',
    score: '9',
    quote:
      "A near-perfect short story. The ending quietly reframes everything before it without a single cheap trick — I flipped straight back to page one to watch the seams.",
    tags: ['Read in one sitting', 'That ending'],
    forWho: 'Readers who love Alice Munro',
    young: false,
  },
  {
    book: 'The Archivist of Small Things',
    reviewer: 'Maria C.',
    score: '7',
    quote:
      "The mystery deepens so gently you don't notice it pulling you under until you're three chapters past your bedtime. Lost half a star because the middle wanders, but the atmosphere is worth it.",
    tags: ["Couldn't stop thinking about it"],
    forWho: 'Readers who love quiet literary mystery',
    young: false,
  },
  {
    book: 'Three Tuesdays in November',
    reviewer: 'Ana P.',
    score: '10',
    quote:
      "The linked structure is so controlled it almost feels unfair. Every story quietly answers a question the last one left open. I reread the whole collection the same night just to catch what I'd missed the first time.",
    more: true,
    tags: ['Will reread this', 'Instant favourite', 'Pressed into hands'],
    forWho: 'Fans of Elizabeth Strout',
    young: false,
  },
  {
    book: 'The Velveteen Rabbit',
    reviewer: 'Lily, age 9',
    score: '10',
    quote:
      "This book made me cry but in a good way. The rabbit just wants to be real and the boy loves him so so much. I made my mum read it again the next night.",
    tags: ['Made me a better person', 'Read it twice'],
    forWho: 'Everyone who has a favourite toy',
    young: true,
  },
  {
    book: "Charlotte's Web",
    reviewer: 'Noah, age 10',
    score: '10',
    quote:
      "I did NOT expect to cry this much about a spider and a pig. Charlotte is the best friend anyone could ever have and I wasn't ready for the ending at all.",
    more: true,
    tags: ['Will reread this', 'Best friend ever', 'Cried a lot'],
    forWho: 'Everyone, forever',
    young: true,
  },
  {
    book: 'The BFG',
    reviewer: 'Sophie, age 8',
    score: '9',
    quote:
      "The BFG talks in the funniest way ever and it made me laugh out loud reading it to my little brother. The dream-catching part is my favourite.",
    tags: ['So funny', 'Great read-aloud'],
    forWho: 'Anyone who wants to laugh a lot',
    young: true,
  },
];

type Audience = 'all' | 'young';

const STYLES = `
.bl-reviews {
  --bl-rev-ink: var(--theme-text);
  background: var(--theme-page);
  color: var(--bl-rev-ink);
  padding: clamp(72px, 10vh, 120px) clamp(24px, 5vw, 80px);
  font-family: var(--br-font-sans);
  transition: background-color 320ms ease, color 320ms ease;
}
.bl-reviews-inner {
  max-width: 1180px;
  margin: 0 auto;
}
.bl-reviews-head {
  text-align: center;
  margin-bottom: clamp(28px, 4vh, 44px);
}
.bl-reviews-eyebrow {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--bl-rev-ink) 55%, transparent);
  margin: 0 0 10px;
}
.bl-reviews-title {
  font-family: var(--br-font-display);
  font-size: clamp(34px, 5.5vw, 56px);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
  margin: 0;
}
.bl-reviews-sub {
  margin: 14px auto 0;
  max-width: 46ch;
  font-size: 18px;
  line-height: 1.55;
  color: var(--theme-text-muted);
}

/* === Audience toggle: clean segmented pill === */
.bl-reviews-toggle {
  display: inline-flex;
  margin: clamp(22px, 3vh, 34px) 0 clamp(34px, 5vh, 52px);
  border: 1px solid var(--theme-border-subtle);
  border-radius: 999px;
  background: var(--theme-surface);
  overflow: hidden;
}
.bl-reviews-toggle-wrap {
  display: flex;
  justify-content: center;
}
.bl-reviews-tab {
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--bl-rev-ink);
  padding: 10px 24px;
  transition: background 160ms var(--v6-ease, ease), color 160ms var(--v6-ease, ease);
}
.bl-reviews-tab + .bl-reviews-tab {
  border-left: 1px solid var(--theme-border-subtle);
}
.bl-reviews-tab[aria-pressed='true'] {
  background: var(--bl-rev-ink);
  color: var(--theme-page);
}
.bl-reviews-tab:hover:not([aria-pressed='true']) {
  background: var(--theme-surface-muted);
}

/* === Grid === */
.bl-reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(32px, 4vw, 48px);
}

/* === Card (clean surface, matching the writers/readers split card) === */
.bl-reviews-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--theme-surface);
  color: var(--bl-rev-ink);
  border: 1px solid var(--theme-border-subtle);
  border-radius: 16px;
  padding: 28px 30px 26px;
  transition:
    border-color 220ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 220ms cubic-bezier(.22, 1, .36, 1),
    transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-reviews-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border-top: 2px solid var(--theme-accent);
  opacity: 0;
  transition: opacity 220ms cubic-bezier(.22, 1, .36, 1);
  pointer-events: none;
}
.bl-reviews-card:hover {
  border-color: var(--theme-border);
  box-shadow: 0 14px 32px rgb(var(--theme-shadow-rgb) / 0.16);
  transform: translateY(-2px);
}
.bl-reviews-card:hover::before {
  opacity: 1;
}
.bl-rev-book {
  font-family: var(--br-font-display);
  font-size: 27px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0;
}
.bl-rev-by {
  font-family: var(--br-font-sans);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--theme-text-muted);
  margin-top: 6px;
}
.bl-rev-quote {
  font-family: var(--br-font-serif);
  font-style: normal;
  font-size: 18px;
  line-height: 1.6;
  color: var(--bl-rev-ink);
  border-left: 3px solid var(--theme-accent);
  padding-left: 15px;
  flex: 1;
}
.bl-rev-more {
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: var(--br-font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-accent-strong);
  padding: 0 0 0 6px;
  white-space: nowrap;
}
.bl-rev-more:hover {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.bl-rev-for {
  font-family: var(--br-font-serif);
  font-size: 13px;
  font-style: italic;
  color: var(--theme-text-faint);
}
.bl-rev-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.bl-rev-tag {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 11px;
  border: 1px solid var(--theme-accent);
  border-radius: 999px;
  background: var(--theme-accent-soft);
  color: var(--bl-rev-ink);
}
.bl-rev-meta {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 6px;
  border-top: 1.5px solid var(--theme-border-subtle);
}
.bl-rev-score {
  font-family: var(--br-font-display);
  font-size: clamp(40px, 5vw, 52px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
  white-space: nowrap;
}
.bl-rev-score span {
  font-size: 16px;
  font-weight: 700;
  color: var(--theme-text-muted);
}

/* === Closing CTA === */
.bl-reviews-foot {
  margin-top: clamp(34px, 5vh, 52px);
  text-align: center;
}
.bl-reviews-cta {
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(18px, 2.4vw, 24px);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--bl-rev-ink);
  text-decoration: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.12em;
  text-decoration-color: var(--theme-accent);
  transition: color 180ms ease;
}
.bl-reviews-cta:hover {
  color: var(--theme-accent-strong);
}

@media (max-width: 980px) {
  .bl-reviews-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 760px) {
  .bl-reviews-grid {
    grid-template-columns: 1fr;
  }
}
`;

type Props = {
  onReader?: () => void;
};

export default function BetweenReviews({ onReader }: Props) {
  const [audience, setAudience] = useState<Audience>('all');
  // null until mounted → SSR and first client paint show a deterministic order
  // (no hydration mismatch). After hydration we shuffle, so each load shows a
  // fresh trio. Reshuffles when the audience toggle changes.
  const [order, setOrder] = useState<number[] | null>(null);

  const pool = useMemo(
    () => REVIEWS.filter((r) => (audience === 'young' ? r.young : !r.young)),
    [audience],
  );

  useEffect(() => {
    const idx = pool.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    setOrder(idx);
  }, [pool]);

  const shown = useMemo(
    () => (order ? order.map((i) => pool[i]) : pool).slice(0, 3),
    [order, pool],
  );

  return (
    <section className="bl-reviews" aria-label="Community reviews">
      <style>{STYLES}</style>
      <div className="bl-reviews-inner">
        <header className="bl-reviews-head">
          <p className="bl-reviews-eyebrow">Between Reads</p>
          <h2 className="bl-reviews-title">What our community recommends</h2>
          <p className="bl-reviews-sub">
            What readers, writers and our team are reading, loving and recommending.
          </p>
        </header>

        <div className="bl-reviews-toggle-wrap">
          <div className="bl-reviews-toggle" role="group" aria-label="Filter reviews by audience">
            <button
              type="button"
              className="bl-reviews-tab"
              aria-pressed={audience === 'all'}
              onClick={() => setAudience('all')}
            >
              All
            </button>
            <button
              type="button"
              className="bl-reviews-tab"
              aria-pressed={audience === 'young'}
              onClick={() => setAudience('young')}
            >
              Young Readers
            </button>
          </div>
        </div>

        <div className="bl-reviews-grid">
          {shown.map((r) => (
            <article className="bl-reviews-card" key={`${r.book}-${r.reviewer}`}>
              <div>
                <h3 className="bl-rev-book">{r.book}</h3>
                <p className="bl-rev-by">by {r.reviewer}</p>
              </div>

              <p className="bl-rev-quote">
                &ldquo;{r.quote}&rdquo;
                {r.more && (
                  <button type="button" className="bl-rev-more">
                    read more
                  </button>
                )}
              </p>

              {r.forWho && <p className="bl-rev-for">For: {r.forWho}</p>}

              {r.tags.length > 0 && (
                <div className="bl-rev-tags">
                  {r.tags.map((t) => (
                    <span className="bl-rev-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        {onReader && (
          <div className="bl-reviews-foot">
            <button type="button" className="bl-reviews-cta" onClick={onReader}>
              More reviews →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
