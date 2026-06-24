'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getMockSession } from '@/lib/mock-session';

// Routes inside the (reader) group that are reachable without a session.
// Prefix matches open a whole subtree; exact matches open just that one path.
const PUBLIC_PREFIXES = ['/gallery'];
// The logged-out writer playground: the real Studio reused as a public,
// sign-up-nudged guest route, plus the one book a guest may open as a sample.
// (The logged-out /read page is a standalone reader-profile page outside the
// (reader) group, so it isn't gated here at all.) Exact-match only — deeper
// reader routes like /read/<book> otherwise stay gated.
const PUBLIC_EXACT = ['/write', '/read/small-fires-soft-rain'];

export function SessionGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isPublic =
    (pathname != null && PUBLIC_EXACT.includes(pathname)) ||
    PUBLIC_PREFIXES.some(
      (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`),
    );
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    if (isPublic) {
      setAuthed(true);
      return;
    }
    const session = getMockSession();
    if (!session) {
      router.replace('/');
      return;
    }
    setAuthed(true);
  }, [router, isPublic]);

  if (authed === null) {
    return (
      <div className="br-handoff">
        <div className="br-handoff-wordmark">
          <span>Between</span>Reads
        </div>
        <div className="br-handoff-rule" />
        <div className="br-handoff-msg br-handoff-dots">Opening your reading</div>
      </div>
    );
  }

  return <>{children}</>;
}
