'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CARD_PALETTE,
  MOOD_LABELS,
  MOOD_ORDER,
  MOOD_TO_QUOTE,
  PILL_BG,
  QUOTES,
  SEED_PICKS,
  filterByAudience,
  type Mood,
  type ReaderPick,
} from './quotes';

type Props = { onReader: () => void; onWriter: () => void };

type AudienceKey = 'all' | 'young';

const AUTOPLAY_MS = 6000;

export default function OpenCallV7({ onReader, onWriter }: Props) {
  const [audience, setAudience] = useState<AudienceKey>('all');
  const visibleQuotes = useMemo(() => filterByAudience(audience === 'young'), [audience]);

  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(false);
  const [activeMood, setActiveMood] = useState<Mood | null>(null);

  const [picks, setPicks] = useState<ReaderPick[]>(SEED_PICKS);
  const [draftOpen, setDraftOpen] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [draftAuthor, setDraftAuthor] = useState('');
  const [draftSource, setDraftSource] = useState('');
  const [toast, setToast] = useState<'idle' | 'shown'>('idle');

  const cardRef = useRef<HTMLDivElement>(null);
  const lastTickRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Clamp idx when audience filter shrinks the list.
  useEffect(() => {
    if (idx >= visibleQuotes.length) setIdx(0);
  }, [visibleQuotes.length, idx]);

  const goTo = useCallback(
    (next: number) => {
      const target = ((next % visibleQuotes.length) + visibleQuotes.length) % visibleQuotes.length;
      setFade(true);
      setTimeout(() => {
        setIdx(target);
        setFade(false);
      }, 180);
      elapsedRef.current = 0;
      lastTickRef.current = null;
      setProgress(0);
    },
    [visibleQuotes.length]
  );

  // Autoplay loop
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
        setIdx((i) => (i + 1) % visibleQuotes.length);
        setProgress(0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [paused, visibleQuotes.length]);

  // Auto-resume autoplay 10s after a manual pause (mood click / draft open).
  useEffect(() => {
    if (!paused) return;
    if (draftOpen) return;
    const t = setTimeout(() => setPaused(false), 10000);
    return () => clearTimeout(t);
  }, [paused, draftOpen]);

  const currentQuote = visibleQuotes[idx] ?? visibleQuotes[0];
  const palette = CARD_PALETTE[idx % CARD_PALETTE.length];
  const pillPalette = PILL_BG[currentQuote.category];

  const handleMood = (mood: Mood) => {
    setActiveMood(mood);
    const targetIdx = MOOD_TO_QUOTE[mood];
    // Snap to the mood quote if it's in the visible set; otherwise switch audience to 'all' first.
    if (audience === 'young') setAudience('all');
    setFade(true);
    setTimeout(() => {
      setIdx(targetIdx);
      setFade(false);
    }, 180);
    setPaused(true);
    elapsedRef.current = 0;
    setProgress(0);
  };

  const submitPick = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draftText.trim();
    if (!text) return;
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `pick-${Date.now()}`;
    const pick: ReaderPick = {
      id,
      quote: text,
      author: draftAuthor.trim() || 'Unknown',
      source: draftSource.trim() || undefined,
      reader: 'You',
      readerSlug: 'you',
      readerType: 'reader',
    };
    setPicks((prev) => [pick, ...prev].slice(0, 6));
    setDraftText('');
    setDraftAuthor('');
    setDraftSource('');
    setDraftOpen(false);
    setToast('shown');
    setTimeout(() => setToast('idle'), 6000);
  };

  return (
    <section
      className="bl-betweenchars"
      aria-label="Words that stayed with us"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!draftOpen) setPaused(false);
      }}
    >
      <style>{STYLES}</style>

      <div className="bl-betweenchars-paper" aria-hidden="true" />

      <div className="bl-betweenchars-inner">
        <header className="bl-betweenchars-head">
          <span className="bl-betweenchars-eyebrow">
            BetweenCharacters · {QUOTES.length} quotes · 38 readers
          </span>
          <div className="bl-betweenchars-tabs" role="tablist" aria-label="Audience">
            <button
              type="button"
              role="tab"
              aria-selected={audience === 'all'}
              className={`bl-betweenchars-tab${audience === 'all' ? ' is-active' : ''}`}
              onClick={() => {
                setAudience('all');
                setIdx(0);
              }}
            >
              All quotes
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={audience === 'young'}
              className={`bl-betweenchars-tab${audience === 'young' ? ' is-active' : ''}`}
              onClick={() => {
                setAudience('young');
                setIdx(0);
              }}
            >
              Young readers
            </button>
          </div>
        </header>

        <div
          ref={cardRef}
          className={`bl-betweenchars-card${fade ? ' is-fading' : ''}`}
          style={{
            background: palette.bg,
            borderColor: palette.border,
          }}
        >
          <div className="bl-betweenchars-card-top">
            <span className="bl-betweenchars-mark" aria-hidden="true">“</span>
            <span
              className="bl-betweenchars-pill"
              style={{ background: pillPalette.bg, color: pillPalette.color }}
            >
              {currentQuote.pill}
            </span>
            <p className="bl-betweenchars-quote">{currentQuote.text}</p>
          </div>
          <div className="bl-betweenchars-card-bottom">
            <div className="bl-betweenchars-attr">
              <span className="bl-betweenchars-author">— {currentQuote.author}</span>
              {currentQuote.source && (
                <span className="bl-betweenchars-source">{currentQuote.source}</span>
              )}
            </div>
            <div className="bl-betweenchars-progress" aria-hidden="true">
              <div
                className="bl-betweenchars-progress-bar"
                style={{ width: `${paused ? 0 : progress}%` }}
              />
            </div>
            <div className="bl-betweenchars-controls">
              <div className="bl-betweenchars-dots" role="tablist" aria-label="Quote">
                {visibleQuotes.slice(0, Math.min(visibleQuotes.length, 18)).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`bl-betweenchars-dot${i === idx ? ' is-active' : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Quote ${i + 1}`}
                  />
                ))}
              </div>
              <div className="bl-betweenchars-nav">
                <span className="bl-betweenchars-counter">
                  {idx + 1} / {visibleQuotes.length}
                </span>
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
          </div>
        </div>

        <div className="bl-betweenchars-mood">
          <span className="bl-betweenchars-mood-label">How are you feeling?</span>
          <div className="bl-betweenchars-mood-row">
            {MOOD_ORDER.map((mood) => (
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
          <div className="bl-betweenchars-picks-head">
            <span className="bl-betweenchars-picks-label">Pinned by readers</span>
            <span className="bl-betweenchars-picks-meta">
              {picks.length} {picks.length === 1 ? 'pick' : 'picks'}
            </span>
          </div>
          <div className="bl-betweenchars-picks-grid">
            {picks.slice(0, 3).map((p) => (
              <article key={p.id} className="bl-betweenchars-pick">
                <span className="bl-betweenchars-pick-badge">{p.reader}’s pick</span>
                <p className="bl-betweenchars-pick-quote">“{p.quote}”</p>
                <div className="bl-betweenchars-pick-meta">
                  <strong>{p.author}</strong>
                  {p.source && <span> · {p.source}</span>}
                </div>
              </article>
            ))}
            {!draftOpen ? (
              <button
                type="button"
                className="bl-betweenchars-pick bl-betweenchars-pick-add"
                onClick={() => {
                  setDraftOpen(true);
                  setPaused(true);
                }}
              >
                <span className="bl-betweenchars-pick-add-glyph" aria-hidden="true">＋</span>
                <span className="bl-betweenchars-pick-add-label">Add yours</span>
                <span className="bl-betweenchars-pick-add-sub">A quote that stayed with you.</span>
              </button>
            ) : (
              <form
                className="bl-betweenchars-pick bl-betweenchars-pick-form"
                onSubmit={submitPick}
              >
                <textarea
                  className="bl-betweenchars-input"
                  placeholder="Type a quote that stayed with you…"
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  maxLength={240}
                  rows={2}
                  autoFocus
                />
                <div className="bl-betweenchars-input-row">
                  <input
                    type="text"
                    className="bl-betweenchars-input-line"
                    placeholder="Author or character"
                    value={draftAuthor}
                    onChange={(e) => setDraftAuthor(e.target.value)}
                    maxLength={80}
                  />
                  <input
                    type="text"
                    className="bl-betweenchars-input-line"
                    placeholder="Source"
                    value={draftSource}
                    onChange={(e) => setDraftSource(e.target.value)}
                    maxLength={80}
                  />
                </div>
                <div className="bl-betweenchars-form-actions">
                  <button
                    type="button"
                    className="bl-betweenchars-form-cancel"
                    onClick={() => {
                      setDraftOpen(false);
                      setDraftText('');
                      setDraftAuthor('');
                      setDraftSource('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bl-betweenchars-form-submit"
                    disabled={!draftText.trim()}
                  >
                    Pin it <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            )}
          </div>
          {toast === 'shown' && (
            <div className="bl-betweenchars-toast" role="status">
              <span>Your quote is on the wall.</span>
              <button
                type="button"
                className="bl-betweenchars-toast-cta"
                onClick={onWriter}
              >
                Save it to your shelf — join the waitlist <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>

        <footer className="bl-betweenchars-foot">
          <button type="button" className="bl-betweenchars-cta" onClick={onReader}>
            Read more in the journal <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="bl-betweenchars-cta-ghost" onClick={onWriter}>
            Submit your own writing <span aria-hidden="true">→</span>
          </button>
        </footer>
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
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 2.4vw, 28px);
}

.bl-betweenchars-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.bl-betweenchars-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-accent);
  font-variant-numeric: tabular-nums;
}
.bl-betweenchars-tabs {
  display: inline-flex;
  border: 0.5px solid rgba(14,14,12,0.18);
  border-radius: 999px;
  overflow: hidden;
  background: var(--bl-surface);
}
.bl-betweenchars-tab {
  appearance: none;
  border: 0;
  background: transparent;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
  padding: 8px 14px;
  cursor: pointer;
  transition: background 180ms ease, color 180ms ease;
}
.bl-betweenchars-tab:hover { color: var(--bl-ink); }
.bl-betweenchars-tab.is-active {
  background: var(--bl-ink);
  color: var(--bl-surface);
}

.bl-betweenchars-card {
  position: relative;
  border-radius: 16px;
  border: 0.5px solid rgba(14,14,12,0.14);
  padding: clamp(24px, 3vw, 36px) clamp(28px, 3.6vw, 44px);
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  transition: opacity 220ms ease, background 600ms ease, border-color 600ms ease;
}
.bl-betweenchars-card.is-fading { opacity: 0; }
.bl-betweenchars-card-top { display: flex; flex-direction: column; gap: 8px; }
.bl-betweenchars-mark {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 52px;
  line-height: 1;
  color: rgba(14,14,12,0.25);
  margin-bottom: -10px;
}
.bl-betweenchars-pill {
  align-self: flex-start;
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 999px;
}
.bl-betweenchars-quote {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(18px, 1.9vw, 23px);
  line-height: 1.55;
  color: var(--bl-ink);
  text-wrap: pretty;
}

.bl-betweenchars-card-bottom { display: flex; flex-direction: column; gap: 10px; }
.bl-betweenchars-attr {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
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
  height: 2px;
  background: rgba(14,14,12,0.08);
  border-radius: 2px;
  overflow: hidden;
}
.bl-betweenchars-progress-bar {
  height: 100%;
  background: var(--bl-ink);
  border-radius: 2px;
  transition: width 80ms linear;
}
.bl-betweenchars-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.bl-betweenchars-dots {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}
.bl-betweenchars-dot {
  appearance: none;
  border: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(14,14,12,0.2);
  padding: 0;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;
}
.bl-betweenchars-dot.is-active {
  background: var(--bl-ink);
  transform: scale(1.3);
}
.bl-betweenchars-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bl-betweenchars-counter {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--bl-ink-muted);
  font-variant-numeric: tabular-nums;
}
.bl-betweenchars-nav-btn {
  appearance: none;
  border: 0.5px solid rgba(14,14,12,0.18);
  background: var(--bl-surface);
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
  border-color: rgba(14,14,12,0.32);
}

.bl-betweenchars-mood { display: flex; flex-direction: column; gap: 10px; }
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
  gap: 6px;
}
.bl-betweenchars-mood-btn {
  appearance: none;
  border: 0.5px solid rgba(14,14,12,0.18);
  background: var(--bl-surface);
  border-radius: 999px;
  padding: 6px 12px;
  font-family: var(--bl-font-body);
  font-size: 12px;
  color: var(--bl-ink);
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
  white-space: nowrap;
}
.bl-betweenchars-mood-btn:hover { border-color: rgba(14,14,12,0.32); }
.bl-betweenchars-mood-btn.is-active {
  background: var(--bl-ink);
  color: var(--bl-surface);
  border-color: var(--bl-ink);
}

.bl-betweenchars-picks { display: flex; flex-direction: column; gap: 10px; }
.bl-betweenchars-picks-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.bl-betweenchars-picks-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-betweenchars-picks-meta {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  color: var(--bl-ink-muted);
  font-variant-numeric: tabular-nums;
}
.bl-betweenchars-picks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  align-items: stretch;
}
.bl-betweenchars-pick {
  background: var(--bl-surface);
  border: 0.5px solid rgba(14,14,12,0.14);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
  font: inherit;
  color: inherit;
  min-height: 130px;
}
.bl-betweenchars-pick-badge {
  align-self: flex-start;
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(14,14,12,0.06);
  color: var(--bl-ink);
}
.bl-betweenchars-pick-quote {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 13px;
  line-height: 1.5;
  color: var(--bl-ink);
}
.bl-betweenchars-pick-meta {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--bl-ink-muted);
}
.bl-betweenchars-pick-meta strong {
  color: var(--bl-ink);
  font-weight: 600;
  letter-spacing: 0.04em;
}

