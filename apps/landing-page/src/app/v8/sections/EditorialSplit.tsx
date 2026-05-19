'use client';

import { useInView } from './useInView';

export type Side = 'author' | 'reader';
export type StartTarget = Side | 'both';

type Props = {
  onStart: (target: StartTarget) => void;
};

type Feature = { title: string; body: string };

const FEATURES: Record<Side, Feature[]> = {
  author: [
    {
      title: "Get secure Beta-Reads",
      body: "Share chapters or full manuscripts with opt-in readers under privacy controls. Get structured feedback before you submit anywhere.",
    },
    {
      title: "Get Published",
      body: "Take your manuscript from polished draft to deal. Track submissions, manage query letters, and connect with editors who are actively acquiring.",
    },
    {
      title: "Build your literary agent list",
      body: "Discover agents who represent your genre, track their wishlists, and build a shortlist backed by real submission data — not guesswork.",
    },
  ],
  reader: [
    {
      title: "Support debut authors with authentic feedback",
      body: "Your notes reach writers at the moment they matter most — while the story is still forming. Shape a book before anyone else reads it.",
    },
    {
      title: "Human-curated drops on a monthly base",
      body: "Every drop is handpicked by editors, not ranked by an algorithm. Expect one great recommendation, not an endless scroll.",
    },
    {
      title: "Engage the authors and readers",
      body: "Follow authors across their drafts, trade notes with fellow readers, and be part of a community that takes fiction seriously.",
    },
  ],
};

const COPY: Record<Side, { eyebrow: string; headline: string; body: string }> = {
  author: {
    eyebrow: 'For authors',
    headline: 'From first draft\nto bookshelf.',
    body: 'Share microstories, chapters, or full manuscripts. Grow real readers, get beta feedback that shapes your draft, and take the next step toward agents.',
  },
  reader: {
    eyebrow: 'For readers',
    headline: 'Fiction that\nneeds you.',
    body: 'Browse curated drops in your favorite genres. Read drafts from emerging authors and give feedback — from a one-tap reaction to notes that shape the book.',
  },
};

const STYLES = `
.bl-editorial {
  position: relative;
  background: var(--bl-section-bg);
  color: var(--bl-section-fg);
  padding: clamp(96px, 14vh, 160px) clamp(24px, 5vw, 80px);
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  transition: background-color 320ms ease, color 320ms ease;
}
.bl-editorial + .bl-editorial { padding-top: 0; }
.bl-editorial-inner {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
}
.bl-editorial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 80px);
  position: relative;
  align-items: start;
}
.bl-editorial-grid::before {
  content: '';
  position: absolute;
  top: 8%;
  bottom: 8%;
  left: 50%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--bl-section-accent) 45%, transparent), transparent);
  transform: translateX(-50%);
}
.bl-col {
  padding: 0 clamp(8px, 2vw, 24px);
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.bl-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-section-accent);
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  transition: color 320ms ease;
  align-self: flex-start;
  font-feature-settings: "kern", "liga";
}
.bl-eyebrow::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 56px;
  background: var(--bl-section-accent);
  transition: background-color 320ms ease;
}
.bl-eyebrow-lg {
  font-size: clamp(16px, 1.6vw, 22px);
  letter-spacing: 0.22em;
  padding-bottom: 12px;
}
.bl-eyebrow-lg::after {
  width: 84px;
  height: 3px;
}
.bl-headline {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(40px, 5.4vw, 80px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: var(--bl-section-fg);
  margin: 0;
  white-space: pre-line;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-body {
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: clamp(15px, 1.05vw, 17px);
  line-height: 1.65;
  color: var(--bl-section-muted);
  max-width: 48ch;
  margin: 0;
  text-wrap: pretty;
}
.bl-features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.bl-feature {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  align-items: baseline;
}
.bl-feature-index {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.28em;
  color: var(--bl-section-accent);
  padding-top: 6px;
  font-variant-numeric: tabular-nums;
}
.bl-feature-body-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.bl-feature-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(24px, 2.2vw, 34px);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--bl-section-fg);
  margin: 0;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}
.bl-feature-body {
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: var(--bl-section-muted);
  margin: 0;
  max-width: 42ch;
  text-wrap: pretty;
}

.bl-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bl-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(242,239,232,0.1);
  border-radius: 14px;
  padding: 22px 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  cursor: pointer;
  transition: background 240ms var(--v6-ease, ease), border-color 240ms var(--v6-ease, ease);
}
.bl-card:hover {
  background: rgba(255,255,255,0.09);
  border-color: rgba(242,239,232,0.22);
}
.bl-card-index {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--bl-section-accent);
  transition: color 320ms ease;
  font-variant-numeric: tabular-nums;
}
.bl-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(20px, 1.8vw, 28px);
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--bl-section-fg);
  margin: 0;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}
.bl-card-body {
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.62;
  color: var(--bl-section-muted);
  margin: 0;
  text-wrap: pretty;
}
.bl-card-learn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--bl-section-accent);
  opacity: 0;
  transform: translateY(5px);
  transition: opacity 240ms var(--v6-ease, ease), transform 240ms var(--v6-ease, ease), color 320ms ease;
}
.bl-card:hover .bl-card-learn {
  opacity: 1;
  transform: none;
}

.bl-sketch {
  width: 210px;
  height: auto;
  opacity: 0.72;
  align-self: flex-start;
  color: var(--bl-section-fg);
  overflow: visible;
}

.bl-both {
  background: var(--bl-section-bg);
  padding: 0 clamp(24px, 5vw, 80px) clamp(96px, 12vh, 140px);
  text-align: center;
}
.bl-both-link {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-section-muted);
  background: none;
  border: 0;
  cursor: pointer;
  padding: 8px 12px;
  position: relative;
  transition: color 220ms ease;
}
.bl-both-link::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 2px;
  height: 1px;
  background: var(--bl-section-accent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 320ms cubic-bezier(.22, 1, .36, 1);
}
.bl-both-link:hover { color: var(--bl-section-fg); }
.bl-both-link:hover::after { transform: scaleX(1); }

.bl-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 700ms ease-out, transform 700ms cubic-bezier(.22, 1, .36, 1);
}
.bl-reveal.is-in {
  opacity: 1;
  transform: none;
}
.bl-col-left.bl-reveal { transition-delay: 0ms; }
.bl-col-right.bl-reveal { transition-delay: 140ms; }

@media (max-width: 760px) {
  .bl-editorial-grid {
    grid-template-columns: 1fr;
    gap: 56px;
  }
  .bl-editorial-grid::before { display: none; }
  .bl-editorial-reader .bl-col-left { order: 2; }
  .bl-editorial-reader .bl-col-right { order: 1; }
}
`;

