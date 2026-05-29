'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { clearMockSession } from '@/lib/mock-session';
import { useMockSession } from '@/lib/useMockSession';

export function AvatarMenu() {
  const { session } = useMockSession();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const close = () => setOpen(false);
  const handleSignOut = () => {
    clearMockSession();
    window.location.href = '/';
  };

  if (!session) return null;

  const isWriter = session.roles.includes('writer');
  const roleLabel = isWriter ? 'Reader · Writer' : 'Reader';

  return (
    <div className="br-avatar-wrap" ref={wrapRef}>
      <button
        type="button"
        className="br-avatar"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Open menu for ${session.user}`}
      >
        {session.initial}
      </button>
      <div className={`br-avatar-menu ${open ? 'is-open' : ''}`} role="menu">
        <div className="br-am-head">
          <div className="br-am-avatar-lg" aria-hidden="true">{session.initial}</div>
          <div>
            <div className="br-am-name">{session.user}</div>
            <div className="br-am-tier">{roleLabel}</div>
          </div>
        </div>
        <div className="br-am-wallet" aria-label="Account balances">
          <div className="br-am-rc">
            <span className="br-am-rc-lbl">Reading Credits</span>
            <span className="br-am-rc-val">{session.rc}</span>
          </div>
          {isWriter ? (
            <div className="br-am-rc is-swap">
              <span className="br-am-rc-lbl">Swap Credits</span>
              <span className="br-am-rc-val">{session.sc}</span>
            </div>
          ) : null}
        </div>
        <div className="br-am-div" />
        <Link href="/profile" className="br-am-item" role="menuitem" onClick={close}>
          <span className="br-am-item-label">My Profile</span>
          <span className="br-am-item-meta">Public reader page</span>
        </Link>
        <Link href="/account" className="br-am-item" role="menuitem" onClick={close}>
          <span className="br-am-item-label">My Reading</span>
          <span className="br-am-item-meta">Library, progress, activity</span>
        </Link>
        {isWriter ? (
          <Link
            href={`/writer/${session.handle}`}
            className="br-am-item"
            role="menuitem"
            onClick={close}
          >
            <span className="br-am-item-label">My Writer Page</span>
            <span className="br-am-item-meta">Public author presence</span>
          </Link>
        ) : null}
        {isWriter ? (
          <Link href="/write" className="br-am-item" role="menuitem" onClick={close}>
            <span className="br-am-item-label">Open Writing Room</span>
            <span className="br-am-item-meta">Drafts and submissions</span>
          </Link>
        ) : null}
        <div className="br-am-div" />
        <div className="br-am-item" role="menuitem">
          <span className="br-am-item-label">Notifications</span>
          <span className="br-am-item-meta">Reader pods and replies</span>
        </div>
        <div className="br-am-item" role="menuitem">
          <span className="br-am-item-label">Preferences</span>
          <span className="br-am-item-meta">Theme, privacy, quiet mode</span>
        </div>
        <div className="br-am-div" />
        <button
          type="button"
          className="br-am-item br-am-signout"
          role="menuitem"
          onClick={handleSignOut}
        >
          <span className="br-am-item-label">Sign out</span>
        </button>
      </div>
    </div>
  );
}
