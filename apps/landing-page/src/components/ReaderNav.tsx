'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AvatarMenu } from './AvatarMenu';
import { ThemeToggle } from './ThemeToggle';
import { useMockSession } from '@/lib/useMockSession';

type NavLink = { href: string; label: string; requiresWriter?: boolean };

const links: NavLink[] = [
  { href: '/read', label: 'Read' },
  { href: '/write', label: 'Write' },
  { href: '/betweenlines', label: 'Submit to Journal' },
  { href: '/read?tab=betareading', label: 'Beta Reading' },
];

export function ReaderNav() {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const [currentTarget, setCurrentTarget] = useState(pathname);
  const { session } = useMockSession();
  const isWriter = session?.roles?.includes('writer') ?? false;

  useEffect(() => {
    setCurrentTarget(`${pathname}${window.location.search}`);
  }, [pathname]);

  return (
    <nav className="br-nav" aria-label="Reader navigation">
      <button
        type="button"
        className="br-nav-brand"
        onClick={() => router.push('/read')}
        aria-label="BetweenReads home"
      >
        Between<strong>Reads</strong>
      </button>

      <div className="br-nav-links">
        {links.map((l) => {
          if (l.requiresWriter && !isWriter) return null;
          const baseHref = l.href.split('?')[0] ?? l.href;
          const isActionLink = l.href.includes('?');
          const currentIsSiblingAction = links.some((candidate) => {
            if (!candidate.href.includes('?')) return false;
            const candidateBase = candidate.href.split('?')[0] ?? candidate.href;
            return candidateBase === baseHref && currentTarget === candidate.href;
          });
          const isActive = isActionLink
            ? currentTarget === l.href
            : pathname.startsWith(baseHref) && !currentIsSiblingAction;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`br-nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setCurrentTarget(l.href)}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      <div className="br-nav-right">
        <ThemeToggle />
        <Link href="/account" className="br-rc-badge" aria-label={`${session?.rc ?? 0} Reading Coins`}>
          <span className="br-rc-num">{session?.rc ?? 0}</span>
          <span className="br-rc-lbl">Reading Coins</span>
        </Link>
        {isWriter ? (
          <Link href="/write" className="br-sc-badge" aria-label={`${session?.sc ?? 0} Swap Coins`}>
            <span className="br-sc-num">{session?.sc ?? 0}</span>
            <span className="br-sc-lbl">Swap Coins</span>
          </Link>
        ) : null}
        <AvatarMenu />
      </div>
    </nav>
  );
}
