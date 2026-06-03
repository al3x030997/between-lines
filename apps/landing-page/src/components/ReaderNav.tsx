'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AccountSwitcher } from './AccountSwitcher';
import { AvatarMenu } from './AvatarMenu';
import { ThemeToggle } from './ThemeToggle';
import { DiscoverSearch } from './read/DiscoverSearch';
import { useMockSession } from '@/lib/useMockSession';
import { useDiscoverSearch } from '@/lib/discover-search';

type NavLink = { href: string; label: string; requiresWriter?: boolean; hideForKids?: boolean };

const links: NavLink[] = [
  { href: '/read', label: 'Read' },
  { href: '/read?tab=betareading', label: 'Beta Reading', hideForKids: true },
  { href: '/read?tab=community', label: 'Community', hideForKids: true },
  { href: '/write', label: 'Write', hideForKids: true },
  { href: '/betweenlines#journal-submission', label: 'Submit to Journal', hideForKids: true },
];

export function ReaderNav() {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const [currentTarget, setCurrentTarget] = useState(pathname);
  const { session } = useMockSession();
  const { query, setQuery } = useDiscoverSearch();
  const isWriter = session?.roles?.includes('writer') ?? false;
  const isKid = session?.isKid ?? false;
  // Search lives in the top bar on /read for grown-up readers. Kids keep their
  // own search inside the kid tab bar, so we don't double it up here.
  const showSearch = !isKid && pathname.startsWith('/read');

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

      {showSearch && (
        <div className="br-nav-search">
          <DiscoverSearch query={query} onChange={setQuery} />
        </div>
      )}

      <div className="br-nav-links">
        {links.map((l) => {
          if (l.requiresWriter && !isWriter) return null;
          if (l.hideForKids && isKid) return null;
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
        {!isKid && <ThemeToggle className="br-nav-theme" />}
        <AccountSwitcher />
        <AvatarMenu />
      </div>
    </nav>
  );
}
