'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton } from '@/components/SignInButton';

/**
 * The single, canonical top navigation bar for the marketing site.
 *
 * This is a faithful extraction of the live home (v12) nav so that every
 * landing subpage renders an identical bar. It is self-contained: the CSS
 * below references the global `--theme-*` variables defined at `:root` in
 * globals.css, so it looks the same inside or outside `.v12-root`.
 *
 * - On the home page, pass `onJoin` so "Join Free" opens the inline intake.
 * - On subpages (no inline intake), "Join Free" links to `/?join=reader`,
 *   which the home page reads on mount to auto-open the reader intake.
 */

type NavLink = { href: string; label: string; modifier?: 'support' };

const LINKS: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/read', label: 'Read' },
  { href: '/write', label: 'Write' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/support', label: 'Support Us', modifier: 'support' },
];

type Props = {
  /** Called when "Join Free" is clicked. When omitted, the CTA links to home. */
  onJoin?: () => void;
  /**
   * Override which link is highlighted. When omitted, the active link is the
   * one whose href is the longest prefix of the current path.
   */
  activeHref?: string;
};

export function SiteNav({ onJoin, activeHref }: Props) {
  const pathname = usePathname() ?? '';

  // Longest-prefix match so /readers/kids highlights "For Kids" (not "Read").
  const resolvedActive =
    activeHref ??
    LINKS.reduce<string | null>((best, link) => {
      const matches = pathname === link.href || pathname.startsWith(`${link.href}/`);
      if (!matches) return best;
      if (best === null || link.href.length > best.length) return link.href;
      return best;
    }, null);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BRNAV_CSS }} />
      <div className="br-subbanner">
        <span className="br-subbanner-inner">
          <span className="br-subbanner-text">
            BetweenLines Journal is now open for submissions.{' '}
            <Link className="br-subbanner-cta" href="/betweenlines#journal-submission">
              Submit your work
              <span className="br-subbanner-arrow" aria-hidden="true">→</span>
            </Link>
          </span>
        </span>
      </div>
      <nav className="brnav" aria-label="Primary">
      <div className="brnav-inner">
        <Link className="brnav-brand" href="/" aria-label="BetweenReads, home">
          <span>between</span>
          <span className="brnav-brand-dot" aria-hidden="true" />
          <span>reads</span>
        </Link>
        <div className="brnav-links">
          {LINKS.map((link) => {
            const cls = [
              'brnav-link',
              link.modifier ?? '',
              link.href === resolvedActive ? 'active' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <Link
                key={link.href}
                className={cls}
                href={link.href}
                aria-current={link.href === resolvedActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="brnav-right">
          {onJoin ? (
            <button type="button" className="brnav-join" onClick={onJoin}>
              Join Free
            </button>
          ) : (
            <Link className="brnav-join" href="/start?mode=reader">
              Join Free
            </Link>
          )}
          <div className="brnav-divider" aria-hidden="true" />
          <SignInButton className="brnav-signin">Sign In</SignInButton>
        </div>
      </div>
      </nav>
    </>
  );
}

const BRNAV_CSS = `
/* Submissions announcement bar — full-bleed near-black strip above the nav.
   Scrolls away while the nav below stays sticky. Shown on every page that
   renders SiteNav, so the journal call follows the visitor across the site. */
.br-subbanner {
  width: 100%;
  background: #16110d;
  color: #f3ede2;
  font-family: 'Outfit', system-ui, sans-serif;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.4);
}
.br-subbanner-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1100px;
  margin: 0 auto;
  padding: 12px clamp(18px, 4vw, 40px);
}
.br-subbanner-text {
  font-size: clamp(16px, 1.4vw, 19px);
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #f3ede2;
  text-align: center;
}
.br-subbanner-cta {
  font-weight: 800;
  color: var(--theme-accent);
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 2px;
  white-space: nowrap;
  transition: color 200ms ease;
}
.br-subbanner-arrow {
  display: inline-block;
  margin-left: 7px;
  font-weight: 900;
  transition: transform 200ms ease;
}
.br-subbanner-cta:hover { color: var(--theme-accent-strong); }
.br-subbanner-cta:hover .br-subbanner-arrow { transform: translateX(4px); }
.br-subbanner-cta:focus-visible {
  outline: 2px solid var(--theme-accent);
  outline-offset: 3px;
}
.brnav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, var(--theme-surface) 94%, transparent);
  border-bottom: 1px solid var(--theme-border-subtle);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  width: 100%;
}
.brnav-inner {
  display: flex;
  align-items: center;
  padding: 0 clamp(12px, 2vw, 24px);
  height: 76px;
  max-width: 1440px;
  margin: 0 auto;
  gap: 0;
}
.brnav-brand {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 21px;
  font-weight: 700;
  color: var(--theme-text);
  text-decoration: none;
  flex-shrink: 0;
  margin-right: clamp(28px, 6vw, 80px);
  letter-spacing: -0.2px;
  display: inline-flex;
  align-items: center;
}
.brnav-brand-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--theme-text);
  margin: 0 3px;
  vertical-align: middle;
  transform: translateY(0px);
}
.brnav-links {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  gap: 2px;
}
.brnav-link {
  font-size: 20px;
  color: var(--theme-text-soft);
  text-decoration: none;
  padding: 6px 11px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-family: 'Outfit', system-ui, sans-serif;
  font-weight: 400;
}
.brnav-link:hover {
  background: var(--theme-surface-muted);
  color: var(--theme-text);
}
.brnav-link.active {
  color: var(--theme-text);
  font-weight: 500;
}
.brnav-link.support {
  background: var(--theme-yellow);
  color: var(--theme-on-yellow);
  border-radius: 6px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.3px;
  padding: 8px 18px;
}
.brnav-link.support:hover {
  background: var(--theme-yellow-strong);
  color: var(--theme-on-yellow);
}
.brnav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 24px;
}
.brnav-join {
  font-size: 20px;
  font-weight: 800;
  color: var(--theme-on-yellow);
  background: var(--theme-yellow);
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: background 0.15s;
  white-space: nowrap;
  font-family: 'Outfit', system-ui, sans-serif;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.brnav-join:hover { background: var(--theme-yellow-strong); }
.brnav-signin {
  font-size: 20px;
  font-weight: 500;
  color: var(--theme-text);
  background: transparent;
  padding: 7px 13px;
  border-radius: 6px;
  border: 1px solid var(--theme-border);
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  font-family: 'Outfit', system-ui, sans-serif;
  text-decoration: none;
}
.brnav-signin:hover { background: var(--theme-surface-muted); }
.brnav-divider {
  width: 1px;
  height: 20px;
  background: var(--theme-border);
  margin: 0 2px;
}
.brnav :where(button, a):focus-visible {
  outline: 2px solid var(--theme-accent-strong);
  outline-offset: 2px;
}
@media (max-width: 1100px) {
  .brnav-links { gap: 0; }
  .brnav-link { padding: 6px 8px; font-size: 19px; }
}
@media (max-width: 900px) {
  .brnav-links { display: none; }
}
@media (max-width: 480px) {
  .brnav-right { gap: 6px; margin-left: 12px; }
  .brnav-join { padding: 7px 12px; }
  .brnav-signin { padding: 7px 10px; }
  .brnav-divider { margin: 0 1px; }
}
`;
