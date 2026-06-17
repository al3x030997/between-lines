import type { ReactNode } from 'react';

type Props = {
  onReader: () => void;
  onWriter: () => void;
};

type Social = {
  name: string;
  label: string;
  href: string;
  icon: ReactNode;
};

// Replace the placeholder `#` hrefs with real profile URLs when available.
const SOCIALS: Social[] = [
  {
    name: 'instagram',
    label: 'Follow BetweenReads on Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.5.01-4.74.07-.9.04-1.38.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.33-.28.81-.32 1.71-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.9.19 1.38.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.13.81.28 1.71.32 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.33.28-.81.32-1.71.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.33-.13-.81-.28-1.71-.32-1.24-.06-1.59-.07-4.74-.07Zm0 2.76a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Zm0 1.62a3.68 3.68 0 1 0 0 7.36 3.68 3.68 0 0 0 0-7.36Zm5.5-.16a1.24 1.24 0 1 1-2.48 0 1.24 1.24 0 0 1 2.48 0Z" />
      </svg>
    ),
  },
  {
    name: 'tiktok',
    label: 'Follow BetweenReads on TikTok',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.86a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1 0-5.18c.27 0 .53.04.77.12V9.96a5.86 5.86 0 0 0-.77-.05A5.79 5.79 0 1 0 15.34 15.7V9.01a7.45 7.45 0 0 0 4.35 1.39V7.2a4.28 4.28 0 0 1-3.09-1.38Z" />
      </svg>
    ),
  },
  {
    name: 'facebook',
    label: 'Follow BetweenReads on Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
      </svg>
    ),
  },
  {
    name: 'discord',
    label: 'Join the BetweenReads Discord',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M20.32 4.94A19.8 19.8 0 0 0 15.43 3.4a.07.07 0 0 0-.08.04c-.21.38-.44.87-.61 1.25a18.3 18.3 0 0 0-5.49 0c-.17-.39-.41-.87-.62-1.25a.08.08 0 0 0-.08-.04A19.74 19.74 0 0 0 3.66 4.94a.07.07 0 0 0-.03.03C.53 9.6-.32 14.13.1 18.6a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .09-.03c.46-.63.87-1.29 1.23-1.99a.08.08 0 0 0-.04-.11c-.65-.25-1.27-.55-1.87-.89a.08.08 0 0 1-.01-.13c.13-.09.25-.19.37-.29a.08.08 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.08.08 0 0 1 .08.01c.12.1.24.2.37.29a.08.08 0 0 1-.01.13c-.6.35-1.22.64-1.87.89a.08.08 0 0 0-.04.11c.36.7.78 1.36 1.23 1.99a.08.08 0 0 0 .09.03 19.84 19.84 0 0 0 6-3.03.08.08 0 0 0 .03-.06c.5-5.18-.84-9.67-3.54-13.63a.06.06 0 0 0-.03-.03ZM8.02 15.88c-1.18 0-2.16-1.08-2.16-2.41 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.96 2.41-2.16 2.41Zm7.97 0c-1.18 0-2.16-1.08-2.16-2.41 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.41-2.16 2.41Z" />
      </svg>
    ),
  },
  {
    name: 'x',
    label: 'Follow BetweenReads on X',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64Z" />
      </svg>
    ),
  },
];

