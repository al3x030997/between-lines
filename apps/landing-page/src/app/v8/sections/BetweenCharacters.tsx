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

// Loose decorative line-art doodles scattered around the illustrated header.
function DoodleQuoteMarks() {
  return (
    <svg viewBox="0 0 80 60" fill="none" aria-hidden="true">
      <path
        d="M6 34c0-10 6-17 15-20l1.6 4.4c-6 2.2-9 6-9 11 .6-.2 1.4-.3 2.2-.3 4 0 7 3 7 6.8 0 4-3.2 7.1-7.4 7.1-5.6 0-9.4-4-9.4-9Z"
        fill="currentColor"
      />
      <path
        d="M40 34c0-10 6-17 15-20l1.6 4.4c-6 2.2-9 6-9 11 .6-.2 1.4-.3 2.2-.3 4 0 7 3 7 6.8 0 4-3.2 7.1-7.4 7.1-5.6 0-9.4-4-9.4-9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DoodleSparkle() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 2c.8 6.6 2.6 12 5.6 15.6C28.6 21.2 33 23 38 24c-5 1-9.4 2.8-12.4 6.4C22.6 34 20.8 35 20 38c-.8-3-2.6-4-5.6-7.6C11.4 26.8 7 25 2 24c5-1 9.4-2.8 12.4-6.4C17.4 14 19.2 8.6 20 2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DoodleBook() {
  return (
    <svg viewBox="0 0 60 44" fill="none" aria-hidden="true">
      <path
        d="M30 9.6C25.8 6.4 18.6 5 12 5.6c-1.4.1-2.4 1.3-2.4 2.7v26c0 1.7 1.4 2.9 3.1 2.7 5-.6 10.4.3 13.7 2.6.9.6 2 .6 2.9 0 3.3-2.3 8.7-3.2 13.7-2.6 1.7.2 3.1-1 3.1-2.7v-26c0-1.4-1-2.6-2.4-2.7-6.6-.6-13.8.8-18 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M30 9.6v26" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function DoodleInkDrop() {
  return (
    <svg viewBox="0 0 36 44" fill="none" aria-hidden="true">
      <path
        d="M18 3c6 8.4 11 15.8 11 21.6 0 6.6-4.9 11.9-11 11.9S7 31.2 7 24.6C7 18.8 12 11.4 18 3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="24.5" cy="36.5" r="1.8" fill="currentColor" />
    </svg>
  );
}

export default function BetweenCharacters() {
  return (
    <section className="bl-bchars" aria-labelledby="bl-bchars-title">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <header className="bl-bchars-about-head">
        <span className="bl-bchars-about-doodle bl-bchars-about-doodle--quote" aria-hidden="true">
          <DoodleQuoteMarks />
        </span>
        <span className="bl-bchars-about-doodle bl-bchars-about-doodle--sparkle" aria-hidden="true">
          <DoodleSparkle />
        </span>
        <span className="bl-bchars-about-doodle bl-bchars-about-doodle--book" aria-hidden="true">
          <DoodleBook />
        </span>
        <span className="bl-bchars-about-doodle bl-bchars-about-doodle--drop" aria-hidden="true">
          <DoodleInkDrop />
        </span>

        <p className="bl-bchars-eyebrow">Between Reads</p>
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
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 35px,
    var(--bc-line) 35px,
    var(--bc-line) 36px
  );
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
.bl-bchars-eyebrow {
  margin: 0 0 16px;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--bc-accent);
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

/* Loose decorative doodles scattered around the header */
.bl-bchars-about-doodle {
  position: absolute;
  display: block;
  color: var(--bc-ink);
  pointer-events: none;
  z-index: 0;
}
.bl-bchars-about-doodle svg {
  display: block;
  width: 100%;
  height: 100%;
}
.bl-bchars-about-doodle--quote {
  top: -38px;
  left: -16px;
  width: 132px;
  height: 99px;
  opacity: 0.09;
}
.bl-bchars-about-doodle--sparkle {
  top: -2%;
  right: -1%;
  width: 60px;
  height: 60px;
  opacity: 0.45;
  color: var(--theme-yellow-deep, var(--bc-accent));
}
.bl-bchars-about-doodle--book {
  bottom: 12%;
  left: -9%;
  width: 86px;
  height: 63px;
  opacity: 0.24;
  transform: rotate(-9deg);
}
.bl-bchars-about-doodle--drop {
  bottom: -24px;
  right: 1%;
  width: 42px;
  height: 52px;
  opacity: 0.32;
}

@media (max-width: 640px) {
  .bl-bchars-about-doodle {
    display: none;
  }
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
