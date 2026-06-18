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

// The manuscript a beta reader discovers first — published later, credited forever.
const BETA_BOOK: MiniBook = {
  title: 'The Undertow Hours',
  italicWords: [1],
  authorMono: 'J.T. CALLOWAY',
  publisher: 'BETWEENREADS',
  coverBg: offerCover('the-undertow-hours'),
  coverFg: 'light',
};

// Member-avatar tints for the club huddle.
const DOT_TINTS = [
  'var(--bl-accent)',
  'color-mix(in srgb, var(--bl-footer-fg) 68%, transparent)',
  'color-mix(in srgb, var(--bl-accent) 58%, var(--bl-footer-fg))',
  'color-mix(in srgb, var(--bl-footer-fg) 42%, transparent)',
  'color-mix(in srgb, var(--bl-accent) 80%, var(--bl-surface))',
];

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

// Circular "stamp" that names the reader on a writer's page once they break out.
function EarlyDiscovererSeal() {
  return (
    <span className="bl-offers-seal" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <path
            id="bl-seal-ring"
            d="M50,50 m-32,0 a32,32 0 1,1 64,0 a32,32 0 1,1 -64,0"
            fill="none"
          />
        </defs>
        <circle cx="50" cy="50" r="47" className="bl-offers-seal-disc" />
        <circle cx="50" cy="50" r="47" className="bl-offers-seal-rim" />
        <circle cx="50" cy="50" r="38" className="bl-offers-seal-rim-inner" />
        <text className="bl-offers-seal-text">
          <textPath href="#bl-seal-ring" startOffset="0%">
            EARLY&nbsp;DISCOVERER&nbsp;·&nbsp;BETWEENREADS&nbsp;·&nbsp;
          </textPath>
        </text>
        <text x="50" y="45" textAnchor="middle" className="bl-offers-seal-star">
          ★
        </text>
        <text x="50" y="62" textAnchor="middle" className="bl-offers-seal-foot">
          FOR LIFE
        </text>
      </svg>
    </span>
  );
}

