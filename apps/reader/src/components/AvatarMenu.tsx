'use client';

import { useEffect, useRef, useState } from 'react';
import { clearMockSession } from '@/lib/mock-session';
import { useMockSession } from '@/lib/useMockSession';

function landingUrl(): string {
  return process.env.NEXT_PUBLIC_LANDING_URL ?? 'http://localhost:3000';
}

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

  const handleSignOut = () => {
    clearMockSession();
    window.location.href = landingUrl();
  };

  if (!session) return null;

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
          <div className="br-am-tier">{session.tier}</div>
        </div>
        <div className="br-am-rc">
          <span className="br-am-rc-lbl">⭐ ReadCredits</span>
          <span className="br-am-rc-val">{session.rc} RC</span>
        </div>
        <div className="br-am-div" />
        <div className="br-am-item" role="menuitem">👤 My Profile</div>
        <div className="br-am-item" role="menuitem">📚 My Reading</div>
        <div className="br-am-item" role="menuitem">🔔 Notifications</div>
        <div className="br-am-item" role="menuitem">⚙️ Preferences</div>
        <div className="br-am-div" />
        <div className="br-am-item" role="menuitem" onClick={handleSignOut}>
          Sign out
        </div>
      </div>
    </div>
  );
}
