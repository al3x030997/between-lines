'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MOOD_LABELS,
  MOOD_TO_QUOTE,
  PILL_BG,
  QUOTES,
  SEED_PICKS,
  type Mood,
} from './quotes';

type Props = { onReader: () => void; onWriter: () => void };

const AUTOPLAY_MS = 6000;

// Trimmed mood set — 6 most common moods (down from 10) to reduce visual density.
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
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(false);
  const [activeMood, setActiveMood] = useState<Mood | null>(null);

  const lastTickRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      const target = ((next % quotes.length) + quotes.length) % quotes.length;
      setFade(true);
      setTimeout(() => {
        setIdx(target);
        setFade(false);
      }, 180);
      elapsedRef.current = 0;
      lastTickRef.current = null;
      setProgress(0);
    },
    [quotes.length]
  );

  useEffect(() => {
    if (paused) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    const tick = (now: number) => {
      if (lastTickRef.current === null) lastTickRef.current = now;
      elapsedRef.current += now - lastTickRef.current;
      lastTickRef.current = now;
      const pct = Math.min(100, (elapsedRef.current / AUTOPLAY_MS) * 100);
      setProgress(pct);
      if (elapsedRef.current >= AUTOPLAY_MS) {
        elapsedRef.current = 0;
        lastTickRef.current = null;
        setIdx((i) => (i + 1) % quotes.length);
        setProgress(0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [paused, quotes.length]);

  // Resume autoplay 10s after a manual pause from a mood click.
  useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => setPaused(false), 10000);
    return () => clearTimeout(t);
  }, [paused]);

  const currentQuote = quotes[idx];
  const pillPalette = PILL_BG[currentQuote.category];

  const handleMood = (mood: Mood) => {
    setActiveMood(mood);
    setFade(true);
    setTimeout(() => {
      setIdx(MOOD_TO_QUOTE[mood]);
      setFade(false);
    }, 180);
    setPaused(true);
    elapsedRef.current = 0;
    setProgress(0);
  };

  const visiblePicks = SEED_PICKS.slice(0, 2);

  return (
    <section
      className="bl-betweenchars"
      aria-label="Words that stayed with us"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{STYLES}</style>

      <div className="bl-betweenchars-paper" aria-hidden="true" />

      <div className="bl-betweenchars-inner">
        <header className="bl-betweenchars-head">
          <span className="bl-betweenchars-eyebrow">BetweenCharacters</span>
          <h2 className="bl-betweenchars-title">
            Words that stayed with us.
          </h2>
        </header>

        <div className={`bl-betweenchars-stage${fade ? ' is-fading' : ''}`}>
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

        <div className="bl-betweenchars-progress" aria-hidden="true">
          <div
            className="bl-betweenchars-progress-bar"
            style={{ width: `${paused ? 0 : progress}%` }}
          />
        </div>

        <div className="bl-betweenchars-nav">
          <span className="bl-betweenchars-counter">
            {String(idx + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}
          </span>
          <div className="bl-betweenchars-nav-btns">
            <button
              type="button"
              className="bl-betweenchars-nav-btn"
              onClick={() => goTo(idx - 1)}
              aria-label="Previous quote"
            >
              ←
            </button>
            <button
              type="button"
              className="bl-betweenchars-nav-btn"
              onClick={() => goTo(idx + 1)}
              aria-label="Next quote"
            >
              →
            </button>
          </div>
        </div>

        <div className="bl-betweenchars-mood">
          <span className="bl-betweenchars-mood-label">How are you feeling?</span>
          <div className="bl-betweenchars-mood-row">
            {COMPACT_MOODS.map((mood) => (
              <button
                key={mood}
                type="button"
                className={`bl-betweenchars-mood-btn${activeMood === mood ? ' is-active' : ''}`}
                onClick={() => handleMood(mood)}
              >
                {MOOD_LABELS[mood]}
              </button>
            ))}
          </div>
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
      </div>
    </section>
  );
}

const STYLES = `
.bl-betweenchars {
  position: relative;
  padding: clamp(72px, 9vh, 104px) clamp(24px, 5vw, 80px);
  background:
    repeating-linear-gradient(180deg, transparent 0 30px, rgba(14,14,12,0.05) 30px 31px),
    var(--bl-paper-bg, var(--bl-surface));
  color: var(--bl-ink);
  overflow: hidden;
}
.bl-betweenchars-paper {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/></svg>");
  mix-blend-mode: multiply;
  opacity: 0.16;
}
.bl-betweenchars-inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 2.6vw, 30px);
}

.bl-betweenchars-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
  align-items: center;
}
.bl-betweenchars-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-accent);
}
.bl-betweenchars-title {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  font-size: clamp(22px, 2.6vw, 30px);
  line-height: 1.15;
  letter-spacing: -0.005em;
  color: var(--bl-ink);
  text-wrap: balance;
}

.bl-betweenchars-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: clamp(12px, 2vw, 20px) 0 clamp(8px, 1.4vw, 14px);
  text-align: center;
  transition: opacity 220ms ease;
}
.bl-betweenchars-stage.is-fading { opacity: 0; }
.bl-betweenchars-mark {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 56px;
  line-height: 0.8;
  color: rgba(14,14,12,0.2);
}
.bl-betweenchars-pill {
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 999px;
}
.bl-betweenchars-quote {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(20px, 2.2vw, 26px);
  line-height: 1.5;
  color: var(--bl-ink);
  max-width: 32ch;
  text-wrap: pretty;
}
.bl-betweenchars-attr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  margin-top: 4px;
}
.bl-betweenchars-author {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-ink);
}
.bl-betweenchars-source {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 12px;
  color: var(--bl-ink-muted);
}

.bl-betweenchars-progress {
  height: 1.5px;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  background: rgba(14,14,12,0.1);
  border-radius: 2px;
  overflow: hidden;
}
.bl-betweenchars-progress-bar {
  height: 100%;
  background: var(--bl-ink);
  border-radius: 2px;
  transition: width 80ms linear;
}

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
}
.bl-betweenchars-nav-btns { display: flex; gap: 8px; }
.bl-betweenchars-nav-btn {
  appearance: none;
  border: 0.5px solid rgba(14,14,12,0.2);
  background: transparent;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--bl-ink);
  font-size: 13px;
  transition: background 160ms ease, border-color 160ms ease;
}
.bl-betweenchars-nav-btn:hover {
  background: rgba(14,14,12,0.04);
  border-color: rgba(14,14,12,0.4);
}

.bl-betweenchars-mood {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}
.bl-betweenchars-mood-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-betweenchars-mood-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}
.bl-betweenchars-mood-btn {
  appearance: none;
  border: 0.5px solid rgba(14,14,12,0.2);
  background: transparent;
  border-radius: 999px;
  padding: 6px 12px;
  font-family: var(--bl-font-body);
  font-size: 12px;
  color: var(--bl-ink);
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
  white-space: nowrap;
}
.bl-betweenchars-mood-btn:hover { border-color: rgba(14,14,12,0.4); }
.bl-betweenchars-mood-btn.is-active {
  background: var(--bl-ink);
  color: var(--bl-surface);
  border-color: var(--bl-ink);
}

.bl-betweenchars-picks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 4px;
}
.bl-betweenchars-pick {
  background: transparent;
  border: 0.5px solid rgba(14,14,12,0.16);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
  font: inherit;
  color: inherit;
  min-height: 110px;
}
.bl-betweenchars-pick-badge {
  align-self: flex-start;
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(14,14,12,0.06);
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
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}

.bl-betweenchars-pick-add {
  cursor: pointer;
  border: 1px dashed rgba(14,14,12,0.3);
  background: transparent;
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
  font-size: 20px;
  color: var(--bl-accent);
  line-height: 1;
}
.bl-betweenchars-pick-add-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
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

@media (max-width: 640px) {
  .bl-betweenchars-picks { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .bl-betweenchars-stage { transition: none; }
  .bl-betweenchars-progress-bar { transition: none; }
}
`;
