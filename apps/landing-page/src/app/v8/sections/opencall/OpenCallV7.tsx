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

// 6 most-common moods; matches the trimmed selector from the previous V7.
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
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);
  const [activeMood, setActiveMood] = useState<Mood | null>(null);
  // Bumped each time the mood changes — drives the pulse animation on the
  // "Now tuned to" subtitle and the brief crimson border flash on the card.
  const [moodTick, setMoodTick] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      const target = ((next % quotes.length) + quotes.length) % quotes.length;
      setFade(true);
      setTimeout(() => {
        setIdx(target);
        setFade(false);
      }, 220);
    },
    [quotes.length]
  );

  const currentQuote = quotes[idx];
  const pillPalette = PILL_BG[currentQuote.category];

  const handleMood = (mood: Mood) => {
    setActiveMood(mood);
    setMoodTick((t) => t + 1);
    setFade(true);
    setTimeout(() => {
      setIdx(MOOD_TO_QUOTE[mood]);
      setFade(false);
    }, 220);
  };

  const visiblePicks = SEED_PICKS.slice(0, 2);

  // Reset the "is-flashing" border state after the flash animation runs.
  const [flashing, setFlashing] = useState(false);
  useEffect(() => {
    if (moodTick === 0) return;
    setFlashing(true);
    const t = window.setTimeout(() => setFlashing(false), 520);
    return () => window.clearTimeout(t);
  }, [moodTick]);

  return (
    <section className="bl-betweenchars" aria-label="Words that stayed with us">
      <style>{STYLES}</style>

      <div className="bl-betweenchars-inner">
        <header className="bl-betweenchars-head">
          <span className="bl-betweenchars-eyebrow">BetweenCharacters</span>
          <h2 className="bl-betweenchars-title">Words that stayed with us.</h2>
          <div
            key={moodTick}
            className={`bl-betweenchars-tuned${activeMood ? ' is-active' : ''}`}
            aria-live="polite"
          >
            <span className="bl-betweenchars-tuned-prefix">
              {activeMood ? 'Now tuned to' : 'Drifting through'}
            </span>
            <span className="bl-betweenchars-tuned-value">
              {activeMood ? MOOD_LABELS[activeMood] : 'all moods'}
            </span>
          </div>
        </header>

        <div className="bl-betweenchars-mood">
          <span className="bl-betweenchars-mood-label">How are you feeling?</span>
          <div className="bl-betweenchars-mood-row">
            {COMPACT_MOODS.map((mood) => (
              <button
                key={mood}
                type="button"
                className={`bl-betweenchars-mood-btn${activeMood === mood ? ' is-active' : ''}`}
                onClick={() => handleMood(mood)}
                aria-pressed={activeMood === mood}
              >
                {activeMood === mood && (
                  <span className="bl-betweenchars-mood-dot" aria-hidden="true" />
                )}
                <span>{MOOD_LABELS[mood]}</span>
              </button>
            ))}
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
            onClick={() => goTo(idx - 1)}
            aria-label="Previous quote"
          >
            ←
          </button>
          <span className="bl-betweenchars-counter">
            {String(idx + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}
          </span>
          <button
            type="button"
            className="bl-betweenchars-nav-btn"
            onClick={() => goTo(idx + 1)}
            aria-label="Next quote"
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
  background: #ffffff;
  color: var(--bl-ink);
  overflow: hidden;
}
.bl-betweenchars-inner {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 2.6vw, 30px);
}

/* === Header === */
.bl-betweenchars-head {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
  align-items: center;
}
.bl-betweenchars-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
}
.bl-betweenchars-title {
  margin: 0;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(40px, 5.4vw, 64px);
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: var(--bl-ink);
  text-wrap: balance;
  max-width: 16ch;
  font-feature-settings: "kern", "liga", "calt";
}
.bl-betweenchars-tuned {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(14, 14, 12, 0.04);
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
  /* Pulse — fired on remount via the key={moodTick} trick */
  animation: bl-tuned-pulse 520ms cubic-bezier(.22, 1, .36, 1);
}
.bl-betweenchars-tuned.is-active {
  background: var(--bl-accent);
  color: #ffffff;
}
.bl-betweenchars-tuned-prefix { opacity: 0.7; }
.bl-betweenchars-tuned.is-active .bl-betweenchars-tuned-prefix { opacity: 0.85; }
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

