'use client';

import { useInView } from '../../v6/sections/useInView';

type Note = {
  quote: string;
  attribution: string;
  attributionRedacted: string;
  rotate: number;
  position: { top: string; left?: string; right?: string };
  ink?: 'graphite' | 'blue' | 'red';
};

const NOTES: Note[] = [
  {
    quote: 'I underlined every page of chapter three. The author rewrote it.',
    attribution: 'reader 037, Issue №00',
    attributionRedacted: 'Mira Ngāti',
    rotate: -2.4,
    position: { top: '4%', left: '4%' },
    ink: 'graphite',
  },
  {
    quote: 'I got my first agent call three days after the drop closed.',
    attribution: 'author, Issue №00',
    attributionRedacted: 'Jasper Iyer',
    rotate: 3,
    position: { top: '8%', right: '6%' },
    ink: 'blue',
  },
  {
    quote:
      'It was the first time anyone read me before I tried to be published. I’d forgotten what that felt like.',
    attribution: 'writer, Issue №00',
    attributionRedacted: 'Hana Bekele',
    rotate: -1.2,
    position: { top: '42%', left: '14%' },
    ink: 'graphite',
  },
  {
    quote: 'I made a friend in someone else’s footnotes.',
    attribution: 'reader 211, Issue №00',
    attributionRedacted: 'Cyrus Voss',
    rotate: 2.6,
    position: { top: '46%', right: '12%' },
    ink: 'red',
  },
  {
    quote:
      'I have never written a margin note in a book in my life. Then there was a draft, and a comment box, and a writer waiting on the other side.',
    attribution: 'reader 089, Issue №00',
    attributionRedacted: 'Saffron Akande',
    rotate: -0.8,
    position: { top: '74%', left: '32%' },
    ink: 'graphite',
  },
];

