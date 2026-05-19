'use client';

import { WrappedCover, type WrappedBook } from '../components/WrappedCover';
import { useInView } from '../../v6/sections/useInView';

const BOOKS: WrappedBook[] = [
  {
    id: 'b1',
    genre: 'Literary thriller',
    firstLine:
      'When the file finally opened, her own name was the first thing she saw.',
    authorRedacted: 'Marcus Osei',
    dropDate: '14.06',
    coverGradient: 'linear-gradient(160deg, #2E3D52 0%, #6B2638 100%)',
  },
  {
    id: 'b2',
    genre: 'Literary fiction',
    firstLine:
      'The morning her mother stopped speaking, the dishes did not break.',
    authorRedacted: 'Iona Hollis',
    dropDate: '14.06',
    coverGradient: 'linear-gradient(155deg, #C9A876 0%, #6B4A2E 100%)',
  },
  {
    id: 'b3',
    genre: 'Speculative',
    firstLine:
      'By the time we noticed the second moon, it had been there for nineteen days.',
    authorRedacted: 'Daniyar Volkov',
    dropDate: '14.06',
    coverGradient: 'linear-gradient(170deg, #1F3145 0%, #0A1320 100%)',
  },
  {
    id: 'b4',
    genre: 'Memoir as fiction',
    firstLine:
      'The town I’m from doesn’t have a name; it has a population.',
    authorRedacted: 'Sara-Beth Lin',
    dropDate: '14.06',
    coverGradient: 'linear-gradient(150deg, #8B6F47 0%, #2E2A22 100%)',
  },
  {
    id: 'b5',
    genre: 'Horror',
    firstLine:
      'The house’s measurements changed every time the surveyor turned his back.',
    authorRedacted: 'Adelaide Vance',
    dropDate: '14.06',
    coverGradient: 'linear-gradient(165deg, #2A1F23 0%, #5C1A1F 100%)',
  },
  {
    id: 'b6',
    genre: 'Romance, literary',
    firstLine:
      'I knew his voice before I’d met him, because we shared a wall in 1994 and ten thousand miles in 2026.',
    authorRedacted: 'Tomás Renard',
    dropDate: '14.06',
    coverGradient: 'linear-gradient(155deg, #B25C56 0%, #3D2230 100%)',
  },
];

