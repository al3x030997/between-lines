'use client';

import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';

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
  return (
    <main className="bl-stub">
      <style>{STUB_CSS}</style>

      <SiteNav />

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