function AuthorSketch() {
  return (
    <svg viewBox="0 0 220 178" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="bl-sketch" aria-hidden="true">
      {/* Desk surface */}
      <line x1="22" y1="114" x2="198" y2="114" strokeWidth="1.8" />
      <line x1="35" y1="114" x2="35" y2="160" strokeWidth="1.6" />
      <line x1="185" y1="114" x2="185" y2="160" strokeWidth="1.6" />
      {/* Papers on desk */}
      <path d="M 90 101 L 174 101 L 174 114 L 90 114 Z" strokeWidth="1.4" />
      <line x1="97" y1="105" x2="164" y2="105" strokeWidth="0.9" />
      <line x1="97" y1="108" x2="150" y2="108" strokeWidth="0.9" />
      <line x1="97" y1="111" x2="158" y2="111" strokeWidth="0.9" />
      {/* Pen */}
      <line x1="152" y1="98" x2="166" y2="112" strokeWidth="1.4" />
      {/* Head */}
      <circle cx="72" cy="44" r="17" strokeWidth="1.6" />
      {/* Hair */}
      <path d="M 56 38 Q 58 26 72 26 Q 86 26 88 38" strokeWidth="1.1" />
      {/* Neck */}
      <line x1="72" y1="61" x2="72" y2="70" strokeWidth="1.4" />
      {/* Back / spine — hunched forward */}
      <path d="M 66 70 C 62 84 56 97 54 109" strokeWidth="1.5" />
      {/* Right arm reaching to desk */}
      <path d="M 78 73 C 90 83 112 93 142 101" strokeWidth="1.5" />
      {/* Left arm resting */}
      <path d="M 64 82 C 67 93 72 102 76 110" strokeWidth="1.4" />
      {/* Chair back */}
      <line x1="44" y1="74" x2="44" y2="114" strokeWidth="1.4" />
      {/* Chair seat */}
      <line x1="44" y1="114" x2="70" y2="114" strokeWidth="1.3" />
      {/* Chair legs */}
      <line x1="44" y1="114" x2="34" y2="158" strokeWidth="1.3" />
      <line x1="70" y1="114" x2="74" y2="158" strokeWidth="1.3" />
    </svg>
  );
}

