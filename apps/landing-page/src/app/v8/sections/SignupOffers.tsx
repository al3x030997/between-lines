'use client';

type Props = {
  onReader?: () => void;
  onWriter?: () => void;
};

type MiniBook = {
  title: string;
  italicWords?: number[];
  authorMono: string;
  publisher: string;
  coverBg: string;
  coverFg: 'light' | 'dark';
};

const offerCover = (filename: string) =>
  `linear-gradient(180deg, rgba(8, 8, 8, 0.04) 0%, rgba(8, 8, 8, 0.38) 56%, rgba(8, 8, 8, 0.66) 100%), url('/covers/${filename}.jpg') center/cover no-repeat`;

// The two covers a club gathers around — the "book" in book club.
const MINI_BOOKS: MiniBook[] = [
  {
    title: 'Hollow Latitude',
    italicWords: [1],
    authorMono: 'M. OSEI',
    publisher: 'BETWEENREADS',
    coverBg: offerCover('hollow-latitude'),
    coverFg: 'light',
  },
  {
    title: 'Ash & Anise',
    italicWords: [2],
    authorMono: 'P. NAIR',
    publisher: 'BETWEENREADS',
    coverBg: offerCover('ash-and-anise'),
    coverFg: 'light',
  },
];

// Member-avatar tints for the club huddle and the pod rings.
const DOT_TINTS = [
  'var(--bl-accent)',
  'color-mix(in srgb, var(--bl-footer-fg) 68%, transparent)',
  'color-mix(in srgb, var(--bl-accent) 58%, var(--bl-footer-fg))',
  'color-mix(in srgb, var(--bl-footer-fg) 42%, transparent)',
  'color-mix(in srgb, var(--bl-accent) 80%, var(--bl-surface))',
];

// Lay out N dots evenly around a ring, starting at the top.
const ringDots = (n: number, radius = 38) =>
  Array.from({ length: n }).map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
    };
  });

function renderTitle(title: string, italicWords?: number[]) {
  if (!italicWords || italicWords.length === 0) return title;
  const parts = title.split(/(\s+)/);
  let wordIdx = -1;
  return parts.map((part, i) => {
    if (/\s+/.test(part)) return part;
    wordIdx += 1;
    if (italicWords.includes(wordIdx)) return <em key={i}>{part}</em>;
    return <span key={i}>{part}</span>;
  });
}

function PodRing({ n, small }: { n: number; small?: boolean }) {
  return (
    <div className={`bl-pod-ring${small ? ' is-small' : ''}`}>
      {ringDots(n).map((dot, i) => (
        <span
          key={i}
          className="bl-pod-dot"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            background: DOT_TINTS[i % DOT_TINTS.length],
          }}
        />
      ))}
      <span className="bl-pod-count">{n}</span>
    </div>
  );
}

