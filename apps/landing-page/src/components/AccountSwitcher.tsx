'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { AccountProfilePicker } from '@/components/AccountProfilePicker';
import { sessionForAccountProfile, type AccountProfile } from '@/lib/account-profiles';
import { setMockSession } from '@/lib/mock-session';
import { useMockSession } from '@/lib/useMockSession';

function SwapIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      className="br-pb-switch-icon"
    >
      <path
        d="M3 7h11l-2.4-2.4M17 13H6l2.4 2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AccountSwitcher() {
  const router = useRouter();
  const { session } = useMockSession();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function switchTo(p: AccountProfile) {
    setMockSession(sessionForAccountProfile(p));
    setOpen(false);
    // Land on the reader home for the newly-selected profile so a kid profile
    // drops straight into the kid-skinned view (and adults into the full one).
    router.push('/read');
  }

  const trigger = (
    <button
      type="button"
      className="br-pb-switch"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
    >
      <SwapIcon />
      <span>Switch Account</span>
    </button>
  );

  if (!mounted || !open) return trigger;

  const modal = (
    <div
      className="br-acct-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="br-acct-headline"
    >
      <button
        type="button"
        className="br-acct-backdrop"
        aria-label="Close account switcher"
        onClick={() => setOpen(false)}
      />
      <AccountProfilePicker
        currentUser={session?.user}
        onAddAccount={() => setOpen(false)}
        onManageProfiles={() => setOpen(false)}
        onSelectProfile={switchTo}
      />
    </div>
  );

  return (
    <>
      {trigger}
      {createPortal(modal, document.body)}
    </>
  );
}
