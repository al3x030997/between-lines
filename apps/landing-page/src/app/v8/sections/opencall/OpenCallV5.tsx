'use client';

import { useState } from 'react';
import { FEATURED_MARGIN } from './data';

type Props = { onReader: () => void; onWriter: () => void };

type Annotation = { idx: number; note: string; from: string };

const LINE_HEIGHT = 38; // px — matches the body line-height multiplier on .bl-margin-line

export default function OpenCallV5({ onReader, onWriter }: Props) {
  const { manuscript, sentences } = FEATURED_MARGIN;
  const [annotations, setAnnotations] = useState<Annotation[]>(FEATURED_MARGIN.annotations);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [draftIdx, setDraftIdx] = useState<number | null>(null);
  const [draftText, setDraftText] = useState('');

  const submitAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (draftIdx === null) return;
    const trimmed = draftText.trim();
    if (!trimmed) return;
    setAnnotations((prev) => [...prev, { idx: draftIdx, note: trimmed, from: 'You' }]);
    setDraftText('');
    setDraftIdx(null);
  };

  return (
    <section className="bl-margin" aria-label="Read in the margin">
      <style>{STYLES}</style>

      <header className="bl-margin-head">
        <span className="bl-margin-eyebrow">In the margin · Issue №01</span>
        <h2 className="bl-margin-title">
          Read the way readers read.<br />
          <em>Together.</em>
        </h2>
        <p className="bl-margin-lede">
          Hover a sentence. Hear what stopped someone else. Add your own.
        </p>
      </header>

      <div className="bl-margin-stage">
        <article className="bl-margin-page" aria-label="Manuscript excerpt with reader margin notes">
          <header className="bl-margin-page-head">
            <span className="bl-margin-page-num">Pg. 1</span>
            <span className="bl-margin-page-title">{manuscript.title}</span>
            <span className="bl-margin-page-author">— {manuscript.author}</span>
          </header>
          <div className="bl-margin-body">
            {sentences.map((s, idx) => {
              const linked = annotations.filter((a) => a.idx === idx);
              const isHover = hoveredIdx === idx;
              const isDraft = draftIdx === idx;
              return (
                <p
                  key={idx}
                  className={`bl-margin-line${linked.length ? ' has-note' : ''}${isHover ? ' is-hovered' : ''}${isDraft ? ' is-drafting' : ''}`}
                  data-idx={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx((h) => (h === idx ? null : h))}
                  onClick={() => setDraftIdx((d) => (d === idx ? null : idx))}
                >
                  <span className="bl-margin-line-text">{s}</span>
                  {linked.length > 0 && (
                    <span className="bl-margin-line-pip" aria-hidden="true">
                      {linked.length}
                    </span>
                  )}
                </p>
              );
            })}
          </div>
          <footer className="bl-margin-page-foot">
            <span className="bl-margin-page-foot-rule" />
            <span className="bl-margin-page-foot-text">
              Click a sentence to leave your own note in the margin.
            </span>
          </footer>
        </article>

        <aside className="bl-margin-side" aria-label="Reader annotations">
          {annotations.map((a, i) => {
            const isHover = hoveredIdx === a.idx;
            return (
              <div
                key={`${a.idx}-${i}`}
                className={`bl-margin-note${isHover ? ' is-lit' : ''}`}
                style={{ top: a.idx * LINE_HEIGHT + 'px' }}
                onMouseEnter={() => setHoveredIdx(a.idx)}
                onMouseLeave={() => setHoveredIdx((h) => (h === a.idx ? null : h))}
              >
                <span className="bl-margin-note-text">{a.note}</span>
                <span className="bl-margin-note-from">— {a.from}</span>
              </div>
            );
          })}
          {draftIdx !== null && (
            <form
              className="bl-margin-draft"
              style={{ top: draftIdx * LINE_HEIGHT + 'px' }}
              onSubmit={submitAnnotation}
            >
              <input
                type="text"
                className="bl-margin-draft-input"
                placeholder="Your note…"
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                maxLength={90}
                autoFocus
              />
              <button type="submit" className="bl-margin-draft-submit" disabled={!draftText.trim()}>
                Pin
              </button>
              <button
                type="button"
                className="bl-margin-draft-cancel"
                onClick={() => {
                  setDraftIdx(null);
                  setDraftText('');
                }}
                aria-label="Cancel"
              >
                ×
              </button>
            </form>
          )}
        </aside>
      </div>

      <div className="bl-margin-stack" aria-live="polite">
        <span className="bl-margin-stack-label">All notes</span>
        <ul className="bl-margin-stack-list">
          {annotations.map((a, i) => (
            <li key={`m-${i}`}>
              <span className="bl-margin-stack-quote">&ldquo;{a.note}&rdquo;</span>
              <span className="bl-margin-stack-from">— {a.from} on line {a.idx + 1}</span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="bl-margin-foot">
        <button type="button" className="bl-margin-cta" onClick={onReader}>
          Read this manuscript in full <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="bl-margin-cta-ghost" onClick={onWriter}>
          Become a margin annotator <span aria-hidden="true">→</span>
        </button>
      </footer>
    </section>
  );
}

const STYLES = `
.bl-margin {
  position: relative;
  padding: clamp(90px, 12vh, 130px) clamp(24px, 5vw, 80px);
  background: var(--bl-surface);
  color: var(--bl-ink);
  overflow: hidden;
}
.bl-margin-head {
  max-width: 720px;
  margin: 0 auto clamp(36px, 5vw, 56px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.bl-margin-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
}
.bl-margin-title {
  margin: 0;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(32px, 4.4vw, 56px);
  line-height: 1.04;
  letter-spacing: -0.035em;
  color: var(--bl-ink);
  text-wrap: balance;
}
.bl-margin-title em {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  color: var(--bl-accent);
}
.bl-margin-lede {
  margin: 0;
  font-family: var(--bl-font-body);
  font-size: 15px;
  color: var(--bl-ink-muted);
}

.bl-margin-stage {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 560px) minmax(0, 280px);
  gap: clamp(20px, 3vw, 40px);
  max-width: 980px;
  margin: 0 auto;
  align-items: start;
}

.bl-margin-page {
  position: relative;
  background:
    repeating-linear-gradient(180deg, transparent 0 36px, rgba(14,14,12,0.06) 36px 37px),
    var(--bl-paper-bg, #fbf6e9);
  border: 1px solid rgba(14,14,12,0.1);
  border-radius: 6px;
  padding: clamp(28px, 3.4vw, 44px) clamp(28px, 3.6vw, 48px) clamp(36px, 4vw, 56px);
  box-shadow: 0 18px 36px rgba(14,14,12,0.08);
}
.bl-margin-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/></svg>");
  opacity: 0.15;
  mix-blend-mode: multiply;
  pointer-events: none;
  border-radius: inherit;
}
.bl-margin-page-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 18px;
  margin-bottom: clamp(18px, 2vw, 28px);
  border-bottom: 1px solid rgba(14,14,12,0.16);
  position: relative;
  z-index: 1;
}
.bl-margin-page-num {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-accent);
  font-variant-numeric: tabular-nums;
}
.bl-margin-page-title {
  font-family: var(--bl-font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.005em;
  color: var(--bl-ink);
}
.bl-margin-page-author {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-margin-body { position: relative; z-index: 1; }
.bl-margin-line {
  position: relative;
  margin: 0;
  padding: 4px 8px 4px 4px;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: 18px;
  line-height: 38px;
  color: var(--bl-ink);
  cursor: pointer;
  border-radius: 4px;
  transition: background 220ms ease, color 220ms ease;
}
.bl-margin-line.has-note { color: var(--bl-ink); }
.bl-margin-line.is-hovered {
  background: var(--bl-accent-soft);
  color: var(--bl-ink);
}
.bl-margin-line.is-drafting {
  background: var(--bl-accent-soft);
  outline: 1px dashed var(--bl-accent);
  outline-offset: -1px;
}
.bl-margin-line-pip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-left: 6px;
  border-radius: 50%;
  background: var(--bl-accent);
  color: #fff;
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  vertical-align: 0.18em;
}

.bl-margin-page-foot {
  position: relative;
  z-index: 1;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bl-margin-page-foot-rule {
  width: 100%;
  height: 1px;
  background: rgba(14,14,12,0.16);
}
.bl-margin-page-foot-text {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 13px;
  color: var(--bl-ink-muted);
}

.bl-margin-side {
  position: relative;
  /* matches the page top padding so notes line up with sentences */
  padding-top: calc(clamp(28px, 3.4vw, 44px) + 18px + clamp(18px, 2vw, 28px));
  min-height: 480px;
}
.bl-margin-note {
  position: absolute;
  left: 0;
  right: 8px;
  padding: 6px 10px;
  background: transparent;
  font-family: 'Caveat', 'Kalam', 'Fraunces', cursive;
  font-style: italic;
  font-size: 17px;
  line-height: 1.25;
  color: var(--bl-ink-muted);
  border-left: 2px solid transparent;
  transition: color 220ms ease, border-color 220ms ease, transform 220ms ease;
  cursor: default;
}
.bl-margin-note.is-lit {
  color: var(--bl-accent);
  border-left-color: var(--bl-accent);
  transform: translateX(3px);
}
.bl-margin-note-from {
  display: block;
  margin-top: 2px;
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
  opacity: 0.8;
}

.bl-margin-draft {
  position: absolute;
  left: 0;
  right: 8px;
  padding: 6px 8px;
  background: var(--bl-surface);
  border: 1.5px solid var(--bl-accent);
  border-radius: 8px;
  display: flex;
  gap: 6px;
  align-items: center;
  box-shadow: 0 8px 20px rgba(14,14,12,0.1);
  z-index: 5;
}
.bl-margin-draft-input {
  flex: 1;
  appearance: none;
  border: 0;
  background: transparent;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 14px;
  color: var(--bl-ink);
  padding: 4px 2px;
}
.bl-margin-draft-input:focus { outline: none; }
.bl-margin-draft-submit {
  appearance: none;
  border: 0;
  background: var(--bl-accent);
  color: #fff;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
}
.bl-margin-draft-submit:disabled { opacity: 0.4; cursor: not-allowed; }
.bl-margin-draft-cancel {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--bl-ink-muted);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
}
.bl-margin-draft-cancel:hover { color: var(--bl-accent); }

.bl-margin-stack {
  display: none;
}
.bl-margin-stack-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-margin-stack-list {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bl-margin-stack-list li {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 14px;
  color: var(--bl-ink);
}
.bl-margin-stack-quote { display: block; }
.bl-margin-stack-from {
  display: block;
  margin-top: 2px;
  font-family: var(--bl-font-eyebrow);
  font-style: normal;
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}

.bl-margin-foot {
  margin-top: clamp(40px, 5vw, 64px);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}
.bl-margin-cta {
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
}
.bl-margin-cta:hover { background: var(--bl-accent-strong); transform: translateY(-1px); }
.bl-margin-cta-ghost {
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
.bl-margin-cta-ghost::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 22px;
  bottom: 4px;
  height: 1px;
  background: currentColor;
  opacity: 0.45;
}
.bl-margin-cta-ghost:hover { color: var(--bl-accent); }

@media (max-width: 760px) {
  .bl-margin-stage { grid-template-columns: 1fr; }
  .bl-margin-side { display: none; }
  .bl-margin-stack { display: block; max-width: 560px; margin: 28px auto 0; }
  .bl-margin-line-pip { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .bl-margin-line, .bl-margin-note { transition: none; }
}
`;
