import Link from 'next/link';
import { FAQ } from '@/lib/faq';

const STYLES = `
.bl-faq-teaser {
  background: var(--bl-surface);
  color: var(--bl-ink);
  padding: clamp(96px, 12vw, 140px) clamp(24px, 5vw, 80px);
  font-family: var(--bl-font-display);
}
.bl-faq-teaser-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.bl-faq-teaser-head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: clamp(40px, 5vw, 64px);
  max-width: 640px;
}
.bl-faq-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  margin: 0;
}
.bl-faq-eyebrow::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 56px;
  background: var(--bl-accent);
}
.bl-faq-title {
  font-family: var(--bl-font-display);
  font-weight: 600;
  font-size: clamp(36px, 4.6vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.025em;
  color: var(--bl-ink);
  margin: 0;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-faq-lede {
  font-family: var(--bl-font-body);
  font-size: clamp(15px, 1.05vw, 17px);
  line-height: 1.6;
  color: var(--bl-ink-muted);
  margin: 0;
  max-width: 52ch;
  text-wrap: pretty;
}
.bl-faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}
.bl-faq-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px 26px 22px;
  background: var(--bl-surface);
  border: 1px solid rgba(14,14,12,0.1);
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  position: relative;
  transition:
    border-color 220ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 220ms cubic-bezier(.22, 1, .36, 1),
    transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 14px;
  border-top: 2px solid var(--bl-accent);
  opacity: 0;
  transition: opacity 220ms cubic-bezier(.22, 1, .36, 1);
  pointer-events: none;
}
.bl-faq-card:hover,
.bl-faq-card:focus-visible {
  border-color: rgba(14,14,12,0.2);
  box-shadow: 0 14px 32px rgba(14,14,12,0.07);
  transform: translateY(-2px);
  outline: none;
}
.bl-faq-card:hover::before,
.bl-faq-card:focus-visible::before {
  opacity: 1;
}
.bl-faq-card-index {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.24em;
  color: var(--bl-accent);
  font-variant-numeric: tabular-nums;
  text-transform: uppercase;
}
.bl-faq-card-title {
  font-family: var(--bl-font-display);
  font-weight: 600;
  font-size: clamp(22px, 1.9vw, 28px);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--bl-ink);
  margin: 0;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}
.bl-faq-card-blurb {
  font-family: var(--bl-font-body);
  font-size: 14px;
  line-height: 1.55;
  color: var(--bl-ink-muted);
  margin: 0;
  text-wrap: pretty;
}
.bl-faq-card-arrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bl-ink);
}
.bl-faq-card-arrow-glyph {
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-card:hover .bl-faq-card-arrow,
.bl-faq-card:focus-visible .bl-faq-card-arrow {
  color: var(--bl-accent);
}
.bl-faq-card:hover .bl-faq-card-arrow-glyph,
.bl-faq-card:focus-visible .bl-faq-card-arrow-glyph {
  transform: translateX(4px);
}
.bl-faq-all {
  margin-top: clamp(32px, 4vw, 48px);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--bl-font-eyebrow);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-ink);
  text-decoration: none;
  padding: 12px 0;
  position: relative;
}
.bl-faq-all::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  height: 1px;
  background: var(--bl-accent);
  transform: scaleX(0.3);
  transform-origin: left;
  transition: transform 320ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-all:hover,
.bl-faq-all:focus-visible {
  color: var(--bl-accent);
  outline: none;
}
.bl-faq-all:hover::after,
.bl-faq-all:focus-visible::after {
  transform: scaleX(1);
}
.bl-faq-all-arrow {
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-all:hover .bl-faq-all-arrow,
.bl-faq-all:focus-visible .bl-faq-all-arrow {
  transform: translateX(4px);
}

.bl-faq-split {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 6vw, 80px);
  margin: clamp(48px, 6vw, 72px) 0 clamp(56px, 7vw, 88px);
}
.bl-faq-split::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--bl-divider), transparent);
  pointer-events: none;
}
.bl-faq-split-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
}
.bl-faq-split-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0;
}
.bl-faq-split-headline {
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 40;
  font-size: clamp(22px, 2.4vw, 30px);
  line-height: 1.15;
  letter-spacing: -0.005em;
  color: var(--bl-ink);
  margin: 0;
  text-wrap: balance;
}
.bl-faq-split-bullets {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bl-faq-split-bullets li {
  font-family: var(--bl-font-body);
  font-size: 14px;
  line-height: 1.55;
  color: var(--bl-ink-muted);
  display: flex;
  gap: 10px;
  text-wrap: pretty;
}
.bl-faq-split-bullets li::before {
  content: '→';
  color: var(--bl-accent);
  flex-shrink: 0;
}
.bl-faq-split-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  background: var(--bl-accent);
  color: #fff;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 220ms var(--bl-ease),
    transform 220ms var(--bl-ease);
}
.bl-faq-split-cta:hover,
.bl-faq-split-cta:focus-visible {
  background: var(--bl-accent-strong);
  transform: translateY(-1px);
  outline: none;
}
.bl-faq-split-cta > span {
  transition: transform 240ms var(--bl-ease);
}
.bl-faq-split-cta:hover > span,
.bl-faq-split-cta:focus-visible > span {
  transform: translateX(4px);
}

@media (max-width: 760px) {
  .bl-faq-split { grid-template-columns: 1fr; gap: 40px; }
  .bl-faq-split::before { display: none; }
}
@media (max-width: 600px) {
  .bl-faq-grid { grid-template-columns: 1fr; }
}
`;

