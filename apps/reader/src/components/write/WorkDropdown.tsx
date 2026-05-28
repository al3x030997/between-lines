'use client';

import { useEffect, useRef } from 'react';
import type { WorkSummary } from '@/lib/mock-writers';

type Props = {
  works: WorkSummary[];
  activeId: string;
  onChange: (id: string) => void;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function WorkDropdown({ works, activeId, onChange, open, onToggle, onClose }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open, onClose]);

  return (
    <div className="br-write-workdrop" ref={wrapRef}>
      <button type="button" className="br-write-workdrop-btn" onClick={onToggle}>
        My Writing ▾
      </button>
      <div className={`br-write-workdrop-menu ${open ? 'is-open' : ''}`} role="menu">
        {works.map((w) => (
          <div
            key={w.id}
            role="menuitem"
            className={`br-write-workdrop-item ${w.id === activeId ? 'is-active' : ''}`}
            onClick={() => onChange(w.id)}
          >
            <div className="br-write-workdrop-title">{w.title}</div>
            <div className="br-write-workdrop-meta">{w.meta}</div>
          </div>
        ))}
        <div className="br-write-workdrop-div" />
        <div className="br-write-workdrop-new" role="menuitem">＋ New work</div>
      </div>
    </div>
  );
}
