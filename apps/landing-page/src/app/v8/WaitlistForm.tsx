'use client';

import { useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import type { IntakePayload } from '@/lib/schemas';

const CSS = `
.su-root {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 4vh, 48px) clamp(16px, 4vw, 32px);
  font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
  color: #0e0e0c;
}
.su-scrim {
  position: absolute;
  inset: 0;
  background: rgba(14, 14, 12, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: su-fade 220ms ease both;
}
.su-sheet {
  position: relative;
  width: min(460px, 100%);
  max-height: 100%;
  background: #ffffff;
  overflow-y: auto;
  padding: 48px clamp(28px, 5vw, 56px) 48px;
  border-radius: 18px;
  box-shadow:
    0 1px 0 rgba(14, 14, 12, 0.04),
    0 28px 80px rgba(14, 14, 12, 0.32);
  animation: su-pop 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.su-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 26px;
  line-height: 1;
  color: #0e0e0c;
  cursor: pointer;
  border-radius: 999px;
  transition: background 180ms ease, color 180ms ease;
}
.su-close:hover {
  background: rgba(14, 14, 12, 0.06);
  color: var(--v6-accent);
}
.su-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--v6-accent);
  margin: 0 0 12px;
}
.su-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(28px, 3.4vw, 36px);
  letter-spacing: -0.03em;
  font-variation-settings: 'wdth' 94, 'opsz' 36;
  line-height: 1.05;
  margin: 0 0 10px;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt";
}
.su-pitch {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  line-height: 1.5;
  color: #4d4d47;
  margin: 0 0 26px;
  max-width: 36ch;
  text-wrap: pretty;
}
.su-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.su-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.su-label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6a6a64;
}
.su-input {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 14px;
  border: 1px solid rgba(14, 14, 12, 0.2);
  border-radius: 8px;
  background: #ffffff;
  color: #0e0e0c;
  width: 100%;
  transition: border-color 160ms var(--v6-ease, ease), background 160ms var(--v6-ease, ease);
}
.su-input::placeholder { color: rgba(14, 14, 12, 0.45); }
.su-input:focus {
  outline: none;
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
.su-consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 6px;
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: #4d4d47;
  cursor: pointer;
}
.su-consent input[type="checkbox"] {
  margin-top: 3px;
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  accent-color: var(--v6-accent, #e94b36);
  cursor: pointer;
}
.su-consent a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.su-consent a:hover { color: var(--v6-accent, #e94b36); }
.su-btn {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.01em;
  padding: 14px 22px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: var(--v6-accent);
  color: #ffffff;
  cursor: pointer;
  margin-top: 6px;
  transition: background 160ms ease, transform 120ms ease;
}
.su-btn:hover { filter: brightness(0.92); }
.su-btn:disabled {
  background: rgba(14, 14, 12, 0.18);
  cursor: not-allowed;
}
.su-foot {
  margin-top: 22px;
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: #6a6a64;
  text-align: center;
}
.su-error {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: #c0392b;
  margin: 6px 0 0;
}
.su-success {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}
.su-success .su-btn { align-self: flex-start; margin-top: 14px; }

@keyframes su-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes su-pop {
  from { transform: translateY(12px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .su-scrim, .su-sheet { animation: none; }
}
@media (max-width: 520px) {
  .su-root { padding: 0; }
  .su-sheet {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
    padding: 56px 22px 56px;
  }
}
`;

type Props = {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  intake?: IntakePayload | null;
};

export function WaitlistOverlay({ open, onClose, eyebrow, intake }: Props) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) {
      setEmail('');
      setConsent(false);
      setWebsite('');
      setSubmitting(false);
      setStatus('idle');
      setErrorMsg('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canSubmit = email.trim().length > 0 && consent && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          consent: true,
          website,
          ...(intake ? { intake } : {}),
        }),
      });
      track('waitlist_submit', { ok: res.ok });
      if (!res.ok) {
        const code =
          res.status === 429
            ? 'Too many attempts. Please try again in a few minutes.'
            : 'Something went wrong. Please try again.';
        setErrorMsg(code);
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      track('waitlist_submit', { ok: false });
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="su-root" role="dialog" aria-modal="true" aria-labelledby="su-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="su-scrim" onClick={onClose} aria-hidden="true" />
      <div className="su-sheet">
        <button className="su-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {status === 'success' ? (
          <div className="su-success">
            <p className="su-eyebrow">Check your email</p>
            <h2 id="su-title" className="su-title">
              You’re almost in.
            </h2>
            <p className="su-pitch">
              We sent a confirmation link to <strong>{email}</strong>. Click it and we’ll send you
              your private insider link.
            </p>
            <button type="button" className="su-btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            {eyebrow && <p className="su-eyebrow">{eyebrow}</p>}
            <h2 id="su-title" className="su-title">Save your spot.</h2>
            <p className="su-pitch">
              Join the waitlist and we’ll email you a private insider link when we open the doors.
            </p>

            <form className="su-form" onSubmit={handleSubmit} noValidate>
              <label className="su-field">
                <span className="su-label">Email</span>
                <input
                  type="email"
                  inputMode="email"
                  spellCheck={false}
                  autoCapitalize="none"
                  className="su-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.com"
                  autoComplete="email"
                  required
                />
              </label>

              {/* Honeypot — humans never see this. Bots usually fill every field. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                aria-hidden="true"
              />

              <label className="su-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <span>
                  I agree to receive launch updates from Between Lines and to the processing
                  described in our <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>.
                  Unsubscribe anytime.
                </span>
              </label>

              {status === 'error' && <p className="su-error">{errorMsg}</p>}

              <button type="submit" className="su-btn" disabled={!canSubmit}>
                {submitting ? 'Saving…' : 'Join waitlist'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
