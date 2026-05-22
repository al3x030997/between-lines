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
      title: "SecureBetaReads — protected, structured feedback",
      body: "Match with real beta readers under confidentiality. Get reactions, quick comments, or deep thoughts on every chapter. Watermarks, no copy-paste, no AI training — ever. You control who reads, and you can revoke access anytime.",
    },
    {
      title: "Publish your content and build your audience",
      body: "Share anything from microfiction to full novels, plus poetry — chapter by chapter or complete. Engage readers through Reader Pods and Writer Pods. Sell on our storefront (you keep 80%) or link to your Amazon and other storefronts from your free Author Page. We help you get discovered — editorial curation only, no paid placement.",
    },
    {
      title: "Make real income from your work",
      body: "Submit to the monthly BetweenLines Journal for $2. If selected, you share in that month's new subscription revenue after platform costs — alongside the other featured writers. Pure editorial selection: quality and fit, never paid placement or popularity metrics.",
    },
    {
      title: "AgentReady — research and submit in one place",
      body: "Build your agent list beyond QueryTracker. Generate tailored query letters, synopses, and pitches. Track every submission and every open window. Free to start; Pro is paid or unlocked with SwapCredits.",
    },
  ],
  reader: [
    {
      title: "Read emerging authors before anyone else",
      body: "Beta read unpublished manuscripts and shape books while they're still forming. If a writer you read gets agented or published, you're credited as an Early Discoverer on their author page — permanently. It can't be bought, only earned.",
    },
    {
      title: "Human-curated, no ads, no algorithm",
      body: "Monthly BetweenLines Journal drops curated by editors. Reader Picks chosen by people who read. QuietReading mode holds every notification while you're in a story. No ads, ever — for any age.",
    },
    {
      title: "Earn your way in — no subscription required",
      body: "Read 3 pieces free every month. Earn ReadCredits with every reaction, comment, or beta read. Spend them on more chapters, journal months, or Reader Pod invitations. Credits never expire.",
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
  gap: 36px;
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
  font-family: 'Outfit', sans-serif;
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
  font-family: 'Outfit', sans-serif;
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
  font-family: 'Outfit', sans-serif;
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