type Props = {
  onReader: () => void;
  onWriter: () => void;
};

export default function FaqTeaser({ onReader, onWriter }: Props) {
  return (
    <section className="bl-faq-teaser" aria-label="Frequently asked questions">
      <style>{STYLES}</style>
      <div className="bl-faq-teaser-inner">
        <div className="bl-faq-teaser-head">
          <span className="bl-faq-eyebrow">Frequently asked</span>
          <h2 className="bl-faq-title">Questions, answered.</h2>
          <p className="bl-faq-lede">
            Browse by topic — credits, copyright, beta reading, AI policy, manuscript protection,
            and more.
          </p>
        </div>

        <div className="bl-faq-split">
          <div className="bl-faq-split-col">
            <span className="bl-faq-split-eyebrow">For writers</span>
            <h3 className="bl-faq-split-headline">
              Publish your manuscript. Find your readers.
            </h3>
            <ul className="bl-faq-split-bullets">
              <li>Free to upload — chapter by chapter or in full. First three chapters are free to beta-read.</li>
              <li><em>SecureBetaReads</em> — watermarked, no copy-paste, no AI training. Ever.</li>
              <li>Your copyright stays yours. Always.</li>
            </ul>
            <button type="button" className="bl-faq-split-cta" onClick={onWriter}>
              Submit a manuscript <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="bl-faq-split-col">
            <span className="bl-faq-split-eyebrow">For readers</span>
            <h3 className="bl-faq-split-headline">
              Read what no algorithm would surface.
            </h3>
            <ul className="bl-faq-split-bullets">
              <li>Three free reads a month — chapter, short story, poem, or illustration.</li>
              <li>Earn ReadCredits by reacting, commenting, or beta-reading. Spend them on more reads.</li>
              <li>Beta-read writers before they publish — credited as <em>Early Discoverer</em> for life.</li>
            </ul>
            <button type="button" className="bl-faq-split-cta" onClick={onReader}>
              Open the shelf <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="bl-faq-grid">
          {FAQ.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/faq#${cat.slug}`}
              className="bl-faq-card"
              aria-label={`${cat.title} — ${cat.questions.length} questions`}
            >
              <span className="bl-faq-card-index">
                {String(i + 1).padStart(2, '0')} · {cat.questions.length} Q
              </span>
              <h3 className="bl-faq-card-title">{cat.title}</h3>
              <p className="bl-faq-card-blurb">{cat.blurb}</p>
              <span className="bl-faq-card-arrow">
                Browse <span className="bl-faq-card-arrow-glyph" aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
          <Link
            href="/faq#what-is-agentready"
            className="bl-faq-card"
            aria-label="AgentReady — research, query, and submit in one place"
          >
            <span className="bl-faq-card-index">
              {String(FAQ.length + 1).padStart(2, '0')} · TOOL
            </span>
            <h3 className="bl-faq-card-title">AgentReady</h3>
            <p className="bl-faq-card-blurb">
              Research, query, and submit in one place
            </p>
            <span className="bl-faq-card-arrow">
              Browse <span className="bl-faq-card-arrow-glyph" aria-hidden="true">→</span>
            </span>
          </Link>
        </div>

        <Link href="/faq" className="bl-faq-all">
          Read all FAQs <span className="bl-faq-all-arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
