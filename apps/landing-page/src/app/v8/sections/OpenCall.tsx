'use client';

import Link from 'next/link';

type Props = {
  onSubmit?: () => void;
};

export default function OpenCall({ onSubmit }: Props) {
  const handleSubmit = (e: React.MouseEvent) => {
    if (onSubmit) {
      e.preventDefault();
      onSubmit();
    }
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
            <span className="bl-opencall-sticker bl-opencall-sticker-tl">
              <span className="bl-opencall-sticker-arrow">&#x2198;</span>
              First 50 pages, free
            </span>
            <span className="bl-opencall-sticker bl-opencall-sticker-r">
              <span className="bl-opencall-sticker-arrow">&#x2197;</span>
              Author-friendly
            </span>
            <span className="bl-opencall-sticker bl-opencall-sticker-bl">
              <span className="bl-opencall-sticker-arrow">&rarr;</span>
              No algorithms inside
            </span>

            <div className="bl-opencall-cover-paper" aria-hidden="true" />

            <article className="bl-opencall-cover">
              <span className="bl-opencall-cover-spine">
                <span>BL &middot; ISSUE 01</span>
              </span>
              <header className="bl-opencall-cover-head">
                <span className="bl-opencall-cover-imprint">BL Press</span>
                <span className="bl-opencall-cover-num">N&#x00BA; 001</span>
              </header>
              <div className="bl-opencall-cover-mid">
                <h3 className="bl-opencall-cover-title">
                  A path
                  <br />
                  for every
                  <br />
                  <em>manuscript</em>
                </h3>
              </div>
              <footer className="bl-opencall-cover-foot">
                <span className="bl-opencall-cover-rule" />
                <span className="bl-opencall-cover-byline">
                  The editors at BetweenReads
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
  background: #ffffff;
  color: #0e0e0c;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #e94b36;
  margin: 0;
  font-feature-settings: "kern", "liga";
}
.bl-opencall-title {
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 600;
  font-size: clamp(36px, 5vw, 68px);
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: #0e0e0c;
  margin: 0 0 6px;
  max-width: 22ch;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-opencall-title em {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 50;
}
.bl-opencall-body {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #4a4640;
  margin: 0;
  line-height: 1.6;
  text-wrap: pretty;
  max-width: 56ch;
}
.bl-opencall-body strong {
  font-weight: 600;
  color: #0e0e0c;
}
.bl-opencall-cta {
  display: flex;
  gap: clamp(16px, 2vw, 28px);
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
}
.bl-opencall-cta-primary {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #0e0e0c;
  color: #ffffff;
  padding: 15px 28px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), background 200ms ease;
}
.bl-opencall-cta-primary:hover { transform: translateY(-1px); background: #e94b36; }
.bl-opencall-cta-arrow {
  display: inline-block;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-opencall-cta-primary:hover .bl-opencall-cta-arrow { transform: translateX(3px); }
.bl-opencall-cta-ghost {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0e0e0c;
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
.bl-opencall-cta-ghost:hover { color: #e94b36; }
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
  color: #F6F1E3;
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
  background: #F6F1E3;
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
  font-family: 'Bricolage Grotesque', sans-serif;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(246, 241, 227, 0.94);
}
.bl-opencall-cover-mid {
  display: flex;
  align-items: center;
}
.bl-opencall-cover-title {
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 600;
  font-size: clamp(38px, 4.6vw, 54px);
  line-height: 0.98;
  letter-spacing: -0.022em;
  margin: 0;
  color: #F6F1E3;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-opencall-cover-title em {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 50;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(246, 241, 227, 0.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Sticker labels with arrows */
.bl-opencall-sticker {
  position: absolute;
  z-index: 3;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: #ffffff;
  color: #0e0e0c;
  border: 1px solid #0e0e0c;
  padding: 9px 14px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 14px rgba(22, 20, 16, 0.1);
}
.bl-opencall-sticker-arrow {
  display: inline-block;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0;
}
.bl-opencall-sticker-tl {
  top: -12px;
  left: -34px;
  transform: rotate(-4deg);
}
.bl-opencall-sticker-r {
  top: 44%;
  right: -68px;
  transform: rotate(3deg);
}
.bl-opencall-sticker-bl {
  bottom: 32px;
  left: -42px;
  transform: rotate(-2deg);
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
  .bl-opencall-sticker-tl { left: -16px; top: -8px; }
  .bl-opencall-sticker-r { right: -28px; top: 44%; }
  .bl-opencall-sticker-bl { left: -20px; bottom: 28px; }
}
@media (max-width: 520px) {
  .bl-opencall-cover-frame { width: min(280px, 92%); }
  .bl-opencall-sticker { font-size: 10px; padding: 7px 11px; letter-spacing: 0.14em; }
  .bl-opencall-sticker-tl { left: -10px; }
  .bl-opencall-sticker-r { right: -16px; }
  .bl-opencall-sticker-bl { left: -12px; }
}
`;
