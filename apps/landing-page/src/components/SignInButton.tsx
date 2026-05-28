'use client';

import { useCallback } from 'react';

type Props = {
  className?: string;
  children?: React.ReactNode;
  /**
   * Mock user identity to hand off to the reader app. Optional —
   * defaults to "Sarah M." with 142 RC, 75 SC, both reader + writer roles.
   */
  user?: string;
  handle?: string;
  rc?: number;
  sc?: number;
  roles?: Array<'reader' | 'writer'>;
};

function readerUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_READER_URL?.trim();
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '');

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3002';
  }

  return '';
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
  handle = 'sarah-m',
  rc = 142,
  sc = 75,
  roles = ['reader', 'writer'],
}: Props) {
  const onClick = useCallback(() => {
    const base = readerUrl();
    if (!base) {
      console.error('Missing NEXT_PUBLIC_READER_URL. Set it to the deployed reader app URL in Vercel.');
      return;
    }
    const qs = new URLSearchParams({
      u: user,
      h: handle,
      rc: String(rc),
      sc: String(sc),
      roles: roles.join(','),
    });
    window.location.href = `${base}/auth/handoff?${qs.toString()}`;
  }, [user, handle, rc, sc, roles]);

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