export default function SignupOffers({ onReader, onWriter }: Props) {
  const handle = (cb?: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    cb?.();
  };

  return (
    <section className="bl-offers" aria-label="Reading clubs and pods">
      <style>{CSS}</style>
      <div className="bl-offers-inner">
        {/* LEFT — Reading Clubs: the open, wide community */}
        <article
          className="bl-offers-panel bl-offers-clubs"
          aria-labelledby="bl-offers-clubs-title"
        >
          <h2 className="bl-offers-title" id="bl-offers-clubs-title">
            Your book club, <em>but bigger.</em>
          </h2>

          <div className="bl-offers-club-art" aria-hidden="true">
            <div className="bl-offers-covers">
              {MINI_BOOKS.map((book, i) => (
                <div
                  key={book.title}
                  className={`bl-offers-cover${book.coverFg === 'dark' ? ' is-light' : ''}`}
                  style={{
                    background: book.coverBg,
                    color: book.coverFg === 'light' ? '#F3EFE6' : '#0e0e0c',
                    transform: `rotate(${[-3, 2.5][i]}deg)`,
                  }}
                >
                  <div className="bl-offers-cover-publisher">{book.publisher}</div>
                  <div className="bl-offers-cover-title">
                    {renderTitle(book.title, book.italicWords)}
                  </div>
                  <div className="bl-offers-cover-foot">
                    <div className="bl-offers-cover-rule" />
                    <div className="bl-offers-cover-author">{book.authorMono}</div>
                  </div>
                </div>
              ))}
              <div className="bl-offers-club-meta">
                <div className="bl-offers-members">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="bl-offers-member"
                      style={{ background: DOT_TINTS[i % DOT_TINTS.length] }}
                    />
                  ))}
                  <span className="bl-offers-members-more">+ many</span>
                </div>
                <span className="bl-offers-chip">
                  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
                    <path
                      d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5.5 5.5 5.5 7.5 5.5 9 7 12 9.5 15 7 16.5 5.5 18.5 5.5c3 0 4.5 3 3 6C19 15.65 12 20 12 20z"
                      fill="currentColor"
                    />
                  </svg>
                  couldn’t put it down
                </span>
              </div>
            </div>
          </div>

          <p className="bl-offers-lede">
            Gather around any book, genre, or author &mdash; published, indie, or just
            discovered. Read together, react in the margins, and unpack every twist in a
            private thread. Free to join, or start your own.
          </p>
          <a
            href="/start?mode=reader"
            className="bl-offers-cta"
            onClick={handle(onReader)}
          >
            Find your club
            <span className="bl-offers-cta-arrow" aria-hidden="true">→</span>
          </a>
        </article>

        <div className="bl-offers-divider" aria-hidden="true" />

        {/* RIGHT — Pods: the small, intimate, by-invitation counter-move */}
        <article
          className="bl-offers-panel bl-offers-pods-panel"
          aria-labelledby="bl-offers-pods-title"
        >
          <h2 className="bl-offers-title" id="bl-offers-pods-title">
            <span className="bl-offers-mark">Pods.</span>
            <span className="bl-offers-sub">
              An inner circle, <em>by invitation.</em>
            </span>
          </h2>

          <div className="bl-offers-pods" aria-hidden="true">
            <div className="bl-pod">
              <PodRing n={6} />
              <div className="bl-pod-cap">
                <strong>Reader Pod</strong>
                <span>up to 6 readers</span>
              </div>
            </div>
            <div className="bl-pod">
              <PodRing n={4} small />
              <div className="bl-pod-cap">
                <strong>Writer Pod</strong>
                <span>up to 4 writers</span>
              </div>
            </div>
          </div>

          <p className="bl-offers-lede">
            <strong>Reader Pods</strong> bring up to six readers around a writer’s work
            &mdash; a trusted circle, not a public feed. <strong>Writer Pods</strong> keep
            four writers close for honest craft talk. Small on purpose.
          </p>
          <a
            href="/start?mode=writer"
            className="bl-offers-cta"
            onClick={handle(onWriter)}
          >
            Start a pod
            <span className="bl-offers-cta-arrow" aria-hidden="true">→</span>
          </a>
        </article>
      </div>
    </section>
  );
}

