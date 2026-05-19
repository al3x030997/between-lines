'use client';

import { useInView } from '../../v6/sections/useInView';
import type { Region } from '../../v6/InlineQuestions';

type Side = 'author' | 'reader';

type Card = { index: string; title: string; tail: string };

const COPY: Record<Side, { eyebrow: string; headline: string; body: string; cta: string; ctaTarget: Region }> = {
  author: {
    eyebrow: 'For writers',
    headline: 'What if the readers\nfound you first?',
    body:
      'Twelve manuscripts make it into the magazine each year. We don’t pick them — the readers do, and they read you first.',
    cta: 'Submit a draft to Issue №02',
    ctaTarget: 'author',
  },
  reader: {
    eyebrow: 'For readers',
    headline: 'What if you got there\nbefore the publisher did?',
    body:
      'Every issue closes with a quiet vote. Your margin notes follow the manuscripts the rest of the way — into the third draft, sometimes into the bookstore.',
    cta: 'Open Issue №01',
    ctaTarget: 'reader',
  },
};

const CARDS: Record<Side, Card[]> = {
  author: [
    {
      index: '01',
      title: '14 opt-in readers. Zero leaks.',
      tail: 'how the privacy walls work',
    },
    {
      index: '02',
      title: 'Track 38 agent submissions in one place.',
      tail: 'the dashboard tour',
    },
    {
      index: '03',
      title: 'Match against 2,400 agents by what they actually requested last quarter.',
      tail: 'why “wishlist” data lies',
    },
  ],
  reader: [
    {
      index: '01',
      title: 'Your margin notes reach the writer before the third draft.',
      tail: 'what reader 037 changed',
    },
    {
      index: '02',
      title: 'One curated drop per month. No infinite scroll, no algorithm.',
      tail: 'meet the editors',
    },
    {
      index: '03',
      title: 'Follow an author from manuscript to deal.',
      tail: 'see Issue №00’s outcome',
    },
  ],
};

const STYLES = `
.v7-ed {
  position: relative;
  background: var(--bl-paper-warm);
  color: var(--bl-ink);
  padding: clamp(96px, 14vh, 160px) clamp(24px, 5vw, 80px) 0;
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
}
.v7-ed + .v7-ed { padding-top: clamp(48px, 6vh, 88px); padding-bottom: 0; }
.v7-ed-last { padding-bottom: clamp(96px, 14vh, 160px); }
.v7-ed-inner {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
}
.v7-ed-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 80px);
  position: relative;
  align-items: start;
}
.v7-ed-grid::before {
  content: '';
  position: absolute;
  top: 8%;
  bottom: 8%;
  left: 50%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(139,36,56,0.35), transparent);
  transform: translateX(-50%);
}
.v7-ed-col {
  padding: 0 clamp(8px, 2vw, 24px);
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.v7-ed-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bl-accent);
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 12px;
  padding-bottom: 6px;
  align-self: flex-start;
}
.v7-ed-eyebrow::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 56px;
  background: var(--bl-accent);
}
.v7-ed-eyebrow-roman {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 22px;
  letter-spacing: 0;
  text-transform: none;
  color: var(--bl-ink);
  transform: translateY(2px);
}
.v7-ed-headline {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-weight: 400;
  font-style: italic;
  font-size: clamp(36px, 5vw, 72px);
  line-height: 1.02;
  letter-spacing: -0.022em;
  color: var(--bl-ink);
  margin: 0;
  white-space: pre-line;
}
.v7-ed-body {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(17px, 1.3vw, 22px);
  line-height: 1.55;
  color: var(--bl-wash);
  max-width: 44ch;
  margin: 0;
}
.v7-ed-cta {
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
  gap: 10px;
  align-self: flex-start;
}
.v7-ed-cta::after {
  content: '→';
  transition: transform 240ms cubic-bezier(.22,1,.36,1);
}
.v7-ed-cta:hover::after { transform: translateX(4px); }

.v7-ed-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.v7-ed-card {
  position: relative;
  background: var(--bl-paper);
  border: 1px solid var(--bl-divider);
  border-radius: 4px;
  padding: 24px 26px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 280ms ease, transform 320ms cubic-bezier(.22,1,.36,1), background 280ms ease;
}
.v7-ed-card::before {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  left: 0;
  width: 3px;
  background: var(--bl-accent);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 380ms cubic-bezier(.22,1,.36,1);
}
.v7-ed-card:hover {
  background: #FFFCF4;
  border-color: rgba(139, 36, 56, 0.36);
}
.v7-ed-card:hover::before { transform: scaleY(1); transform-origin: top; }
.v7-ed-card-index {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 18px;
  color: var(--bl-accent);
}
.v7-ed-card-title {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-weight: 400;
  font-style: italic;
  font-size: clamp(20px, 1.7vw, 26px);
  line-height: 1.25;
  letter-spacing: -0.012em;
  color: var(--bl-ink);
  margin: 0;
}
.v7-ed-card-tail {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-wash);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  align-self: flex-start;
}
.v7-ed-card-tail::before {
  content: '→';
  color: var(--bl-accent);
  font-size: 14px;
  letter-spacing: 0;
  transition: transform 240ms cubic-bezier(.22,1,.36,1);
}
.v7-ed-card:hover .v7-ed-card-tail::before { transform: translateX(3px); }

.v7-ed-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 700ms ease-out, transform 700ms cubic-bezier(.22,1,.36,1);
}
.v7-ed-reveal.is-in { opacity: 1; transform: none; }
.v7-ed-col-left.v7-ed-reveal { transition-delay: 0ms; }
.v7-ed-col-right.v7-ed-reveal { transition-delay: 140ms; }

.v7-ed-sketch {
  width: 200px;
  height: auto;
  align-self: flex-start;
  color: var(--bl-ink);
  opacity: 0.62;
  overflow: visible;
}

@media (max-width: 760px) {
  .v7-ed-grid { grid-template-columns: 1fr; gap: 56px; }
  .v7-ed-grid::before { display: none; }
  .v7-ed-reader .v7-ed-col-left { order: 2; }
  .v7-ed-reader .v7-ed-col-right { order: 1; }
}
`;