export default function SignupOffers({ onReader, onWriter }: Props) {
  const handle = (cb?: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    cb?.();
  };

  return (
    <section className="bl-offers" aria-label="Reading clubs and beta reading">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
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
            <div className="bl-offers-art-stage bl-offers-club-stage">
              <span className="bl-offers-art-label">Private club thread</span>
              <div className="bl-offers-covers">
                {MINI_BOOKS.map((book, i) => (
                  <div
                    key={book.title}
                    className={`bl-offers-cover${book.coverFg === 'dark' ? ' is-light' : ''}`}
                    style={{
                      background: book.coverBg,
                      color: book.coverFg === 'light' ? '#F3EFE6' : '#0e0e0c',
                      transform: `rotate(${[-4, 3][i]}deg)`,
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
              </div>
              <div className="bl-offers-thread-card">
                <span className="bl-offers-thread-rail" />
                <span className="bl-offers-thread-note">Chapter 12</span>
                <span className="bl-offers-thread-copy">The twist changes the title.</span>
                <span className="bl-offers-thread-copy is-muted">4 replies in the margins</span>
              </div>
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

        {/* RIGHT — Beta reading: discovery on one side, real readers on the other */}
        <article
          className="bl-offers-panel bl-offers-beta-panel"
          aria-labelledby="bl-offers-beta-title"
        >
          <h2 className="bl-offers-title" id="bl-offers-beta-title">
            <span className="bl-offers-mark">Read it first.</span>
            <span className="bl-offers-sub">
              Discovery, <em>both ways.</em>
            </span>
          </h2>

          <div className="bl-offers-beta-art" aria-hidden="true">
            <div className="bl-offers-art-stage bl-offers-beta-stage">
              <span className="bl-offers-art-label">Manuscript discovery</span>
              <div className="bl-offers-dossier">
                <span className="bl-offers-page bl-offers-page-back" />
                <span className="bl-offers-page bl-offers-page-front">
                  <span className="bl-offers-page-title" />
                  <span className="bl-offers-page-line" />
                  <span className="bl-offers-page-line" />
                  <span className="bl-offers-page-line is-short" />
                  <span className="bl-offers-page-note">Reader note</span>
                </span>
              </div>
              <div className="bl-offers-manuscript">
                <div
                  className="bl-offers-cover"
                  style={{
                    background: BETA_BOOK.coverBg,
                    color: '#F3EFE6',
                    transform: 'rotate(-3.5deg)',
                  }}
                >
                  <div className="bl-offers-cover-publisher">{BETA_BOOK.publisher}</div>
                  <div className="bl-offers-cover-title">
                    {renderTitle(BETA_BOOK.title, BETA_BOOK.italicWords)}
                  </div>
                  <div className="bl-offers-cover-foot">
                    <div className="bl-offers-cover-rule" />
                    <div className="bl-offers-cover-author">{BETA_BOOK.authorMono}</div>
                  </div>
                </div>
                <EarlyDiscovererSeal />
              </div>
              <span className="bl-offers-credit-card">
                <span className="bl-offers-credit-kicker">Author page credit</span>
                <span className="bl-offers-credit-name">Early Discoverer</span>
              </span>
              <span className="bl-offers-beta-line" />
            </div>
          </div>

          <p className="bl-offers-lede">
            Readers find writers before they break out &mdash; beta read a manuscript and,
            if it goes on to be agented or published, you&rsquo;re named an{' '}
            <strong>Early Discoverer</strong> on their page, for life. Writers get real
            readers and honest feedback before they ever query.
          </p>
          <div className="bl-offers-cta-row">
            <a
              href="/start?mode=reader"
              className="bl-offers-cta"
              onClick={handle(onReader)}
            >
              Become a beta reader
              <span className="bl-offers-cta-arrow" aria-hidden="true">→</span>
            </a>
            <a
              href="/start?mode=writer"
              className="bl-offers-cta bl-offers-cta-ghost"
              onClick={handle(onWriter)}
            >
              Get your work read
              <span className="bl-offers-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
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
  padding: clamp(76px, 10vh, 116px) clamp(24px, 5vw, 80px);
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
  max-width: 1320px;
  margin: 0 auto;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  /* shared row tracks: title · illustration · lede · cta */
  grid-template-rows: minmax(116px, auto) minmax(304px, auto) 1fr auto;
  gap: clamp(20px, 2.2vw, 30px) clamp(30px, 4.4vw, 70px);
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
.bl-offers-beta-panel { grid-column: 3; }
/* Shared rows keep the two panels in visual lockstep. */
.bl-offers-title { align-self: start; }
.bl-offers-club-art,
.bl-offers-beta-art { align-self: center; }
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
  font-size: clamp(40px, 4.1vw, 58px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--bl-footer-fg);
  margin: 0;
  min-height: clamp(92px, 8vw, 116px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
  font-size: clamp(40px, 4.1vw, 58px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: var(--bl-footer-fg);
}
.bl-offers-sub {
  display: block;
  margin-top: 6px;
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(21px, 1.9vw, 28px);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--bl-footer-fg);
}
.bl-offers-sub em { color: var(--bl-footer-fg); }

.bl-offers-lede {
  font-family: var(--bl-font-body);
  font-size: clamp(18px, 1.35vw, 22px);
  line-height: 1.5;
  color: color-mix(in srgb, var(--bl-footer-fg) 70%, transparent);
  margin: 0;
  max-width: 45ch;
  text-wrap: pretty;
}
.bl-offers-lede strong {
  color: var(--bl-footer-fg);
  font-weight: 600;
}

/* ── Shared illustration language ── */
.bl-offers-club-art,
.bl-offers-beta-art {
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
}
.bl-offers-art-stage {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: clamp(284px, 25vw, 324px);
}
.bl-offers-art-label {
  position: absolute;
  top: 0;
  left: 2px;
  z-index: 5;
  white-space: nowrap;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--bl-footer-fg) 54%, transparent);
}
.bl-offers-cover {
  flex: 0 0 auto;
  width: clamp(104px, 9.5vw, 132px);
  aspect-ratio: 2 / 3;
  border-radius: 4px;
  padding: 11px 11px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.24);
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
  font-size: clamp(15px, 1.45vw, 19px);
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

/* ── Left: club as a live margin thread ── */
.bl-offers-club-stage::before {
  content: '';
  position: absolute;
  left: -4px;
  right: 22px;
  bottom: 32px;
  height: 132px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--bl-footer-fg) 16%, transparent);
  background:
    radial-gradient(circle at 34% 44%, color-mix(in srgb, var(--bl-surface) 36%, transparent), transparent 34%),
    color-mix(in srgb, var(--bl-footer-fg) 7%, transparent);
  transform: rotate(-5deg);
}
.bl-offers-covers {
  position: absolute;
  left: clamp(6px, 1vw, 18px);
  bottom: 58px;
  z-index: 3;
  display: flex;
  align-items: flex-end;
}
.bl-offers-covers .bl-offers-cover + .bl-offers-cover {
  margin-left: -18px;
  margin-bottom: 12px;
}
.bl-offers-thread-card {
  position: absolute;
  top: clamp(58px, 5.8vw, 72px);
  right: clamp(0px, 2vw, 22px);
  z-index: 4;
  width: clamp(190px, 42%, 238px);
  min-height: 122px;
  border-radius: 8px;
  padding: 18px 18px 16px 24px;
  background: color-mix(in srgb, var(--bl-surface) 94%, transparent);
  color: var(--bl-paper-ink, #161410);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.18);
  transform: rotate(2deg);
}
.bl-offers-thread-rail {
  position: absolute;
  left: 12px;
  top: 18px;
  bottom: 16px;
  width: 2px;
  border-radius: 999px;
  background: var(--bl-accent);
}
.bl-offers-thread-note,
.bl-offers-thread-copy {
  display: block;
}
.bl-offers-thread-note {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.bl-offers-thread-copy {
  margin-top: 8px;
  font-family: var(--bl-font-body);
  font-size: 15px;
  font-weight: 650;
  line-height: 1.25;
}
.bl-offers-thread-copy.is-muted {
  margin-top: 10px;
  font-size: 12px;
  font-weight: 600;
  color: color-mix(in srgb, var(--bl-paper-ink, #161410) 58%, transparent);
}
.bl-offers-club-meta {
  position: absolute;
  left: clamp(142px, 20vw, 228px);
  bottom: clamp(8px, 1.6vw, 20px);
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  font-weight: 700;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--bl-footer-fg) 64%, transparent);
}

/* ── Right: beta reading as a manuscript dossier ── */
.bl-offers-beta-stage {
  width: 100%;
  max-width: 500px;
}
.bl-offers-beta-line {
  position: absolute;
  left: 34px;
  right: 48px;
  bottom: 54px;
  height: 1px;
  background: color-mix(in srgb, var(--bl-footer-fg) 20%, transparent);
  transform: rotate(-2deg);
}
.bl-offers-dossier {
  position: absolute;
  left: clamp(8px, 1vw, 18px);
  top: 54px;
  width: clamp(212px, 22vw, 276px);
  height: clamp(180px, 18vw, 220px);
}
.bl-offers-page {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--bl-footer-fg) 16%, transparent);
  background: var(--bl-paper-bg, #F6F1E3);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.16);
}
.bl-offers-page-back {
  transform: translate(18px, 12px) rotate(3deg);
  opacity: 0.72;
}
.bl-offers-page-front {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  transform: rotate(-2deg);
}
.bl-offers-page-title,
.bl-offers-page-line {
  display: block;
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--bl-paper-ink, #161410) 20%, transparent);
}
.bl-offers-page-title {
  width: 44%;
  height: 10px;
  background: color-mix(in srgb, var(--bl-paper-ink, #161410) 34%, transparent);
}
.bl-offers-page-line.is-short { width: 66%; }
.bl-offers-page-note {
  margin-top: auto;
  align-self: flex-start;
  border-radius: 999px;
  padding: 7px 12px;
  background: color-mix(in srgb, var(--bl-accent) 74%, var(--bl-surface));
  color: #17150f;
  font-family: var(--bl-font-body);
  font-size: 12px;
  font-style: italic;
  font-weight: 700;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}
.bl-offers-manuscript {
  position: absolute;
  left: clamp(132px, 15vw, 188px);
  top: clamp(44px, 5vw, 62px);
  z-index: 4;
  width: max-content;
  padding: 6px 44px 34px 0;
}
.bl-offers-manuscript .bl-offers-cover {
  width: clamp(98px, 9vw, 126px);
}
/* A cream medallion stamped over the cover's lower-right corner so the ink
   rim + text stay legible against both the dark cover and the yellow ground. */
.bl-offers-seal {
  position: absolute;
  right: 0;
  bottom: 0;
  width: clamp(78px, 7.5vw, 96px);
  height: clamp(78px, 7.5vw, 96px);
  color: var(--bl-footer-fg);
  transform: rotate(-8deg);
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.28));
}
.bl-offers-seal-disc { fill: var(--bl-paper-bg, #F6F1E3); }
.bl-offers-seal-rim {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
}
.bl-offers-seal-rim-inner {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  stroke-dasharray: 2 3.2;
  opacity: 0.85;
}
.bl-offers-seal-text {
  fill: currentColor;
  font-family: var(--bl-font-eyebrow);
  font-weight: 800;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.bl-offers-seal-star {
  fill: currentColor;
  font-size: 19px;
}
.bl-offers-seal-foot {
  fill: currentColor;
  font-family: var(--bl-font-eyebrow);
  font-weight: 800;
  font-size: 7.6px;
  letter-spacing: 0.2em;
}
.bl-offers-credit-card {
  position: absolute;
  left: clamp(108px, 13vw, 168px);
  bottom: clamp(8px, 1.6vw, 20px);
  z-index: 5;
  min-width: 210px;
  border-radius: 8px;
  padding: 12px 16px;
  background: var(--bl-footer-fg);
  color: var(--bl-footer-bg);
  box-shadow: 0 14px 26px rgba(0, 0, 0, 0.22);
  transform: rotate(1.5deg);
}
.bl-offers-credit-kicker,
.bl-offers-credit-name {
  display: block;
}
.bl-offers-credit-kicker {
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.68;
}
.bl-offers-credit-name {
  margin-top: 2px;
  font-family: var(--bl-font-serif);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.bl-offers-cta {
  justify-self: start;
  align-self: end;
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--bl-footer-fg);
  color: var(--bl-footer-bg);
  min-width: 262px;
  min-height: 64px;
  padding: 20px 40px;
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

/* Dual CTA: filled primary (reader) + ghost secondary (writer) */
.bl-offers-cta-row {
  justify-self: start;
  align-self: end;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: min(100%, 340px);
}
.bl-offers-cta-row .bl-offers-cta {
  justify-self: auto;
  align-self: auto;
  width: 100%;
}
.bl-offers-cta-ghost {
  background: transparent;
  color: var(--bl-footer-fg);
  box-shadow: none;
  border: 1.5px solid color-mix(in srgb, var(--bl-footer-fg) 38%, transparent);
}
.bl-offers-cta-ghost:hover {
  background: var(--bl-footer-fg);
  color: var(--bl-footer-bg);
  box-shadow: 0 10px 26px color-mix(in srgb, var(--bl-footer-fg) 32%, transparent);
}

@media (max-width: 980px) {
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
  .bl-offers-title {
    align-self: start;
    min-height: 0;
  }
  .bl-offers-art-stage {
    width: 100%;
    max-width: 520px;
  }
  .bl-offers-cta {
    margin-top: 6px;
    align-self: start;
  }
  .bl-offers-cta-row {
    margin-top: 6px;
    align-self: start;
  }
  .bl-offers-cta-row .bl-offers-cta { margin-top: 0; }
  .bl-offers-divider {
    grid-row: auto;
    grid-column: 1;
    width: auto;
    height: 1px;
  }
}

@media (max-width: 560px) {
  .bl-offers {
    padding: 64px 20px;
  }
  .bl-offers-title,
  .bl-offers-mark {
    font-size: clamp(36px, 11vw, 48px);
  }
  .bl-offers-sub {
    font-size: clamp(20px, 6vw, 24px);
  }
  .bl-offers-art-stage {
    height: 352px;
  }
  .bl-offers-club-stage::before {
    right: 0;
    bottom: 78px;
    height: 118px;
  }
  .bl-offers-art-label {
    top: 4px;
    left: 0;
  }
  .bl-offers-covers {
    left: auto;
    right: 0;
    bottom: 98px;
  }
  .bl-offers-covers .bl-offers-cover + .bl-offers-cover {
    margin-left: -58px;
    margin-bottom: 16px;
  }
  .bl-offers-thread-card {
    top: 64px;
    left: 0;
    right: auto;
    z-index: 2;
    width: 188px;
    min-height: 132px;
    padding-right: 14px;
    transform: rotate(-2deg);
  }
  .bl-offers-club-meta {
    left: 0;
    bottom: 14px;
  }
  .bl-offers-beta-stage {
    height: 390px;
  }
  .bl-offers-dossier {
    left: auto;
    right: 0;
    top: 62px;
    width: min(64%, 222px);
    height: 232px;
  }
  .bl-offers-manuscript {
    left: 0;
    right: auto;
    top: 100px;
  }
  .bl-offers-credit-card {
    left: 0;
    right: 0;
    bottom: 10px;
    min-width: 0;
    width: auto;
    transform: none;
  }
  .bl-offers-beta-line {
    display: none;
  }
  .bl-offers-cta,
  .bl-offers-cta-row {
    width: 100%;
  }
  .bl-offers-cta {
    min-width: 0;
    padding-inline: 28px;
  }
}
`;