const CSS = `
.bl-offers {
  position: relative;
  background: var(--bl-footer-bg);
  color: var(--bl-footer-fg);
  padding: clamp(72px, 10vh, 112px) clamp(24px, 5vw, 80px);
  overflow: hidden;
  font-family: var(--bl-font-display);
}
.bl-offers::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.06;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.bl-offers-inner {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  /* shared row tracks: title · illustration · lede · cta */
  grid-template-rows: auto auto 1fr auto;
  gap: clamp(22px, 2.6vw, 32px) clamp(28px, 4vw, 64px);
}
/* Both panels borrow the inner grid's rows so title/art/lede/cta line up
   across the divider regardless of how tall each side's content runs. */
.bl-offers-panel {
  display: grid;
  grid-row: 1 / 5;
  grid-template-rows: subgrid;
  row-gap: clamp(22px, 2.6vw, 32px);
  min-width: 0;
}
.bl-offers-clubs { grid-column: 1; }
.bl-offers-pods-panel { grid-column: 3; }
/* titles sit on the same baseline by bottom-aligning in their shared row */
.bl-offers-title { align-self: end; }
.bl-offers-club-art,
.bl-offers-pods { align-self: start; }
.bl-offers-lede { align-self: start; }
.bl-offers-divider {
  grid-column: 2;
  grid-row: 1 / 5;
  background: color-mix(in srgb, var(--bl-footer-fg) 18%, transparent);
  width: 1px;
}
.bl-offers-title {
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(30px, 3.6vw, 46px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--bl-footer-fg);
  margin: 0;
  text-wrap: balance;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-offers-title em {
  font-style: italic;
  font-weight: 500;
  color: var(--bl-footer-fg);
}
.bl-offers-mark {
  display: block;
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-weight: 500;
  font-size: clamp(48px, 6vw, 78px);
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: var(--bl-footer-fg);
}
.bl-offers-sub {
  display: block;
  margin-top: 8px;
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(22px, 2.2vw, 30px);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--bl-footer-fg);
}
.bl-offers-sub em { color: var(--bl-footer-fg); }

.bl-offers-lede {
  font-family: var(--bl-font-body);
  font-size: clamp(20px, 1.5vw, 24px);
  line-height: 1.55;
  color: color-mix(in srgb, var(--bl-footer-fg) 74%, transparent);
  margin: 0;
  max-width: 46ch;
  text-wrap: pretty;
}
.bl-offers-lede strong {
  color: var(--bl-footer-fg);
  font-weight: 600;
}

/* ── Left: Reading Clubs ── */
.bl-offers-club-art { margin: 2px 0 4px; }
.bl-offers-covers {
  display: flex;
  gap: 14px;
  align-items: flex-end;
  flex-wrap: wrap;
}
.bl-offers-cover {
  flex: 0 0 auto;
  width: clamp(96px, 11vw, 132px);
  aspect-ratio: 2 / 3;
  border-radius: 4px;
  padding: 11px 11px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
  font-family: var(--bl-font-serif);
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.bl-offers-cover:hover { transform: translateY(-2px) rotate(0deg) !important; }
.bl-offers-cover-publisher {
  font-family: var(--bl-font-eyebrow);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.22em;
  opacity: 0.85;
  text-transform: uppercase;
}
.bl-offers-cover-title {
  font-size: clamp(15px, 1.5vw, 19px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.01em;
}
.bl-offers-cover-title em { font-style: italic; font-weight: 500; }
.bl-offers-cover-foot {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.bl-offers-cover-rule { height: 1px; background: currentColor; opacity: 0.55; }
.bl-offers-cover-author {
  font-family: var(--bl-font-eyebrow);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.bl-offers-club-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 4px;
}
.bl-offers-members {
  display: flex;
  align-items: center;
}
.bl-offers-member {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-left: -9px;
  border: 2px solid var(--bl-footer-bg);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.22);
}
.bl-offers-member:first-child { margin-left: 0; }
.bl-offers-members-more {
  margin-left: 12px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--bl-footer-fg) 66%, transparent);
}
.bl-offers-chip {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bl-surface);
  color: #1a1a18;
  padding: 8px 15px;
  border-radius: 999px;
  font-family: var(--bl-font-body);
  font-style: italic;
  font-size: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.28);
}
.bl-offers-chip svg { color: var(--bl-accent); flex: 0 0 auto; }

/* ── Right: Pods ── */
.bl-offers-pods {
  display: flex;
  gap: clamp(20px, 3vw, 44px);
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 6px 0 2px;
}
.bl-pod {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.bl-pod-ring {
  position: relative;
  width: 152px;
  height: 152px;
}
.bl-pod-ring.is-small { width: 132px; height: 132px; }
.bl-pod-ring::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px dashed color-mix(in srgb, var(--bl-footer-fg) 26%, transparent);
}
.bl-pod-dot {
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid var(--bl-footer-bg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.26);
}
.bl-pod-count {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-weight: 500;
  font-size: 38px;
  color: var(--bl-footer-fg);
}
.bl-pod-cap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
}
.bl-pod-cap strong {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-footer-fg);
}
.bl-pod-cap span {
  font-family: var(--bl-font-body);
  font-size: 13px;
  color: color-mix(in srgb, var(--bl-footer-fg) 64%, transparent);
}

.bl-offers-cta {
  justify-self: start;
  align-self: end;
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 19px;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: var(--bl-footer-fg);
  color: var(--bl-footer-bg);
  padding: 23px 48px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), box-shadow 220ms ease;
  box-shadow: 0 8px 22px color-mix(in srgb, var(--bl-footer-fg) 30%, transparent);
}
.bl-offers-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--bl-footer-fg) 40%, transparent);
}
.bl-offers-cta-arrow {
  display: inline-block;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-offers-cta:hover .bl-offers-cta-arrow { transform: translateX(3px); }

@media (max-width: 820px) {
  .bl-offers-inner {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    gap: clamp(40px, 6vw, 56px);
  }
  .bl-offers-panel {
    display: flex;
    flex-direction: column;
    grid-row: auto;
    grid-column: 1;
    gap: clamp(18px, 2.4vw, 26px);
  }
  .bl-offers-title { align-self: start; }
  .bl-offers-cta {
    margin-top: 6px;
    align-self: start;
  }
  .bl-offers-divider {
    grid-row: auto;
    grid-column: 1;
    width: auto;
    height: 1px;
  }
}
`;
