'use client';

import type { ReactNode } from 'react';

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
.bl-footer {
  background: var(--bl-footer-bg);
  color: var(--bl-footer-fg);
  padding: clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px) 40px;
  font-family: var(--bl-font-display);
  transition: background-color 320ms ease, color 320ms ease;
}
.bl-footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(40px, 5vw, 64px);
}
.bl-footer-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.bl-footer-mark {
  font-family: var(--bl-font-serif);
  font-weight: 600;
  font-size: clamp(36px, 4vw, 56px);
  letter-spacing: -0.02em;
  color: var(--bl-footer-fg);
  margin: 0;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-footer-tag {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-size: clamp(18px, 1.4vw, 20px);
  color: var(--bl-footer-muted);
  max-width: 36ch;
  text-align: right;
  margin: 0;
  text-wrap: pretty;
}
.bl-footer-socials {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(24px, 5vw, 64px);
  padding: clamp(24px, 3vw, 36px) 0;
  border-top: 1px solid var(--bl-footer-divider);
  border-bottom: 1px solid var(--bl-footer-divider);
}
.bl-footer-socials-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 46ch;
}
.bl-footer-socials-title {
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-footer-fg);
  margin: 0;
  font-weight: 700;
}
.bl-footer-socials-blurb {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-size: clamp(17px, 1.35vw, 20px);
  line-height: 1.45;
  color: var(--bl-footer-muted);
  margin: 0;
  text-wrap: pretty;
}
.bl-footer-socials-icons {
  list-style: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: clamp(10px, 1.2vw, 14px);
  margin: 0;
  padding: 0;
}
.bl-footer-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--bl-footer-fg) 24%, transparent);
  color: var(--bl-footer-fg);
  background: color-mix(in srgb, var(--bl-footer-fg) 5%, transparent);
  text-decoration: none;
  transition:
    color 180ms var(--v6-ease, ease),
    background 180ms var(--v6-ease, ease),
    border-color 180ms var(--v6-ease, ease),
    transform 180ms var(--v6-ease, ease);
}
.bl-footer-social:hover,
.bl-footer-social:focus-visible {
  color: var(--bl-footer-bg);
  background: var(--bl-footer-fg);
  border-color: var(--bl-footer-fg);
  transform: translateY(-2px);
  outline: none;
}
.bl-footer-social svg {
  width: 24px;
  height: 24px;
}
.bl-footer-cols {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(24px, 4vw, 64px);
}
.bl-footer-col-title {
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-footer-muted);
  margin: 0 0 16px;
  font-weight: 600;
}
.bl-footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bl-footer-col a {
  color: var(--bl-footer-fg);
  text-decoration: none;
  font-size: 18px;
  transition: color 180ms var(--v6-ease, ease);
}
.bl-footer-col a:hover { color: var(--bl-footer-accent); }
.bl-footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--bl-footer-divider);
  padding-top: 24px;
  font-size: 13px;
  color: var(--bl-footer-muted);
}
.bl-footer-bottom-left { display: inline-flex; align-items: center; gap: 12px; }
.bl-footer-accent {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: var(--bl-footer-accent);
  transition: background-color 320ms ease;
}
.bl-footer-bottom a {
  color: var(--bl-footer-muted);
  text-decoration: none;
  transition: color 180ms var(--v6-ease, ease);
}
.bl-footer-bottom a:hover { color: var(--bl-footer-accent); }

@media (max-width: 760px) {
  .bl-footer-top { flex-direction: column; align-items: flex-start; }
  .bl-footer-tag { text-align: left; }
  .bl-footer-socials {
    flex-direction: column;
    align-items: flex-start;
  }
  .bl-footer-socials-icons { justify-content: flex-start; }
  .bl-footer-cols { grid-template-columns: 1fr; }
  .bl-footer-bottom { flex-direction: column; align-items: flex-start; }
}
`;

export default function Footer() {
  return (
    <footer className="bl-footer">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="bl-footer-inner">
        <div className="bl-footer-top">
          <h2 className="bl-footer-mark">BetweenReads</h2>
          <p className="bl-footer-tag">A home for emerging authors and the readers who discover them first. Read free, ad-free, and curated by humans &mdash; no ranked feed, no pay-to-play.</p>
        </div>

        <div className="bl-footer-socials" aria-label="Social links">
          <div className="bl-footer-socials-copy">
            <span className="bl-footer-socials-title">Join us on socials</span>
            <p className="bl-footer-socials-blurb">
              Writing tips, sneak peeks, and a community that reads before the world does.
            </p>
          </div>
          <ul className="bl-footer-socials-icons">
            {SOCIALS.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="bl-footer-social"
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="bl-footer-cols">
          <div className="bl-footer-col">
            <h3 className="bl-footer-col-title">Product</h3>
            <ul>
              <li><a href="/readers">Features</a></li>
              <li><a href="/betweenlines">BetweenLines Journal</a></li>
              <li><a href="/creators/agent-readiness">AgentReady</a></li>
              <li><a href="/pricing">Pricing</a></li>
            </ul>
          </div>
          <div className="bl-footer-col">
            <h3 className="bl-footer-col-title">Company</h3>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/support">Support Us</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/privacy">Terms</a></li>
              <li><a href="/privacy">Cookies</a></li>
            </ul>
          </div>
          <div className="bl-footer-col">
            <h3 className="bl-footer-col-title">Get Started</h3>
            <ul>
              <li><a href="/?join=reader">Start reading</a></li>
              <li><a href="/?join=author">Start writing</a></li>
              <li><a href="/insider">Become a Member</a></li>
            </ul>
          </div>
        </div>

        <div className="bl-footer-bottom">
          <span className="bl-footer-bottom-left">
            <span className="bl-footer-accent" aria-hidden />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>© 2026 BetweenReads</span>
          </span>
          <a href="#">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
