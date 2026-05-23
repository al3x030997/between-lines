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
          <p className="bl-opencall-eyebrow">
            <span className="bl-opencall-eyebrow-mark" aria-hidden="true" />
            Open call
          </p>

          <h2 className="bl-opencall-title">
            <span className="bl-opencall-title-lead">between.</span>
            <em>lines</em> &mdash; first issue, <em>late summer.</em>
          </h2>

          <p className="bl-opencall-lede">
            We&rsquo;re collecting submissions for the first issue of the journal. Looking for serious writing for serious readers.
          </p>

          <ol className="bl-opencall-cards">
            <li>
              <span className="bl-opencall-num">01</span>
              <div className="bl-opencall-card-body">
                <h3 className="bl-opencall-card-title">Late-summer release</h3>
                <p className="bl-opencall-card-text">
                  The inaugural issue lands in August. One curated drop, no monthly grind.
                </p>
              </div>
            </li>
            <li>
              <span className="bl-opencall-num">02</span>
              <div className="bl-opencall-card-body">
                <h3 className="bl-opencall-card-title">Revenue pool participation</h3>
                <p className="bl-opencall-card-text">
                  Selected writers share that issue&rsquo;s new-subscription revenue after platform costs. No paid placement, ever.
                </p>
              </div>
            </li>
            <li>
              <span className="bl-opencall-num">03</span>
              <div className="bl-opencall-card-body">
                <h3 className="bl-opencall-card-title">Editorial-only curation</h3>
                <p className="bl-opencall-card-text">
                  Read by humans. Selection on quality and fit &mdash; not metrics, not algorithms.
                </p>
              </div>
            </li>
          </ol>

          <p className="bl-opencall-note">
            We&rsquo;re looking for <strong>strong, serious writers</strong>. We are author-friendly &mdash; you keep your copyright, we never train AI on your work, and you can withdraw any time.
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
          <article className="bl-opencall-poster">
            <header className="bl-opencall-poster-head">
              <span className="bl-opencall-poster-meta">Issue №01 &middot; Late Summer 2026</span>
              <span className="bl-opencall-poster-rule" />
            </header>
            <div className="bl-opencall-poster-mid">
              <h3 className="bl-opencall-poster-title">
                between.<em>lines</em>
              </h3>
              <p className="bl-opencall-poster-sub">
                A journal of new fiction &amp; serious voices.
              </p>
              <span className="bl-opencall-poster-ornament">⁂</span>
            </div>
            <footer className="bl-opencall-poster-foot">
              <span className="bl-opencall-poster-rule" />
              <span className="bl-opencall-poster-stamp">Open for submissions</span>
            </footer>
          </article>
          <p className="bl-opencall-poster-caption">
            Inaugural issue, summer 2026.
          </p>
        </aside>
      </div>
    </section>
  );
}

