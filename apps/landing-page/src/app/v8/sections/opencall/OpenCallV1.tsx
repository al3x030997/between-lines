'use client';

import Link from 'next/link';

type Props = {
  onReader: () => void;
  onWriter: () => void;
};

export default function OpenCallV1({ onWriter }: Props) {
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    onWriter();
  };

  return (
    <section id="open-call" className="bl-opencall" aria-label="Open call for submissions">
      <style>{CSS}</style>
      <div className="bl-opencall-inner">
        <div className="bl-opencall-left">
          <p className="bl-opencall-eyebrow">Issue №01 &middot; submissions open</p>

          <h2 className="bl-opencall-title">
            Read the first issue &mdash;
            <br />
            <em>or write your way in.</em>
          </h2>

          <p className="bl-opencall-body">
            A curated issue of emerging fiction and poetry, hand-picked by editors. We&rsquo;re
            looking for <strong>strong, serious writers</strong> &mdash; and we are author-friendly.
          </p>

          <p className="bl-opencall-body">
            Open to any writer on the platform &mdash; <strong>free to submit while we launch</strong>.
            Selected writers share a portion of that issue&rsquo;s new-subscription revenue.
            Readers can recommend a writer for free.
          </p>

          <div className="bl-opencall-cta">
            <Link
              href="/?intake=writer"
              className="bl-opencall-cta-primary"
              onClick={handleSubmit}
            >
              Submit your work
              <span className="bl-opencall-cta-arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/faq#writers" className="bl-opencall-cta-ghost">
              How the journal works
            </Link>
          </div>
        </div>

        <aside className="bl-opencall-right" aria-hidden="true">
          <div className="bl-opencall-cover-frame">
            <div className="bl-opencall-cover-paper" aria-hidden="true" />

            <article className="bl-opencall-cover">
              <span className="bl-opencall-cover-spine">
                <span>BETWEENREADS &middot; ISSUE 01</span>
              </span>
              <header className="bl-opencall-cover-head">
                <span className="bl-opencall-cover-imprint">BetweenReads</span>
                <span className="bl-opencall-cover-num">N&#x00BA; 001</span>
              </header>
              <div className="bl-opencall-cover-mid">
                <h3 className="bl-opencall-cover-title">
                  Six debuts.
                  <br />
                  <em>Zero algorithms.</em>
                </h3>
                <p className="bl-opencall-cover-toc">
                  Fiction &middot; Essays &middot; Audiobooks
                  <br />
                  Three free reads a month. Yours.
                </p>
              </div>
              <footer className="bl-opencall-cover-foot">
                <span className="bl-opencall-cover-rule" />
                <span className="bl-opencall-cover-byline">
                  Six debut voices &middot; Spring 2026
                </span>
              </footer>
            </article>
          </div>
        </aside>
      </div>
    </section>
  );
}