const STYLES = `
.bl-closing {
  font-family: var(--bl-font-display);
}

/* ---- A. Socials strip ---- */
.bl-closing-socials {
  background: var(--bl-surface);
  color: var(--bl-ink);
  padding: clamp(64px, 8vw, 104px) clamp(24px, 5vw, 80px);
}
.bl-closing-socials-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(28px, 5vw, 64px);
  flex-wrap: wrap;
}
.bl-closing-socials-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 46ch;
}
.bl-closing-eyebrow {
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
  align-self: flex-start;
}
.bl-closing-eyebrow::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 64px;
  background: var(--bl-accent-strong);
}
.bl-closing-socials-blurb {
  font-family: var(--bl-font-body);
  font-size: clamp(18px, 1.5vw, 22px);
  line-height: 1.55;
  color: var(--bl-ink-muted);
  margin: 0;
  text-wrap: pretty;
}
.bl-closing-socials-icons {
  list-style: none;
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.4vw, 18px);
  margin: 0;
  padding: 0;
}
.bl-closing-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: 1px solid var(--theme-border-subtle);
  color: var(--bl-ink);
  text-decoration: none;
  transition:
    color 220ms var(--bl-ease),
    border-color 220ms var(--bl-ease),
    background 220ms var(--bl-ease),
    transform 220ms var(--bl-ease);
}
.bl-closing-social:hover,
.bl-closing-social:focus-visible {
  color: var(--bl-accent-strong);
  border-color: var(--bl-accent);
  background: var(--bl-accent-soft);
  transform: translateY(-2px);
  outline: none;
}
.bl-closing-social:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--bl-accent) 45%, transparent);
}

/* ---- B. Final CTA band ---- */
.bl-closing-cta {
  position: relative;
  overflow: hidden;
  background: #161410;
  color: #f6f1e3;
  padding: clamp(72px, 11vw, 132px) clamp(24px, 5vw, 80px);
  text-align: center;
}
.bl-closing-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.05;
  pointer-events: none;
}
.bl-closing-cta::after {
  content: '';
  position: absolute;
  left: 50%;
  top: -40%;
  width: min(680px, 90%);
  height: 80%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, color-mix(in srgb, var(--bl-accent) 18%, transparent), transparent 70%);
  pointer-events: none;
}
.bl-closing-cta-inner {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.bl-closing-cta-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0;
  animation: bl-closing-rise 640ms var(--bl-ease) both;
}
.bl-closing-cta-title {
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(34px, 5vw, 60px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: #fdfbf4;
  margin: 0;
  text-wrap: balance;
  font-feature-settings: "kern", "liga";
  animation: bl-closing-rise 640ms var(--bl-ease) 80ms both;
}
.bl-closing-cta-title em {
  font-style: italic;
  color: var(--bl-accent);
}
.bl-closing-cta-sub {
  font-family: var(--bl-font-body);
  font-size: clamp(17px, 1.4vw, 20px);
  line-height: 1.55;
  color: color-mix(in srgb, #f6f1e3 76%, transparent);
  margin: 0;
  max-width: 48ch;
  text-wrap: pretty;
  animation: bl-closing-rise 640ms var(--bl-ease) 160ms both;
}
.bl-closing-cta-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 14px;
  animation: bl-closing-rise 640ms var(--bl-ease) 240ms both;
}
.bl-closing-pill {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    transform 220ms var(--bl-ease),
    box-shadow 220ms var(--bl-ease),
    background 220ms var(--bl-ease),
    border-color 220ms var(--bl-ease),
    color 220ms var(--bl-ease);
}
.bl-closing-pill-primary {
  background: var(--bl-accent);
  color: #161410;
  border: 1px solid var(--bl-accent);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--bl-accent) 30%, transparent);
}
.bl-closing-pill-primary:hover,
.bl-closing-pill-primary:focus-visible {
  background: var(--bl-accent-strong);
  border-color: var(--bl-accent-strong);
  transform: translateY(-2px);
  box-shadow: 0 14px 30px color-mix(in srgb, var(--bl-accent) 42%, transparent);
  outline: none;
}
.bl-closing-pill-ghost {
  background: transparent;
  color: #f6f1e3;
  border: 1px solid color-mix(in srgb, #f6f1e3 38%, transparent);
}
.bl-closing-pill-ghost:hover,
.bl-closing-pill-ghost:focus-visible {
  border-color: #f6f1e3;
  background: color-mix(in srgb, #f6f1e3 8%, transparent);
  transform: translateY(-2px);
  outline: none;
}
.bl-closing-pill:focus-visible {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--bl-accent) 55%, transparent);
}
.bl-closing-pill-arrow {
  transition: transform 240ms var(--bl-ease);
}
.bl-closing-pill:hover .bl-closing-pill-arrow,
.bl-closing-pill:focus-visible .bl-closing-pill-arrow {
  transform: translateX(4px);
}

@keyframes bl-closing-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .bl-closing-socials-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
  }
  .bl-closing-cta-actions {
    flex-direction: column;
    align-self: stretch;
  }
  .bl-closing-pill {
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bl-closing-cta-eyebrow,
  .bl-closing-cta-title,
  .bl-closing-cta-sub,
  .bl-closing-cta-actions {
    animation: none;
  }
  .bl-closing-social,
  .bl-closing-pill,
  .bl-closing-pill-arrow {
    transition: none;
  }
}
`;

export default function ClosingCta({ onReader, onWriter }: Props) {
  return (
    <section className="bl-closing" aria-label="Connect with us and sign up">
      <style>{STYLES}</style>

      <div className="bl-closing-socials">
        <div className="bl-closing-socials-inner">
          <div className="bl-closing-socials-text">
            <span className="bl-closing-eyebrow">Join us on socials</span>
            <p className="bl-closing-socials-blurb">
              Writing tips, sneak peeks, and a community that reads before the world
              does.
            </p>
          </div>
          <ul className="bl-closing-socials-icons">
            {SOCIALS.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="bl-closing-social"
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bl-closing-cta">
        <div className="bl-closing-cta-inner">
          <p className="bl-closing-cta-eyebrow">Begin today</p>
          <h2 className="bl-closing-cta-title">
            Your next chapter <em>starts here.</em>
          </h2>
          <p className="bl-closing-cta-sub">
            Read fiction worth your time, or share work the world hasn&rsquo;t met
            yet.
          </p>
          <div className="bl-closing-cta-actions">
            <button
              type="button"
              className="bl-closing-pill bl-closing-pill-primary"
              onClick={onReader}
            >
              Start reading <span className="bl-closing-pill-arrow" aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              className="bl-closing-pill bl-closing-pill-ghost"
              onClick={onWriter}
            >
              Start writing <span className="bl-closing-pill-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
