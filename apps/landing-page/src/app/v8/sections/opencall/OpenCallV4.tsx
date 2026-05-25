'use client';

import { useMemo, useState } from 'react';
import { MANUSCRIPTS, QUOTES, type Manuscript, type Quote } from './data';
import { FauxCover } from './shared';

type Props = { onReader: () => void; onWriter: () => void };

type WallTile = {
  id: string;
  manuscript?: Manuscript;
  custom?: { title: string; author: string; coverHue: number };
  quote?: Quote;
  fresh?: boolean;
};

const BUILT_QUOTE: Record<string, Quote | undefined> = QUOTES.reduce((acc, q) => {
  if (!acc[q.msId]) acc[q.msId] = q;
  return acc;
}, {} as Record<string, Quote>);

const STARTING_TILES: WallTile[] = MANUSCRIPTS.slice(0, 12).map((m) => ({
  id: m.id,
  manuscript: m,
  quote: BUILT_QUOTE[m.id],
}));

function hashRotate(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const rot = ((h % 9) - 4) * 0.6;
  return rot;
}

export default function OpenCallV4({ onReader, onWriter }: Props) {
  const [tiles, setTiles] = useState<WallTile[]>(STARTING_TILES);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const total = tiles.length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      ? crypto.randomUUID()
      : `usr-${Date.now()}`;
    const customTitle = trimmed.length > 40 ? trimmed.slice(0, 40) + '…' : trimmed;
    const coverHue = Math.floor((id.charCodeAt(0) * 17 + id.charCodeAt(1) * 7) % 360);
    const newTile: WallTile = {
      id,
      custom: { title: customTitle, author: 'Yours', coverHue },
      quote: { id: `usr-${id}`, msId: id, text: trimmed, reader: 'You' },
      fresh: true,
    };
    setTiles((prev) => [newTile, ...prev].slice(0, 18));
    setInput('');
    setTimeout(() => setSubmitting(false), 600);
    setTimeout(() => {
      setTiles((prev) =>
        prev.map((t) => (t.id === id ? { ...t, fresh: false } : t))
      );
    }, 900);
  };

  const hoveredQuote: Quote | null = useMemo(() => {
    if (!hoveredId) return null;
    const tile = tiles.find((t) => t.id === hoveredId);
    return tile?.quote ?? null;
  }, [hoveredId, tiles]);

  return (
    <section className="bl-wall" aria-label="Community favorites wall">
      <style>{STYLES}</style>

      <header className="bl-wall-head">
        <span className="bl-wall-eyebrow">The wall · {total} reads strong</span>
        <h2 className="bl-wall-title">
          Books our readers <em>refuse to forget.</em>
        </h2>
        <p className="bl-wall-lede">
          Hover any cover. Add the last line that lodged itself in you.
        </p>
      </header>

      <div className="bl-wall-grid">
        {tiles.map((tile, i) => {
          const cover = tile.manuscript ?? toFauxManuscript(tile);
          const rot = hashRotate(tile.id);
          const isHover = hoveredId === tile.id;
          return (
            <button
              type="button"
              key={tile.id}
              className={`bl-wall-tile${tile.fresh ? ' is-fresh' : ''}${isHover ? ' is-hovered' : ''}`}
              style={{ transform: `rotate(${rot}deg)` }}
              onMouseEnter={() => setHoveredId(tile.id)}
              onMouseLeave={() => setHoveredId((id) => (id === tile.id ? null : id))}
              onFocus={() => setHoveredId(tile.id)}
              onBlur={() => setHoveredId((id) => (id === tile.id ? null : id))}
              aria-label={`${cover.title} by ${cover.author}`}
            >
              <span className="bl-wall-tile-rank">Nº&nbsp;{String(i + 1).padStart(2, '0')}</span>
              <FauxCover ms={cover} size="sm" />
              {tile.quote && (
                <span className={`bl-wall-bubble${isHover ? ' is-on' : ''}`} aria-hidden={!isHover}>
                  <span className="bl-wall-bubble-text">{tile.quote.text}</span>
                  <span className="bl-wall-bubble-attr">— {tile.quote.reader}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="bl-wall-mobile-quote" aria-live="polite">
        {hoveredQuote ? (
          <>
            <span className="bl-wall-mobile-quote-text">{hoveredQuote.text}</span>
            <span className="bl-wall-mobile-quote-attr">— {hoveredQuote.reader}</span>
          </>
        ) : (
          <span className="bl-wall-mobile-quote-hint">Tap a cover to read what stuck.</span>
        )}
      </div>

      <form className="bl-wall-form" onSubmit={submit}>
        <label htmlFor="bl-wall-input" className="bl-wall-form-label">
          What&rsquo;s the last book that broke you?
        </label>
        <div className="bl-wall-form-row">
          <input
            id="bl-wall-input"
            type="text"
            className="bl-wall-input"
            placeholder="One title, one line — we&rsquo;ll pin it on the wall."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={120}
            disabled={submitting}
          />
          <button
            type="submit"
            className="bl-wall-submit"
            disabled={!input.trim() || submitting}
          >
            Pin it <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>

      <footer className="bl-wall-foot">
        <button type="button" className="bl-wall-cta" onClick={onReader}>
          Read the journal <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="bl-wall-cta-ghost" onClick={onWriter}>
          Submit your own writing <span aria-hidden="true">→</span>
        </button>
      </footer>
    </section>
  );
}

function toFauxManuscript(tile: WallTile): Manuscript {
  if (tile.manuscript) return tile.manuscript;
  const c = tile.custom!;
  return {
    id: tile.id,
    title: c.title,
    author: c.author,
    coverHue: c.coverHue,
    genre: 'Reader pick',
    firstLine: '',
    paragraph: '',
    pitch: '',
    mood: [],
  };
}

const STYLES = `
.bl-wall {
  position: relative;
  padding: clamp(90px, 12vh, 130px) clamp(24px, 5vw, 80px);
  background: var(--bl-surface);
  color: var(--bl-ink);
  overflow: hidden;
}
.bl-wall::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 10% 0%, var(--bl-accent-soft) 0%, transparent 40%),
    radial-gradient(circle at 95% 100%, var(--bl-accent-soft) 0%, transparent 38%);
  opacity: 0.7;
  pointer-events: none;
}
.bl-wall-head, .bl-wall-grid, .bl-wall-form, .bl-wall-foot, .bl-wall-mobile-quote {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
}
.bl-wall-head {
  text-align: center;
  margin-bottom: clamp(28px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.bl-wall-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
}
.bl-wall-title {
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
.bl-wall-title em {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  color: var(--bl-accent);
}
.bl-wall-lede {
  margin: 0;
  font-family: var(--bl-font-body);
  font-size: 15px;
  color: var(--bl-ink-muted);
  max-width: 48ch;
}

.bl-wall-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: clamp(16px, 2.4vw, 28px);
  padding: clamp(8px, 1vw, 16px) 0;
}
.bl-wall-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: 0;
  padding: 6px;
  cursor: pointer;
  font: inherit;
  color: inherit;
  transition: transform 320ms cubic-bezier(.22, 1, .36, 1);
  outline: none;
}
.bl-wall-tile:hover, .bl-wall-tile:focus-visible {
  transform: translateY(-4px) rotate(0deg) !important;
  z-index: 5;
}
.bl-wall-tile.is-fresh {
  animation: bl-wall-fresh 720ms cubic-bezier(.22, 1, .36, 1);
}
@keyframes bl-wall-fresh {
  0% { opacity: 0; transform: translateY(-30px) rotate(-8deg) scale(.85); }
  60% { opacity: 1; transform: translateY(4px) rotate(2deg) scale(1.02); }
  100% { transform: rotate(0deg) scale(1); }
}
.bl-wall-tile-rank {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-accent);
  font-variant-numeric: tabular-nums;
}

.bl-wall-bubble {
  position: absolute;
  bottom: calc(100% - 10px);
  left: 50%;
  transform: translate(-50%, 10px);
  width: 220px;
  background: var(--bl-ink);
  color: var(--bl-surface);
  padding: 10px 12px;
  border-radius: 10px;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 13px;
  line-height: 1.45;
  text-align: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 220ms ease, transform 240ms cubic-bezier(.22, 1, .36, 1);
  z-index: 6;
  box-shadow: 0 12px 24px rgba(14,14,12,0.16);
}
.bl-wall-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--bl-ink);
}
.bl-wall-bubble.is-on {
  opacity: 1;
  transform: translate(-50%, 0);
}
.bl-wall-bubble-text { display: block; }
.bl-wall-bubble-attr {
  display: block;
  margin-top: 6px;
  font-family: var(--bl-font-eyebrow);
  font-style: normal;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.7;
}

.bl-wall-mobile-quote {
  display: none;
  margin-top: 16px;
  padding: 14px 16px;
  background: var(--bl-paper-bg, rgba(14,14,12,0.04));
  border-radius: 12px;
  text-align: center;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 14px;
  color: var(--bl-ink);
  min-height: 56px;
}
.bl-wall-mobile-quote-attr {
  display: block;
  margin-top: 4px;
  font-family: var(--bl-font-eyebrow);
  font-style: normal;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-wall-mobile-quote-hint { color: var(--bl-ink-muted); font-style: italic; }

.bl-wall-form {
  margin-top: clamp(40px, 5vw, 64px);
  padding: clamp(20px, 2.4vw, 32px);
  background: rgba(14,14,12,0.04);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
}
.bl-wall-form-label {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  font-size: clamp(20px, 2.4vw, 28px);
  line-height: 1.15;
  color: var(--bl-ink);
  text-align: center;
  margin: 0 0 6px;
}
.bl-wall-form-row {
  display: flex;
  gap: 12px;
  align-items: stretch;
}
.bl-wall-input {
  flex: 1;
  appearance: none;
  border: 1.5px solid rgba(14,14,12,0.2);
  background: var(--bl-surface);
  border-radius: 999px;
  padding: 14px 22px;
  font-family: var(--bl-font-body);
  font-size: 15px;
  color: var(--bl-ink);
  transition: border-color 200ms ease;
}
.bl-wall-input:focus { border-color: var(--bl-accent); outline: none; }
.bl-wall-submit {
  appearance: none;
  border: 0;
  background: var(--bl-ink);
  color: var(--bl-surface);
  border-radius: 999px;
  padding: 14px 22px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.bl-wall-submit:hover:not(:disabled) { background: var(--bl-accent); transform: translateY(-1px); }
.bl-wall-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.bl-wall-foot {
  margin-top: clamp(32px, 4vw, 48px);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.bl-wall-cta {
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
.bl-wall-cta:hover { background: var(--bl-accent-strong); transform: translateY(-1px); }
.bl-wall-cta-ghost {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--bl-ink);
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 8px 4px;
  position: relative;
}
.bl-wall-cta-ghost::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 22px;
  bottom: 4px;
  height: 1px;
  background: currentColor;
  opacity: 0.45;
}
.bl-wall-cta-ghost:hover { color: var(--bl-accent); }

@media (max-width: 980px) {
  .bl-wall-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 640px) {
  .bl-wall-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .bl-wall-bubble { display: none; }
  .bl-wall-mobile-quote { display: block; }
  .bl-wall-form-row { flex-direction: column; }
  .bl-wall-submit { justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  .bl-wall-tile.is-fresh { animation: none; }
  .bl-wall-tile, .bl-wall-bubble { transition: none; }
}
`;
