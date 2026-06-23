'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Item = { heading: string; body: string };

const PLATFORM_ITEMS: Item[] = [
  {
    heading: 'Original Voices',
    body: "Stories published on BetweenReads first. Emerging writers, poets, and illustrators the world hasn't found yet.",
  },
  {
    heading: 'BetweenLines Journal',
    body: 'Our literary journal. Paid critics write considered takes — full reviews, capsules, and themed reading lists.',
  },
  {
    heading: 'Beta Reading',
    body: 'Real feedback before you publish. Early Discoverer credit for the readers who spot what breaks out.',
  },
];

const BOOK_WORLD_ITEMS: Item[] = [
  {
    heading: 'Honest Reviews',
    body: 'Real readers, real voice — written the way a good reader actually talks, not crowdsourced star-bombing.',
  },
  {
    heading: 'Bookseller Picks',
    body: 'Independent bookstores curate what to read next. Human taste, not an algorithm — a different shelf every week.',
  },
  {
    heading: 'The Storefront',
    body: 'Buy from local shops. Better royalty terms for authors than the big platforms, on every purchase.',
  },
];

const CSS = `
/* ── Root ── */
.tw-root {
  background: var(--theme-page, #ffffff);
  color: #1a1714;
  padding: clamp(72px, 10vh, 124px) clamp(24px, 5.5vw, 88px);
  font-family: 'Outfit', system-ui, sans-serif;
  overflow: hidden;
}
.tw-inner {
  max-width: 1180px;
  margin: 0 auto;
}

/* ── Header ── */
.tw-header {
  text-align: center;
  margin-bottom: clamp(40px, 6vh, 64px);
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

/* ── Two-world body — converging wedge ── */
.tw-body {
  position: relative;
  display: grid;
  grid-template-columns: 1fr clamp(40px, 9vw, 132px) 1fr;
  column-gap: 0;
  align-items: start;
  padding-bottom: clamp(96px, 13vh, 150px);
}

/* The connector lines are drawn into this overlay; they sit behind the text. */
.tw-connector {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.tw-connector .tw-line {
  fill: none;
  stroke: rgba(26, 23, 20, 0.28);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.tw-root.is-visible .tw-connector .tw-line {
  animation: tw-draw 760ms cubic-bezier(.65, 0, .35, 1) 120ms forwards;
}
@keyframes tw-draw { to { stroke-dashoffset: 0; } }

/* ── Columns ── */
.tw-col {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}
.tw-col--platform { grid-column: 1; text-align: right; align-items: flex-end; }
.tw-col--bookworld { grid-column: 3; text-align: left; align-items: flex-start; }

.tw-col-label {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(13px, 1.3vw, 15px);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(26, 23, 20, 0.5);
  margin-bottom: clamp(20px, 2.8vh, 30px);
}
.tw-arrow { font-size: 1em; line-height: 1; }

/* ── Items ── */
.tw-item {
  /* --tw-i set inline per index drives the inward wedge offset */
  max-width: 33ch;
  padding-block: clamp(16px, 2vh, 22px);
  padding-inline-start: calc(var(--tw-i, 0) * clamp(0px, 2.4vw, 30px));
  border-top: 1px solid rgba(26, 23, 20, 0.14);
  opacity: 1;
}
.tw-col--platform .tw-item:first-of-type,
.tw-col--bookworld .tw-item:first-of-type { border-top: none; }

.tw-item-heading {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(23px, 2.4vw, 30px);
  font-weight: 800;
  letter-spacing: -0.015em;
  line-height: 1.15;
  color: #1a1714;
  margin: 0 0 8px;
  position: relative;
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
/* Yellow tick at the spine-side edge, revealed on hover. */
.tw-item-heading::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 0;
  height: 3px;
  border-radius: 2px;
  background: var(--theme-accent-strong, #d4aa18);
  transform: translateY(-50%);
  transition: width 240ms cubic-bezier(.22, 1, .36, 1);
}
.tw-col--platform .tw-item-heading::after { right: calc(100% + 12px); }
.tw-col--bookworld .tw-item-heading::after { left: calc(100% + 12px); }
.tw-col--platform .tw-item:hover .tw-item-heading { transform: translateX(-5px); }
.tw-col--bookworld .tw-item:hover .tw-item-heading { transform: translateX(5px); }
.tw-item:hover .tw-item-heading::after { width: clamp(16px, 2vw, 26px); }

.tw-item-body {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(15px, 1.5vw, 18px);
  line-height: 1.6;
  color: rgba(26, 23, 20, 0.62);
  margin: 0;
  text-wrap: pretty;
}

/* ── Convergence node ── */
.tw-node {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%) scale(0.5);
  width: clamp(56px, 6vw, 72px);
  height: clamp(56px, 6vw, 72px);
  z-index: 2;
  opacity: 0;
  display: grid;
  place-items: center;
}
.tw-root.is-visible .tw-node {
  animation: tw-node-pop 480ms cubic-bezier(.34, 1.56, .64, 1) 720ms forwards;
}
@keyframes tw-node-pop {
  from { opacity: 0; transform: translate(-50%, 50%) scale(0.4); }
  to   { opacity: 1; transform: translate(-50%, 50%) scale(1); }
}
.tw-node-ring {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: var(--theme-page, #ffffff);
  border: 2.4px solid #1a1714;
  display: grid;
  place-items: center;
  box-shadow: 0 10px 28px rgba(26, 23, 20, 0.14);
}
.tw-node-dot {
  width: 38%;
  height: 38%;
  border-radius: 999px;
  background: var(--theme-accent-strong, #d4aa18);
}

/* ── Meeting line + CTAs ── */
.tw-meet {
  text-align: center;
  margin-top: clamp(40px, 6vh, 64px);
  opacity: 1;
}
.tw-meet-line {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(20px, 2.4vw, 28px);
  font-style: italic;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #1a1714;
  margin: 0 0 clamp(22px, 3vh, 32px);
}
.tw-ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(12px, 1.6vw, 18px);
}
.tw-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(15px, 1.35vw, 17px);
  font-weight: 800;
  letter-spacing: 0.01em;
  border-radius: 999px;
  padding: clamp(13px, 1.7vh, 17px) clamp(26px, 2.8vw, 36px);
  text-decoration: none;
  transition:
    transform 220ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 220ms cubic-bezier(.22, 1, .36, 1),
    background-color 220ms cubic-bezier(.22, 1, .36, 1),
    border-color 220ms cubic-bezier(.22, 1, .36, 1);
}
.tw-cta--solid {
  color: var(--theme-paper-bg, #f3efe6);
  background: #1a1714;
  box-shadow: 0 10px 28px rgba(26, 23, 20, 0.22);
}
.tw-cta--solid:hover,
.tw-cta--solid:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px rgba(26, 23, 20, 0.30);
  background: #2d2926;
  outline: none;
}
.tw-cta--ghost {
  color: #1a1714;
  background: transparent;
  border: 1.5px solid rgba(26, 23, 20, 0.32);
}
.tw-cta--ghost:hover,
.tw-cta--ghost:focus-visible {
  transform: translateY(-2px);
  border-color: #1a1714;
  background: rgba(26, 23, 20, 0.04);
  outline: none;
}
.tw-cta:active { transform: translateY(0); }
.tw-cta-arrow {
  display: inline-block;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.tw-cta:hover .tw-cta-arrow,
.tw-cta:focus-visible .tw-cta-arrow { transform: translateX(4px); }

/* ── Entrance choreography ── */
.tw-col-label,
.tw-item,
.tw-meet {
  opacity: 0;
  transform: translateY(16px);
}
.tw-root.is-visible .tw-col-label,
.tw-root.is-visible .tw-item,
.tw-root.is-visible .tw-meet {
  animation: tw-rise 560ms cubic-bezier(.22, 1, .36, 1) forwards;
  animation-delay: var(--tw-delay, 0ms);
}
@keyframes tw-rise {
  to { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 860px) {
  .tw-body {
    grid-template-columns: 1fr;
    padding-bottom: 0;
  }
  .tw-col--platform,
  .tw-col--bookworld {
    grid-column: 1;
    text-align: left;
    align-items: stretch;
  }
  .tw-item {
    max-width: none;
    padding-inline-start: 0;
  }
  .tw-col--platform .tw-item-heading::after,
  .tw-col--bookworld .tw-item-heading::after { display: none; }
  .tw-connector { display: none; }
  .tw-node {
    position: relative;
    left: auto;
    bottom: auto;
    transform: none;
    margin: clamp(36px, 7vw, 52px) auto;
    opacity: 1;
  }
  .tw-root.is-visible .tw-node { animation: none; }
  .tw-col--bookworld { margin-top: 0; }
  .tw-meet { margin-top: clamp(36px, 7vw, 52px); }
}

@media (prefers-reduced-motion: reduce) {
  .tw-root .tw-col-label,
  .tw-root .tw-item,
  .tw-root .tw-meet,
  .tw-root .tw-node {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
  .tw-node { transform: translate(-50%, 50%) !important; }
  .tw-connector .tw-line { stroke-dashoffset: 0 !important; animation: none !important; }
}
@media (prefers-reduced-motion: reduce) and (max-width: 860px) {
  .tw-node { transform: none !important; }
}
`;

