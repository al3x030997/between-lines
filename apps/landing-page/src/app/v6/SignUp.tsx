'use client';

import { useEffect, useState } from 'react';

export type SignUpVariant = 'signup' | 'signin';

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
}
.su-pitch {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  line-height: 1.5;
  color: #4d4d47;
  margin: 0 0 26px;
  max-width: 36ch;
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
  transition: border-color 160ms ease, background 160ms ease;
}
.su-input::placeholder { color: rgba(14, 14, 12, 0.45); }
.su-input:focus {
  outline: none;
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
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
.su-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 22px 0 14px;
  color: rgba(14, 14, 12, 0.4);
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.su-divider::before,
.su-divider::after {
  content: '';
  flex: 1 1 auto;
  height: 1px;
  background: rgba(14, 14, 12, 0.12);
}
.su-secondary {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 14px;
  width: 100%;
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid rgba(14, 14, 12, 0.18);
  background: #ffffff;
  color: #0e0e0c;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;
}
.su-secondary:hover {
  border-color: #0e0e0c;
  background: rgba(14, 14, 12, 0.03);
}
.su-foot {
  margin-top: 22px;
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: #6a6a64;
  text-align: center;
}
.su-link {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: var(--v6-accent);
  font-weight: 600;
  cursor: pointer;
}
.su-link:hover { text-decoration: underline; }
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

export function SignUpOverlay({
  open,
  onClose,
  variant: initialVariant = 'signup',
  eyebrow,
}: {
  open: boolean;
  onClose: () => void;
  variant?: SignUpVariant;
  eyebrow?: string;
}) {
  const [variant, setVariant] = useState<SignUpVariant>(initialVariant);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) setVariant(initialVariant);
  }, [open, initialVariant]);

  useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setPassword('');
      setSubmitted(false);
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

  const isSignIn = variant === 'signin';
  const canSubmit = email.trim().length > 0 && password.length > 0 && (isSignIn || name.trim().length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <div className="su-root" role="dialog" aria-modal="true" aria-labelledby="su-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="su-scrim" onClick={onClose} aria-hidden="true" />
      <div className="su-sheet">
        <button className="su-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {!submitted ? (
          <>
            {eyebrow && <p className="su-eyebrow">{eyebrow}</p>}
            <h2 id="su-title" className="su-title">
              {isSignIn ? 'Welcome back.' : 'Save your spot.'}
            </h2>
            <p className="su-pitch">
              {isSignIn
                ? 'Sign in to pick up where you left off.'
                : 'Create an account so we can hold your place for launch.'}
            </p>

            <form className="su-form" onSubmit={handleSubmit}>
              {!isSignIn && (
                <label className="su-field">
                  <span className="su-label">Name</span>
                  <input
                    type="text"
                    className="su-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </label>
              )}
              <label className="su-field">
                <span className="su-label">Email</span>
                <input
                  type="email"
                  className="su-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label className="su-field">
                <span className="su-label">Password</span>
                <input
                  type="password"
                  className="su-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isSignIn ? 'current-password' : 'new-password'}
                  required
                />
              </label>
              <button type="submit" className="su-btn" disabled={!canSubmit}>
                {isSignIn ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="su-divider"><span>or</span></div>
            <button
              type="button"
              className="su-secondary"
              onClick={() => setSubmitted(true)}
            >
              Continue with Google
            </button>

            <p className="su-foot">
              {isSignIn ? "Don't have an account? " : 'Already a member? '}
              <button
                type="button"
                className="su-link"
                onClick={() => setVariant(isSignIn ? 'signup' : 'signin')}
              >
                {isSignIn ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </>
        ) : (
          <div className="su-success">
            <p className="su-eyebrow">All set</p>
            <h2 id="su-title" className="su-title">
              {isSignIn ? 'Welcome back.' : 'You’re on the list.'}
            </h2>
            <p className="su-pitch">
              {isSignIn
                ? 'You’re signed in.'
                : 'We’ll be in touch as soon as we’re ready to let you in.'}
            </p>
            <button type="button" className="su-btn" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
