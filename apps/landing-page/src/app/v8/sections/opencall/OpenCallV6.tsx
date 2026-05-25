'use client';

import { useEffect, useState } from 'react';
import { MOODS, byMood, type MoodKey, type Mood } from './data';
import { FauxCover } from './shared';

type Props = { onReader: () => void; onWriter: () => void };

export default function OpenCallV6({ onReader, onWriter }: Props) {
  const [mood, setMood] = useState<MoodKey | null>('brave');
  const [picking, setPicking] = useState(false);

  const active: Mood | null = mood ? MOODS.find((m) => m.key === mood) ?? null : null;
  const cards = mood ? byMood(mood) : [];

  const pickMood = (m: MoodKey) => {
    setPicking(true);
    setMood(m);
    setTimeout(() => setPicking(false), 480);
  };

  // re-trigger fan animation on mood change
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [mood]);

  const tint = active?.tint ?? 'var(--bl-accent)';

  return (
    <section
      className="bl-compass"
      aria-label="Find a manuscript by mood"
      style={{ ['--bl-mood-tint' as string]: tint }}
    >
      <style>{STYLES}</style>

      <header className="bl-compass-head">
        <span className="bl-compass-eyebrow">Mood compass · Issue №01</span>
        <h2 className="bl-compass-title">
          Tell us how you feel. <em>We&rsquo;ll find the book.</em>
        </h2>
      </header>

      <div className="bl-compass-stage">
        <div className="bl-compass-dial-wrap" aria-hidden="false">
          <svg
            className="bl-compass-dial"
            viewBox="0 0 320 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#bl-sketch)">
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeDasharray="2 6"
                opacity="0.5"
              />
              <circle
                cx="160"
                cy="160"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                opacity="0.35"
              />
              {MOODS.map((m) => {
                const rad = ((m.angle - 90) * Math.PI) / 180;
                const x1 = 160 + Math.cos(rad) * 124;
                const y1 = 160 + Math.sin(rad) * 124;
                const x2 = 160 + Math.cos(rad) * 144;
                const y2 = 160 + Math.sin(rad) * 144;
                return (
                  <line
                    key={`tick-${m.key}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity={mood === m.key ? 1 : 0.55}
                  />
                );
              })}
              <g
                style={{
                  transformOrigin: '160px 160px',
                  transform: `rotate(${active?.angle ?? 0}deg)`,
                  transition: 'transform 480ms cubic-bezier(.22, 1, .36, 1)',
                }}
              >
                <polygon points="160,42 152,160 168,160" fill="var(--bl-mood-tint)" />
                <circle cx="160" cy="160" r="10" fill="var(--bl-mood-tint)" />
                <circle cx="160" cy="160" r="4" fill="#f6f1e3" />
              </g>
            </g>
          </svg>
          <div className="bl-compass-labels">
            {MOODS.map((m) => {
              const rad = ((m.angle - 90) * Math.PI) / 180;
              const r = 168;
              const left = 50 + (Math.cos(rad) * r) / 3.2;
              const top = 50 + (Math.sin(rad) * r) / 3.2;
              return (
                <button
                  type="button"
                  key={m.key}
                  className={`bl-compass-label${mood === m.key ? ' is-active' : ''}`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  onClick={() => pickMood(m.key)}
                  aria-pressed={mood === m.key}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bl-compass-result" key={animKey}>
          <div className="bl-compass-result-head">
            <span className="bl-compass-result-tag">Mood</span>
            <span className="bl-compass-result-mood">{active?.label ?? '—'}</span>
          </div>
          <div className="bl-compass-cards">
            {cards.map((ms, i) => (
              <article
                key={ms.id}
                className="bl-compass-card"
                style={{ animationDelay: `${80 * i}ms` }}
              >
                <FauxCover ms={ms} size="md" rotate={i % 2 === 0 ? -1.5 : 1.5} />
                <div className="bl-compass-card-body">
                  <h3 className="bl-compass-card-title">{ms.title}</h3>
                  <span className="bl-compass-card-author">{ms.author}</span>
                  <p className="bl-compass-card-pitch">{ms.pitch}</p>
                  <button type="button" className="bl-compass-card-open" onClick={onReader}>
                    Open <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          {cards.length === 0 && (
            <p className="bl-compass-empty">Pick a mood to see three matched manuscripts.</p>
          )}
        </div>
      </div>

      <footer className="bl-compass-foot">
        <button type="button" className="bl-compass-cta" onClick={onWriter}>
          Submit a manuscript with this mood <span aria-hidden="true">→</span>
        </button>
      </footer>
    </section>
  );
}

const STYLES = `
.bl-compass {
  position: relative;
  padding: clamp(90px, 12vh, 130px) clamp(24px, 5vw, 80px);
  background: var(--bl-surface);
  color: var(--bl-ink);
  overflow: hidden;
}
.bl-compass::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 50% 30%, var(--bl-mood-tint) 0%, transparent 50%);
  opacity: 0.08;
  pointer-events: none;
  transition: opacity 480ms ease, background-image 480ms ease;
}

.bl-compass-head,
.bl-compass-stage,
.bl-compass-foot {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
}
.bl-compass-head {
  text-align: center;
  margin-bottom: clamp(28px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.bl-compass-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
}
.bl-compass-title {
  margin: 0;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(32px, 4.4vw, 56px);
  letter-spacing: -0.035em;
  line-height: 1.04;
  color: var(--bl-ink);
  text-wrap: balance;
}
.bl-compass-title em {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  color: var(--bl-mood-tint);
  transition: color 320ms ease;
}

.bl-compass-stage {
  display: grid;
  grid-template-columns: minmax(260px, 360px) 1fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
}

.bl-compass-dial-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 360px;
  color: var(--bl-ink);
  justify-self: center;
}
.bl-compass-dial {
  width: 100%;
  height: 100%;
  display: block;
}
.bl-compass-labels {
  position: absolute;
  inset: 0;
}
.bl-compass-label {
  position: absolute;
  appearance: none;
  border: 1.5px solid rgba(14,14,12,0.18);
  background: var(--bl-surface);
  border-radius: 999px;
  padding: 6px 14px;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-ink);
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: background 200ms ease, color 200ms ease, border-color 200ms ease, transform 200ms ease;
  white-space: nowrap;
}
.bl-compass-label:hover { border-color: var(--bl-mood-tint); }
.bl-compass-label.is-active {
  background: var(--bl-mood-tint);
  color: #fff;
  border-color: var(--bl-mood-tint);
  transform: translate(-50%, -50%) scale(1.06);
}

.bl-compass-result {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.bl-compass-result-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.bl-compass-result-tag {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-compass-result-mood {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(24px, 3vw, 36px);
  color: var(--bl-mood-tint);
  letter-spacing: -0.015em;
  transition: color 320ms ease;
}

.bl-compass-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(16px, 2vw, 24px);
}
.bl-compass-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 18px 14px;
  background: var(--bl-paper-bg, rgba(14,14,12,0.03));
  border-radius: 14px;
  text-align: center;
  opacity: 0;
  transform: translateY(14px);
  animation: bl-compass-fan 520ms cubic-bezier(.22, 1, .36, 1) forwards;
}
@keyframes bl-compass-fan {
  to { opacity: 1; transform: none; }
}
.bl-compass-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
}
.bl-compass-card-title {
  margin: 0;
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-size: 16px;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--bl-ink);
  text-wrap: balance;
}
.bl-compass-card-author {
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-compass-card-pitch {
  margin: 4px 0 0;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 13px;
  line-height: 1.4;
  color: var(--bl-ink);
  max-width: 24ch;
}
.bl-compass-card-open {
  margin-top: 6px;
  appearance: none;
  border: 1.5px solid var(--bl-ink);
  background: transparent;
  color: var(--bl-ink);
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
}
.bl-compass-card-open:hover {
  background: var(--bl-mood-tint);
  color: #fff;
  border-color: var(--bl-mood-tint);
}

.bl-compass-empty {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  color: var(--bl-ink-muted);
  text-align: center;
  padding: 32px 0;
}

.bl-compass-foot {
  margin-top: clamp(48px, 6vw, 72px);
  display: flex;
  justify-content: center;
}
.bl-compass-cta {
  appearance: none;
  border: 0;
  background: var(--bl-mood-tint);
  color: #fff;
  padding: 14px 26px;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: filter 200ms ease, transform 200ms ease;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.bl-compass-cta:hover { filter: brightness(1.1); transform: translateY(-1px); }

@media (max-width: 880px) {
  .bl-compass-stage { grid-template-columns: 1fr; }
  .bl-compass-dial-wrap { max-width: 280px; }
  .bl-compass-cards { grid-template-columns: 1fr; max-width: 360px; margin: 0 auto; }
}
@media (prefers-reduced-motion: reduce) {
  .bl-compass-card { animation: none; opacity: 1; transform: none; }
  .bl-compass-dial g { transition: none !important; }
}
`;
