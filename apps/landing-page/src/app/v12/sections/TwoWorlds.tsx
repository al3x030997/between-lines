'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type Item = { heading: string; body: string };
type Side = 'platform' | 'bookworld';
type View = 'platform' | 'overview' | 'bookworld';
type OverviewItem = Item & { side: Side };

type Props = {
  onSlideOpenChange?: (open: boolean) => void;
};

const PLATFORM_ITEMS: Item[] = [
  {
    heading: 'Original Voices',
    body: "Stories published on BetweenReads. Emerging writers, poets, and illustrators the world hasn't found yet.",
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

const OVERVIEW_ITEMS: OverviewItem[] = [
  { ...PLATFORM_ITEMS[0], side: 'platform' },
  { ...BOOK_WORLD_ITEMS[0], side: 'bookworld' },
  { ...PLATFORM_ITEMS[1], side: 'platform' },
  { ...BOOK_WORLD_ITEMS[1], side: 'bookworld' },
  { ...PLATFORM_ITEMS[2], side: 'platform' },
  { ...BOOK_WORLD_ITEMS[2], side: 'bookworld' },
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
/* Tighter vertical rhythm on the overview so the card grid fits
   within the viewport (minus the pinned header) after a scroll-cue jump. */
.tw-slide--overview {
  padding-top: clamp(22px, 3.2vh, 44px);
  padding-bottom: clamp(18px, 2.6vh, 36px);
}
/* The platform deep-dive slides in as a full yellow page. */
.tw-slide--platform {
  background: var(--theme-yellow, #FFE600);
  color: var(--theme-on-yellow, #0e0e0c);
}
.tw-slide--platform,
.tw-slide--bookworld {
  min-height: calc(100vh + 4px);
  min-height: calc(100svh + 4px);
}
.tw-inner {
  max-width: 1180px;
  margin: 0 auto;
}

/* ── Overview cards ── */
.tw-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(16px, 2.2vw, 26px);
}

.tw-card {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  min-height: clamp(178px, 18vw, 228px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  background: color-mix(in srgb, var(--theme-page, #ffffff) 88%, var(--theme-yellow, #FFE600) 12%);
  border: 2px dotted rgba(26, 23, 20, 0.34);
  border-radius: 8px;
  color: inherit;
  cursor: pointer;
  padding: clamp(22px, 3vw, 34px);
  opacity: 1;
  transition:
    transform 220ms cubic-bezier(.22, 1, .36, 1),
    border-color 220ms cubic-bezier(.22, 1, .36, 1),
    background-color 220ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 220ms cubic-bezier(.22, 1, .36, 1);
}
.tw-card--bookworld {
  background: var(--theme-page, #ffffff);
}
.tw-card:hover {
  transform: translateY(-3px);
  border-color: rgba(26, 23, 20, 0.62);
  box-shadow: 0 18px 42px rgba(26, 23, 20, 0.10);
  outline: none;
}
.tw-card:focus-visible {
  transform: translateY(-3px);
  border-color: rgba(26, 23, 20, 0.62);
  box-shadow: 0 18px 42px rgba(26, 23, 20, 0.10);
  outline: 2px solid var(--theme-accent-strong, #d4aa18);
  outline-offset: 4px;
}
.tw-card:active { transform: translateY(-1px); }

.tw-item-heading {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(29px, 3.2vw, 42px);
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.02;
  color: #1a1714;
  margin: 0 0 clamp(10px, 1.2vw, 14px);
}

.tw-item-body {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(17px, 1.7vw, 20px);
  line-height: 1.42;
  color: rgba(26, 23, 20, 0.68);
  margin: 0;
  max-width: 36ch;
  text-wrap: pretty;
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
.tw-slide--overview .tw-card {
  opacity: 0;
  transform: translateY(16px);
}
.tw-root.is-visible .tw-slide--overview .tw-card {
  animation: tw-rise 560ms cubic-bezier(.22, 1, .36, 1) forwards;
  animation-delay: var(--tw-delay, 0ms);
}
@keyframes tw-rise {
  to { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 860px) {
  .tw-grid { grid-template-columns: 1fr; }
  .tw-card { min-height: auto; }
}

@media (prefers-reduced-motion: reduce) {
  .tw-viewport,
  .tw-track { transition: none !important; }
  .tw-root .tw-card {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }
}
`;

function FeatureGrid({
  onOpen,
}: {
  onOpen: (side: Side, trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className="tw-grid">
      {OVERVIEW_ITEMS.map((item, i) => (
        <button
          type="button"
          className={`tw-card tw-card--${item.side}`}
          key={item.heading}
          onClick={(event) => onOpen(item.side, event.currentTarget)}
          aria-expanded={false}
          aria-controls={`tw-panel-${item.side}`}
          style={{
            ['--tw-delay' as string]: `${90 + i * 70}ms`,
          }}
        >
          <h3 className="tw-item-heading">{item.heading}</h3>
          <p className="tw-item-body">{item.body}</p>
        </button>
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

export default function TwoWorlds({ onSlideOpenChange }: Props) {
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

  useEffect(() => {
    onSlideOpenChange?.(view !== 'overview');
  }, [onSlideOpenChange, view]);

  useEffect(() => {
    return () => onSlideOpenChange?.(false);
  }, [onSlideOpenChange]);

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
      aria-label="A place for two sides"
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
              <FeatureGrid
                onOpen={(side, trigger) => {
                  triggerRefs.current[side] = trigger;
                  setView(side);
                }}
              />
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