.bl-betweenchars-pick-add {
  cursor: pointer;
  border: 1px dashed rgba(14,14,12,0.32);
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
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
  max-width: 18ch;
}

.bl-betweenchars-pick-form {
  grid-column: span 2;
  border: 1px solid var(--bl-accent);
  background: var(--bl-surface);
  gap: 8px;
  min-height: 130px;
}
.bl-betweenchars-input {
  width: 100%;
  border: 0.5px solid rgba(14,14,12,0.16);
  border-radius: 8px;
  padding: 8px 10px;
  background: var(--bl-paper-bg, rgba(14,14,12,0.03));
  font-family: 'Fraunces', Georgia, serif;
  font-size: 13px;
  line-height: 1.45;
  color: var(--bl-ink);
  resize: none;
  outline: none;
  transition: border-color 200ms ease;
}
.bl-betweenchars-input:focus { border-color: var(--bl-accent); }
.bl-betweenchars-input-row {
  display: flex;
  gap: 6px;
}
.bl-betweenchars-input-line {
  flex: 1;
  appearance: none;
  border: 0.5px solid rgba(14,14,12,0.16);
  border-radius: 8px;
  padding: 6px 10px;
  background: var(--bl-paper-bg, rgba(14,14,12,0.03));
  font-family: var(--bl-font-body);
  font-size: 12px;
  color: var(--bl-ink);
  outline: none;
}
.bl-betweenchars-input-line:focus { border-color: var(--bl-accent); }
.bl-betweenchars-form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.bl-betweenchars-form-cancel {
  appearance: none;
  border: 0;
  background: transparent;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
  cursor: pointer;
}
.bl-betweenchars-form-cancel:hover { color: var(--bl-accent); }
.bl-betweenchars-form-submit {
  appearance: none;
  border: 0;
  background: var(--bl-ink);
  color: var(--bl-surface);
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 200ms ease;
}
.bl-betweenchars-form-submit:hover:not(:disabled) { background: var(--bl-accent); }
.bl-betweenchars-form-submit:disabled { opacity: 0.4; cursor: not-allowed; }

