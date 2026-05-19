'use client';

import { MarginNote } from '../components/MarginNote';
import { RedactedText } from '../components/RedactedText';
import { useInView } from '../../v6/sections/useInView';

const STYLES = `
.v7-passage {
  position: relative;
  background: var(--bl-paper);
  color: var(--bl-ink);
  padding: clamp(96px, 14vh, 160px) clamp(24px, 5vw, 80px) clamp(96px, 12vh, 140px);
  overflow: hidden;
}
.v7-passage::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--bl-divider) 18%, var(--bl-divider) 82%, transparent);
}
.v7-passage-inner {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
}
.v7-passage-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: var(--bl-accent);
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 48px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 700ms ease, transform 700ms cubic-bezier(.22,1,.36,1);
}
.v7-passage-eyebrow.is-in { opacity: 1; transform: none; }
.v7-passage-eyebrow .v7-passage-roman {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 22px;
  letter-spacing: 0;
  text-transform: none;
  color: var(--bl-ink);
  transform: translateY(-1px);
}
.v7-passage-eyebrow .v7-passage-rule {
  flex: 1;
  height: 1px;
  background: var(--bl-divider);
}
.v7-passage-quote {
  position: relative;
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 400;
  font-style: italic;
  font-size: clamp(20px, 2.2vw, 28px);
  line-height: 1.7;
  color: var(--bl-ink);
  letter-spacing: 0;
}
.v7-passage-quote::before {
  content: '"';
  position: absolute;
  left: -0.6em;
  top: -0.2em;
  font-size: 1.8em;
  color: var(--bl-accent);
  font-family: 'Fraunces', serif;
  font-style: normal;
}
.v7-passage-quote p {
  margin: 0 0 1em;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 900ms ease, transform 900ms cubic-bezier(.22,1,.36,1);
}
.v7-passage-quote.is-in p { opacity: 1; transform: none; }
.v7-passage-quote.is-in p:nth-child(2) { transition-delay: 120ms; }
.v7-passage-quote.is-in p:nth-child(3) { transition-delay: 240ms; }
.v7-passage-quote p:last-child {
  position: relative;
}
.v7-passage-fade {
  position: relative;
  margin-top: -2.4em;
  height: 4.2em;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(240,233,217,0) 0%, var(--bl-paper) 78%);
}
.v7-passage-edge {
  position: absolute;
  inset: auto 0 0 0;
  height: 18px;
  background:
    radial-gradient(ellipse at 12% 100%, rgba(0,0,0,0.06) 0%, transparent 60%),
    radial-gradient(ellipse at 88% 100%, rgba(0,0,0,0.06) 0%, transparent 60%);
}
.v7-passage-cite {
  margin-top: 32px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-wash);
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.v7-passage-cite-sep {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--bl-divider);
}
.v7-passage-cta {
  margin-top: 36px;
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(22px, 2.4vw, 30px);
  color: var(--bl-accent);
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: color 240ms ease, transform 240ms cubic-bezier(.22,1,.36,1);
}
.v7-passage-cta::before {
  content: '↳';
  font-style: normal;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 0.88em;
  color: var(--bl-accent);
  transform: translateY(-2px);
}
.v7-passage-cta:hover {
  color: var(--bl-ink);
  transform: translateX(4px);
}
.v7-passage-cta:hover::before { color: var(--bl-ink); }
.v7-passage-cta-tail {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-style: normal;
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-wash);
  margin-left: 14px;
  align-self: center;
}

.v7-passage-margin {
  position: absolute;
  top: 38%;
  right: -120px;
  max-width: 200px;
}
@media (max-width: 1100px) {
  .v7-passage-margin {
    position: relative;
    top: auto;
    right: auto;
    margin: 14px 0 0;
    display: inline-block;
  }
}
`;

const PARAGRAPHS = [
  'The morning her mother stopped speaking, the dishes did not break. They did not even rattle.',
  'The whole house held its breath, and inside that held breath — between the radiator’s third click and the kettle’s first whistle — my mother turned to glass.',
  'I learned later that glass is just sand that has been frightened into shape. I learned later that grief is too. But that morning, in the kitchen, with the kettle climbing toward its scream, I did not know any of that. I only knew that I could see through her, and that the light through her was the same color',
];

export default function SamplePassage({ onReveal }: { onReveal: () => void }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.22);
  return (
    <section className="v7-passage" aria-label="Sample passage from Issue №01">
      <style>{STYLES}</style>
      <div className="v7-passage-inner" ref={ref}>
        <div className={`v7-passage-eyebrow${inView ? ' is-in' : ''}`}>
          <span className="v7-passage-roman">II.</span>
          <span>An opening</span>
          <span className="v7-passage-rule" />
        </div>

        <blockquote className={`v7-passage-quote${inView ? ' is-in' : ''}`}>
          {PARAGRAPHS.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </blockquote>
        <div className="v7-passage-fade" aria-hidden="true" />

        <MarginNote rotate={-3.5} arrow="left" size="sm" className="v7-passage-margin">
          this is where<br />I knew
        </MarginNote>

        <div className="v7-passage-cite">
          <span>from</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, fontSize: 16, color: 'var(--bl-ink)' }}>
            &ldquo;Hollow Latitude&rdquo;
          </span>
          <span className="v7-passage-cite-sep" />
          <span>
            by <RedactedText text="Iona Hollis" inkClass="ink" />
          </span>
          <span className="v7-passage-cite-sep" />
          <span>drops 14.06</span>
        </div>

        <button className="v7-passage-cta" type="button" onClick={onReveal}>
          Get the rest of this chapter
          <span className="v7-passage-cta-tail">free · one email</span>
        </button>
      </div>
    </section>
  );
}
