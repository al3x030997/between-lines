'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const AMOUNTS = [1, 3, 5, 10] as const;

type Props = {
  authorName: string;
  authorHandle?: string;
  size?: 'lg' | 'sm';
  /** Label shown on the trigger button. Defaults to "Tip writer". */
  label?: string;
};

export function TipWriterButton({ authorName, authorHandle, size = 'sm', label = 'Tip writer' }: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(3);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
    // reset after the close animation finishes so reopening starts clean
    setTimeout(() => {
      setSent(null);
      setMessage('');
      setAmount(3);
    }, 250);
  }

  function submit() {
    setSent(amount);
  }

  const triggerCls = `br-btn br-btn-ghost br-tip-trigger${size === 'lg' ? ' br-btn-lg' : ''}`;

  const trigger = (
    <button
      type="button"
      className={triggerCls}
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
    >
      <span aria-hidden="true">💝</span> {label}
    </button>
  );

  if (!mounted || !open) return trigger;

  const handleLine = authorHandle ? `@${authorHandle}` : null;

  const modal = (
    <div
      className="br-tip-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="br-tip-headline"
    >
      <button
        type="button"
        className="br-tip-backdrop"
        aria-label="Close tip writer"
        onClick={close}
      />
      <div className="br-tip-modal">
        {sent === null ? (
          <>
            <div className="br-tip-eyebrow">Send a thank-you</div>
            <h2 id="br-tip-headline" className="br-tip-headline">
              Tip {authorName}
            </h2>
            {handleLine ? <div className="br-tip-handle">{handleLine}</div> : null}
            <p className="br-tip-sub">
              Tips go straight to the writer. Pick an amount and add a note if you&rsquo;d
              like.
            </p>

            <div className="br-tip-amounts" role="radiogroup" aria-label="Tip amount in US dollars">
              {AMOUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={amount === n}
                  className={`br-tip-amount ${amount === n ? 'is-on' : ''}`}
                  onClick={() => setAmount(n)}
                >
                  <span className="br-tip-amount-num">${n}</span>
                  <span className="br-tip-amount-lbl">USD</span>
                </button>
              ))}
            </div>

            <label className="br-tip-msg-label" htmlFor="br-tip-msg">
              Note <span>(optional)</span>
            </label>
            <textarea
              id="br-tip-msg"
              className="br-tip-msg"
              rows={3}
              placeholder={`Tell ${authorName.split(' ')[0]} what landed for you…`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={280}
            />
            <div className="br-tip-count" aria-live="polite">{message.length}/280</div>

            <div className="br-tip-actions">
              <button type="button" className="br-btn br-btn-ghost" onClick={close}>
                Cancel
              </button>
              <button type="button" className="br-btn br-btn-primary" onClick={submit}>
                Send ${amount} →
              </button>
            </div>
            <p className="br-tip-fine">Preview only — no card is charged yet.</p>
          </>
        ) : (
          <div className="br-tip-confirm">
            <div className="br-tip-confirm-mark" aria-hidden="true">✓</div>
            <h2 className="br-tip-headline">Tip on its way</h2>
            <p className="br-tip-sub">
              ${sent} sent to {authorName}. They&rsquo;ll see your note next time they log in.
            </p>
            <button type="button" className="br-btn br-btn-primary" onClick={close}>
              Done
            </button>
          </div>
        )}
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
