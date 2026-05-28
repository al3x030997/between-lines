'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MOOD_LABELS,
  MOOD_TO_QUOTE,
  PILL_BG,
  QUOTES,
  SEED_PICKS,
  type Mood,
} from './quotes';

type Props = { onReader: () => void; onWriter: () => void };

// 6 moods displayed as chips. Pagination iterates through these in order, so
// quote + mood stay coupled.
const COMPACT_MOODS: Mood[] = [
  'feel-good',
  'escapist',
  'funny',
  'calming',
  'intense',
  'reflective',
];

export default function OpenCallV7({ onReader }: Props) {
  const quotes = useMemo(() => QUOTES, []);

  // Drive everything off mood index. Quote is derived from the active mood.
  const [moodIdx, setMoodIdx] = useState(0);
  const [fade, setFade] = useState(false);
  // Bumped on every change — drives the pulse on the "Now tuned to" subtitle.
  const [moodTick, setMoodTick] = useState(0);

  const activeMood = COMPACT_MOODS[moodIdx];
  const quoteIdx = MOOD_TO_QUOTE[activeMood];
  const currentQuote = quotes[quoteIdx];
  const pillPalette = PILL_BG[currentQuote.category];

  const switchToMoodIdx = useCallback((next: number) => {
    const target = ((next % COMPACT_MOODS.length) + COMPACT_MOODS.length) % COMPACT_MOODS.length;
    setFade(true);
    setTimeout(() => {
      setMoodIdx(target);
      setMoodTick((t) => t + 1);
      setFade(false);
    }, 260);
  }, []);

  const visiblePicks = SEED_PICKS.slice(0, 2);

  // is-flashing border highlight on every change.
  const [flashing, setFlashing] = useState(false);
  useEffect(() => {
    if (moodTick === 0) return;
    setFlashing(true);
    const t = window.setTimeout(() => setFlashing(false), 620);
    return () => window.clearTimeout(t);
  }, [moodTick]);

  return (
    <section className="bl-betweenchars" aria-label="Words that stayed with us">
      <style>{STYLES}</style>

      <div className="bl-betweenchars-inner">
        <header className="bl-betweenchars-head">
          <h2 className="bl-betweenchars-title">
            <span className="bl-betweenchars-title-row">Words that stayed with us.</span>
            <span className="bl-betweenchars-title-row">Characters we never forgot. Writers who inspire us.</span>
          </h2>
          <div
            key={moodTick}
            className="bl-betweenchars-tuned is-active"
            aria-live="polite"
          >
            <span className="bl-betweenchars-tuned-prefix">Now tuned to</span>
            <span className="bl-betweenchars-tuned-value">{MOOD_LABELS[activeMood]}</span>
          </div>
        </header>

        <div className="bl-betweenchars-mood">
          <span className="bl-betweenchars-mood-label">How are you feeling?</span>
          <div className="bl-betweenchars-mood-row">
            {COMPACT_MOODS.map((mood, i) => {
              const isActive = i === moodIdx;
              return (
                <button
                  key={mood}
                  type="button"
                  className={`bl-betweenchars-mood-btn${isActive ? ' is-active' : ''}`}
                  onClick={() => {
                    if (isActive) return;
                    switchToMoodIdx(i);
                  }}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <span className="bl-betweenchars-mood-dot" aria-hidden="true" />
                  )}
                  <span>{MOOD_LABELS[mood]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <article
          className={[
            'bl-betweenchars-card',
            fade ? 'is-fading' : '',
            flashing ? 'is-flashing' : '',
          ].filter(Boolean).join(' ')}
        >
          <span className="bl-betweenchars-bg-mark" aria-hidden="true">“</span>
          <div className="bl-betweenchars-card-inner">
            <span className="bl-betweenchars-mark" aria-hidden="true">“</span>
            <span
              className="bl-betweenchars-pill"
              style={{ background: pillPalette.bg, color: pillPalette.color }}
            >
              {currentQuote.pill}
            </span>
            <p className="bl-betweenchars-quote">{currentQuote.text}</p>
            <div className="bl-betweenchars-attr">
              <span className="bl-betweenchars-author">— {currentQuote.author}</span>
              {currentQuote.source && (
                <span className="bl-betweenchars-source">{currentQuote.source}</span>
              )}
            </div>
          </div>
        </article>

        <div className="bl-betweenchars-nav">
          <button
            type="button"
            className="bl-betweenchars-nav-btn"
            onClick={() => switchToMoodIdx(moodIdx - 1)}
            aria-label="Previous mood"
          >
            ←
          </button>
          <span className="bl-betweenchars-counter">
            {String(moodIdx + 1).padStart(2, '0')} / {String(COMPACT_MOODS.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            className="bl-betweenchars-nav-btn"
            onClick={() => switchToMoodIdx(moodIdx + 1)}
            aria-label="Next mood"
          >
            →
          </button>
        </div>

        <div className="bl-betweenchars-picks">
          {visiblePicks.map((p) => (
            <article key={p.id} className="bl-betweenchars-pick">
              <span className="bl-betweenchars-pick-badge">{p.reader}’s pick</span>
              <p className="bl-betweenchars-pick-quote">“{p.quote}”</p>
              <span className="bl-betweenchars-pick-author">— {p.author}</span>
            </article>
          ))}
          <button
            type="button"
            className="bl-betweenchars-pick bl-betweenchars-pick-add"
            onClick={onReader}
          >
            <span className="bl-betweenchars-pick-add-glyph" aria-hidden="true">＋</span>
            <span className="bl-betweenchars-pick-add-label">Add yours</span>
            <span className="bl-betweenchars-pick-add-sub">Sign in to pin a quote.</span>
          </button>
        </div>

        <div className="bl-betweenchars-cta-row">
          <button
            type="button"
            className="bl-betweenchars-cta"
            onClick={onReader}
          >
            <span>Pin a quote that stayed with you</span>
            <span className="bl-betweenchars-cta-arrow" aria-hidden="true">→</span>
          </button>
          <span className="bl-betweenchars-cta-sub">
            Join the wall — readers and writers share what won&apos;t leave them.
          </span>
        </div>
      </div>
    </section>
  );
}

const STYLES = `
.bl-betweenchars {
  position: relative;
  padding: clamp(72px, 9vh, 104px) clamp(24px, 5vw, 80px);
  background: var(--theme-page);
  color: var(--bl-ink);
  overflow: hidden;
}
.bl-betweenchars-inner {
  position: relative;
  z-index: 1;
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 2.6vw, 30px);
}

/* === Header === */
.bl-betweenchars-head {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: center;
  align-items: center;
}
.bl-betweenchars-title {
  margin: 0;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(28px, 3.8vw, 46px);
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--bl-ink);
  text-wrap: balance;
  font-feature-settings: "kern", "liga", "calt";
}
.bl-betweenchars-title-row {
  display: block;
}
.bl-betweenchars-tuned {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--bl-accent);
  color: #ffffff;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  /* Pulse — fired on remount via key={moodTick} */
  animation: bl-tuned-pulse 520ms cubic-bezier(.22, 1, .36, 1);
}
.bl-betweenchars-tuned-prefix { opacity: 0.85; }
.bl-betweenchars-tuned-value {
  font-family: var(--bl-font-display);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: none;
  font-size: 12px;
}
@keyframes bl-tuned-pulse {
  0%   { transform: scale(0.94); opacity: 0; }
  60%  { transform: scale(1.04); opacity: 1; }
  100% { transform: scale(1);    opacity: 1; }
}

/* === Mood selector === */
.bl-betweenchars-mood {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
.bl-betweenchars-mood-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-betweenchars-mood-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.bl-betweenchars-mood-btn {
  appearance: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1.5px solid var(--theme-border);
  background: var(--theme-surface);
  border-radius: 999px;
  padding: 8px 14px;
  font-family: var(--bl-font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--bl-ink);
  cursor: pointer;
  /* Longer / smoother transitions so the active-state hand-off reads as motion */
  transition:
    background 320ms cubic-bezier(.22, 1, .36, 1),
    color 320ms cubic-bezier(.22, 1, .36, 1),
    border-color 320ms cubic-bezier(.22, 1, .36, 1),
    transform 320ms cubic-bezier(.22, 1, .36, 1),
    padding 320ms cubic-bezier(.22, 1, .36, 1);
  white-space: nowrap;
}
.bl-betweenchars-mood-btn:hover {
  border-color: var(--bl-accent);
  color: var(--bl-accent);
  transform: translateY(-1px);
}
.bl-betweenchars-mood-btn.is-active {
  background: var(--bl-ink);
  color: var(--theme-page);
  border-color: var(--bl-ink);
  padding-left: 10px;
  transform: translateY(-2px) scale(1.04);
}
.bl-betweenchars-mood-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--bl-accent);
  box-shadow: 0 0 0 2px rgba(31, 122, 62, 0.32);
  animation: bl-mood-dot 480ms cubic-bezier(.22, 1, .36, 1);
}
@keyframes bl-mood-dot {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}

/* === Quote card (dark grey, white text) === */
.bl-betweenchars-card {
  position: relative;
  background: #1F2024;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: clamp(32px, 4vw, 52px) clamp(32px, 4vw, 56px);
  min-height: 240px;
  box-shadow:
    0 2px 6px rgba(14, 14, 12, 0.10),
    0 14px 32px rgba(14, 14, 12, 0.18),
    0 32px 64px rgba(14, 14, 12, 0.10);
  transition:
    transform 360ms cubic-bezier(.22, 1, .36, 1),
    border-color 280ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 360ms cubic-bezier(.22, 1, .36, 1);
  isolation: isolate;
  overflow: hidden;
}
.bl-betweenchars-card::before {
  /* Subtle paper grain over the dark surface — keeps it from feeling plastic. */
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
  mix-blend-mode: overlay;
  opacity: 0.08;
  z-index: 0;
}
.bl-betweenchars-card.is-fading .bl-betweenchars-card-inner {
  opacity: 0;
  transform: translateY(8px);
}
.bl-betweenchars-card.is-flashing {
  border-color: var(--bl-accent);
  transform: translateY(-4px);
  box-shadow:
    0 4px 10px rgba(14, 14, 12, 0.10),
    0 22px 44px rgba(14, 14, 12, 0.20),
    0 0 0 4px rgba(31, 122, 62, 0.16);
}
.bl-betweenchars-bg-mark {
  position: absolute;
  top: -36px;
  right: -18px;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 700;
  font-variation-settings: 'opsz' 144;
  font-size: clamp(180px, 22vw, 320px);
  line-height: 0.85;
  color: #ffffff;
  opacity: 0.06;
  pointer-events: none;
  z-index: 0;
  transform: rotate(8deg);
}
.bl-betweenchars-card-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  /* Smoother content transition — opacity + slide */
  transition:
    opacity 280ms cubic-bezier(.22, 1, .36, 1),
    transform 360ms cubic-bezier(.22, 1, .36, 1);
}
.bl-betweenchars-mark {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 56px;
  line-height: 0.8;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: -6px;
}
.bl-betweenchars-pill {
  align-self: flex-start;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}
.bl-betweenchars-quote {
  margin: 4px 0 8px;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 500;
  font-variation-settings: 'opsz' 96, 'SOFT' 20;
  font-size: clamp(22px, 2.4vw, 30px);
  line-height: 1.4;
  color: #ffffff;
  max-width: 28ch;
  text-wrap: pretty;
}
.bl-betweenchars-attr {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: auto;
}
.bl-betweenchars-author {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
}
.bl-betweenchars-source {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
}

/* === Pagination === */
.bl-betweenchars-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
.bl-betweenchars-counter {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: var(--bl-ink-muted);
  font-variant-numeric: tabular-nums;
  min-width: 72px;
  text-align: center;
}
.bl-betweenchars-nav-btn {
  appearance: none;
  border: 1.5px solid var(--theme-border);
  background: var(--theme-surface);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--bl-ink);
  font-size: 14px;
  transition: background 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
}
.bl-betweenchars-nav-btn:hover {
  background: var(--theme-surface-muted);
  border-color: var(--bl-accent);
  color: var(--bl-accent);
  transform: translateY(-1px);
}

/* === Picks strip === */
.bl-betweenchars-picks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 4px;
}
.bl-betweenchars-pick {
  background: var(--theme-surface);
  border: 0.5px solid var(--theme-border-subtle);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  font: inherit;
  color: inherit;
  min-height: 120px;
}
.bl-betweenchars-pick-badge {
  align-self: flex-start;
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--theme-surface-muted);
  color: var(--bl-ink);
}
.bl-betweenchars-pick-quote {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 13px;
  line-height: 1.45;
  color: var(--bl-ink);
}
.bl-betweenchars-pick-author {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-betweenchars-pick-add {
  cursor: pointer;
  border: 1px dashed var(--theme-border-strong);
  background: var(--theme-surface-subtle);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: border-color 200ms ease, background 200ms ease, transform 200ms ease;
  text-align: center;
}
.bl-betweenchars-pick-add:hover {
  border-color: var(--bl-accent);
  background: var(--bl-accent-soft);
  transform: translateY(-1px);
}
.bl-betweenchars-pick-add-glyph {
  font-size: 22px;
  color: var(--bl-accent);
  line-height: 1;
}
.bl-betweenchars-pick-add-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--bl-ink);
}
.bl-betweenchars-pick-add-sub {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 11px;
  color: var(--bl-ink-muted);
  line-height: 1.3;
  max-width: 16ch;
}

/* === CTA below picks === */
.bl-betweenchars-cta-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: clamp(8px, 1.6vw, 14px);
}
.bl-betweenchars-cta {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--bl-ink);
  color: #f6f1e3;
  border: 0;
  border-radius: 999px;
  padding: 14px 26px 14px 24px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 220ms cubic-bezier(.22, 1, .36, 1),
              color 220ms cubic-bezier(.22, 1, .36, 1),
              transform 220ms cubic-bezier(.22, 1, .36, 1),
              box-shadow 220ms cubic-bezier(.22, 1, .36, 1);
  box-shadow: 0 6px 16px rgba(14, 14, 12, 0.14);
}
.bl-betweenchars-cta:hover,
.bl-betweenchars-cta:focus-visible {
  background: var(--bl-accent);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(31, 122, 62, 0.28);
  outline: none;
}
.bl-betweenchars-cta-arrow {
  display: inline-block;
  font-size: 16px;
  transition: transform 280ms cubic-bezier(.22, 1, .36, 1);
}
.bl-betweenchars-cta:hover .bl-betweenchars-cta-arrow,
.bl-betweenchars-cta:focus-visible .bl-betweenchars-cta-arrow {
  transform: translateX(5px);
}
.bl-betweenchars-cta-sub {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 13px;
  color: var(--bl-ink-muted);
  text-align: center;
  max-width: 44ch;
  line-height: 1.5;
}

@media (max-width: 760px) {
  .bl-betweenchars-title { font-size: clamp(24px, 5.8vw, 34px); }
  .bl-betweenchars-picks { grid-template-columns: 1fr; }
  .bl-betweenchars-bg-mark { font-size: 200px; right: -28px; top: -20px; }
  .bl-betweenchars-quote { font-size: 21px; }
  .bl-betweenchars-mood-row { gap: 6px; }
  .bl-betweenchars-mood-btn { font-size: 12px; padding: 7px 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .bl-betweenchars-card,
  .bl-betweenchars-card-inner,
  .bl-betweenchars-cta,
  .bl-betweenchars-mood-btn,
  .bl-betweenchars-tuned,
  .bl-betweenchars-mood-dot { transition: none !important; animation: none !important; }
}
`;
