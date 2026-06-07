'use client';

import { useMemo, useState } from 'react';

type Review = {
  book: string;
  author: string;
  reviewer: string;
  role: string;
  score: string;
  body: string;
  pull?: string;
  feeling?: string;
  forWho?: string;
  young: boolean;
};

// Ported from the BetweenReviews prototype (between_reviews) — reviews wall data only.
const REVIEWS: Review[] = [
  {
    book: 'The Quiet Hours',
    author: 'MidnightDraftsman',
    reviewer: 'The Wandering Owl',
    role: 'Reader',
    score: '9',
    body: "Eleanor Marsh is one of the most quietly devastating characters I've read in years. I finished it in two sittings and couldn't speak for an hour.",
    pull: 'The name was hers.',
    feeling: 'Stayed with me',
    forWho: 'Readers who loved The Remains of the Day',
    young: false,
  },
  {
    book: 'The Glass Meridian',
    author: 'NocturnalReader',
    reviewer: 'James K.',
    role: 'Writer',
    score: '8',
    body: "A climate fiction novel that doesn't feel like a lesson. The science is woven into the emotional life of the protagonist so seamlessly you forget you're learning something.",
    pull: 'Her models had been right about everything except the most important thing.',
    feeling: "Couldn't stop thinking about it",
    forWho: 'Readers drawn to quiet speculative fiction',
    young: false,
  },
  {
    book: 'Salt & the Sea Between',
    author: 'MarginNotes',
    reviewer: 'BetweenReads Team',
    role: 'Team',
    score: '9',
    body: "A love story told entirely in letters that never arrived. The structure is the point — what doesn't get said is the whole novel.",
    pull: "I wrote this for you on a Tuesday. I don't know what day it is now.",
    feeling: 'Put it down and looked out the window',
    forWho: 'Readers who loved Letters to a Young Poet',
    young: false,
  },
  {
    book: 'Ember & the Cartographer',
    author: 'TheOpenChapter',
    reviewer: 'Priya R.',
    role: 'Volunteer Reader',
    score: '8',
    body: 'The map that updates itself is such a clean metaphor for grief and recovery. This is YA that respects its readers completely.',
    pull: 'The map knew where she needed to go before she did.',
    feeling: 'Changed how I see things',
    forWho: 'Anyone who loved The Night Circus',
    young: false,
  },
  {
    book: 'Before the Frost',
    author: 'MidnightDraftsman',
    reviewer: 'Tom W.',
    role: 'Reader',
    score: '9',
    body: 'A perfect short story. The ending reframes everything that came before without a single cheap trick.',
    pull: 'She had learned to love the silence — not because it was peaceful, but because it was honest.',
    feeling: 'Read it in one sitting',
    forWho: 'Readers who love Alice Munro',
    young: false,
  },
  {
    book: 'What the River Keeps',
    author: 'SilverMarginal',
    reviewer: 'BetweenLines Editorial',
    role: 'Team',
    score: '8',
    body: 'Six voices, one river, and a collection of small goodbyes that adds up to something enormous.',
    pull: 'We are the things we leave behind.',
    feeling: 'Put it down and looked out the window',
    forWho: 'Readers of W.S. Merwin and Mary Oliver',
    young: false,
  },
  {
    book: 'The Archivist of Small Things',
    author: 'QuietPageTurner',
    reviewer: 'Maria C.',
    role: 'Reader',
    score: '7',
    body: "The mystery deepens so naturally you don't notice it happening.",
    pull: 'She had been collecting their faces for years without knowing why.',
    feeling: "Couldn't stop thinking about it",
    forWho: 'Readers who love quiet literary mystery',
    young: false,
  },
  {
    book: 'Three Tuesdays in November',
    author: 'MidnightDraftsman',
    reviewer: 'Ana P.',
    role: 'Writer',
    score: '10',
    body: 'The linked structure is breathtakingly controlled. I reread the whole collection immediately just to catch what I missed.',
    pull: 'Nobody in this town ever said the thing they meant on the first try.',
    feeling: 'Will reread this',
    forWho: 'Fans of Elizabeth Strout',
    young: false,
  },
  {
    book: 'The Velveteen Rabbit',
    author: 'Margery Williams',
    reviewer: 'Lily, age 9',
    role: 'Young Reader',
    score: '10',
    body: 'This book made me cry but in a good way. The rabbit just wants to be real and the boy loves him so much.',
    pull: 'What is REAL? asked the Rabbit.',
    feeling: 'Made me a better person',
    forWho: 'Everyone who has a favourite toy',
    young: true,
  },
  {
    book: "Charlotte's Web",
    author: 'E.B. White',
    reviewer: 'Noah, age 10',
    role: 'Young Reader',
    score: '10',
    body: 'I did not expect to cry this much in a book about a spider and a pig. Charlotte is the best friend anyone could have.',
    pull: 'It is not often that someone comes along who is a true friend and a good writer.',
    feeling: 'Will reread this',
    forWho: 'Everyone, forever',
    young: true,
  },
  {
    book: 'The BFG',
    author: 'Roald Dahl',
    reviewer: 'Sophie, age 8',
    role: 'Young Reader',
    score: '9',
    body: 'The BFG speaks in the funniest way and it makes the book so fun to read out loud.',
    pull: 'I is not understanding human beans at all.',
    feeling: 'Will reread this',
    forWho: 'Anyone who wants to laugh a lot',
    young: true,
  },
];

