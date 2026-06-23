'use client';

import Link from 'next/link';

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
    <div className="tw-art">
      <svg className="tw-illo" viewBox="0 0 320 220" aria-hidden="true" focusable="false">
        <ellipse className="wash" cx="160" cy="184" rx="120" ry="20" />
        <path className="paper" d="M58 70h96v100c0 6-4 10-10 10H68c-6 0-10-4-10-10z" />
        <path className="line" d="M58 70h96M106 70v110" />
        <path className="thin" d="M70 92h28M70 112h28M70 132h28M118 92h26M118 112h26M118 132h26" />
        <path className="paper" d="M170 64h100v112c0 6-4 10-10 10h-80c-6 0-10-4-10-10z" />
        <path className="line" d="M170 64h100M220 64v116" />
        <path className="thin" d="M184 86h28M184 106h28M184 126h28M232 86h26M232 106h26M232 126h26" />
        <path className="pop" d="M250 50l7 14 16 2-12 11 3 16-14-7-14 7 3-16-12-11 16-2z" />
        <path className="pop-stroke" d="M48 184c20-14 42-14 62 0" />
      </svg>
    </div>
  );
}

function JournalArt() {
  return (
    <div className="tw-art">
      <svg className="tw-illo" viewBox="0 0 320 220" aria-hidden="true" focusable="false">
        <ellipse className="wash-2" cx="160" cy="184" rx="118" ry="20" />
        <path className="paper" d="M86 50h120c8 0 14 6 14 14v108c0 8-6 14-14 14H86c-8 0-14-6-14-14V64c0-8 6-14 14-14z" />
        <path className="line" d="M100 50v136" />
        <path className="thin" d="M118 78h84M118 100h84M118 122h64M118 144h70" />
        <path className="pop-stroke" d="M86 64c10-10 24-10 28 0" />
        <circle className="pop" cx="240" cy="76" r="6" />
        <path className="line" d="M198 178c12-16 30-16 42 0" />
      </svg>
    </div>
  );
}

function BetaReadingArt() {
  return (
    <div className="tw-art tw-art-dossier">
      <svg className="tw-illo" viewBox="0 0 320 220" aria-hidden="true" focusable="false">
        <ellipse className="wash" cx="150" cy="184" rx="120" ry="20" />
        <path className="paper" d="M70 56h126v118c0 6-4 10-10 10H80c-6 0-10-4-10-10z" transform="rotate(-3 133 121)" />
        <path className="thin" d="M92 86h70M92 108h54M92 130h66M92 152h44" transform="rotate(-3 133 121)" />
        <path className="pop-stroke" d="M222 70l30 9" />
        <path className="pop" d="M246 56l6 12 14 2-10 10 2 14-12-6-13 6 2-14-10-10 14-2z" />
      </svg>
      <Seal className="tw-beta-seal" />
    </div>
  );
}

function HonestReviewsArt() {
  return (
    <div className="tw-art">
      <svg className="tw-illo" viewBox="0 0 320 220" aria-hidden="true" focusable="false">
        <ellipse className="wash" cx="160" cy="184" rx="118" ry="20" />
        <path
          className="paper"
          d="M58 64h180c14 0 24 10 24 24v52c0 14-10 24-24 24h-58l-34 26v-26H58c-14 0-24-10-24-24V88c0-14 10-24 24-24z"
        />
        <path className="thin" d="M76 100h96M76 124h70" />
        <path className="pop" d="M236 56l7 14 16 2-12 11 3 16-14-7-14 7 3-16-12-11 16-2z" />
        <path className="pop" d="M270 86l5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1z" />
      </svg>
    </div>
  );
}

function BooksellerPicksArt() {
  return (
    <div className="tw-art">
      <svg className="tw-illo" viewBox="0 0 320 220" aria-hidden="true" focusable="false">
        <ellipse className="wash-2" cx="160" cy="184" rx="120" ry="20" />
        <path className="line" d="M50 176h220" />
        <path className="paper" d="M66 60h36v112H66z" transform="rotate(-4 84 116)" />
        <path className="paper" d="M118 50h44v122h-44z" />
        <path className="paper" d="M178 64h38v108h-38z" transform="rotate(3 197 118)" />
        <path className="thin" d="M132 70h16M132 90h16M132 110h16M132 130h16" />
        <path className="pop" d="M250 56l6 13 15 2-11 10 3 15-13-7-13 7 3-15-11-10 15-2z" />
      </svg>
    </div>
  );
}

