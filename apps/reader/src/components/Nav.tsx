'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AvatarMenu } from './AvatarMenu';
import { useMockSession } from '@/lib/useMockSession';

type NavLink = { href: string; label: string };

const links: NavLink[] = [
  { href: '/read', label: 'Read' },
  { href: '/betweenlines', label: 'BetweenLines' },
  { href: '/betweencharacters', label: 'BetweenCharacters' },
  { href: '/betweenpages', label: 'BetweenPages' },
  { href: '/store', label: 'Store' },
];

export function Nav() {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const { session } = useMockSession();

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
          const isActive =
            l.href === '/read' ? pathname.startsWith('/read') : pathname.startsWith(l.href);
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
        <div className="br-rc-badge" role="status" aria-label={`${session?.rc ?? 0} ReadCredits`}>
          <span aria-hidden="true">⭐</span>
          <span className="br-rc-num">{session?.rc ?? 0}</span>
          <span className="br-rc-lbl">RC</span>
        </div>
        <AvatarMenu />
      </div>
    </nav>
  );
}
