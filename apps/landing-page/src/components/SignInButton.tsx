'use client';

import { useCallback } from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
  /**
   * Mock user identity to hand off to the reader app. Optional —
   * defaults to "Sarah M." with 142 RC for preview purposes.
   */
  user?: string;
  rc?: number;
};

function readerUrl(): string {
  return process.env.NEXT_PUBLIC_READER_URL ?? 'http://localhost:3002';
}

/**
 * Mock sign-in button. On click, navigates to the reader app's
 * /auth/handoff route, which writes the mock session and forwards
 * to /read. Swap this out for a real auth call when ready.
 */
export function SignInButton({
  className = 'v11-btn-signin',
  children = 'Sign In',
  user = 'Sarah M.',
  rc = 142,
}: Props) {
  const onClick = useCallback(() => {
    const base = readerUrl();
    const qs = new URLSearchParams({ u: user, rc: String(rc) });
    window.location.href = `${base}/auth/handoff?${qs.toString()}`;
  }, [user, rc]);

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
