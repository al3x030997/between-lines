'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { setMockSession, type Role } from '@/lib/mock-session';
import { useMockSession } from '@/lib/useMockSession';

type Profile = {
  id: string;
  user: string;
  initial: string;
  rc: number;
  sc: number;
  tier: 'Reader' | 'Member';
  roles: Role[];
  followers: number;
  following: number;
  avatarBg: string;
  avatarInk: string;
  badge?: 'kids';
};

const PROFILES: Profile[] = [
  {
    id: 'sarah',
    user: 'Sarah M.',
    initial: 'S',
    rc: 142,
    sc: 75,
    tier: 'Reader',
    roles: ['reader', 'writer'],
    followers: 412,
    following: 38,
    avatarBg: 'linear-gradient(160deg, #95d6ad 0%, #6fbf90 100%)',
    avatarInk: '#10241a',
  },
  {
    id: 'alex',
    user: 'Alex K.',
    initial: 'A',
    rc: 87,
    sc: 14,
    tier: 'Member',
    roles: ['reader'],
    followers: 120,
    following: 64,
    avatarBg: 'linear-gradient(160deg, #f0c75d 0%, #d8a93b 100%)',
    avatarInk: '#2a1f06',
  },
  {
    id: 'mira',
    user: 'Mira O.',
    initial: 'M',
    rc: 31,
    sc: 0,
    tier: 'Reader',
    roles: ['reader'],
    followers: 22,
    following: 41,
    avatarBg: 'linear-gradient(160deg, #c8a8e0 0%, #9a7fc4 100%)',
    avatarInk: '#1e1426',
  },
  {
    id: 'kids',
    user: 'Kids',
    initial: 'K',
    rc: 0,
    sc: 0,
    tier: 'Reader',
    roles: ['reader'],
    followers: 0,
    following: 0,
    avatarBg: 'linear-gradient(160deg, #ffd28a 0%, #ec9a6a 100%)',
    avatarInk: '#2a1a08',
    badge: 'kids',
  },
];

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

  function switchTo(p: Profile) {
    setMockSession({
      user: p.user,
      rc: p.rc,
      sc: p.sc,
      tier: p.tier,
      roles: p.roles,
      followers: p.followers,
      following: p.following,
    });
    setOpen(false);
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
      <div className="br-acct-modal">
        <h2 id="br-acct-headline" className="br-acct-headline">Who&rsquo;s reading?</h2>
        <p className="br-acct-sub">Pick a profile to continue</p>

        <div className="br-acct-grid">
          {PROFILES.map((p) => {
            const isCurrent = session?.user === p.user;
            return (
              <button
                key={p.id}
                type="button"
                className={`br-acct-tile ${isCurrent ? 'is-current' : ''}`}
                onClick={() => switchTo(p)}
                aria-current={isCurrent ? 'true' : undefined}
              >
                <div
                  className="br-acct-avatar"
                  style={{ background: p.avatarBg, color: p.avatarInk }}
                  aria-hidden="true"
                >
                  {p.initial}
                  {p.badge === 'kids' ? (
                    <span className="br-acct-avatar-tag">KIDS</span>
                  ) : null}
                </div>
                <span className="br-acct-name">{p.user}</span>
                <span className="br-acct-meta">
                  {p.tier === 'Member' ? 'Member · ' : ''}
                  {p.roles.includes('writer') ? 'Reader · Writer' : 'Reader'}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            className="br-acct-tile is-add"
            onClick={() => setOpen(false)}
          >
            <div className="br-acct-avatar is-add" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M12 5v14M5 12h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="br-acct-name">Add account</span>
            <span className="br-acct-meta">Bring a reader along</span>
          </button>
        </div>

        <button
          type="button"
          className="br-acct-manage"
          onClick={() => setOpen(false)}
        >
          Manage profiles
        </button>
      </div>
    </div>
  );

  return (
    <>
      {trigger}
      {createPortal(modal, document.body)}
    </>
  );
}
