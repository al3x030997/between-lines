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
      title: 'Share work in any size',
      body: 'Microstories, chapters, or full manuscripts. Drop work in whatever shape it’s ready in — and grow as it grows.',
    },
    {
      title: 'Beta feedback that lands',
      body: 'Real readers, opt-in. Reactions to margin notes — calibrated to where the draft actually is, not where you wish it were.',
    },
    {
      title: 'A path to agents',
      body: 'When your work is ready, take the next step. Built-in routes into agent submissions, with the receipts to back you up.',
    },
  ],
  reader: [
    {
      title: 'Curated drops',
      body: 'New work in your favorite genres, before anyone else sees it. Quietly handpicked, never algorithm-thrashed.',
    },
    {
      title: 'Read drafts, not finished books',
      body: 'Sit with emerging authors at the moment the story is forming. Watch a novel become itself.',
    },
    {
      title: 'One-tap to deep notes',
      body: 'A reaction, a margin note, or a full critique — your call. Your fingerprints stay on books you helped shape.',
    },
  ],
};

const COPY: Record<Side, { eyebrow: string; headline: string; body: string; cta: string }> = {
  author: {
    eyebrow: 'I’m a writer',
    headline: 'Be discovered.\nBuild an audience.\nGet published.',
    body: 'Share microstories, chapters, or full manuscripts. Grow real readers, get beta feedback that shapes your draft, and take the next step toward agents.',
    cta: 'Start writing',
  },
  reader: {
    eyebrow: 'I’m a reader',
    headline: 'Read fiction before\nit hits the shelf.',
    body: 'Browse curated drops in your favorite genres. Read drafts from emerging authors and give feedback — from a one-tap reaction to notes that shape the book.',
    cta: 'Start reading',
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
.bl-headline {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(40px, 5.4vw, 80px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: var(--bl-section-fg);
  margin: 0;
  white-space: pre-line;
}
.bl-body {
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: clamp(15px, 1.05vw, 17px);
  line-height: 1.65;
  color: var(--bl-section-muted);
  max-width: 48ch;
  margin: 0;
}
.bl-cta {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 26px;
  border-radius: 999px;
  border: 1px solid var(--bl-section-fg);
  background: var(--bl-section-fg);
  color: var(--bl-section-bg);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 220ms ease, color 220ms ease, border-color 220ms ease, transform 220ms cubic-bezier(.22, 1, .36, 1);
  margin-top: 12px;
}
.bl-cta:hover {
  background: var(--bl-section-accent);
  border-color: var(--bl-section-accent);
  color: var(--bl-section-fg);
  transform: translateY(-2px);
}
.bl-cta-arrow { transition: transform 220ms cubic-bezier(.22, 1, .36, 1); }
.bl-cta:hover .bl-cta-arrow { transform: translateX(4px); }

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
}
.bl-feature-body {
  font-family: 'Inter', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: var(--bl-section-muted);
  margin: 0;
  max-width: 42ch;
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

function OverviewColumn({
  side,
  align,
  inView,
  onStart,
}: {
  side: Side;
  align: 'left' | 'right';
  inView: boolean;
  onStart: (target: StartTarget) => void;
}) {
  const c = COPY[side];
  return (
    <div className={`bl-col bl-col-${align} bl-reveal${inView ? ' is-in' : ''}`}>
      <span className="bl-eyebrow">{c.eyebrow}</span>
      <h2 className="bl-headline">{c.headline}</h2>
      <p className="bl-body">{c.body}</p>
      <button type="button" className="bl-cta" onClick={() => onStart(side)}>
        {c.cta}
        <span className="bl-cta-arrow" aria-hidden>→</span>
      </button>
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
            <OverviewColumn side="author" align="left" inView={authorInView} onStart={onStart} />
            <FeaturesColumn side="author" align="right" inView={authorInView} />
          </div>
        </div>
      </section>

      <section className="bl-editorial bl-editorial-reader" aria-label="For readers">
        <div className="bl-editorial-inner" ref={readerRef}>
          <div className="bl-editorial-grid">
            <FeaturesColumn side="reader" align="left" inView={readerInView} />
            <OverviewColumn side="reader" align="right" inView={readerInView} onStart={onStart} />
          </div>
        </div>
      </section>

      <div className="bl-both">
        <button type="button" className="bl-both-link" onClick={() => onStart('both')}>
          I&apos;m both →
        </button>
      </div>
    </>
  );
}
