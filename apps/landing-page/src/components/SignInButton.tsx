'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  className?: string;
  children?: React.ReactNode;
  /**
   * Mock user identity to hand off. Defaults to "Sarah M." with 142 RC,
   * 75 SC, both reader + writer roles for preview purposes.
   */
  user?: string;
  handle?: string;
  rc?: number;
  sc?: number;
  roles?: Array<'reader' | 'writer'>;
};

/**
 * Mock sign-in button. Navigates to /auth/handoff in the same app — same
 * origin, so localStorage works without any deployment plumbing. Swap this
 * out for a real auth call when ready.
 */
export function SignInButton({
  className = 'v11-btn-signin',
  children = 'Sign In',
  user = 'Sarah M.',
  handle = 'sarah-m',
  rc = 142,
  sc = 75,
  roles = ['reader', 'writer'],
}: Props) {
  const router = useRouter();

  const onClick = useCallback(() => {
    const qs = new URLSearchParams({
      u: user,
      h: handle,
      rc: String(rc),
      sc: String(sc),
      roles: roles.join(','),
    });
    router.push(`/auth/handoff?${qs.toString()}`);
  }, [router, user, handle, rc, sc, roles]);

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