const STYLES = `
.v7-drop {
  position: relative;
  background: var(--bl-paper-warm);
  color: var(--bl-ink);
  padding: clamp(96px, 14vh, 160px) clamp(24px, 5vw, 80px) clamp(96px, 12vh, 140px);
}
.v7-drop-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.v7-drop-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 6vw, 80px);
  align-items: flex-end;
  margin-bottom: clamp(48px, 8vh, 88px);
}
@media (max-width: 800px) {
  .v7-drop-head { grid-template-columns: 1fr; gap: 28px; }
}
.v7-drop-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: var(--bl-accent);
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}
.v7-drop-eyebrow .v7-drop-roman {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 22px;
  letter-spacing: 0;
  text-transform: none;
  color: var(--bl-ink);
  transform: translateY(-1px);
}
.v7-drop-eyebrow .v7-drop-rule {
  flex: 1;
  height: 1px;
  background: var(--bl-divider);
  max-width: 140px;
}
.v7-drop-title {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-weight: 500;
  font-size: clamp(40px, 5.4vw, 76px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--bl-ink);
  margin: 0;
}
.v7-drop-title em {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
}
.v7-drop-body {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(16px, 1.15vw, 18px);
  line-height: 1.6;
  color: var(--bl-wash);
  max-width: 44ch;
  margin: 0;
}
.v7-drop-body strong {
  font-weight: 600;
  color: var(--bl-ink);
}
.v7-drop-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(20px, 3vw, 36px);
}
@media (max-width: 1000px) {
  .v7-drop-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .v7-drop-grid { grid-template-columns: 1fr; gap: 18px; }
}

/* Wrapped cover styles */
.v7-wrap {
  position: relative;
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  aspect-ratio: 5 / 7;
  text-align: left;
  color: inherit;
  font: inherit;
  display: block;
  overflow: visible;
  transition: transform 360ms cubic-bezier(.22,1,.36,1);
}
.v7-wrap:hover { transform: translateY(-4px); }
.v7-wrap:focus-visible { outline: none; }
.v7-wrap:focus-visible .v7-wrap-paper { box-shadow: 0 0 0 3px var(--bl-accent), 0 18px 36px rgba(60,40,18,0.22); }
.v7-wrap-cover {
  position: absolute;
  inset: 8px 0 0 8px;
  background: var(--bl-kraft);
  box-shadow: 0 14px 30px rgba(40,28,12,0.28);
}
.v7-wrap-paper {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(45deg, rgba(157, 126, 74, 0.05) 0 2px, transparent 2px 6px),
    linear-gradient(160deg, var(--bl-kraft) 0%, var(--bl-kraft-deep) 100%);
  box-shadow: 0 18px 36px rgba(60,40,18,0.22), inset 0 0 60px rgba(60,40,18,0.18);
  transform-origin: 50% 100%;
  transition: transform 420ms cubic-bezier(.22,1,.36,1);
  overflow: hidden;
}
.v7-wrap-paper::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' seed='5' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.16;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.v7-wrap:hover .v7-wrap-paper {
  transform: rotate(-1.4deg) translate(-6px, 4px);
}
.v7-wrap-twine {
  position: absolute;
  background: rgba(60, 40, 18, 0.55);
  box-shadow: 0 1px 1px rgba(255,255,255,0.18);
}
.v7-wrap-twine-v {
  top: 0; bottom: 0;
  left: 38%;
  width: 2px;
}
.v7-wrap-twine-h {
  left: 0; right: 0;
  top: 58%;
  height: 2px;
}
.v7-wrap-knot {
  position: absolute;
  left: 38%;
  top: 58%;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: rgba(40, 26, 12, 0.78);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 6px rgba(0,0,0,0.3);
}
.v7-wrap-content {
  position: absolute;
  inset: 0;
  padding: 18px 20px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #F5EBD6;
  z-index: 2;
  pointer-events: none;
}
.v7-wrap-genre {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #F5EBD6;
  background: rgba(15,13,10,0.42);
  padding: 5px 9px;
  align-self: flex-start;
  border-radius: 2px;
  backdrop-filter: blur(2px);
}
.v7-wrap-line {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(14px, 1.05vw, 17px);
  line-height: 1.35;
  color: #F5EBD6;
  margin-top: auto;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
  max-width: 28ch;
}
.v7-wrap-meta {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(245, 235, 214, 0.82);
}
.v7-wrap-by-redact {
  display: inline-block;
  background: var(--bl-redaction);
  color: transparent;
  padding: 0 2px;
  margin-left: 4px;
  border-radius: 1px;
  user-select: none;
}
.v7-wrap-no {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0;
  text-transform: none;
  opacity: 0.78;
}
.v7-wrap-tag {
  position: absolute;
  top: -14px;
  right: 18px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}
.v7-wrap-tag-string {
  width: 1px;
  height: 18px;
  background: rgba(60, 40, 18, 0.5);
}
.v7-wrap-tag-card {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: var(--bl-paper);
  color: var(--bl-ink);
  padding: 4px 8px;
  border: 1px solid var(--bl-divider);
  border-radius: 2px;
  transform: rotate(2deg);
  white-space: nowrap;
  box-shadow: 0 4px 8px rgba(60,40,18,0.18);
}
.v7-wrap:hover .v7-wrap-tag-card { transform: rotate(-1deg); }

.v7-drop-foot {
  margin-top: clamp(48px, 8vh, 80px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
  padding-top: 28px;
  border-top: 1px solid var(--bl-divider);
}
.v7-drop-foot-note {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(16px, 1.4vw, 22px);
  color: var(--bl-wash);
  max-width: 56ch;
  margin: 0;
}
.v7-drop-foot-cta {
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-accent);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.v7-drop-foot-cta::after {
  content: '→';
  transition: transform 220ms cubic-bezier(.22,1,.36,1);
}
.v7-drop-foot-cta:hover::after { transform: translateX(4px); }
`;

export default function TheDrop({ onRevealBook }: { onRevealBook: (bookId: string) => void }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.18);
  return (
    <section className="v7-drop" aria-label="The Drop, Issue №01">
      <style>{STYLES}</style>
      <div className="v7-drop-inner" ref={ref}>
        <header className="v7-drop-head">
          <div>
            <div className="v7-drop-eyebrow">
              <span className="v7-drop-roman">III.</span>
              <span>The Drop</span>
              <span className="v7-drop-rule" />
            </div>
            <h2 className="v7-drop-title">
              Six manuscripts.
              <br />
              <em>None of them, yet, are books.</em>
            </h2>
          </div>
          <p className="v7-drop-body">
            <strong>Three months of reader notes</strong> will decide which two reach a
            publisher. The rest get returned to their authors with everything you wrote in
            the margins. The wrappers come off when you do.
          </p>
        </header>

        <div className="v7-drop-grid" style={{ opacity: inView ? 1 : 0, transition: 'opacity 700ms ease' }}>
          {BOOKS.map((b, i) => (
            <WrappedCover key={b.id} book={b} index={i} onClick={() => onRevealBook(b.id)} />
          ))}
        </div>

        <div className="v7-drop-foot">
          <p className="v7-drop-foot-note">
            Issue №00 returned 14 manuscripts to their authors with 2,431 margin notes.
            Two of them are with publishers now.
          </p>
          <button type="button" className="v7-drop-foot-cta" onClick={() => onRevealBook('outcomes')}>
            See Issue №00 outcomes
          </button>
        </div>
      </div>
    </section>
  );
}
