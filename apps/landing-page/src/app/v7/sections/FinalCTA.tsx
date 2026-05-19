'use client';

import type { Region } from '../../v6/InlineQuestions';
import { useInView } from '../../v6/sections/useInView';

const STYLES = `
.v7-final {
  position: relative;
  background: var(--bl-dark-bg);
  color: var(--bl-dark-fg);
  padding: clamp(120px, 18vh, 200px) clamp(24px, 5vw, 80px) clamp(96px, 14vh, 160px);
  overflow: hidden;
}
.v7-final::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(216,144,96,0.07) 0%, transparent 40%),
    radial-gradient(circle at 82% 70%, rgba(139,36,56,0.10) 0%, transparent 45%);
  pointer-events: none;
}
.v7-final-inner {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
}
.v7-final-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: var(--bl-dark-accent);
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 56px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 700ms ease, transform 700ms cubic-bezier(.22,1,.36,1);
}
.v7-final-eyebrow.is-in { opacity: 1; transform: none; }
.v7-final-eyebrow .v7-final-roman {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 22px;
  letter-spacing: 0;
  text-transform: none;
  color: var(--bl-dark-fg);
}
.v7-final-eyebrow .v7-final-rule {
  flex: 1;
  height: 1px;
  background: rgba(240,233,217,0.16);
  max-width: 200px;
}

.v7-final-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  position: relative;
  border-top: 1px solid rgba(240,233,217,0.16);
}
.v7-final-grid::before {
  content: '';
  position: absolute;
  top: 12%; bottom: 12%;
  left: 50%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(240,233,217,0.22), transparent);
}
@media (max-width: 800px) {
  .v7-final-grid { grid-template-columns: 1fr; }
  .v7-final-grid::before { display: none; }
}

.v7-final-door {
  appearance: none;
  background: none;
  border: 0;
  padding: clamp(48px, 7vh, 88px) clamp(28px, 4vw, 56px) clamp(56px, 8vh, 96px);
  text-align: left;
  color: inherit;
  font: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 28px;
  position: relative;
  transition: background 320ms ease;
  opacity: 0;
  transform: translateY(20px);
  border-bottom: 1px solid transparent;
}
.v7-final-door.is-in { opacity: 1; transform: none; transition: opacity 800ms ease, transform 800ms cubic-bezier(.22,1,.36,1), background 320ms ease; }
.v7-final-door.is-in.delay { transition-delay: 140ms; }
.v7-final-door:hover {
  background: rgba(240,233,217,0.03);
}
.v7-final-door::after {
  content: '';
  position: absolute;
  left: clamp(28px, 4vw, 56px);
  right: clamp(28px, 4vw, 56px);
  bottom: clamp(24px, 4vh, 56px);
  height: 1px;
  background: var(--bl-dark-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 480ms cubic-bezier(.22,1,.36,1);
}
.v7-final-door:hover::after { transform: scaleX(1); }
.v7-final-door-eye {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: var(--bl-dark-accent);
}
.v7-final-door-title {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-weight: 400;
  font-style: italic;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.015em;
  color: var(--bl-dark-fg);
  margin: 0;
  max-width: 18ch;
}
.v7-final-door-cta {
  margin-top: auto;
  display: inline-flex;
  align-items: baseline;
  gap: 12px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bl-dark-fg);
}
.v7-final-door-cta::after {
  content: '→';
  font-size: 18px;
  transition: transform 280ms cubic-bezier(.22,1,.36,1);
}
.v7-final-door:hover .v7-final-door-cta::after { transform: translateX(6px); }

.v7-final-both {
  margin-top: 56px;
  text-align: center;
  border-top: 1px solid rgba(240,233,217,0.16);
  padding-top: 36px;
}
.v7-final-both-link {
  appearance: none;
  background: none;
  border: 0;
  padding: 8px 14px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(240,233,217,0.66);
  cursor: pointer;
  position: relative;
  transition: color 220ms ease;
}
.v7-final-both-link::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 4px;
  height: 1px;
  background: var(--bl-dark-accent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 360ms cubic-bezier(.22,1,.36,1);
}
.v7-final-both-link:hover { color: var(--bl-dark-fg); }
.v7-final-both-link:hover::after { transform: scaleX(1); }
.v7-final-colophon {
  margin-top: clamp(64px, 8vh, 96px);
  text-align: center;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 14px;
  color: rgba(240, 233, 217, 0.5);
  letter-spacing: 0.04em;
}
`;

export default function FinalCTA({ onOpenRegion }: { onOpenRegion: (r: Region) => void }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.18);
  return (
    <section className="v7-final" aria-label="Open Issue №01">
      <style>{STYLES}</style>
      <div className="v7-final-inner" ref={ref}>
        <div className={`v7-final-eyebrow${inView ? ' is-in' : ''}`}>
          <span className="v7-final-roman">VII.</span>
          <span>Open the issue</span>
          <span className="v7-final-rule" />
        </div>

        <div className="v7-final-grid">
          <button
            type="button"
            className={`v7-final-door${inView ? ' is-in' : ''}`}
            onClick={() => onOpenRegion('reader')}
          >
            <span className="v7-final-door-eye">For readers</span>
            <h3 className="v7-final-door-title">Read what hasn’t been published.</h3>
            <span className="v7-final-door-cta">Open as a reader</span>
          </button>
          <button
            type="button"
            className={`v7-final-door delay${inView ? ' is-in' : ''}`}
            onClick={() => onOpenRegion('author')}
          >
            <span className="v7-final-door-eye">For writers</span>
            <h3 className="v7-final-door-title">Be read before you’re published.</h3>
            <span className="v7-final-door-cta">Submit a draft</span>
          </button>
        </div>

        <div className="v7-final-both">
          <button
            type="button"
            className="v7-final-both-link"
            onClick={() => onOpenRegion('both')}
          >
            Or open the whole issue — both →
          </button>
        </div>

        <p className="v7-final-colophon">
          Issue №01 · Editors: ◼◼◼ ◼◼◼, ◼◼◼ ◼◼◼ · Set in Fraunces &amp; Bricolage Grotesque · Printed on the internet, monthly.
        </p>
      </div>
    </section>
  );
}