function AuthorSketch() {
  return (
    <svg viewBox="0 0 220 178" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="v7-ed-sketch" aria-hidden="true">
      <line x1="22" y1="114" x2="198" y2="114" strokeWidth="1.8" />
      <line x1="35" y1="114" x2="35" y2="160" strokeWidth="1.6" />
      <line x1="185" y1="114" x2="185" y2="160" strokeWidth="1.6" />
      <path d="M 90 101 L 174 101 L 174 114 L 90 114 Z" strokeWidth="1.4" />
      <line x1="97" y1="105" x2="164" y2="105" strokeWidth="0.9" />
      <line x1="97" y1="108" x2="150" y2="108" strokeWidth="0.9" />
      <line x1="97" y1="111" x2="158" y2="111" strokeWidth="0.9" />
      <line x1="152" y1="98" x2="166" y2="112" strokeWidth="1.4" />
      <circle cx="72" cy="44" r="17" strokeWidth="1.6" />
      <path d="M 56 38 Q 58 26 72 26 Q 86 26 88 38" strokeWidth="1.1" />
      <line x1="72" y1="61" x2="72" y2="70" strokeWidth="1.4" />
      <path d="M 66 70 C 62 84 56 97 54 109" strokeWidth="1.5" />
      <path d="M 78 73 C 90 83 112 93 142 101" strokeWidth="1.5" />
      <path d="M 64 82 C 67 93 72 102 76 110" strokeWidth="1.4" />
      <line x1="44" y1="74" x2="44" y2="114" strokeWidth="1.4" />
      <line x1="44" y1="114" x2="70" y2="114" strokeWidth="1.3" />
      <line x1="44" y1="114" x2="34" y2="158" strokeWidth="1.3" />
      <line x1="70" y1="114" x2="74" y2="158" strokeWidth="1.3" />
    </svg>
  );
}