function ReaderSketch() {
  return (
    <svg viewBox="0 0 220 192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="bl-sketch" aria-hidden="true">
      {/* Head */}
      <circle cx="110" cy="40" r="18" strokeWidth="1.6" />
      {/* Hair */}
      <path d="M 93 34 Q 96 21 110 21 Q 124 21 127 34" strokeWidth="1.1" />
      {/* Neck */}
      <line x1="110" y1="58" x2="110" y2="68" strokeWidth="1.4" />
      {/* Shoulders */}
      <path d="M 70 82 Q 88 68 110 66 Q 132 68 150 82" strokeWidth="1.5" />
      {/* Left arm down to book */}
      <path d="M 72 85 C 66 100 63 116 62 132" strokeWidth="1.5" />
      {/* Right arm down to book */}
      <path d="M 148 85 C 154 100 157 116 158 132" strokeWidth="1.5" />
      {/* Left hand cupping book */}
      <path d="M 60 132 C 62 140 70 142 80 141" strokeWidth="1.4" />
      {/* Right hand cupping book */}
      <path d="M 140 141 C 150 142 158 140 160 132" strokeWidth="1.4" />
      {/* Open book — left page */}
      <path d="M 80 128 Q 93 119 108 117 L 108 166 Q 93 168 80 174 Z" strokeWidth="1.5" />
      {/* Open book — right page */}
      <path d="M 112 117 Q 127 119 140 128 L 140 174 Q 127 168 112 166 Z" strokeWidth="1.5" />
      {/* Book spine */}
      <path d="M 108 117 C 109 140 109 152 108 166" strokeWidth="1.1" />
      <path d="M 112 117 C 111 140 111 152 112 166" strokeWidth="1.1" />
      {/* Text lines — left page */}
      <line x1="86" y1="131" x2="104" y2="129" strokeWidth="0.85" />
      <line x1="85" y1="136" x2="104" y2="134" strokeWidth="0.85" />
      <line x1="85" y1="141" x2="104" y2="139" strokeWidth="0.85" />
      <line x1="85" y1="146" x2="102" y2="144" strokeWidth="0.85" />
      <line x1="85" y1="151" x2="104" y2="149" strokeWidth="0.85" />
      <line x1="85" y1="156" x2="100" y2="154" strokeWidth="0.85" />
      {/* Text lines — right page */}
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
  align,
  inView,
}: {
  side: Side;
  align: 'left' | 'right';
  inView: boolean;
}) {
  const c = COPY[side];
  return (
    <div className={`bl-col bl-col-${align} bl-reveal${inView ? ' is-in' : ''}`}>
      <span className="bl-eyebrow bl-eyebrow-lg">{c.eyebrow}</span>
      <h2 className="bl-headline">{c.headline}</h2>
      {side === 'author' ? <AuthorSketch /> : <ReaderSketch />}
      <p className="bl-body">{c.body}</p>
    </div>
  );
}

function AuthorCardsColumn({ inView }: { inView: boolean }) {
  return (
    <div className={`bl-col bl-col-right bl-reveal${inView ? ' is-in' : ''}`}>
      <span className="bl-eyebrow">Features</span>
      <div className="bl-cards">
        {FEATURES.author.map((f, i) => (
          <div key={f.title} className="bl-card">
            <div className="bl-card-index">0{i + 1}</div>
            <h3 className="bl-card-title">{f.title}</h3>
            <p className="bl-card-body">{f.body}</p>
            <span className="bl-card-learn">Learn more →</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReaderCardsColumn({ inView }: { inView: boolean }) {
  return (
    <div className={`bl-col bl-col-left bl-reveal${inView ? ' is-in' : ''}`}>
      <span className="bl-eyebrow">Features</span>
      <div className="bl-cards">
        {FEATURES.reader.map((f, i) => (
          <div key={f.title} className="bl-card">
            <div className="bl-card-index">0{i + 1}</div>
            <h3 className="bl-card-title">{f.title}</h3>
            <p className="bl-card-body">{f.body}</p>
            <span className="bl-card-learn">Learn more →</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesColumn({
  side,
  align,
  inView,
}: {
  side: Side;
  align: 'left' | 'right';
  inView: boolean;
}) {
  return (
    <div className={`bl-col bl-col-${align} bl-reveal${inView ? ' is-in' : ''}`}>
      <span className="bl-eyebrow">Features</span>
      <ul className="bl-features-list">
        {FEATURES[side].map((f, i) => (
          <li key={f.title} className="bl-feature">
            <span className="bl-feature-index">0{i + 1}</span>
            <div className="bl-feature-body-wrap">
              <h3 className="bl-feature-title">{f.title}</h3>
              <p className="bl-feature-body">{f.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EditorialSplit({ onStart }: Props) {
  const [authorRef, authorInView] = useInView<HTMLDivElement>(0.18);
  const [readerRef, readerInView] = useInView<HTMLDivElement>(0.18);

  return (
    <>
      <style>{STYLES}</style>

      <section className="bl-editorial bl-editorial-author" aria-label="For writers">
        <div className="bl-editorial-inner" ref={authorRef}>
          <div className="bl-editorial-grid">
            <OverviewColumn side="author" align="left" inView={authorInView} />
            <AuthorCardsColumn inView={authorInView} />
          </div>
        </div>
      </section>

      <section className="bl-editorial bl-editorial-reader" aria-label="For readers">
        <div className="bl-editorial-inner" ref={readerRef}>
          <div className="bl-editorial-grid">
            <ReaderCardsColumn inView={readerInView} />
            <OverviewColumn side="reader" align="right" inView={readerInView} />
          </div>
        </div>
      </section>

      <div className="bl-both">
        <button type="button" className="bl-both-link" onClick={() => onStart('both')}>
          I’m both →
        </button>
      </div>
    </>
  );
}
