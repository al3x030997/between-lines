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
          <div className="br-am-name">{session.user}</div>
          <div className="br-am-tier">
            {session.tier}
            {isWriter ? ' · Writer' : ''}
          </div>
        </div>
        <div className="br-am-rc">
          <span className="br-am-rc-lbl">Reading Coins</span>
          <span className="br-am-rc-val">{session.rc}</span>
        </div>
        {isWriter ? (
          <div
            className="br-am-rc"
            style={{ background: 'var(--br-sc-green-soft)' }}
          >
            <span className="br-am-rc-lbl" style={{ color: 'var(--br-sc-green)' }}>Swap Coins</span>
            <span className="br-am-rc-val" style={{ color: 'var(--br-sc-green)' }}>{session.sc}</span>
          </div>
        ) : null}
        <div className="br-am-div" />
        <Link href="/profile" className="br-am-item" role="menuitem" onClick={close}>
          👤 My Profile
        </Link>
        <Link href="/account" className="br-am-item" role="menuitem" onClick={close}>
          📚 My Reading
        </Link>
        {isWriter ? (
          <Link
            href={`/writer/${session.handle}`}
            className="br-am-item"
            role="menuitem"
            onClick={close}
          >
            🖊️ My Writer Page
          </Link>
        ) : null}
        {isWriter ? (
          <Link href="/write" className="br-am-item" role="menuitem" onClick={close}>
            ✍️ Open Writing Room
          </Link>
        ) : null}
        <div className="br-am-item" role="menuitem">🔔 Notifications</div>
        <div className="br-am-item" role="menuitem">⚙️ Preferences</div>
        <div className="br-am-div" />
        <button
          type="button"
          className="br-am-item"
          role="menuitem"
          onClick={handleSignOut}
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
