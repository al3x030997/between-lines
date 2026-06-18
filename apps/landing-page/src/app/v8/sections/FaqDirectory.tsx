import Link from 'next/link';
import { FAQ } from '@/lib/faq';

const STYLES = `
.bl-qa {
  background: var(--theme-surface);
  color: var(--bl-ink);
  padding: clamp(80px, 11vw, 132px) clamp(24px, 5vw, 80px);
  font-family: var(--bl-font-display);
}
.bl-qa-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.bl-qa-head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: clamp(40px, 5vw, 60px);
  max-width: 640px;
}
.bl-qa-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-ink);
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  margin: 0;
}
.bl-qa-eyebrow::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 64px;
  background: var(--bl-accent-strong);
}
.bl-qa-title {
  /* Match the hero headline treatment: Playfair Display at the heavy display weight. */
  font-family: var(--bl-font-serif);
  font-weight: 900;
  font-size: clamp(36px, 4.6vw, 60px);
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--bl-ink);
  margin: 0;
  text-wrap: balance;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-qa-lede {
  font-family: var(--bl-font-body);
  font-size: clamp(18px, 1.5vw, 22px);
  line-height: 1.55;
  color: var(--bl-ink-muted);
  margin: 0;
  max-width: 52ch;
  text-wrap: pretty;
}
.bl-qa-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.bl-qa-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 28px 28px 24px;
  background: var(--theme-surface-subtle, var(--theme-surface));
  border: 1px solid var(--theme-border-subtle);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  position: relative;
  transition:
    border-color 220ms var(--bl-ease),
    box-shadow 220ms var(--bl-ease),
    transform 220ms var(--bl-ease);
}
.bl-qa-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border-top: 2px solid var(--bl-accent);
  opacity: 0;
  transition: opacity 220ms var(--bl-ease);
  pointer-events: none;
}
.bl-qa-card:hover,
.bl-qa-card:focus-visible {
  border-color: var(--bl-accent);
  box-shadow: 0 16px 34px color-mix(in srgb, var(--bl-ink) 14%, transparent);
  transform: translateY(-3px);
  outline: none;
}
.bl-qa-card:hover::before,
.bl-qa-card:focus-visible::before {
  opacity: 1;
}
.bl-qa-card-index {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.24em;
  color: var(--bl-accent-strong);
  font-variant-numeric: tabular-nums;
  text-transform: uppercase;
}
.bl-qa-card-title {
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
.bl-qa-card-blurb {
  font-family: var(--bl-font-body);
  font-size: 17px;
  line-height: 1.5;
  color: var(--bl-ink-muted);
  margin: 0;
  text-wrap: pretty;
}
.bl-qa-card-arrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bl-ink);
}
.bl-qa-card-arrow-glyph {
  transition: transform 240ms var(--bl-ease);
}
.bl-qa-card:hover .bl-qa-card-arrow,
.bl-qa-card:focus-visible .bl-qa-card-arrow {
  color: var(--bl-accent-strong);
}
.bl-qa-card:hover .bl-qa-card-arrow-glyph,
.bl-qa-card:focus-visible .bl-qa-card-arrow-glyph {
  transform: translateX(4px);
}
.bl-qa-all {
  margin: clamp(32px, 4vw, 48px) 0 0;
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 8px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
  text-decoration: none;
  padding: 10px 0;
  position: relative;
}
.bl-qa-all::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  height: 1px;
  background: var(--bl-accent);
  transform: scaleX(0.3);
  transform-origin: left;
  transition: transform 320ms var(--bl-ease);
}
.bl-qa-all:hover,
.bl-qa-all:focus-visible {
  color: var(--bl-accent-strong);
  outline: none;
}
.bl-qa-all:hover::after,
.bl-qa-all:focus-visible::after {
  transform: scaleX(1);
}
.bl-qa-all-arrow {
  transition: transform 240ms var(--bl-ease);
}
.bl-qa-all:hover .bl-qa-all-arrow,
.bl-qa-all:focus-visible .bl-qa-all-arrow {
  transform: translateX(4px);
}

@media (max-width: 600px) {
  .bl-qa-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .bl-qa-card,
  .bl-qa-card::before,
  .bl-qa-card-arrow-glyph,
  .bl-qa-all::after,
  .bl-qa-all-arrow {
    transition: none;
  }
}
`;

export default function FaqDirectory() {
  return (
    <section className="bl-qa" aria-label="Questions, answered">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="bl-qa-inner">
        <div className="bl-qa-head">
          <span className="bl-qa-eyebrow">FAQ</span>
          <h2 className="bl-qa-title">Questions, answered.</h2>
          <p className="bl-qa-lede">
            Find your footing &mdash; browse by topic, or read the full list.
          </p>
        </div>

        <div className="bl-qa-grid">
          {FAQ.map((category, i) => (
            <Link
              key={category.slug}
              href={`/faq#${category.slug}`}
              className="bl-qa-card"
            >
              <span className="bl-qa-card-index">
                {String(i + 1).padStart(2, '0')} &middot; {category.questions.length} Q
              </span>
              <h3 className="bl-qa-card-title">{category.title}</h3>
              <p className="bl-qa-card-blurb">{category.blurb}</p>
              <span className="bl-qa-card-arrow">
                Browse{' '}
                <span className="bl-qa-card-arrow-glyph" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>

        <Link href="/faq" className="bl-qa-all">
          Read all FAQs{' '}
          <span className="bl-qa-all-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
