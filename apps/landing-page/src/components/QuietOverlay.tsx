'use client';

import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  chapterTitle: string;
  bookTitle: string;
  /** Raw HTML chapter body */
  body: string;
};

export function QuietOverlay({ open, onClose, chapterTitle, bookTitle, body }: Props) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) document.body.setAttribute('data-quiet', 'true');
    else document.body.removeAttribute('data-quiet');
    return () => {
      document.body.removeAttribute('data-quiet');
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={`br-quiet ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="br-quiet-bar">
        <span className="br-quiet-eyebrow">Quiet mode</span>
        <button
          type="button"
          className="br-quiet-exit"
          onClick={onClose}
          style={{ background: 'none', border: 'none' }}
        >
          ✕ Exit quiet mode
        </button>
      </div>
      <div className="br-quiet-body" key={open ? 'open' : 'closed'}>
        <div className="br-quiet-eyebrow-page">{bookTitle}</div>
        <h1 className="br-quiet-title">{chapterTitle}</h1>
        <div className="br-quiet-text" dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
}
