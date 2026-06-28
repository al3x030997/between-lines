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
    name: 'substack',
    label: 'Read BetweenReads on Substack',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
  },
  {
    name: 'bluesky',
    label: 'Follow BetweenReads on Bluesky',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.296 5.568-.628 6.383-3.364C23.622 9.418 24 4.458 24 3.768c0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
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
.bl-footer-col .bl-footer-socials-icons {
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
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
  grid-template-columns: repeat(4, minmax(0, 1fr));
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
  .bl-footer-cols { grid-template-columns: 1fr 1fr; }
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
          <div className="bl-footer-col">
            <h3 className="bl-footer-col-title">Follow us on socials</h3>
            <ul className="bl-footer-socials-icons" aria-label="Social links">
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
