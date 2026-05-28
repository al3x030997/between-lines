'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AvatarMenu } from './AvatarMenu';
import { ThemeToggle } from './ThemeToggle';
import { useMockSession } from '@/lib/useMockSession';

type NavLink = { href: string; label: string; requiresWriter?: boolean };

const links: NavLink[] = [
  { href: '/read', label: 'Read' },
  { href: '/write', label: 'Write', requiresWriter: true },
  { href: '/betweenlines', label: 'BetweenLines' },
  { href: '/betweencharacters', label: 'BetweenCharacters' },
  { href: '/betweenpages', label: 'BetweenPages' },
  { href: '/store', label: 'Store' },
];

export function ReaderNav() {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const { session } = useMockSession();
  const isWriter = session?.roles?.includes('writer') ?? false;

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
          const isActive = pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`br-nav-link ${isActive ? 'is-active' : ''}`}
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
