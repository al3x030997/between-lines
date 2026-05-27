'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type SubNavItem = { label: string; href: string };

type Props = {
  eyebrow: string;
  title: string;
  sub?: string;
  /** Sibling sub-pages shown as a horizontal chip nav. */
  subNav?: SubNavItem[];
  /** Mark which chip is active. If omitted, no chip is highlighted (parent page). */
  activeHref?: string;
  /** Where the "← Back" link points. Defaults to /. */
  backHref?: string;
  backLabel?: string;
};

export default function SubpageStub({
  eyebrow,
  title,
  sub = 'Coming soon.',
  subNav,
  activeHref,
  backHref = '/',
  backLabel = '← Back home',
}: Props) {
  const pathname = usePathname() ?? '';
  const isActive = (root: string) => pathname === root || pathname.startsWith(`${root}/`);

  return (
    <main className="bl-stub">
      <style>{STUB_CSS}</style>

      <nav className="bl-stub-nav" aria-label="Site">
        <div className="bl-stub-nav-left">
          <Link className="bl-stub-brand" href="/" aria-label="BetweenReads, home">
            <span>between</span>
            <span className="bl-stub-brand-dot">.</span>
            <span>reads</span>
          </Link>
          <div className="bl-stub-nav-links">
            <Link className={`bl-stub-nav-link${isActive('/betweenlines') ? ' is-active' : ''}`} href="/betweenlines">BetweenLines</Link>
            <div className="bl-stub-nav-group">
              <Link className={`bl-stub-nav-link${isActive('/readers') ? ' is-active' : ''}`} href="/readers">Readers</Link>
              <div className="bl-stub-nav-dropdown" role="menu" aria-label="Readers sub-pages">
                <Link className="bl-stub-nav-sub" href="/readers/read" role="menuitem">Read</Link>
                <Link className="bl-stub-nav-sub" href="/readers/listen" role="menuitem">Listen</Link>
                <Link className="bl-stub-nav-sub" href="/readers/kids" role="menuitem">Kids</Link>
              </div>
            </div>
            <div className="bl-stub-nav-group">
              <Link className={`bl-stub-nav-link${isActive('/creators') ? ' is-active' : ''}`} href="/creators">Creators</Link>
              <div className="bl-stub-nav-dropdown" role="menu" aria-label="Creators sub-pages">
                <Link className="bl-stub-nav-sub" href="/creators/write-on-betweenreads" role="menuitem">Write on BetweenReads</Link>
                <Link className="bl-stub-nav-sub" href="/creators/upload-illustrations" role="menuitem">Upload Illustrations</Link>
                <Link className="bl-stub-nav-sub" href="/creators/securebetareads" role="menuitem">Secure BetaReads</Link>
                <Link className="bl-stub-nav-sub" href="/creators/agent-readiness" role="menuitem">Agent Readiness</Link>
              </div>
            </div>
            <Link className={`bl-stub-nav-link${isActive('/pricing') ? ' is-active' : ''}`} href="/pricing">Pricing</Link>
            <Link className={`bl-stub-nav-link${isActive('/faq') ? ' is-active' : ''}`} href="/faq">FAQ</Link>
          </div>
        </div>
        <Link className="bl-stub-nav-cta" href="/">Join free</Link>
      </nav>

      <div className="bl-stub-body">
        <span className="bl-stub-eyebrow">{eyebrow}</span>
        <h1 className="bl-stub-title">{title}</h1>
        {subNav && subNav.length > 0 && (
          <nav className="bl-stub-subnav" aria-label={`${title} sections`}>
            {subNav.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`bl-stub-subnav-link${active ? ' is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
        <p className="bl-stub-sub">{sub}</p>
        <Link className="bl-stub-back" href={backHref}>
          {backLabel}
        </Link>
      </div>
    </main>
  );
}

const STUB_CSS = `
.bl-stub {
  min-height: 100vh;
  background: #ffffff;
  color: #0e0e0c;
  display: flex;
  flex-direction: column;
  font-family: var(--bl-font-display, 'Inter Tight', system-ui, sans-serif);
}

/* === site nav (matches /pricing) === */
.bl-stub-nav {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 3.5vw, 56px);
  border-bottom: 1px solid rgba(14, 14, 12, 0.1);
  background: #ffffff;
}
.bl-stub-nav-left {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 38px);
}
.bl-stub-brand {
  display: inline-flex;
  align-items: baseline;
  font-family: var(--bl-font-eyebrow, system-ui, sans-serif);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0e0e0c;
  text-decoration: none;
  font-variation-settings: 'wdth' 95;
}
.bl-stub-brand-dot {
  color: #1F7A3E;
  padding: 0 4px;
  font-weight: 800;
  transform: translateY(-1px);
}
.bl-stub-nav-links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 24px);
  font-family: var(--bl-font-eyebrow, system-ui, sans-serif);
}
.bl-stub-nav-link {
  font-size: 13px;
  font-weight: 500;
  color: #0e0e0c;
  text-decoration: none;
  padding: 4px 0;
  position: relative;
  transition: color 200ms ease;
}
.bl-stub-nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #1F7A3E;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.bl-stub-nav-link:hover { color: #1F7A3E; }
.bl-stub-nav-link:hover::after { transform: scaleX(1); }
.bl-stub-nav-link.is-active { color: #1F7A3E; }
.bl-stub-nav-link.is-active::after { transform: scaleX(1); }
.bl-stub-nav-cta {
  background: #0e0e0c;
  color: #f6f1e3;
  padding: 10px 20px;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow, system-ui, sans-serif);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 200ms ease, transform 200ms ease, box-shadow 200ms ease;
}
.bl-stub-nav-cta:hover {
  background: #1F7A3E;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(14, 14, 12, 0.16);
}
@media (max-width: 760px) {
  .bl-stub-nav-links { display: none; }
}

/* dropdown for nav groups (Readers, Creators) */
.bl-stub-nav-group {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.bl-stub-nav-group::before {
  content: '';
  position: absolute;
  left: -12px;
  right: -12px;
  top: 100%;
  height: 18px;
  pointer-events: none;
}
.bl-stub-nav-group:hover::before,
.bl-stub-nav-group:focus-within::before {
  pointer-events: auto;
}
.bl-stub-nav-dropdown {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  min-width: 232px;
  background: #ffffff;
  border: 1px solid rgba(14, 14, 12, 0.08);
  border-radius: 14px;
  padding: 8px;
  box-shadow:
    0 18px 40px -16px rgba(14, 14, 12, 0.22),
    0 8px 16px -10px rgba(14, 14, 12, 0.14);
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translate(-50%, -6px);
  transition:
    opacity 200ms cubic-bezier(.22, 1, .36, 1),
    transform 220ms cubic-bezier(.22, 1, .36, 1),
    visibility 200ms linear;
  z-index: 10;
}
.bl-stub-nav-group:hover .bl-stub-nav-dropdown,
.bl-stub-nav-group:focus-within .bl-stub-nav-dropdown {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  transform: translate(-50%, 0);
}
.bl-stub-nav-sub {
  display: block;
  padding: 9px 14px;
  font-family: var(--bl-font-body, system-ui, sans-serif);
  font-size: 13px;
  font-weight: 500;
  color: #0e0e0c;
  text-decoration: none;
  border-radius: 8px;
  white-space: nowrap;
  transition: background 160ms ease, color 160ms ease, transform 160ms cubic-bezier(.22, 1, .36, 1);
}
.bl-stub-nav-sub:hover,
.bl-stub-nav-sub:focus-visible {
  background: rgba(31, 122, 62, 0.08);
  color: #155F2F;
  transform: translateX(2px);
  outline: none;
}
@media (max-width: 760px) {
  .bl-stub-nav-dropdown { display: none; }
}

/* === body === */
.bl-stub-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
  padding: 64px 24px;
}
.bl-stub-eyebrow {
  font-family: var(--bl-font-eyebrow, system-ui, sans-serif);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #1F7A3E;
}
.bl-stub-title {
  margin: 0;
  font-family: var(--bl-font-display, 'Inter Tight', system-ui, sans-serif);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(40px, 6vw, 96px);
  letter-spacing: -0.035em;
  line-height: 1.0;
}
.bl-stub-subnav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  max-width: 720px;
}
.bl-stub-subnav-link {
  font-family: var(--bl-font-eyebrow, system-ui, sans-serif);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0e0e0c;
  text-decoration: none;
  padding: 8px 14px;
  border: 1px solid rgba(14, 14, 12, 0.18);
  border-radius: 999px;
  transition: color 200ms ease, border-color 200ms ease, background 200ms ease, transform 200ms ease;
}
.bl-stub-subnav-link:hover {
  color: #1F7A3E;
  border-color: #1F7A3E;
  transform: translateY(-1px);
}
.bl-stub-subnav-link.is-active {
  background: #0e0e0c;
  color: #ffffff;
  border-color: #0e0e0c;
}
.bl-stub-sub {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 18px;
  color: rgba(14, 14, 12, 0.6);
}
.bl-stub-back {
  margin-top: 16px;
  font-family: var(--bl-font-eyebrow, system-ui, sans-serif);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #0e0e0c;
  text-decoration: none;
  padding: 6px 0;
  border-bottom: 1px solid rgba(14, 14, 12, 0.25);
  transition: color 200ms ease, border-color 200ms ease;
}
.bl-stub-back:hover {
  color: #1F7A3E;
  border-bottom-color: #1F7A3E;
}
`;

export const CREATORS_SUBNAV: SubNavItem[] = [
  { label: 'Write on BetweenReads', href: '/creators/write-on-betweenreads' },
  { label: 'Upload Illustrations', href: '/creators/upload-illustrations' },
  { label: 'Secure BetaReads', href: '/creators/securebetareads' },
];

export const READERS_SUBNAV: SubNavItem[] = [
  { label: 'Read', href: '/readers/read' },
  { label: 'Listen', href: '/readers/listen' },
  { label: 'Kids', href: '/readers/kids' },
];
