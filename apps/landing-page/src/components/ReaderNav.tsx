'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AccountSwitcher } from './AccountSwitcher';
import { AvatarMenu } from './AvatarMenu';
import { ThemeToggle } from './ThemeToggle';
import { useMockSession } from '@/lib/useMockSession';

type NavLink = { href: string; label: string; requiresWriter?: boolean };

const links: NavLink[] = [
  { href: '/read', label: 'Read' },
  { href: '/write', label: 'Write' },
  { href: '/betweenlines#journal-submission', label: 'Submit to Journal' },
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
        className={`br-nav-brand ${pathname === '/gallery' ? 'is-active' : ''}`}
        onClick={() => {
          setCurrentTarget('/gallery');
          router.push('/gallery');
        }}
        aria-label="Open BetweenReads gallery"
        aria-current={pathname === '/gallery' ? 'page' : undefined}
      >
        Between<strong>Reads</strong>
      </button>

      <div className="br-nav-links">
        {links.map((l) => {
          if (l.requiresWriter && !isWriter) return null;
          const hrefWithoutHash = l.href.split('#')[0] ?? l.href;
          const baseHref = hrefWithoutHash.split('?')[0] ?? hrefWithoutHash;
          const isActionLink = hrefWithoutHash.includes('?');
          const currentIsSiblingAction = links.some((candidate) => {
            if (!candidate.href.includes('?')) return false;
            const candidateWithoutHash = candidate.href.split('#')[0] ?? candidate.href;
            const candidateBase = candidateWithoutHash.split('?')[0] ?? candidateWithoutHash;
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
        <ThemeToggle className="br-nav-theme" />
        <AccountSwitcher />
        <AvatarMenu />
      </div>
    </nav>
  );
}
