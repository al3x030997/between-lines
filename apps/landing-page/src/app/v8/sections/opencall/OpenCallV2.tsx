'use client';

import { useEffect, useRef, useState } from 'react';
import { MANUSCRIPTS } from './data';
import { useSequentialIndex } from './shared';

type Props = { onReader: () => void; onWriter: () => void };

export default function OpenCallV2({ onReader, onWriter }: Props) {
  const items = MANUSCRIPTS;
  const { i, next, prev } = useSequentialIndex(items.length);
  const current = items[i];
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [ticker, setTicker] = useState(317);
  const [flipKey, setFlipKey] = useState(0);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setExpanded(false);
    setFlipKey((k) => k + 1);
  }, [i]);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      const delay = 4000 + Math.random() * 4000;
      setTimeout(() => {
        if (cancelled) return;
        const drift = Math.random() < 0.62 ? 1 : Math.random() < 0.5 ? 0 : -1;
        setTicker((t) => Math.max(290, t + drift));
        tick();
      }, delay);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, []);

  const heartIt = () => {
    setLiked((set) => {
      const out = new Set(set);
      if (out.has(current.id)) out.delete(current.id);
      else out.add(current.id);
      return out;
    });
  };

  const isLiked = liked.has(current.id);

  return (
    <section className="bl-firstline" aria-label="Read the first line of a manuscript">
      <style>{STYLES}</style>

      <div className="bl-firstline-paper" aria-hidden="true">
        <svg className="bl-firstline-doodle bl-firstline-doodle-a" viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 30 Q 22 5, 42 30 T 80 30 T 118 30 T 156 30 T 194 30"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            filter="url(#bl-sketch)"
          />
        </svg>
        <svg className="bl-firstline-doodle bl-firstline-doodle-b" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M40 8 L46 32 L70 32 L50 46 L58 70 L40 56 L22 70 L30 46 L10 32 L34 32 Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinejoin="round"
            filter="url(#bl-sketch)"
          />
        </svg>
      </div>

      <header className="bl-firstline-head">
        <span className="bl-firstline-eyebrow">First lines · Issue №01</span>
        <button type="button" className="bl-firstline-submit" onClick={onWriter}>
          Submit yours <span aria-hidden="true">→</span>
        </button>
      </header>

      <div className="bl-firstline-stage">
        <div className="bl-firstline-counter">
          <span>{String(i + 1).padStart(2, '0')}</span>
          <span className="bl-firstline-counter-sep">/</span>
          <span>{String(items.length).padStart(2, '0')}</span>
        </div>

        <div className="bl-firstline-card" key={flipKey}>
          <blockquote className="bl-firstline-quote">
            <span className="bl-firstline-quote-mark" aria-hidden="true">&ldquo;</span>
            {current.firstLine}
          </blockquote>
          <div className={`bl-firstline-body${expanded ? ' is-expanded' : ''}`} aria-hidden={!expanded}>
            <p>{current.paragraph}</p>
          </div>
          <div className="bl-firstline-meta">
            <span className="bl-firstline-title">{current.title}</span>
            <span className="bl-firstline-sep" aria-hidden="true">·</span>
            <span className="bl-firstline-author">{current.author}</span>
            <span className="bl-firstline-sep" aria-hidden="true">·</span>
            <span className="bl-firstline-genre">{current.genre}</span>
          </div>
        </div>

        <div className="bl-firstline-controls">
          <button
            type="button"
            className="bl-firstline-ctl bl-firstline-ctl-ghost"
            onClick={prev}
            aria-label="Previous first line"
          >
            ←
          </button>
          <button
            type="button"
            className="bl-firstline-ctl bl-firstline-ctl-primary"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
          >
            {expanded ? 'Less' : 'Keep reading'} <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            className={`bl-firstline-ctl bl-firstline-ctl-heart${isLiked ? ' is-liked' : ''}`}
            onClick={heartIt}
            aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={isLiked}
          >
            <span aria-hidden="true">{isLiked ? '♥' : '♡'}</span>
          </button>
          <button
            type="button"
            className="bl-firstline-ctl bl-firstline-ctl-ghost"
            onClick={next}
            aria-label="Next first line"
          >
            →
          </button>
        </div>
      </div>

      <footer className="bl-firstline-foot">
        <div className="bl-firstline-ticker" ref={liveRef} aria-live="polite" aria-atomic="true">
          <span className="bl-firstline-ticker-dot" aria-hidden="true" />
          <span className="bl-firstline-ticker-num">{ticker}</span>
          <span className="bl-firstline-ticker-text">first lines read today</span>
        </div>
        <button type="button" className="bl-firstline-cta" onClick={onReader}>
          Get the issue <span aria-hidden="true">→</span>
        </button>
      </footer>
    </section>
  );
}

