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

/* AgentReady spotlight */
.bl-faq-spotlight {
  margin-top: clamp(28px, 4vw, 44px);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: clamp(28px, 4vw, 56px);
  align-items: center;
  padding: clamp(28px, 3.6vw, 40px) clamp(28px, 4vw, 48px);
  background: #0e0e0c;
  color: #F4EFE3;
  border-radius: 18px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: transform 280ms cubic-bezier(.22, 1, .36, 1), box-shadow 280ms ease;
}
.bl-faq-spotlight::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.14'/></svg>");
  opacity: 0.4;
  mix-blend-mode: overlay;
  pointer-events: none;
}
.bl-faq-spotlight:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 48px rgba(14, 14, 12, 0.18);
}
.bl-faq-spotlight-icon {
  width: 64px;
  height: 64px;
  border: 1px solid rgba(244, 239, 227, 0.32);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 32px;
  color: #E9B547;
  line-height: 1;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}
.bl-faq-spotlight-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 1;
}
.bl-faq-spotlight-tag {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: #E9B547;
}
.bl-faq-spotlight-title {
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 500;
  font-size: clamp(24px, 2.6vw, 34px);
  line-height: 1.1;
  letter-spacing: -0.018em;
  margin: 0;
  text-wrap: balance;
}
.bl-faq-spotlight-title em {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  color: #E9B547;
}
.bl-faq-spotlight-blurb {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: rgba(244, 239, 227, 0.78);
  margin: 0;
  max-width: 58ch;
  text-wrap: pretty;
}
.bl-faq-spotlight-cta {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #F4EFE3;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  position: relative;
  z-index: 1;
  transition: color 200ms ease, gap 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-spotlight:hover .bl-faq-spotlight-cta {
  color: #E9B547;
  gap: 12px;
}
.bl-faq-spotlight-cta-arrow {
  display: inline-block;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-spotlight:hover .bl-faq-spotlight-cta-arrow { transform: translateX(2px); }

@media (max-width: 760px) {
  .bl-faq-spotlight {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 28px 26px;
    text-align: left;
  }
  .bl-faq-spotlight-icon { width: 52px; height: 52px; font-size: 26px; }
  .bl-faq-spotlight-cta { align-self: flex-start; }
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

        <Link
          href="/faq#what-is-agentready"
          className="bl-faq-spotlight"
          aria-label="AgentReady — research, query, and submit in one place"
        >
          <span className="bl-faq-spotlight-icon" aria-hidden="true">A</span>
          <div className="bl-faq-spotlight-body">
            <span className="bl-faq-spotlight-tag">Tool &middot; spotlight</span>
            <h3 className="bl-faq-spotlight-title">
              <em>AgentReady</em> &mdash; research, query, and submit in one place.
            </h3>
            <p className="bl-faq-spotlight-blurb">
              Build your agent list beyond QueryTracker. Generate tailored query letters,
              synopses, and pitches. Free to start; Pro unlocks AI-assisted drafts and
              real-time agent open/closed status.
            </p>
          </div>
          <span className="bl-faq-spotlight-cta">
            Read how it works
            <span className="bl-faq-spotlight-cta-arrow" aria-hidden="true">→</span>
          </span>
        </Link>

        <Link href="/faq" className="bl-faq-all">
          Read all FAQs <span className="bl-faq-all-arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