// Roles that read as "official" BetweenReads voices get the yellow-accent badge.
const OFFICIAL_ROLES = new Set(['Team']);

type Audience = 'all' | 'young';

const STYLES = `
.bl-reviews {
  --bl-rev-ink: var(--theme-text);
  background: var(--theme-page-soft);
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
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--theme-text-muted);
}

/* === Audience toggle: brutalist segmented control === */
.bl-reviews-toggle {
  display: inline-flex;
  margin: clamp(22px, 3vh, 34px) 0 clamp(34px, 5vh, 52px);
  border: 2px solid var(--bl-rev-ink);
  box-shadow: 4px 4px 0 var(--bl-rev-ink);
  background: var(--theme-surface);
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
  padding: 10px 22px;
  transition: background 160ms var(--v6-ease, ease), color 160ms var(--v6-ease, ease);
}
.bl-reviews-tab + .bl-reviews-tab {
  border-left: 2px solid var(--bl-rev-ink);
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
  gap: clamp(16px, 2vw, 22px);
}

/* === Card (v11 brutalist) === */
.bl-reviews-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--theme-surface);
  color: var(--bl-rev-ink);
  border: 2px solid var(--bl-rev-ink);
  border-radius: 0;
  padding: 28px 30px 26px;
  box-shadow: 6px 6px 0 var(--bl-rev-ink);
  transition:
    box-shadow 220ms cubic-bezier(.22, 1, .36, 1),
    transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-reviews-card:hover {
  box-shadow: 10px 10px 0 var(--bl-rev-ink);
  transform: translate(-2px, -2px);
}
.bl-rev-head {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
}
.bl-rev-badge {
  font-size: 9.5px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
  border: 1.5px solid var(--bl-rev-ink);
  border-radius: 0;
  background: transparent;
  color: var(--bl-rev-ink);
}
.bl-rev-badge.is-official {
  background: var(--theme-accent);
  border-color: var(--bl-rev-ink);
  color: var(--theme-accent-contrast, #10110f);
}
.bl-rev-name {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--theme-text-soft);
}
.bl-rev-book {
  font-family: var(--br-font-display);
  font-size: 27px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 4px 0 0;
}
.bl-rev-author {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--theme-text-muted);
  margin-top: 5px;
}
.bl-rev-pull {
  font-family: var(--br-font-serif);
  font-style: italic;
  font-size: 18px;
  line-height: 1.5;
  color: var(--bl-rev-ink);
  border-left: 3px solid var(--theme-accent);
  padding-left: 15px;
  flex: 1;
}
.bl-rev-for {
  font-family: var(--br-font-serif);
  font-size: 13px;
  font-style: italic;
  color: var(--theme-text-faint);
}
.bl-rev-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 4px;
  border-top: 1.5px solid var(--theme-border-subtle);
}
.bl-rev-feeling {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 11px;
  border: 1.5px solid var(--theme-border-strong);
  border-radius: 999px;
  color: var(--theme-text-soft);
}
.bl-rev-score {
  font-family: var(--br-font-display);
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.02em;
  white-space: nowrap;
}
.bl-rev-score span {
  font-size: 14px;
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

  const shown = useMemo(
    () => REVIEWS.filter((r) => (audience === 'young' ? r.young : !r.young)),
    [audience],
  );

  return (
    <section className="bl-reviews" aria-label="Community reviews">
      <style>{STYLES}</style>
      <div className="bl-reviews-inner">
        <header className="bl-reviews-head">
          <p className="bl-reviews-eyebrow">Between Reads</p>
          <h2 className="bl-reviews-title">BetweenReviews</h2>
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
              <div className="bl-rev-head">
                <span
                  className={`bl-rev-badge${OFFICIAL_ROLES.has(r.role) ? ' is-official' : ''}`}
                >
                  {r.role}
                </span>
                <span className="bl-rev-name">{r.reviewer}</span>
              </div>

              <div>
                <h3 className="bl-rev-book">{r.book}</h3>
                <p className="bl-rev-author">{r.author}</p>
              </div>

              {r.pull && <p className="bl-rev-pull">&ldquo;{r.pull}&rdquo;</p>}
              {r.forWho && <p className="bl-rev-for">For: {r.forWho}</p>}

              <div className="bl-rev-meta">
                {r.feeling && <span className="bl-rev-feeling">{r.feeling}</span>}
                {r.score && (
                  <span className="bl-rev-score">
                    {r.score}
                    <span>/10</span>
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {onReader && (
          <div className="bl-reviews-foot">
            <button type="button" className="bl-reviews-cta" onClick={onReader}>
              Share what you&rsquo;re reading →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