const STYLES = `
.bl-firstline {
  position: relative;
  padding: clamp(90px, 12vh, 130px) clamp(24px, 5vw, 80px);
  background:
    repeating-linear-gradient(180deg, transparent 0 30px, rgba(14,14,12,0.05) 30px 31px),
    var(--bl-paper-bg, var(--bl-surface));
  color: var(--bl-ink);
  overflow: hidden;
}
.bl-firstline-paper {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  color: var(--bl-accent);
  opacity: 0.35;
}
.bl-firstline-paper::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/></svg>");
  mix-blend-mode: multiply;
  opacity: 0.18;
}
.bl-firstline-doodle {
  position: absolute;
  color: var(--bl-accent);
  opacity: 0.55;
}
.bl-firstline-doodle-a {
  top: clamp(70px, 8vh, 110px);
  left: clamp(20px, 4vw, 70px);
  width: clamp(120px, 16vw, 200px);
  height: auto;
}
.bl-firstline-doodle-b {
  bottom: clamp(40px, 6vh, 80px);
  right: clamp(30px, 5vw, 80px);
  width: clamp(48px, 5vw, 64px);
  height: auto;
  opacity: 0.5;
}

.bl-firstline-head,
.bl-firstline-stage,
.bl-firstline-foot {
  position: relative;
  z-index: 1;
  max-width: 980px;
  margin: 0 auto;
}
.bl-firstline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: clamp(36px, 5vw, 56px);
}
.bl-firstline-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
}
.bl-firstline-submit {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--bl-ink);
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 4px 0;
  position: relative;
}
.bl-firstline-submit::after {
  content: '';
  position: absolute;
  left: 0;
  right: 18px;
  bottom: 0;
  height: 1px;
  background: currentColor;
  opacity: 0.45;
  transition: opacity 200ms ease;
}
.bl-firstline-submit:hover { color: var(--bl-accent); }
.bl-firstline-submit:hover::after { opacity: 1; }

.bl-firstline-stage { position: relative; }
.bl-firstline-counter {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
  font-variant-numeric: tabular-nums;
  margin-bottom: 14px;
}
.bl-firstline-counter-sep { opacity: 0.4; }

.bl-firstline-card {
  position: relative;
  animation: bl-firstline-flip 480ms cubic-bezier(.22, 1, .36, 1);
}
@keyframes bl-firstline-flip {
  from { opacity: 0; transform: translateY(12px) rotateX(8deg); transform-origin: center top; }
  to   { opacity: 1; transform: none; }
}

.bl-firstline-quote {
  margin: 0;
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  font-size: clamp(32px, 4.6vw, 68px);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--bl-ink);
  text-wrap: balance;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-firstline-quote-mark {
  display: inline-block;
  font-size: 1.4em;
  line-height: 0;
  vertical-align: -0.18em;
  margin-right: 0.08em;
  color: var(--bl-accent);
  opacity: 0.85;
}

.bl-firstline-body {
  margin-top: clamp(20px, 2.4vw, 30px);
  max-height: 0;
  overflow: hidden;
  transition: max-height 460ms cubic-bezier(.22, 1, .36, 1), opacity 260ms ease;
  opacity: 0;
}
.bl-firstline-body.is-expanded {
  max-height: 460px;
  opacity: 1;
}
.bl-firstline-body p {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(17px, 1.5vw, 21px);
  line-height: 1.6;
  letter-spacing: 0;
  color: var(--bl-ink);
  max-width: 60ch;
  text-wrap: pretty;
}

.bl-firstline-meta {
  margin-top: clamp(22px, 2.6vw, 32px);
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-firstline-title { color: var(--bl-ink); letter-spacing: 0.18em; }
.bl-firstline-sep { opacity: 0.45; }

.bl-firstline-controls {
  margin-top: clamp(28px, 3.2vw, 40px);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.bl-firstline-ctl {
  appearance: none;
  border: 1.5px solid rgba(14,14,12,0.18);
  background: transparent;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-ink);
  cursor: pointer;
  padding: 12px 18px;
  transition: background 200ms ease, color 200ms ease, border-color 200ms ease, transform 200ms ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-variant-numeric: tabular-nums;
}
.bl-firstline-ctl-primary {
  background: var(--bl-ink);
  color: var(--bl-surface);
  border-color: var(--bl-ink);
  padding: 12px 22px;
}
.bl-firstline-ctl-primary:hover { background: var(--bl-accent); border-color: var(--bl-accent); }
.bl-firstline-ctl-ghost {
  width: 44px;
  height: 44px;
  padding: 0;
  justify-content: center;
  font-size: 16px;
  letter-spacing: 0;
}
.bl-firstline-ctl-ghost:hover { border-color: var(--bl-accent); color: var(--bl-accent); transform: translateY(-1px); }
.bl-firstline-ctl-heart {
  width: 44px;
  height: 44px;
  padding: 0;
  justify-content: center;
  font-size: 20px;
  letter-spacing: 0;
}
.bl-firstline-ctl-heart.is-liked { color: var(--bl-accent); border-color: var(--bl-accent); background: var(--bl-accent-soft); }

.bl-firstline-foot {
  margin-top: clamp(56px, 7vw, 88px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: clamp(20px, 2.4vw, 28px);
  border-top: 1px solid rgba(14,14,12,0.12);
  flex-wrap: wrap;
}
.bl-firstline-ticker {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--bl-font-body);
  font-size: 14px;
  color: var(--bl-ink-muted);
  font-variant-numeric: tabular-nums;
}
.bl-firstline-ticker-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--bl-accent);
  transform: translateY(-1px);
  animation: bl-firstline-pulse 2.4s ease-in-out infinite;
}
@keyframes bl-firstline-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.4); }
  50% { opacity: 0.6; box-shadow: 0 0 0 8px rgba(230, 57, 70, 0); }
}
.bl-firstline-ticker-num {
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-size: 22px;
  color: var(--bl-ink);
  letter-spacing: -0.01em;
}
.bl-firstline-cta {
  appearance: none;
  border: 0;
  background: var(--bl-accent);
  color: #fff;
  padding: 14px 26px;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.bl-firstline-cta:hover { background: var(--bl-accent-strong); transform: translateY(-1px); }

@media (max-width: 600px) {
  .bl-firstline-controls { gap: 8px; }
  .bl-firstline-ctl { padding: 10px 14px; font-size: 11px; }
  .bl-firstline-ctl-primary { padding: 11px 18px; }
  .bl-firstline-foot { justify-content: flex-start; }
}
@media (prefers-reduced-motion: reduce) {
  .bl-firstline-card { animation: none; }
  .bl-firstline-ticker-dot { animation: none; }
}
`;