function StorefrontArt() {
  return (
    <div className="tw-art">
      <svg className="tw-illo" viewBox="0 0 320 220" aria-hidden="true" focusable="false">
        <ellipse className="wash" cx="160" cy="184" rx="120" ry="20" />
        <path className="pop" d="M62 58h160l-13 34H75z" />
        <path className="line" d="M62 58h160l-13 34H75zM88 92v76M196 92v76M70 168h146" />
        <path className="paper" d="M132 122h40v46h-40z" />
        <path className="line" d="M132 122h40v46h-40M152 122v46" />
        <path className="pop-stroke" d="M222 96c10 14 10 28 0 42" />
        <circle className="pop" cx="246" cy="106" r="5" />
      </svg>
    </div>
  );
}

function ArrowToPlatform() {
  return (
    <svg className="tw-connector tw-connector-left" viewBox="0 0 200 140" aria-hidden="true" focusable="false">
      <path className="line" d="M170 10c-40 8-90 18-126 60-14 16-22 34-26 56" />
      <path className="line" d="M14 122l-7 10M14 122l13 4" />
    </svg>
  );
}

function ArrowToBookWorld() {
  return (
    <svg className="tw-connector tw-connector-right" viewBox="0 0 200 140" aria-hidden="true" focusable="false">
      <path className="line" d="M30 10c40 8 90 18 126 60 14 16 22 34 26 56" />
      <path className="line" d="M186 122l7 10M186 122l-13 4" />
    </svg>
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
  position: relative;
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
.tw-connector {
  position: absolute;
  top: 100%;
  width: clamp(120px, 14vw, 200px);
  height: clamp(84px, 9.8vw, 140px);
  color: rgba(26, 23, 20, 0.55);
  pointer-events: none;
  transform: translateY(-6px);
}
.tw-connector .line {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.tw-connector-left { left: clamp(8%, 18vw, 22%); }
.tw-connector-right { right: clamp(8%, 18vw, 22%); }

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
  align-items: baseline;
  gap: 10px;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(21px, 2.1vw, 25px);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #1a1714;
  border: none;
  background: none;
  border-radius: 0;
  padding: 0 0 10px;
  border-bottom: 2.5px solid rgba(26, 23, 20, 0.7);
  margin-bottom: clamp(22px, 3vh, 30px);
  align-self: flex-start;
  user-select: none;
}
.tw-col--bookworld .tw-col-label {
  align-self: flex-end;
}
.tw-arrow {
  font-size: 0.6em;
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
  border: 1.5px dotted rgba(26, 23, 20, 0.55);
  border-radius: 16px;
  background: none;
  padding: clamp(22px, 2.6vw, 28px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), box-shadow 220ms cubic-bezier(.22, 1, .36, 1), border-color 220ms ease;
}
.tw-row:hover {
  transform: translateY(-2px);
  border-color: rgba(26, 23, 20, 0.85);
  box-shadow: 0 14px 26px rgba(26, 23, 20, 0.1);
}
.tw-row-top {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.tw-num {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  font-style: italic;
  color: rgba(26, 23, 20, 0.42);
  flex-shrink: 0;
}
.tw-row-heading {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(27px, 2.7vw, 33px);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #1a1714;
  margin: 0;
  line-height: 1.15;
}
.tw-row-body {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(17px, 1.6vw, 20px);
  line-height: 1.6;
  color: rgba(26, 23, 20, 0.68);
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
.tw-illo {
  width: 100%;
  height: 100%;
  overflow: visible;
  color: #1a1714;
}
.tw-illo .line,
.tw-illo .thin,
.tw-illo .pop-stroke {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.tw-illo .line {
  stroke: currentColor;
  stroke-width: 2.4;
}
.tw-illo .thin {
  stroke: rgba(26, 23, 20, 0.48);
  stroke-width: 1.6;
}
.tw-illo .paper {
  fill: #ffffff;
  stroke: rgba(26, 23, 20, 0.72);
  stroke-width: 2;
}
.tw-illo .wash,
.tw-illo .wash-2 {
  fill: rgba(26, 23, 20, 0.08);
}
.tw-illo .pop {
  fill: var(--theme-accent-strong, #d4aa18);
}
.tw-illo .pop-stroke {
  stroke: var(--theme-accent-strong, #d4aa18);
  stroke-width: 2.4;
}

/* Beta Reading — manuscript art + seal overlay */
.tw-art-dossier { position: relative; }
.tw-beta-seal {
  position: absolute;
  right: 2px;
  bottom: -6px;
  width: clamp(34px, 3.2vw, 40px);
  height: clamp(34px, 3.2vw, 40px);
  color: #1a1714;
  transform: rotate(-8deg);
}
.tw-seal-disc { fill: #ffffff; }
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
  .tw-connector {
    display: none;
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
            A place for two sides.
          </h2>
          <ArrowToPlatform />
          <ArrowToBookWorld />
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
