import Link from 'next/link';

// Pre-filled social invites (X compose intents) for the actionable feature-list items.
const INVITE_AUTHORS_URL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  'I want my favorite author on @betweenreads — a reader-first home for emerging writers. Come join us:',
)}`;
const INVITE_READERS_URL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  'I’m sharing my writing on @betweenreads — a reader-first home for emerging writers. Come read with me:',
)}`;

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
  color: var(--bl-ink);
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
  height: 3px;
  width: 64px;
  background: var(--bl-accent-strong);
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
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-subtle);
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
  border-color: var(--theme-border);
  box-shadow: 0 14px 32px rgb(var(--theme-shadow-rgb) / 0.16);
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
  margin: 0 0 clamp(56px, 7vw, 88px);
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
  font-family: var(--bl-font-display);
  font-weight: 600;
  font-size: clamp(40px, 5vw, 64px);
  line-height: 1.0;
  letter-spacing: -0.025em;
  text-transform: none;
  color: var(--bl-ink);
  margin: 0;
  text-wrap: balance;
  font-feature-settings: "kern", "liga", "calt";
}
.bl-faq-split-invitation {
  font-family: var(--bl-font-serif);
  font-weight: 400;
  font-size: clamp(17px, 1.4vw, 20px);
  line-height: 1.5;
  color: var(--bl-ink);
  margin: 0;
  max-width: 38ch;
  text-wrap: pretty;
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
  color: var(--theme-accent-contrast);
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

.bl-faq-features {
  list-style: none;
  margin: 2px 0 4px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
  max-width: 38ch;
  font-family: var(--bl-font-body);
  font-size: 15px;
  line-height: 1.45;
  color: var(--bl-ink-muted);
}
.bl-faq-features li {
  position: relative;
  padding-left: 18px;
}
.bl-faq-features li::before {
  content: '';
  position: absolute;
  left: 1px;
  top: 0.62em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--bl-accent);
  opacity: 0.7;
}
.bl-faq-feature-link {
  font: inherit;
  color: var(--bl-ink);
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-align: left;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, var(--bl-ink) 35%, transparent);
  transition: text-decoration-color 200ms var(--bl-ease);
}
.bl-faq-feature-link:hover,
.bl-faq-feature-link:focus-visible {
  text-decoration-color: currentColor;
  outline: none;
}
.bl-faq-feature-arrow {
  display: inline-block;
  margin-left: 5px;
  transition: transform 200ms var(--bl-ease);
}
.bl-faq-feature-link:hover .bl-faq-feature-arrow,
.bl-faq-feature-link:focus-visible .bl-faq-feature-arrow {
  transform: translateX(3px);
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
        <div className="bl-faq-split">
          <div className="bl-faq-split-col">
            <h3 className="bl-faq-split-eyebrow">For writers</h3>
            <p className="bl-faq-split-invitation">
              Bring your work to a platform built for writers. Find readers who care.
              Beta readers waiting. A community that reads seriously.
            </p>
            <ul className="bl-faq-features">
              <li>Publish your work — reach readers who care.</li>
              <li>Earn tips from readers who love your writing.</li>
              <li>Find beta readers before you publish.</li>
              <li>Discuss craft in writer pods.</li>
              <li>
                <button type="button" className="bl-faq-feature-link" onClick={onWriter}>
                  Turn your book into an audiobook with Volume.
                  <span className="bl-faq-feature-arrow" aria-hidden="true">→</span>
                </button>
              </li>
              <li>
                <a
                  className="bl-faq-feature-link"
                  href={INVITE_READERS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Invite your readers to follow you here.
                  <span className="bl-faq-feature-arrow" aria-hidden="true">→</span>
                </a>
              </li>
            </ul>
            <button type="button" className="bl-faq-split-cta" onClick={onWriter}>
              Submit a manuscript <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="bl-faq-split-col">
            <h3 className="bl-faq-split-eyebrow">For readers</h3>
            <p className="bl-faq-split-invitation">
              Be among the first readers on BetweenReads. Help shape what a reading
              community can be. Volunteer as a beta reader. Your taste matters here.
            </p>
            <ul className="bl-faq-features">
              <li>Emerging authors, or self-published — read them free.</li>
              <li>Tip your favorite authors.</li>
              <li>Review and rate books.</li>
              <li>The more you read, the more credits you earn.</li>
              <li>
                <button type="button" className="bl-faq-feature-link" onClick={onReader}>
                  Recommend a book you love — tell us why.
                  <span className="bl-faq-feature-arrow" aria-hidden="true">→</span>
                </button>
              </li>
              <li>
                <a
                  className="bl-faq-feature-link"
                  href={INVITE_AUTHORS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Help us onboard your favorite authors.
                  <span className="bl-faq-feature-arrow" aria-hidden="true">→</span>
                </a>
              </li>
            </ul>
            <button type="button" className="bl-faq-split-cta" onClick={onReader}>
              Open the shelf <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="bl-faq-teaser-head">
          <span className="bl-faq-eyebrow">Frequently asked</span>
          <h2 className="bl-faq-title">Questions, answered.</h2>
          <p className="bl-faq-lede">
            Answers on credits, copyright, beta reading, AI policy, manuscript protection,
            and more.
          </p>
        </div>

        <Link href="/faq" className="bl-faq-all">
          Read all FAQs <span className="bl-faq-all-arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