function ReaderSketch() {
  return (
    <svg viewBox="0 0 220 192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="v7-ed-sketch" aria-hidden="true">
      <circle cx="110" cy="40" r="18" strokeWidth="1.6" />
      <path d="M 93 34 Q 96 21 110 21 Q 124 21 127 34" strokeWidth="1.1" />
      <line x1="110" y1="58" x2="110" y2="68" strokeWidth="1.4" />
      <path d="M 70 82 Q 88 68 110 66 Q 132 68 150 82" strokeWidth="1.5" />
      <path d="M 72 85 C 66 100 63 116 62 132" strokeWidth="1.5" />
      <path d="M 148 85 C 154 100 157 116 158 132" strokeWidth="1.5" />
      <path d="M 60 132 C 62 140 70 142 80 141" strokeWidth="1.4" />
      <path d="M 140 141 C 150 142 158 140 160 132" strokeWidth="1.4" />
      <path d="M 80 128 Q 93 119 108 117 L 108 166 Q 93 168 80 174 Z" strokeWidth="1.5" />
      <path d="M 112 117 Q 127 119 140 128 L 140 174 Q 127 168 112 166 Z" strokeWidth="1.5" />
      <path d="M 108 117 C 109 140 109 152 108 166" strokeWidth="1.1" />
      <path d="M 112 117 C 111 140 111 152 112 166" strokeWidth="1.1" />
      <line x1="86" y1="131" x2="104" y2="129" strokeWidth="0.85" />
      <line x1="85" y1="136" x2="104" y2="134" strokeWidth="0.85" />
      <line x1="85" y1="141" x2="104" y2="139" strokeWidth="0.85" />
      <line x1="85" y1="146" x2="102" y2="144" strokeWidth="0.85" />
      <line x1="85" y1="151" x2="104" y2="149" strokeWidth="0.85" />
      <line x1="85" y1="156" x2="100" y2="154" strokeWidth="0.85" />
      <line x1="116" y1="129" x2="134" y2="131" strokeWidth="0.85" />
      <line x1="116" y1="134" x2="135" y2="136" strokeWidth="0.85" />
      <line x1="116" y1="139" x2="135" y2="141" strokeWidth="0.85" />
      <line x1="116" y1="144" x2="133" y2="146" strokeWidth="0.85" />
      <line x1="116" y1="149" x2="135" y2="151" strokeWidth="0.85" />
      <line x1="116" y1="154" x2="132" y2="156" strokeWidth="0.85" />
    </svg>
  );
}

function OverviewColumn({
  side,
  inView,
  onStart,
  roman,
}: {
  side: Side;
  inView: boolean;
  onStart: (r: Region) => void;
  roman: string;
}) {
  const c = COPY[side];
  return (
    <div className={`v7-ed-col v7-ed-col-left v7-ed-reveal${inView ? ' is-in' : ''}`}>
      <span className="v7-ed-eyebrow">
        <span className="v7-ed-eyebrow-roman">{roman}</span>
        {c.eyebrow}
      </span>
      <h2 className="v7-ed-headline">{c.headline}</h2>
      {side === 'author' ? <AuthorSketch /> : <ReaderSketch />}
      <p className="v7-ed-body">{c.body}</p>
      <button type="button" className="v7-ed-cta" onClick={() => onStart(c.ctaTarget)}>
        {c.cta}
      </button>
    </div>
  );
}

function CardsColumn({ side, inView, onTail }: { side: Side; inView: boolean; onTail: (label: string) => void }) {
  return (
    <div className={`v7-ed-col v7-ed-col-right v7-ed-reveal${inView ? ' is-in' : ''}`}>
      <div className="v7-ed-cards">
        {CARDS[side].map((c) => (
          <button
            key={c.index}
            type="button"
            className="v7-ed-card"
            onClick={() => onTail(c.tail)}
            aria-label={`${c.title} — ${c.tail}`}
          >
            <span className="v7-ed-card-index">№{c.index}</span>
            <h3 className="v7-ed-card-title">{c.title}</h3>
            <span className="v7-ed-card-tail">{c.tail}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

type Props = {
  onStart: (r: Region) => void;
  onTail: (label: string) => void;
};

export default function EditorialSplit({ onStart, onTail }: Props) {
  const [authorRef, authorInView] = useInView<HTMLDivElement>(0.18);
  const [readerRef, readerInView] = useInView<HTMLDivElement>(0.18);

  return (
    <>
      <style>{STYLES}</style>

      <section className="v7-ed v7-ed-author" aria-label="For writers">
        <div className="v7-ed-inner" ref={authorRef}>
          <div className="v7-ed-grid">
            <OverviewColumn side="author" inView={authorInView} onStart={onStart} roman="IV." />
            <CardsColumn side="author" inView={authorInView} onTail={onTail} />
          </div>
        </div>
      </section>

      <section className="v7-ed v7-ed-reader v7-ed-last" aria-label="For readers">
        <div className="v7-ed-inner" ref={readerRef}>
          <div className="v7-ed-grid">
            <CardsColumn side="reader" inView={readerInView} onTail={onTail} />
            <OverviewColumn side="reader" inView={readerInView} onStart={onStart} roman="·" />
          </div>
        </div>
      </section>
    </>
  );
}