.bl-betweenchars-toast {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bl-accent-soft);
  border: 0.5px solid var(--bl-accent);
  border-radius: 12px;
  padding: 10px 14px;
  font-family: var(--bl-font-body);
  font-size: 13px;
  color: var(--bl-ink);
  animation: bl-betweenchars-toast 6000ms cubic-bezier(.22, 1, .36, 1);
}
@keyframes bl-betweenchars-toast {
  0% { opacity: 0; transform: translateY(6px); }
  6% { opacity: 1; transform: none; }
  88% { opacity: 1; }
  100% { opacity: 0; }
}
.bl-betweenchars-toast-cta {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--bl-accent);
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0;
}
.bl-betweenchars-toast-cta:hover { text-decoration: underline; }

.bl-betweenchars-foot {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 6px;
}
.bl-betweenchars-cta {
  appearance: none;
  border: 0;
  background: var(--bl-accent);
  color: #fff;
  padding: 12px 24px;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease;
}
.bl-betweenchars-cta:hover { background: var(--bl-accent-strong); transform: translateY(-1px); }
.bl-betweenchars-cta-ghost {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--bl-ink);
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 8px 4px;
  position: relative;
}
.bl-betweenchars-cta-ghost::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 22px;
  bottom: 4px;
  height: 1px;
  background: currentColor;
  opacity: 0.45;
}
.bl-betweenchars-cta-ghost:hover { color: var(--bl-accent); }

@media (max-width: 640px) {
  .bl-betweenchars-head { flex-direction: column; align-items: flex-start; gap: 10px; }
  .bl-betweenchars-picks-grid { grid-template-columns: 1fr; }
  .bl-betweenchars-pick-form { grid-column: span 1; }
  .bl-betweenchars-controls { flex-direction: column; align-items: stretch; gap: 8px; }
  .bl-betweenchars-nav { justify-content: space-between; }
}
@media (prefers-reduced-motion: reduce) {
  .bl-betweenchars-card, .bl-betweenchars-progress-bar { transition: none; }
  .bl-betweenchars-toast { animation: none; }
}
`;
