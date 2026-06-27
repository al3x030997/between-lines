import Link from 'next/link';

export default function BetweenCharacters() {
  return (
    <section className="bl-bchars" aria-labelledby="bl-bchars-title">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <header className="bl-bchars-about-head">
        <h2 className="bl-bchars-title" id="bl-bchars-title">
          In a world of distractions,
          <br />
          <span className="bl-bchars-about-mark">
            we&rsquo;re built to <em>read.</em>
          </span>
        </h2>
        <p className="bl-bchars-about-lede">
          BetweenReads is an ad-free home for readers, writers, poets, and illustrators &mdash;
          where the best work rises through tailored reading, honest recommendations, and
          community trust.
        </p>

        <div className="bl-bchars-about-ctas">
          <Link href="/faq" className="bl-bchars-about-cta bl-bchars-about-cta--ghost">
            Read the FAQ
          </Link>
          <Link href="/features" className="bl-bchars-about-cta bl-bchars-about-cta--solid">
            Learn more
          </Link>
        </div>
      </header>
    </section>
  );
}

const STYLES = `
.bl-bchars {
  --bc-ink: #1a1714;
  --bc-muted: #6b6358;
  --bc-faint: #948b7c;
  --bc-line: rgba(14, 14, 12, 0.10);
  --bc-line-mid: rgba(14, 14, 12, 0.18);
  --bc-accent: #0e0e0c;
  --bc-accent-dim: rgba(14, 14, 12, 0.06);
  --bc-on-accent: #f3d84a;
  position: relative;
  min-height: 100vh;
  padding: clamp(72px, 10vh, 120px) clamp(24px, 5.5vw, 88px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: var(--bc-ink);
  font-family: var(--br-font-sans, var(--bl-font-body));
  overflow: hidden;
  isolation: isolate;
}

/* Header: illustrated, centered "About" treatment */
.bl-bchars-about-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 880px;
  margin: 0 auto;
  position: relative;
}
.bl-bchars-title {
  position: relative;
  z-index: 1;
  margin: 0;
  font-family: var(--br-font-display, var(--bl-font-serif));
  font-weight: 900;
  font-size: clamp(42px, 6.6vw, 78px);
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--bc-ink);
  text-wrap: balance;
}
.bl-bchars-title em { font-style: italic; font-weight: 700; }
.bl-bchars-about-mark {
  background: linear-gradient(to bottom, transparent 60%, var(--theme-yellow) 60%);
  padding: 0 2px;
}
.bl-bchars-about-lede {
  position: relative;
  z-index: 1;
  margin: clamp(20px, 3vw, 28px) auto 0;
  max-width: 62ch;
  font-family: var(--bl-font-body);
  font-size: clamp(19px, 1.9vw, 25px);
  line-height: 1.56;
  color: var(--theme-text-muted, var(--bc-muted));
  text-wrap: pretty;
}

/* CTAs below the lede */
.bl-bchars-about-ctas {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: clamp(36px, 5vw, 52px);
}
.bl-bchars-about-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 28px;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  transition: transform 200ms ease, background 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.bl-bchars-about-cta--ghost {
  border: 1px solid var(--bc-line-mid);
  color: var(--bc-ink);
  background: transparent;
}
.bl-bchars-about-cta--ghost:hover {
  border-color: var(--bc-ink);
  background: rgba(14, 14, 12, 0.04);
  transform: translateY(-2px);
}
.bl-bchars-about-cta--solid {
  border: 1px solid var(--bc-accent);
  background: var(--bc-accent);
  color: var(--bc-on-accent);
}
.bl-bchars-about-cta--solid:hover {
  background: #ffe948;
  border-color: #ffe948;
  color: var(--bc-accent);
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(243, 216, 74, 0.35);
}

@media (max-width: 760px) {
  .bl-bchars {
    padding-inline: 20px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bl-bchars *,
  .bl-bchars *::before,
  .bl-bchars *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