function Column({
  side,
  label,
  items,
  baseDelay,
}: {
  side: 'platform' | 'bookworld';
  label: string;
  items: Item[];
  baseDelay: number;
}) {
  const isBookWorld = side === 'bookworld';
  return (
    <div className={`tw-col tw-col--${side}`}>
      <div className="tw-col-label" style={{ ['--tw-delay' as string]: `${baseDelay}ms` }}>
        {!isBookWorld && <span className="tw-arrow" aria-hidden="true">←</span>}
        <span>{label}</span>
        {isBookWorld && <span className="tw-arrow" aria-hidden="true">→</span>}
      </div>
      {items.map((item, i) => (
        <div
          className="tw-item"
          key={item.heading}
          style={{
            ['--tw-i' as string]: i,
            ['--tw-delay' as string]: `${baseDelay + 90 + i * 90}ms`,
          }}
        >
          <h3 className="tw-item-heading">{item.heading}</h3>
          <p className="tw-item-body">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function TwoWorlds() {
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`tw-root${visible ? ' is-visible' : ''}`}
      aria-labelledby="tw-title"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="tw-inner">
        <header className="tw-header">
          <h2 className="tw-title" id="tw-title">
            A place for two sides.
          </h2>
        </header>

        <div className="tw-body">
          {/* Converging lines, drawn behind the text. preserveAspectRatio="none"
              lets the straight lines re-angle to fit any width — they meet at the
              node anchored at (50, 100). */}
          <svg
            className="tw-connector"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <line
              className="tw-line"
              x1="32"
              y1="6"
              x2="50"
              y2="100"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
            <line
              className="tw-line"
              x1="68"
              y1="6"
              x2="50"
              y2="100"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <Column side="platform" label="The Platform" items={PLATFORM_ITEMS} baseDelay={0} />
          <Column side="bookworld" label="The Book World" items={BOOK_WORLD_ITEMS} baseDelay={120} />

          <div className="tw-node" aria-hidden="true">
            <div className="tw-node-ring">
              <div className="tw-node-dot" />
            </div>
          </div>
        </div>

        <div className="tw-meet" style={{ ['--tw-delay' as string]: '900ms' }}>
          <p className="tw-meet-line">One place — between reads.</p>
          <div className="tw-ctas">
            <Link href="/?intake=writer" className="tw-cta tw-cta--ghost">
              Join as writer
              <span className="tw-cta-arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/reviews" className="tw-cta tw-cta--solid">
              Browse books
              <span className="tw-cta-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