const STYLES = `
.v7-marg {
  position: relative;
  background: var(--bl-paper);
  color: var(--bl-ink);
  padding: clamp(96px, 14vh, 160px) clamp(24px, 5vw, 80px) clamp(120px, 16vh, 200px);
  overflow: hidden;
}
.v7-marg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, transparent 0 31px, rgba(61,79,92,0.05) 31px 32px),
    radial-gradient(circle at 8% 18%, rgba(155, 130, 90, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 92% 82%, rgba(155, 130, 90, 0.06) 0%, transparent 40%);
  pointer-events: none;
}
.v7-marg-inner {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  min-height: clamp(640px, 90vh, 880px);
}
.v7-marg-head {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 56px;
  max-width: 620px;
  position: relative;
  z-index: 2;
}
.v7-marg-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: var(--bl-accent);
  display: flex;
  align-items: center;
  gap: 18px;
}
.v7-marg-eyebrow .v7-marg-roman {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 22px;
  letter-spacing: 0;
  text-transform: none;
  color: var(--bl-ink);
}
.v7-marg-eyebrow .v7-marg-rule {
  flex: 1;
  height: 1px;
  background: var(--bl-divider);
  max-width: 140px;
}
.v7-marg-title {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-weight: 500;
  font-size: clamp(36px, 4.4vw, 60px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--bl-ink);
  margin: 0;
}
.v7-marg-title em {
  font-style: italic;
  font-weight: 400;
}
.v7-marg-sub {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(16px, 1.3vw, 20px);
  color: var(--bl-wash);
  max-width: 50ch;
  margin: 0;
}
.v7-marg-stage {
  position: absolute;
  inset: 220px 0 0 0;
  pointer-events: none;
}
@media (max-width: 760px) {
  .v7-marg-stage { position: static; margin-top: 32px; min-height: 0; }
}

.v7-marg-note {
  position: absolute;
  max-width: clamp(240px, 26vw, 360px);
  padding: 24px 26px 22px;
  background: #FBF6E8;
  border: 1px solid rgba(60, 50, 32, 0.12);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.6) inset,
    0 14px 28px rgba(60, 40, 18, 0.16),
    0 3px 6px rgba(60, 40, 18, 0.08);
  font-family: 'Caveat', 'Bradley Hand', cursive;
  color: #3D4F5C;
  pointer-events: auto;
  transform: rotate(var(--rot));
  transition: transform 360ms cubic-bezier(.22,1,.36,1), box-shadow 360ms ease;
  will-change: transform;
}
.v7-marg-note::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  width: 60px;
  height: 18px;
  background: rgba(184, 158, 110, 0.28);
  transform: translateX(-50%) rotate(-3deg);
  border: 1px solid rgba(120, 95, 50, 0.18);
  box-shadow: 0 2px 4px rgba(60,40,18,0.1);
}
.v7-marg-note.ink-graphite { color: #2F3A45; }
.v7-marg-note.ink-blue { color: #2A4A6B; }
.v7-marg-note.ink-red { color: #8B2438; }
.v7-marg-note:hover {
  transform: rotate(0) translateY(-6px) scale(1.04);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.7) inset,
    0 24px 44px rgba(60, 40, 18, 0.22),
    0 4px 8px rgba(60, 40, 18, 0.12);
  z-index: 5;
}
@media (max-width: 760px) {
  .v7-marg-note {
    position: relative;
    inset: auto !important;
    margin: 0 auto 22px;
    max-width: 92%;
    display: block;
    transform: rotate(calc(var(--rot) * 0.55));
  }
}
.v7-marg-quote {
  font-size: clamp(20px, 1.6vw, 26px);
  line-height: 1.35;
  font-weight: 500;
  margin: 0;
}
.v7-marg-quote::before { content: '“'; opacity: 0.7; }
.v7-marg-quote::after { content: '”'; opacity: 0.7; }
.v7-marg-attr {
  margin-top: 14px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-wash);
  display: flex;
  align-items: center;
  gap: 8px;
}
.v7-marg-attr-redact {
  display: inline-block;
  background: var(--bl-redaction);
  color: transparent;
  padding: 1px 2px;
  border-radius: 1px;
  user-select: none;
  letter-spacing: -0.02em;
}
.v7-marg-fadein { opacity: 0; transition: opacity 800ms ease; }
.v7-marg-fadein.is-in { opacity: 1; }
.v7-marg-fadein.is-in:nth-child(2) { transition-delay: 120ms; }
.v7-marg-fadein.is-in:nth-child(3) { transition-delay: 240ms; }
.v7-marg-fadein.is-in:nth-child(4) { transition-delay: 360ms; }
.v7-marg-fadein.is-in:nth-child(5) { transition-delay: 480ms; }
`;

export default function Marginalia() {
  const [ref, inView] = useInView<HTMLDivElement>(0.12);
  return (
    <section className="v7-marg" aria-label="Reader and author notes from Issue №00">
      <style>{STYLES}</style>
      <div className="v7-marg-inner" ref={ref}>
        <header className="v7-marg-head">
          <div className="v7-marg-eyebrow">
            <span className="v7-marg-roman">VI.</span>
            <span>Marginalia</span>
            <span className="v7-marg-rule" />
          </div>
          <h2 className="v7-marg-title">
            What people leave <em>in the margins.</em>
          </h2>
          <p className="v7-marg-sub">
            Pulled from Issue №00. Names redacted at reader request — the books were not
            yet books, and not everyone wanted their fingerprints on the early drafts.
          </p>
        </header>
        <div className="v7-marg-stage">
          {NOTES.map((n, i) => (
            <div
              key={i}
              className={`v7-marg-note ink-${n.ink ?? 'graphite'} v7-marg-fadein${inView ? ' is-in' : ''}`}
              style={{
                ...n.position,
                ['--rot' as string]: `${n.rotate}deg`,
              }}
            >
              <p className="v7-marg-quote">{n.quote}</p>
              <div className="v7-marg-attr">
                — <span className="v7-marg-attr-redact">{n.attributionRedacted}</span>, {n.attribution}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
