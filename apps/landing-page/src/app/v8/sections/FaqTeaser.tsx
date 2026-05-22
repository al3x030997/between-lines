import Link from 'next/link';
import { FAQ } from '@/lib/faq';

const STYLES = `
.bl-faq-teaser {
  background: #ffffff;
  color: #0e0e0c;
  padding: clamp(96px, 12vw, 140px) clamp(24px, 5vw, 80px);
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #e94b36;
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
  background: #e94b36;
}
.bl-faq-title {
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 600;
  font-size: clamp(36px, 4.6vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.025em;
  color: #0e0e0c;
  margin: 0;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-faq-lede {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(15px, 1.05vw, 17px);
  line-height: 1.6;
  color: #5a5a52;
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
  background: #ffffff;
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
  border-top: 2px solid #e94b36;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.24em;
  color: #e94b36;
  font-variant-numeric: tabular-nums;
  text-transform: uppercase;
}
.bl-faq-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(22px, 1.9vw, 28px);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: #0e0e0c;
  margin: 0;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}
.bl-faq-card-blurb {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  line-height: 1.55;
  color: #5a5a52;
  margin: 0;
  text-wrap: pretty;
}
.bl-faq-card-arrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0e0e0c;
}
.bl-faq-card-arrow-glyph {
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-card:hover .bl-faq-card-arrow,
.bl-faq-card:focus-visible .bl-faq-card-arrow {
  color: #e94b36;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0e0e0c;
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
  background: #e94b36;
  transform: scaleX(0.3);
  transform-origin: left;
  transition: transform 320ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-all:hover,
.bl-faq-all:focus-visible {
  color: #e94b36;
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

@media (max-width: 600px) {
  .bl-faq-grid { grid-template-columns: 1fr; }
}
`;

export default function FaqTeaser() {
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
        </div>

        <Link href="/faq" className="bl-faq-all">
          Read all FAQs <span className="bl-faq-all-arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