/* === Mood selector (now ABOVE the card — the entry point) === */
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
  border: 1.5px solid rgba(14, 14, 12, 0.18);
  background: #ffffff;
  border-radius: 999px;
  padding: 8px 14px;
  font-family: var(--bl-font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--bl-ink);
  cursor: pointer;
  transition:
    background 220ms cubic-bezier(.22, 1, .36, 1),
    color 220ms cubic-bezier(.22, 1, .36, 1),
    border-color 220ms cubic-bezier(.22, 1, .36, 1),
    transform 220ms cubic-bezier(.22, 1, .36, 1);
  white-space: nowrap;
}
.bl-betweenchars-mood-btn:hover {
  border-color: var(--bl-accent);
  color: var(--bl-accent);
  transform: translateY(-1px);
}
.bl-betweenchars-mood-btn.is-active {
  background: var(--bl-ink);
  color: #ffffff;
  border-color: var(--bl-ink);
  padding-left: 10px;
}
.bl-betweenchars-mood-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--bl-accent);
  box-shadow: 0 0 0 2px rgba(27, 69, 255, 0.28);
  animation: bl-mood-dot 480ms cubic-bezier(.22, 1, .36, 1);
}
@keyframes bl-mood-dot {
  0%   { transform: scale(0.4); opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}

/* === Quote card (yellow with bold white text) === */
.bl-betweenchars-card {
  position: relative;
  background: #FFC700;
  border: 2px solid var(--bl-ink);
  border-radius: 18px;
  padding: clamp(32px, 4vw, 52px) clamp(32px, 4vw, 56px);
  min-height: 240px;
  /* Soft layered ambient shadow — no offset stamp block underneath. */
  box-shadow:
    0 2px 4px rgba(14, 14, 12, 0.05),
    0 12px 28px rgba(14, 14, 12, 0.12),
    0 28px 56px rgba(14, 14, 12, 0.06);
  transition:
    opacity 240ms cubic-bezier(.22, 1, .36, 1),
    transform 320ms cubic-bezier(.22, 1, .36, 1),
    border-color 240ms cubic-bezier(.22, 1, .36, 1),
    border-width 240ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 320ms cubic-bezier(.22, 1, .36, 1);
  isolation: isolate;
  overflow: hidden;
}
.bl-betweenchars-card::before {
  /* Paper grain so the yellow doesn't read plastic */
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/></svg>");
  mix-blend-mode: multiply;
  opacity: 0.08;
  z-index: 0;
}
.bl-betweenchars-card.is-fading .bl-betweenchars-card-inner {
  opacity: 0;
  transform: translateY(10px);
}
.bl-betweenchars-card.is-flashing {
  /* Mood-change feedback: border thickens + turns cobalt, card lifts slightly,
     and a soft cobalt halo glows underneath. */
  border-color: var(--bl-accent);
  border-width: 3px;
  transform: translateY(-4px);
  box-shadow:
    0 4px 10px rgba(14, 14, 12, 0.08),
    0 18px 38px rgba(14, 14, 12, 0.14),
    0 0 0 6px rgba(27, 69, 255, 0.10);
}
/* The giant background quote-mark — watermark, not decoration */
.bl-betweenchars-bg-mark {
  position: absolute;
  top: -32px;
  right: -16px;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 700;
  font-variation-settings: 'opsz' 144;
  font-size: clamp(180px, 22vw, 320px);
  line-height: 0.85;
  color: #ffffff;
  opacity: 0.28;
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
  transition:
    opacity 220ms cubic-bezier(.22, 1, .36, 1),
    transform 280ms cubic-bezier(.22, 1, .36, 1);
}
.bl-betweenchars-mark {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 56px;
  line-height: 0.8;
  color: rgba(14, 14, 12, 0.5);
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
  /* Inline style overrides bg/color per-category; we just normalize ring */
  box-shadow: inset 0 0 0 1px rgba(14, 14, 12, 0.12);
}
.bl-betweenchars-quote {
  margin: 4px 0 8px;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 700;
  font-variation-settings: 'opsz' 96, 'SOFT' 20;
  font-size: clamp(22px, 2.4vw, 30px);
  line-height: 1.4;
  color: #ffffff;
  max-width: 24ch;
  text-wrap: pretty;
  /* Soft ink shadow keeps white-on-yellow legible at small sizes
     without losing the bold poster vibe */
  text-shadow:
    0 1px 0 rgba(14, 14, 12, 0.20),
    0 2px 8px rgba(14, 14, 12, 0.12);
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
  font-weight: 800;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--bl-ink);
}
.bl-betweenchars-source {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 13px;
  color: rgba(14, 14, 12, 0.7);
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
  border: 1.5px solid rgba(14, 14, 12, 0.18);
  background: #ffffff;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--bl-ink);
  font-size: 14px;
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
}
.bl-betweenchars-nav-btn:hover {
  background: #f8f5ee;
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
  background: #ffffff;
  border: 0.5px solid #e8e4dc;
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
  background: rgba(14, 14, 12, 0.06);
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
  border: 1px dashed rgba(14, 14, 12, 0.3);
  background: #fafafa;
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
  box-shadow: 0 12px 24px rgba(27, 69, 255, 0.28);
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

@media (max-width: 640px) {
  .bl-betweenchars-picks { grid-template-columns: 1fr; }
  .bl-betweenchars-title { font-size: clamp(34px, 9vw, 48px); }
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