const CSS = `
.bl-opencall {
  position: relative;
  background: #F6F1E3;
  color: #161410;
  padding: clamp(96px, 14vh, 160px) clamp(24px, 5vw, 80px);
  overflow: hidden;
}
.bl-opencall::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.05;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.bl-opencall-inner {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  display: grid;
  grid-template-columns: 5fr 3fr;
  gap: clamp(48px, 7vw, 120px);
  align-items: start;
}
.bl-opencall-left {
  display: flex;
  flex-direction: column;
  gap: clamp(26px, 3vw, 40px);
}
.bl-opencall-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.46em;
  text-transform: uppercase;
  color: #C5283D;
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 16px;
}
.bl-opencall-eyebrow-mark {
  display: inline-block;
  width: 36px;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
}
.bl-opencall-title {
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 500;
  font-size: clamp(42px, 5.6vw, 78px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: #161410;
  margin: 0;
  max-width: 16ch;
  text-wrap: balance;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-opencall-title-lead { font-style: normal; }
.bl-opencall-title em {
  font-style: italic;
  font-weight: 500;
  color: #C5283D;
}
.bl-opencall-lede {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(17px, 1.35vw, 21px);
  line-height: 1.55;
  color: #4a463c;
  margin: 0;
  max-width: 52ch;
  text-wrap: pretty;
}
.bl-opencall-cards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(22, 20, 16, 0.18);
}
.bl-opencall-cards li {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 24px;
  align-items: baseline;
  padding: 22px 0;
  border-bottom: 1px solid rgba(22, 20, 16, 0.18);
}
.bl-opencall-num {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.24em;
  color: #C5283D;
  font-variant-numeric: tabular-nums;
}
.bl-opencall-card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.bl-opencall-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(22px, 2.1vw, 28px);
  line-height: 1.12;
  letter-spacing: -0.005em;
  color: #161410;
  margin: 0;
}
.bl-opencall-card-text {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: #4a463c;
  margin: 0;
  max-width: 52ch;
  text-wrap: pretty;
}
.bl-opencall-note {
  font-family: 'Outfit', sans-serif;
  font-size: 15.5px;
  line-height: 1.6;
  color: #4a463c;
  margin: 0;
  max-width: 52ch;
  text-wrap: pretty;
}
.bl-opencall-note strong {
  font-weight: 600;
  color: #161410;
}
.bl-opencall-cta {
  display: flex;
  gap: clamp(16px, 2vw, 28px);
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
}
.bl-opencall-cta-primary {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #C5283D;
  color: #F6F1E3;
  padding: 16px 30px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), box-shadow 220ms ease;
  box-shadow: 0 4px 14px rgba(197, 40, 61, 0.18);
}
.bl-opencall-cta-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(197, 40, 61, 0.24);
}
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
  color: #161410;
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
  transition: opacity 200ms ease, background 200ms ease;
}
.bl-opencall-cta-ghost:hover {
  color: #C5283D;
}
.bl-opencall-cta-ghost:hover::after { opacity: 1; }

/* Right column poster */
.bl-opencall-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  position: sticky;
  top: clamp(90px, 12vh, 120px);
}
.bl-opencall-poster {
  width: 100%;
  max-width: 380px;
  aspect-ratio: 3/4;
  background: linear-gradient(180deg, #C5283D 0%, #921a2b 100%);
  color: #F6F1E3;
  padding: clamp(24px, 3vw, 36px) clamp(22px, 2.8vw, 32px);
  display: grid;
  grid-template-rows: auto 1fr auto;
  box-shadow: 0 30px 60px rgba(22, 20, 16, 0.22), 0 6px 14px rgba(22, 20, 16, 0.1);
  position: relative;
  overflow: hidden;
  transform: rotate(-1.2deg);
  transition: transform 480ms cubic-bezier(.22, 1, .36, 1);
}
.bl-opencall-poster:hover {
  transform: rotate(0deg) translateY(-4px);
}
.bl-opencall-poster::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.09;
  mix-blend-mode: overlay;
  pointer-events: none;
}
.bl-opencall-poster-head,
.bl-opencall-poster-foot {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
  position: relative;
  z-index: 1;
}
.bl-opencall-poster-meta {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-align: center;
  text-transform: uppercase;
  opacity: 0.88;
}
.bl-opencall-poster-rule {
  width: 100%;
  height: 1px;
  background: currentColor;
  opacity: 0.42;
}
.bl-opencall-poster-mid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  text-align: center;
  position: relative;
  z-index: 1;
}
.bl-opencall-poster-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(36px, 5vw, 58px);
  line-height: 1;
  letter-spacing: -0.022em;
  margin: 0;
}
.bl-opencall-poster-title em {
  font-style: italic;
  font-weight: 500;
}
.bl-opencall-poster-sub {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.35;
  margin: 0;
  opacity: 0.88;
  max-width: 22ch;
}
.bl-opencall-poster-ornament {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  opacity: 0.72;
  letter-spacing: 0.1em;
}
.bl-opencall-poster-stamp {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.34em;
  text-align: center;
  text-transform: uppercase;
  padding: 9px 14px;
  border: 1px solid currentColor;
  opacity: 0.94;
  align-self: center;
}
.bl-opencall-poster-caption {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6b6357;
  margin: 0;
  text-align: center;
}

@media (max-width: 940px) {
  .bl-opencall-inner { grid-template-columns: 1fr; gap: clamp(40px, 6vw, 64px); }
  .bl-opencall-right { position: static; order: -1; }
  .bl-opencall-poster { max-width: 280px; }
}
@media (max-width: 540px) {
  .bl-opencall-poster { max-width: 240px; }
  .bl-opencall-cards li { grid-template-columns: 40px 1fr; gap: 16px; }
}
`;
