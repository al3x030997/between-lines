'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type Item = { heading: string; body: string };
type Side = 'platform' | 'bookworld';
type View = 'platform' | 'overview' | 'bookworld';

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

const SIDE_COPY: Record<Side, { label: string; title: string; paragraphs: string[] }> = {
  platform: {
    label: 'The Platform',
    title: 'Where the work begins.',
    paragraphs: [
      'The publishing side of BetweenReads — where writers find their first readers, critics do considered work, and the people with taste get credit for finding it early.',
      'Placeholder copy for the platform deep-dive. Drop the real story here later; for now this is filler text so the layout and the slide-in transition can be judged on their own.',
    ],
  },
  bookworld: {
    label: 'The Book World',
    title: 'Where readers decide.',
    paragraphs: [
      'The reading side of BetweenReads — honest reviews, human curation, and a storefront that sends more of every sale back to authors and the shops that champion them.',
      'Placeholder copy for the book-world deep-dive. Swap in the real story when it is ready; this filler is here only to flesh out the page while the design settles.',
    ],
  },
};

const CSS = `
/* ── Root ── */
.tw-root {
  background: var(--theme-page, #ffffff);
  color: #1a1714;
  padding: 0;
  font-family: 'Outfit', system-ui, sans-serif;
  overflow: hidden;
}

/* ── Slide viewport + track ── */
.tw-viewport {
  position: relative;
  overflow: hidden;
  transition: height 560ms cubic-bezier(.22, 1, .36, 1);
}
.tw-track {
  display: flex;
  align-items: flex-start;
  width: 300%;
  transform: translateX(-33.3333%);
  transition: transform 560ms cubic-bezier(.22, 1, .36, 1);
}
.tw-track[data-view='platform']  { transform: translateX(0); }
.tw-track[data-view='overview']  { transform: translateX(-33.3333%); }
.tw-track[data-view='bookworld'] { transform: translateX(-66.6667%); }
.tw-slide {
  flex: 0 0 33.3333%;
  width: 33.3333%;
  box-sizing: border-box;
  /* Padding lives on the slide (not the root) so a panel's background is full-bleed. */
  padding: clamp(44px, 6vh, 80px) clamp(24px, 5.5vw, 96px);
  background: var(--theme-page, #ffffff);
}
/* The platform deep-dive slides in as a full yellow page. */
.tw-slide--platform {
  background: var(--theme-yellow, #FFE600);
  color: var(--theme-on-yellow, #0e0e0c);
}
.tw-inner {
  max-width: 1180px;
  margin: 0 auto;
}

/* ── Header ── */
.tw-header {
  text-align: center;
  margin-bottom: clamp(22px, 3.4vh, 40px);
}
.tw-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(34px, 4.4vw, 58px);
  font-weight: 900;
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: #1a1714;
  margin: 0;
  text-wrap: balance;
}

/* ── Two-world body — converging spine wedge ── */
.tw-body {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 36% 1fr;
  column-gap: 0;
  align-items: start;
  padding-bottom: clamp(60px, 8vh, 104px);
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
  stroke: rgba(26, 23, 20, 0.30);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.tw-root.is-visible .tw-connector .tw-line {
  animation: tw-draw 820ms cubic-bezier(.65, 0, .35, 1) 120ms forwards;
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

/* ── Clickable side label / trigger ── */
.tw-col-trigger {
  appearance: none;
  -webkit-appearance: none;
  background: none;
  border: 0;
  margin: 0 0 clamp(16px, 2.2vh, 26px);
  padding: 6px 4px;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.tw-col--platform .tw-col-trigger { align-items: flex-end; text-align: right; }
.tw-col--bookworld .tw-col-trigger { align-items: flex-start; text-align: left; }
.tw-col-trigger:focus-visible {
  outline: 2px solid var(--theme-accent-strong, #d4aa18);
  outline-offset: 4px;
}
.tw-col-trigger:hover { transform: translateY(-1px); }

.tw-col-label {
  display: inline-flex;
  align-items: baseline;
  gap: 12px;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(15px, 1.6vw, 19px);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(26, 23, 20, 0.55);
  transition: color 220ms cubic-bezier(.22, 1, .36, 1);
}
.tw-col-trigger:hover .tw-col-label,
.tw-col-trigger:focus-visible .tw-col-label { color: #1a1714; }
.tw-arrow { font-size: 1em; line-height: 1; }

.tw-explore {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: clamp(12px, 1.15vw, 14px);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--theme-accent-strong, #b8920f);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 220ms cubic-bezier(.22, 1, .36, 1),
              transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.tw-col-trigger:hover .tw-explore,
.tw-col-trigger:focus-visible .tw-explore {
  opacity: 1;
  transform: translateY(0);
}
.tw-explore-arrow { transition: transform 220ms cubic-bezier(.22, 1, .36, 1); }
.tw-col-trigger:hover .tw-explore-arrow { transform: translateX(4px); }

/* ── Items ── */
.tw-item {
  /* --tw-step drives the inward offset; --tw-x (set inline per index) angles
     each block toward the spine so the column echoes the converging lines. */
  --tw-step: clamp(10px, 2vw, 30px);
  max-width: 28ch;
  padding-block: clamp(9px, 1.4vh, 16px);
  border-top: 1px solid rgba(26, 23, 20, 0.14);
  opacity: 1;
}
.tw-col--platform .tw-item:first-of-type,
.tw-col--bookworld .tw-item:first-of-type { border-top: none; }

.tw-item-heading {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(23px, 2.5vw, 34px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: #1a1714;
  margin: 0 0 7px;
  position: relative;
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
/* Permanent connector tick at the spine-side edge of each heading. */
.tw-item-heading::after {
  content: "";
  position: absolute;
  top: 50%;
  width: clamp(16px, 2.2vw, 30px);
  height: 3px;
  border-radius: 2px;
  background: var(--theme-accent-strong, #d4aa18);
  transform: translateY(-50%);
  transition: width 240ms cubic-bezier(.22, 1, .36, 1);
}
.tw-col--platform .tw-item-heading::after { left: calc(100% + 14px); }
.tw-col--bookworld .tw-item-heading::after { right: calc(100% + 14px); }
.tw-col--platform .tw-item:hover .tw-item-heading { transform: translateX(6px); }
.tw-col--bookworld .tw-item:hover .tw-item-heading { transform: translateX(-6px); }
.tw-item:hover .tw-item-heading::after { width: clamp(26px, 3.4vw, 44px); }

.tw-item-body {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(14px, 1.4vw, 16.5px);
  line-height: 1.45;
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
  width: clamp(50px, 5.4vw, 66px);
  height: clamp(50px, 5.4vw, 66px);
  z-index: 2;
  opacity: 0;
  display: grid;
  place-items: center;
}
.tw-root.is-visible .tw-node {
  animation: tw-node-pop 480ms cubic-bezier(.34, 1.56, .64, 1) 780ms forwards;
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
  border: 2.6px solid #1a1714;
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
  margin-top: clamp(26px, 3.8vh, 44px);
  opacity: 1;
}
.tw-meet-line {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(22px, 2.7vw, 32px);
  font-style: italic;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #1a1714;
  margin: 0 0 clamp(24px, 3.2vh, 34px);
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

/* ── Detail panels ── */
.tw-detail {
  padding-block: clamp(8px, 2vh, 24px);
}
.tw-detail-inner {
  max-width: 1000px;
  margin: 0 auto;
}
/* Back sits on the edge that faces the main page: platform→right, bookworld→left. */
.tw-detail-bar {
  display: flex;
  margin-bottom: clamp(22px, 3.4vh, 44px);
}
.tw-slide--platform .tw-detail-bar { justify-content: flex-end; }
.tw-slide--bookworld .tw-detail-bar { justify-content: flex-start; }
.tw-back {
  appearance: none;
  -webkit-appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: 1.5px solid rgba(26, 23, 20, 0.22);
  border-radius: 999px;
  padding: 10px 20px;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(13px, 1.2vw, 15px);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #1a1714;
  cursor: pointer;
  margin: 0;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1),
              border-color 220ms cubic-bezier(.22, 1, .36, 1),
              background-color 220ms cubic-bezier(.22, 1, .36, 1);
}
.tw-back:hover { border-color: #1a1714; background: rgba(26, 23, 20, 0.04); }
.tw-slide--platform .tw-back:hover { transform: translateX(3px); }
.tw-slide--bookworld .tw-back:hover { transform: translateX(-3px); }
.tw-back:focus-visible { outline: 2px solid var(--theme-accent-strong, #d4aa18); outline-offset: 3px; }
.tw-back-arrow { transition: transform 220ms cubic-bezier(.22, 1, .36, 1); }
.tw-slide--platform .tw-back:hover .tw-back-arrow { transform: translateX(3px); }
.tw-slide--bookworld .tw-back:hover .tw-back-arrow { transform: translateX(-3px); }

.tw-detail-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(48px, 7.6vw, 108px);
  font-weight: 900;
  line-height: 1.0;
  letter-spacing: -0.035em;
  color: #1a1714;
  margin: 0 0 clamp(24px, 3.4vh, 44px);
  text-wrap: balance;
}
.tw-detail-text {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(18px, 1.9vw, 24px);
  line-height: 1.55;
  color: rgba(26, 23, 20, 0.7);
  max-width: 62ch;
  margin: 0 0 clamp(18px, 2.4vh, 28px);
  text-wrap: pretty;
}
.tw-detail-text:last-child { margin-bottom: 0; }

/* ── Entrance choreography (overview only) ── */
.tw-col-label,
.tw-meet {
  opacity: 0;
  transform: translateY(16px);
}
.tw-slide--overview .tw-item {
  opacity: 0;
  transform: translate(var(--tw-x, 0px), 16px);
}
.tw-root.is-visible .tw-col-label,
.tw-root.is-visible .tw-meet {
  animation: tw-rise 560ms cubic-bezier(.22, 1, .36, 1) forwards;
  animation-delay: var(--tw-delay, 0ms);
}
.tw-root.is-visible .tw-slide--overview .tw-item {
  animation: tw-rise-item 560ms cubic-bezier(.22, 1, .36, 1) forwards;
  animation-delay: var(--tw-delay, 0ms);
}
@keyframes tw-rise {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes tw-rise-item {
  to { opacity: 1; transform: translate(var(--tw-x, 0px), 0); }
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
  .tw-col--platform .tw-col-trigger { align-items: flex-start; text-align: left; }
  .tw-item { max-width: none; --tw-step: 0px; }
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
  .tw-viewport,
  .tw-track { transition: none !important; }
  .tw-root .tw-col-label,
  .tw-root .tw-item,
  .tw-root .tw-meet,
  .tw-root .tw-node {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
  .tw-node { transform: translate(-50%, 50%) !important; }
  .tw-slide--overview .tw-item { transform: translate(var(--tw-x, 0px), 0) !important; }
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
  onOpen,
  triggerRef,
}: {
  side: Side;
  label: string;
  items: Item[];
  baseDelay: number;
  onOpen: () => void;
  triggerRef: (el: HTMLButtonElement | null) => void;
}) {
  const isBookWorld = side === 'bookworld';
  const dir = isBookWorld ? -1 : 1;
  return (
    <div className={`tw-col tw-col--${side}`}>
      <button
        type="button"
        className="tw-col-trigger"
        ref={triggerRef}
        onClick={onOpen}
        aria-expanded={false}
        aria-controls={`tw-panel-${side}`}
      >
        <span className="tw-col-label" style={{ ['--tw-delay' as string]: `${baseDelay}ms` }}>
          {!isBookWorld && <span className="tw-arrow" aria-hidden="true">←</span>}
          <span>{label}</span>
          {isBookWorld && <span className="tw-arrow" aria-hidden="true">→</span>}
        </span>
        <span className="tw-explore">
          Explore
          <span className="tw-explore-arrow" aria-hidden="true">→</span>
        </span>
      </button>
      {items.map((item, i) => (
        <div
          className="tw-item"
          key={item.heading}
          style={{
            ['--tw-delay' as string]: `${baseDelay + 90 + i * 90}ms`,
            ['--tw-x' as string]: `calc(${i} * var(--tw-step) * ${dir})`,
          }}
        >
          <h3 className="tw-item-heading">{item.heading}</h3>
          <p className="tw-item-body">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function DetailPanel({
  side,
  onBack,
  backRef,
  slideRef,
}: {
  side: Side;
  onBack: () => void;
  backRef: (el: HTMLButtonElement | null) => void;
  slideRef: (el: HTMLDivElement | null) => void;
}) {
  const copy = SIDE_COPY[side];
  return (
    <div
      className={`tw-slide tw-slide--${side}`}
      id={`tw-panel-${side}`}
      ref={slideRef}
      role="group"
      aria-label={copy.label}
    >
      <div className="tw-detail">
        <div className="tw-detail-bar">
          <button type="button" className="tw-back" ref={backRef} onClick={onBack}>
            {side === 'bookworld' && (
              <span className="tw-back-arrow" aria-hidden="true">←</span>
            )}
            Back
            {side === 'platform' && (
              <span className="tw-back-arrow" aria-hidden="true">→</span>
            )}
          </button>
        </div>
        <div className="tw-detail-inner">
          <h2 className="tw-detail-title">{copy.title}</h2>
          {copy.paragraphs.map((text, i) => (
            <p className="tw-detail-text" key={i}>
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TwoWorlds() {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Record<View, HTMLDivElement | null>>({
    platform: null,
    overview: null,
    bookworld: null,
  });
  const triggerRefs = useRef<Record<Side, HTMLButtonElement | null>>({
    platform: null,
    bookworld: null,
  });
  const backRefs = useRef<Record<Side, HTMLButtonElement | null>>({
    platform: null,
    bookworld: null,
  });
  const prevViewRef = useRef<View>('overview');
  const didMountRef = useRef(false);

  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>('overview');

  // Entrance trigger for the overview choreography.
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

  // While a detail page is open, freeze page scroll — Back is the only way out.
  useEffect(() => {
    if (typeof document === 'undefined' || view === 'overview') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [view]);

  // Sync viewport height + inert/aria-hidden to the active slide.
  useLayoutEffect(() => {
    const order: View[] = ['platform', 'overview', 'bookworld'];
    for (const key of order) {
      const el = slideRefs.current[key];
      if (!el) continue;
      const active = key === view;
      el.inert = !active;
      el.setAttribute('aria-hidden', active ? 'false' : 'true');
    }
    const activeEl = slideRefs.current[view];
    const vp = viewportRef.current;
    if (activeEl && vp) vp.style.height = `${activeEl.offsetHeight}px`;
  }, [view]);

  // Keep height correct as the active slide reflows (fonts, window resize).
  useEffect(() => {
    const vp = viewportRef.current;
    const activeEl = slideRefs.current[view];
    if (!vp || !activeEl || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      vp.style.height = `${activeEl.offsetHeight}px`;
    });
    ro.observe(activeEl);
    return () => ro.disconnect();
  }, [view]);

  // Move focus into the opened panel; restore it to the trigger on return.
  useEffect(() => {
    const prev = prevViewRef.current;
    if (!didMountRef.current) {
      didMountRef.current = true;
      prevViewRef.current = view;
      return;
    }
    if (view === 'platform' || view === 'bookworld') {
      backRefs.current[view]?.focus({ preventScroll: true });
    } else if (prev === 'platform' || prev === 'bookworld') {
      triggerRefs.current[prev]?.focus({ preventScroll: true });
    }
    prevViewRef.current = view;
  }, [view]);

  return (
    <section
      ref={rootRef}
      className={`tw-root${visible ? ' is-visible' : ''}`}
      aria-labelledby="tw-title"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="tw-viewport" ref={viewportRef}>
        <div className="tw-track" data-view={view}>
          <DetailPanel
            side="platform"
            onBack={() => setView('overview')}
            backRef={(el) => (backRefs.current.platform = el)}
            slideRef={(el) => (slideRefs.current.platform = el)}
          />

          <div
            className="tw-slide tw-slide--overview"
            ref={(el) => {
              slideRefs.current.overview = el;
            }}
          >
            <div className="tw-inner">
              <header className="tw-header">
                <h2 className="tw-title" id="tw-title">
                  A place for two sides.
                </h2>
              </header>

              <div className="tw-body">
                {/* Converging lines in the center band (34%–66% at top → 50% at
                    bottom). The 36% center grid column keeps the text columns out
                    to 32%/68%, so the strong angle never crosses the text.
                    preserveAspectRatio="none" lets the lines re-angle to fit any
                    width — they meet at the node anchored at (50, 100). */}
                <svg
                  className="tw-connector"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <line
                    className="tw-line"
                    x1="34"
                    y1="3"
                    x2="50"
                    y2="100"
                    pathLength={1}
                    vectorEffect="non-scaling-stroke"
                  />
                  <line
                    className="tw-line"
                    x1="66"
                    y1="3"
                    x2="50"
                    y2="100"
                    pathLength={1}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <Column
                  side="platform"
                  label="The Platform"
                  items={PLATFORM_ITEMS}
                  baseDelay={0}
                  onOpen={() => setView('platform')}
                  triggerRef={(el) => (triggerRefs.current.platform = el)}
                />
                <Column
                  side="bookworld"
                  label="The Book World"
                  items={BOOK_WORLD_ITEMS}
                  baseDelay={120}
                  onOpen={() => setView('bookworld')}
                  triggerRef={(el) => (triggerRefs.current.bookworld = el)}
                />

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
          </div>

          <DetailPanel
            side="bookworld"
            onBack={() => setView('overview')}
            backRef={(el) => (backRefs.current.bookworld = el)}
            slideRef={(el) => (slideRefs.current.bookworld = el)}
          />
        </div>
      </div>
    </section>
  );
}
