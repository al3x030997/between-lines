'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getMockSession } from '@/lib/mock-session';

// Routes inside the (reader) group that are reachable without a session.
// Prefix matches open a whole subtree; exact matches open just that one path.
const PUBLIC_PREFIXES = ['/gallery'];
// The logged-out playgrounds: the real Discover / Studio screens reused as
// public, sign-up-nudged guest routes. Exact-match only — deeper reader routes
// like /read/<book> stay gated (a guest gets a nudge instead), except the one
// free sample chapter listed here.
const PUBLIC_EXACT = ['/read', '/write', '/read/small-fires-soft-rain'];

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