const CSS = `
.bl-opencall {
  position: relative;
  background: var(--bl-surface);
  color: var(--bl-ink);
  padding: clamp(96px, 14vh, 140px) clamp(24px, 5vw, 80px);
  overflow: hidden;
}
.bl-opencall-inner {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  display: grid;
  grid-template-columns: 5fr 4fr;
  gap: clamp(48px, 7vw, 120px);
  align-items: center;
}
.bl-opencall-left {
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 2.4vw, 30px);
}
.bl-opencall-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0;
  font-feature-settings: "kern", "liga";
}
.bl-opencall-title {
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(36px, 5vw, 68px);
  letter-spacing: -0.035em;
  line-height: 1.02;
  color: var(--bl-ink);
  margin: 0 0 6px;
  max-width: 18ch;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt";
}
.bl-opencall-title em {
  display: inline-block;
  margin-top: 4px;
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  color: var(--bl-accent);
  letter-spacing: -0.01em;
}
.bl-opencall-body {
  font-family: var(--bl-font-body);
  font-size: 16px;
  font-weight: 400;
  color: var(--bl-ink-muted);
  margin: 0;
  line-height: 1.6;
  text-wrap: pretty;
  max-width: 56ch;
}
.bl-opencall-body strong {
  font-weight: 600;
  color: var(--bl-ink);
}
.bl-opencall-cta {
  display: flex;
  gap: clamp(16px, 2vw, 28px);
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
}
.bl-opencall-cta-primary {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--bl-ink);
  color: var(--bl-surface);
  padding: 15px 28px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), background 200ms ease;
}
.bl-opencall-cta-primary:hover { transform: translateY(-1px); background: var(--bl-accent); }
.bl-opencall-cta-arrow {
  display: inline-block;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-opencall-cta-primary:hover .bl-opencall-cta-arrow { transform: translateX(3px); }
.bl-opencall-cta-ghost {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-ink);
  text-decoration: none;
  padding: 6px 2px;
  position: relative;
  transition: color 200ms ease;
}
.bl-opencall-cta-ghost::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: currentColor;
  opacity: 0.45;
  transition: opacity 200ms ease;
}
.bl-opencall-cta-ghost:hover { color: var(--bl-accent); }
.bl-opencall-cta-ghost:hover::after { opacity: 1; }

/* ===== Right column: the journal cover, mocked as a tilted poster ===== */
.bl-opencall-right {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 540px;
}
.bl-opencall-cover-frame {
  position: relative;
  width: min(420px, 100%);
  aspect-ratio: 3/4;
}
.bl-opencall-cover {
  position: absolute;
  inset: 0;
  background: #B98740;
  background-image:
    linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.07) 100%),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/></svg>");
  color: var(--bl-paper-bg);
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: clamp(22px, 2.8vw, 32px) clamp(24px, 3vw, 36px) clamp(22px, 2.8vw, 32px) clamp(48px, 5.5vw, 64px);
  box-shadow: 0 30px 60px rgba(22, 20, 16, 0.22), 0 6px 16px rgba(22, 20, 16, 0.1);
  transform: rotate(-3.6deg);
  transform-origin: 60% 50%;
  transition: transform 520ms cubic-bezier(.22, 1, .36, 1);
  z-index: 2;
}
.bl-opencall-cover:hover {
  transform: rotate(-1.8deg) translateY(-4px);
}
.bl-opencall-cover-paper {
  position: absolute;
  inset: 0;
  background: var(--bl-paper-bg);
  border: 1px solid rgba(22, 20, 16, 0.08);
  box-shadow: 0 14px 30px rgba(22, 20, 16, 0.12);
  transform: rotate(-1.4deg) translate(20px, 16px);
  z-index: 1;
}
.bl-opencall-cover-spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: clamp(22px, 2.4vw, 32px);
  width: 1px;
  background: rgba(246, 241, 227, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
.bl-opencall-cover-spine span {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: rgba(246, 241, 227, 0.84);
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  white-space: nowrap;
  background: #B98740;
  padding: 6px 3px;
}
.bl-opencall-cover-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(246, 241, 227, 0.94);
}
.bl-opencall-cover-mid {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.bl-opencall-cover-title {
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(34px, 4.2vw, 50px);
  line-height: 0.96;
  letter-spacing: -0.04em;
  margin: 0;
  color: var(--bl-paper-bg);
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt";
}
.bl-opencall-cover-title em {
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  letter-spacing: -0.02em;
}
.bl-opencall-cover-toc {
  margin: clamp(14px, 1.6vw, 20px) 0 0;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(12px, 1.05vw, 14px);
  line-height: 1.5;
  letter-spacing: 0.01em;
  color: rgba(246, 241, 227, 0.88);
}
.bl-opencall-cover-foot {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bl-opencall-cover-rule {
  width: 100%;
  height: 1px;
  background: rgba(246, 241, 227, 0.55);
}
.bl-opencall-cover-byline {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(246, 241, 227, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 980px) {
  .bl-opencall-inner {
    grid-template-columns: 1fr;
    gap: clamp(56px, 8vw, 80px);
  }
  .bl-opencall-right {
    order: -1;
    min-height: auto;
    padding: 24px 0 28px;
  }
  .bl-opencall-cover-frame { width: min(320px, 100%); }
}
@media (max-width: 520px) {
  .bl-opencall-cover-frame { width: min(280px, 92%); }
}
`;
