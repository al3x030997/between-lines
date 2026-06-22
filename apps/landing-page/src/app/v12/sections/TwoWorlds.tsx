'use client';

import Link from 'next/link';

const coverBg = (filename: string) =>
  `linear-gradient(180deg, rgba(8, 8, 8, 0.05) 0%, rgba(8, 8, 8, 0.4) 56%, rgba(8, 8, 8, 0.68) 100%), url('/covers/${filename}.jpg') center/cover no-repeat`;

function MiniCover({
  filename,
  title,
  author,
  className,
  style,
}: {
  filename: string;
  title: string;
  author: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`tw-cover${className ? ` ${className}` : ''}`} style={{ background: coverBg(filename), ...style }}>
      <div className="tw-cover-title">{title}</div>
      <div className="tw-cover-author">{author}</div>
    </div>
  );
}

// Circular "stamp" naming the reader on a writer's page once their pick breaks out.
function Seal({ className }: { className?: string }) {
  return (
    <span className={`tw-seal${className ? ` ${className}` : ''}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <path id="tw-seal-ring" d="M50,50 m-32,0 a32,32 0 1,1 64,0 a32,32 0 1,1 -64,0" fill="none" />
        </defs>
        <circle cx="50" cy="50" r="47" className="tw-seal-disc" />
        <circle cx="50" cy="50" r="47" className="tw-seal-rim" />
        <text className="tw-seal-text">
          <textPath href="#tw-seal-ring" startOffset="0%">
            EARLY&nbsp;DISCOVERER&nbsp;·&nbsp;BETWEENREADS&nbsp;·&nbsp;
          </textPath>
        </text>
        <text x="50" y="56" textAnchor="middle" className="tw-seal-star">★</text>
      </svg>
    </span>
  );
}

function OriginalVoicesArt() {
  return (
    <div className="tw-art tw-art-stack">
      <MiniCover filename="hollow-latitude" title="Hollow Latitude" author="M. Osei" className="tw-cover-a" />
      <MiniCover filename="ash-and-anise" title="Ash & Anise" author="P. Nair" className="tw-cover-b" />
    </div>
  );
}

function JournalArt() {
  return (
    <div className="tw-art">
      <div className="tw-journal">
        <span className="tw-journal-mark">
          Between<br />Lines
        </span>
        <span className="tw-journal-issue">Issue 04</span>
      </div>
    </div>
  );
}

function BetaReadingArt() {
  return (
    <div className="tw-art tw-art-dossier">
      <div className="tw-dossier">
        <span className="tw-page tw-page-back" />
        <span className="tw-page tw-page-front">
          <span className="tw-page-line title" />
          <span className="tw-page-line" />
          <span className="tw-page-line short" />
        </span>
      </div>
      <MiniCover
        filename="the-undertow-hours"
        title="The Undertow Hours"
        author="J.T. Calloway"
        className="tw-beta-cover"
      />
      <Seal className="tw-beta-seal" />
    </div>
  );
}

function HonestReviewsArt() {
  return (
    <div className="tw-art">
      <div className="tw-quote-card">
        <p className="tw-quote-text">&ldquo;Quietly took me apart.&rdquo;</p>
        <span className="tw-quote-stars" aria-label="4.5 out of 5 stars">★★★★½</span>
      </div>
    </div>
  );
}

function BooksellerPicksArt() {
  return (
    <div className="tw-art tw-art-shelf">
      <MiniCover filename="the-glass-meridian" title="The Glass Meridian" author="R. Coen" className="tw-shelf-cover" />
      <MiniCover filename="salt-and-the-sea-between" title="Salt & the Sea Between" author="A. Marsh" className="tw-shelf-cover" />
      <MiniCover filename="small-fires-soft-rain" title="Small Fires, Soft Rain" author="L. Quintero" className="tw-shelf-cover" />
    </div>
  );
}

function StorefrontArt() {
  return (
    <div className="tw-art tw-art-storefront">
      <MiniCover filename="the-quiet-hours" title="The Quiet Hours" author="D. Faraday" className="tw-storefront-cover" />
      <span className="tw-buy-chip">Buy · Fair royalties</span>
    </div>
  );
}

type Row = { num: string; heading: string; body: string; Art: () => React.JSX.Element };

const PLATFORM_ROWS: Row[] = [
  {
    num: '01',
    heading: 'Original Voices',
    body: "Stories published on BetweenReads first. Emerging writers, poets, and illustrators the world hasn't found yet.",
    Art: OriginalVoicesArt,
  },
  {
    num: '02',
    heading: 'BetweenLines Journal',
    body: 'Our literary journal. Paid critics write considered takes — full reviews, capsules, and themed reading lists.',
    Art: JournalArt,
  },
  {
    num: '03',
    heading: 'Beta Reading',
    body: 'Real feedback before you publish. Early Discoverer credit for the readers who spot what breaks out.',
    Art: BetaReadingArt,
  },
];

const BOOK_WORLD_ROWS: Row[] = [
  {
    num: '01',
    heading: 'Honest Reviews',
    body: 'Real readers, real voice — written the way a good reader actually talks, not crowdsourced star-bombing.',
    Art: HonestReviewsArt,
  },
  {
    num: '02',
    heading: 'Bookseller Picks',
    body: 'Independent bookstores curate what to read next. Human taste, not an algorithm — a different shelf every week.',
    Art: BooksellerPicksArt,
  },
  {
    num: '03',
    heading: 'The Storefront',
    body: 'Buy from local shops. Better royalty terms for authors than the big platforms, on every purchase.',
    Art: StorefrontArt,
  },
];

const CSS = `
/* ── Root ── */
.tw-root {
  background: var(--theme-yellow, #f3d84a);
  color: #1a1714;
  padding: clamp(72px, 10vh, 120px) clamp(24px, 5.5vw, 88px);
  font-family: 'Outfit', system-ui, sans-serif;
  overflow: hidden;
}
.tw-inner {
  max-width: 1240px;
  margin: 0 auto;
}

/* ── Header ── */
.tw-header {
  text-align: center;
  margin-bottom: clamp(48px, 7vh, 76px);
}
.tw-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(38px, 5.4vw, 64px);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.03em;
  color: #1a1714;
  margin: 0;
  text-wrap: balance;
}

/* ── Two-column body ── */
.tw-body {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 0 clamp(36px, 5vw, 72px);
}
.tw-divider {
  width: 1px;
  background: rgba(26, 23, 20, 0.18);
}

/* ── Column ── */
.tw-col {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.tw-col-label {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(26, 23, 20, 0.68);
  border: 1.5px solid rgba(26, 23, 20, 0.24);
  background: rgba(26, 23, 20, 0.06);
  border-radius: 999px;
  padding: 8px 16px;
  margin-bottom: clamp(22px, 3vh, 30px);
  align-self: flex-start;
  user-select: none;
}
.tw-col--bookworld .tw-col-label {
  align-self: flex-end;
}
.tw-arrow {
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
}

/* ── Row cards ── */
.tw-rows {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(14px, 1.8vh, 18px);
}
.tw-row {
  border: 1px solid rgba(26, 23, 20, 0.14);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  padding: clamp(16px, 2vw, 20px) clamp(18px, 2.2vw, 22px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), box-shadow 220ms cubic-bezier(.22, 1, .36, 1), border-color 220ms ease;
}
.tw-row:hover {
  transform: translateY(-2px);
  border-color: rgba(26, 23, 20, 0.26);
  box-shadow: 0 14px 30px rgba(26, 23, 20, 0.12);
}
.tw-row-top {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.tw-num {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 13px;
  font-weight: 700;
  font-style: italic;
  color: rgba(26, 23, 20, 0.42);
  flex-shrink: 0;
}
.tw-row-heading {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(18px, 1.7vw, 21px);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #1a1714;
  margin: 0;
  line-height: 1.15;
}
.tw-row-body {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(13px, 1.1vw, 14.5px);
  line-height: 1.55;
  color: rgba(26, 23, 20, 0.62);
  margin: 0;
  text-wrap: pretty;
}

/* ── Illustration stage ── */
.tw-art {
  position: relative;
  height: clamp(78px, 8vw, 96px);
  display: flex;
  align-items: center;
  margin: 2px 0;
}
.tw-cover {
  flex-shrink: 0;
  width: clamp(50px, 5vw, 60px);
  aspect-ratio: 2 / 3;
  border-radius: 4px;
  padding: 7px 7px 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22);
  color: #f3efe6;
  font-family: 'Playfair Display', Georgia, serif;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.tw-row:hover .tw-cover { transform: translateY(-1px); }
.tw-cover-title {
  font-size: 9.5px;
  font-weight: 600;
  line-height: 1.15;
}
.tw-cover-author {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 6px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.85;
}

/* Original Voices — stacked covers */
.tw-art-stack { align-items: flex-end; }
.tw-cover-a { transform: rotate(-5deg); }
.tw-cover-b { transform: rotate(4deg); margin-left: -16px; }

/* BetweenLines Journal */
.tw-journal {
  width: clamp(56px, 5.6vw, 66px);
  aspect-ratio: 2 / 3;
  border-radius: 4px;
  background: linear-gradient(160deg, #2b2722 0%, #161410 100%);
  padding: 10px 9px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22);
  transform: rotate(-3deg);
}
.tw-journal-mark {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 11px;
  font-weight: 800;
  line-height: 1.05;
  color: #f3efe6;
}
.tw-journal-issue {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #f3d84a;
}

/* Beta Reading — manuscript dossier + seal */
.tw-art-dossier { padding-right: 30px; }
.tw-dossier {
  position: relative;
  width: clamp(76px, 7.4vw, 90px);
  height: clamp(64px, 6vw, 74px);
  flex-shrink: 0;
}
.tw-page {
  position: absolute;
  inset: 0;
  border-radius: 5px;
  border: 1px solid rgba(26, 23, 20, 0.16);
  background: #f6f1e3;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
}
.tw-page-back { transform: translate(7px, 5px) rotate(3deg); opacity: 0.7; }
.tw-page-front {
  padding: 9px 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  transform: rotate(-2deg);
}
.tw-page-line {
  display: block;
  height: 3px;
  border-radius: 999px;
  background: rgba(22, 20, 16, 0.22);
}
.tw-page-line.title { width: 50%; height: 4px; background: rgba(22, 20, 16, 0.38); }
.tw-page-line.short { width: 60%; }
.tw-beta-cover {
  position: absolute;
  left: clamp(48px, 4.6vw, 58px);
  bottom: -14px;
  width: clamp(42px, 4vw, 50px);
}
.tw-beta-seal {
  position: absolute;
  right: -8px;
  bottom: -16px;
  width: clamp(32px, 3vw, 38px);
  height: clamp(32px, 3vw, 38px);
  color: #1a1714;
  transform: rotate(-8deg);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.24));
}
.tw-seal-disc { fill: #f6f1e3; }
.tw-seal-rim { fill: none; stroke: currentColor; stroke-width: 2.6; }
.tw-seal-text {
  fill: currentColor;
  font-family: 'Outfit', system-ui, sans-serif;
  font-weight: 800;
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.tw-seal-star { fill: currentColor; font-size: 22px; }

/* Honest Reviews — floating quote card */
.tw-quote-card {
  background: #f6f1e3;
  color: #161410;
  border-radius: 10px;
  padding: 12px 15px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.16);
  max-width: 230px;
  transform: rotate(-1.5deg);
}
.tw-quote-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 14px;
  line-height: 1.3;
  margin: 0;
}
.tw-quote-stars {
  display: block;
  margin-top: 7px;
  color: #d4aa18;
  font-size: 13px;
  letter-spacing: 1px;
}

/* Bookseller Picks — shelf row */
.tw-art-shelf { gap: 9px; }
.tw-shelf-cover { width: clamp(42px, 4vw, 50px); }

/* The Storefront — cover + buy chip */
.tw-art-storefront { gap: 16px; }
.tw-storefront-cover { width: clamp(54px, 5.2vw, 62px); }
.tw-buy-chip {
  display: inline-flex;
  align-items: center;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #f6f1e3;
  background: #1a1714;
  padding: 8px 14px;
  border-radius: 999px;
  white-space: nowrap;
}

/* ── CTAs ── */
.tw-cta-wrap {
  margin-top: clamp(26px, 3.6vh, 38px);
}
.tw-cta {
  display: inline-flex;
  align-items: center;
  gap: 13px;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(15px, 1.35vw, 17px);
  font-weight: 800;
  letter-spacing: 0.01em;
  color: var(--theme-paper-bg, #f3efe6);
  background: #1a1714;
  border-radius: 999px;
  padding: clamp(14px, 1.8vh, 18px) clamp(28px, 3vw, 40px);
  text-decoration: none;
  transition:
    transform 220ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 220ms cubic-bezier(.22, 1, .36, 1),
    background-color 220ms cubic-bezier(.22, 1, .36, 1);
  box-shadow: 0 10px 28px rgba(26, 23, 20, 0.22);
}
.tw-cta:hover,
.tw-cta:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px rgba(26, 23, 20, 0.30);
  background: #2d2926;
  outline: none;
}
.tw-cta:active { transform: translateY(0); }
.tw-cta-arrow {
  display: inline-block;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.tw-cta:hover .tw-cta-arrow,
.tw-cta:focus-visible .tw-cta-arrow {
  transform: translateX(4px);
}

/* ── Responsive ── */
@media (max-width: 860px) {
  .tw-body {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .tw-divider {
    width: auto;
    height: 1px;
    margin: clamp(40px, 6vw, 56px) 0;
  }
  .tw-col--bookworld .tw-col-label {
    align-self: flex-start;
  }
}
@media (max-width: 480px) {
  .tw-row { padding: 16px 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .tw-root *, .tw-root *::before, .tw-root *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`;

function Column({ side, rows }: { side: 'platform' | 'bookworld'; rows: Row[] }) {
  const isBookWorld = side === 'bookworld';
  return (
    <div className={`tw-col tw-col--${side}`}>
      <div className="tw-col-label">
        {!isBookWorld && <span className="tw-arrow" aria-hidden="true">←</span>}
        <span>{isBookWorld ? 'The Book World' : 'The Platform'}</span>
        {isBookWorld && <span className="tw-arrow" aria-hidden="true">→</span>}
      </div>
      <div className="tw-rows">
        {rows.map((row) => (
          <div className="tw-row" key={row.num}>
            <div className="tw-row-top">
              <span className="tw-num" aria-hidden="true">{row.num}</span>
              <h3 className="tw-row-heading">{row.heading}</h3>
            </div>
            <row.Art />
            <p className="tw-row-body">{row.body}</p>
          </div>
        ))}
      </div>
      <div className="tw-cta-wrap">
        {isBookWorld ? (
          <Link href="/reviews" className="tw-cta">
            Browse books
            <span className="tw-cta-arrow" aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link href="/?intake=writer" className="tw-cta">
            Join as writer
            <span className="tw-cta-arrow" aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function TwoWorlds() {
  return (
    <section className="tw-root" aria-labelledby="tw-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="tw-inner">
        <header className="tw-header">
          <h2 className="tw-title" id="tw-title">
            Two sides of a reading life.
          </h2>
        </header>

        <div className="tw-body">
          <Column side="platform" rows={PLATFORM_ROWS} />
          <div className="tw-divider" aria-hidden="true" />
          <Column side="bookworld" rows={BOOK_WORLD_ROWS} />
        </div>
      </div>
    </section>
  );
}
