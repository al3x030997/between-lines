import Link from 'next/link';
import { PILL_BG } from './opencall/quotes';

// Line-art "who it's for" icons, drawn to sit inside a pastel circle chip.
function ChipIconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 6.2C10.4 5 8 4.6 5.6 4.8c-.6 0-1 .5-1 1.1v11.4c0 .7.6 1.2 1.3 1.1 2.1-.3 4.3.1 5.7 1.1.3.2.7.2 1 0 1.4-1 3.6-1.4 5.7-1.1.7.1 1.3-.4 1.3-1.1V5.9c0-.6-.4-1.1-1-1.1-2.4-.2-4.8.2-6.4 1.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 6.2v12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ChipIconQuill() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18.5 3.5c-3.8.4-8 2.6-10.3 6.2-1.4 2.2-2 4.6-1.9 6.8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M18.5 3.5c.6 3.6-.4 7.4-3.1 10.4-2 2.2-4.6 3.5-7.1 3.7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M8.3 15.6 4.6 19.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 13l1.8 1.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function ChipIconFeather() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17 4c-5.2 1-9.6 5.2-10.4 10.4-.2 1.3-.3 2.7-.1 4 1.3.2 2.7.1 4-.1C15.7 17.5 19.9 13.1 21 8c-1.4 0-2.8.4-4 1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 4 6.6 18.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
      <path d="M14.6 7.4 11 10" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.55" />
      <path d="M13 10.8 9.6 13.2" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.55" />
      <path d="M11.4 14.2 8.3 16.4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function ChipIconPaintbrush() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.8 14.2 17 5.6c.6-.7 1.7-.8 2.4-.2.7.6.8 1.7.2 2.4l-7.4 8.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.8 14.2c1 .3 1.8 1.1 2 2.1.3 1.5-.6 2.3-1.8 2.9-1.6.8-3.6.9-5-.2 1-.6 1-1.6.9-2.6-.1-1.3.5-2.6 1.6-3.1.7-.3 1.5-.3 2.3.1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const AUDIENCE_CHIPS = [
  { label: 'Readers', Icon: ChipIconBook, category: 'read' },
  { label: 'Writers', Icon: ChipIconQuill, category: 'write' },
  { label: 'Poets', Icon: ChipIconFeather, category: 'both' },
  { label: 'Illustrators', Icon: ChipIconPaintbrush, category: 'character' },
] as const;

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

        <div className="bl-bchars-about-chips" role="list" aria-label="Who BetweenReads is for">
          {AUDIENCE_CHIPS.map(({ label, Icon, category }) => {
            const pill = PILL_BG[category];
            return (
              <div className="bl-bchars-about-chip" role="listitem" key={label}>
                <span
                  className="bl-bchars-about-chip-icon"
                  style={{ background: pill.bg, color: pill.color }}
                >
                  <Icon />
                </span>
                <span className="bl-bchars-about-chip-label">{label}</span>
              </div>
            );
          })}
        </div>

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
  font-size: clamp(48px, 7.6vw, 92px);
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
  font-size: clamp(22px, 2.2vw, 30px);
  line-height: 1.56;
  color: var(--theme-text-muted, var(--bc-muted));
  text-wrap: pretty;
}

/* "Who it's for" chips */
.bl-bchars-about-chips {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(28px, 4.5vw, 52px);
  margin-top: clamp(32px, 4.4vw, 46px);
}
.bl-bchars-about-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.bl-bchars-about-chip-icon {
  width: 104px;
  height: 104px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: transform 280ms cubic-bezier(.22, 1, .36, 1), box-shadow 280ms cubic-bezier(.22, 1, .36, 1);
}
.bl-bchars-about-chip-icon svg {
  width: 46px;
  height: 46px;
  transition: transform 280ms cubic-bezier(.22, 1, .36, 1);
}
.bl-bchars-about-chip:hover .bl-bchars-about-chip-icon {
  transform: translateY(-8px) scale(1.18) rotate(-4deg);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.22);
}
.bl-bchars-about-chip:hover .bl-bchars-about-chip-icon svg {
  transform: scale(1.08);
}
.bl-bchars-about-chip-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bc-muted);
  transition: color 220ms ease, transform 220ms ease;
}
.bl-bchars-about-chip:hover .bl-bchars-about-chip-label {
  color: var(--bc-ink);
  transform: translateY(-2px);
}

/* CTAs below the chips */
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
  .bl-bchars-about-chips {
    gap: 16px;
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
