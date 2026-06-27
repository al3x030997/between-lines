'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AccountSwitcher } from './AccountSwitcher';
import { AvatarMenu } from './AvatarMenu';
import { ThemeToggle } from './ThemeToggle';
import { useMockSession } from '@/lib/useMockSession';

type NavLink = { href: string; label: string; requiresWriter?: boolean; hideForKids?: boolean };

const links: NavLink[] = [
  { href: '/library', label: 'Read' },
  { href: '/studio', label: 'Write', hideForKids: true },
  { href: '/library?tab=betareading', label: 'Beta Reading', hideForKids: true },
  { href: '/library?tab=community', label: 'Community', hideForKids: true },
  { href: '/betweenlines#journal-submission', label: 'Submit to Journal', hideForKids: true },
];

// Logged-out playground nav: point at the public /read (reader library page)
// and /studio (Studio playground, public via SessionGate) routes — the member
// target /library is gated and would bounce a guest home.
const guestLinks: NavLink[] = [
  { href: '/read', label: 'Read' },
  { href: '/studio', label: 'Write' },
];

export function ReaderNav() {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const [currentTarget, setCurrentTarget] = useState(pathname);
  const { session, ready } = useMockSession();
  const isWriter = session?.roles?.includes('writer') ?? false;
  const isKid = session?.isKid ?? false;
  const isGuest = ready && !session;
  const navLinks = isGuest ? guestLinks : links;

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
        {navLinks.map((l) => {
          if (l.requiresWriter && !isWriter) return null;
          if (l.hideForKids && isKid) return null;
          const hrefWithoutHash = l.href.split('#')[0] ?? l.href;
          const baseHref = hrefWithoutHash.split('?')[0] ?? hrefWithoutHash;
          const isActionLink = hrefWithoutHash.includes('?');
          const isLibraryLink = baseHref === '/library';
          const currentIsSiblingAction = links.some((candidate) => {
            if (!candidate.href.includes('?')) return false;
            const candidateWithoutHash = candidate.href.split('#')[0] ?? candidate.href;
            const candidateBase = candidateWithoutHash.split('?')[0] ?? candidateWithoutHash;
            return candidateBase === baseHref && currentTarget === candidate.href;
          });
          const isActive = isActionLink
            ? currentTarget === l.href
            : (pathname.startsWith(baseHref) || (isLibraryLink && pathname.startsWith('/read/'))) &&
              !currentIsSiblingAction;
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
        {isGuest ? (
          <>
            <Link href="/start?mode=reader" className="br-nav-signin">
              Sign in
            </Link>
            <Link href="/start?mode=reader" className="br-nav-signup">
              Sign up free
            </Link>
          </>
        ) : (
          <>
            {!isKid && <ThemeToggle className="br-nav-theme" />}
            <AccountSwitcher />
            <AvatarMenu />
          </>
        )}
      </div>
    </nav>
  );
}
