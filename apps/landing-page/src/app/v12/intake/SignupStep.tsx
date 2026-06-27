'use client';

import { useEffect, useState } from 'react';
import { checkDisplayNameStub, type NameStatus } from './roleData';

/**
 * Account-creation step shown before the intake questions. There is no auth
 * backend yet, so this is a faithful front-end of the prototype's signup:
 * the display-name check is a stub, the password is validated but never sent,
 * and the social buttons are placeholders. The only value the rest of the flow
 * needs is the email (+ display name), captured on a valid submit.
 */

type Props = {
  onComplete: (data: { displayName: string; email: string }) => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupStep({ onComplete }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(false);
  const [error, setError] = useState('');
  const [nameStatus, setNameStatus] = useState<NameStatus>('idle');
  const [social, setSocial] = useState('');

  // Debounced availability check (stub) — mirrors the prototype's 600ms delay.
  useEffect(() => {
    if (displayName.trim().length < 3) {
      setNameStatus('idle');
      return;
    }
    setNameStatus('idle');
    const id = setTimeout(() => setNameStatus(checkDisplayNameStub(displayName)), 600);
    return () => clearTimeout(id);
  }, [displayName]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = displayName.trim();
    const mail = email.trim();
    if (!name) return setError('Please choose a display name.');
    if (nameStatus === 'taken') return setError('Please choose a different display name.');
    if (!EMAIL_RE.test(mail)) return setError('Please enter a valid email address.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (!age) return setError('Please confirm you are over 18.');
    setError('');
    onComplete({ displayName: name, email: mail });
  };

  return (
    <form className="v12-signup" onSubmit={submit} noValidate>
      <h2 className="v12-signup-title">Create your account</h2>

      <button
        type="button"
        className="v12-signup-social"
        onClick={() => setSocial('Google')}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
          <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" />
        </svg>
        Continue with Google
      </button>
      <button
        type="button"
        className="v12-signup-social"
        onClick={() => setSocial('Apple')}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.6 0c.09.9-.27 1.8-.75 2.475-.48.675-1.305 1.2-2.1 1.14-.105-.855.285-1.755.735-2.355C10.98.585 11.865.075 12.6 0zM15.75 6.12c-.165.105-2.01 1.155-1.99 3.405.03 2.7 2.37 3.6 2.4 3.615-.03.09-.375 1.29-1.245 2.52-.735 1.065-1.5 2.115-2.7 2.13-1.17.03-1.56-.69-2.91-.69-1.365 0-1.8.675-2.91.72-1.155.03-2.04-1.125-2.79-2.175C1.98 13.47.75 10.455.75 7.575c0-2.82 1.845-4.305 3.66-4.335 1.155-.015 2.235.78 2.94.78.69 0 1.995-.96 3.375-.825.57.03 2.175.225 3.21 1.71l-.185.215z"
          />
        </svg>
        Continue with Apple
      </button>
      {social && (
        <p className="v12-signup-note">
          {social} sign-in is coming soon — continue with your email for now.
        </p>
      )}

      <div className="v12-signup-or">
        <hr />
        <span>or</span>
        <hr />
      </div>

      <input
        className="v12-field-input"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Display name"
        autoComplete="nickname"
      />
      {nameStatus !== 'idle' && (
        <p className={`v12-signup-status${nameStatus === 'taken' ? ' is-taken' : ' is-ok'}`}>
          {nameStatus === 'taken' ? '✗ Display name already taken' : '✓ Available'}
        </p>
      )}

      <input
        className="v12-field-input"
        type="email"
        inputMode="email"
        spellCheck={false}
        autoCapitalize="none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        autoComplete="email"
      />
      <input
        className="v12-field-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="new-password"
      />

      <label className="v12-signup-age">
        <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} />
        <span>I confirm I&rsquo;m over 18</span>
      </label>
      <p className="v12-signup-hint">Under 18? Ask a parent or guardian to help you sign up.</p>

      {error && <p className="v12-email-error">{error}</p>}

      <button type="submit" className="v8-cta v8-cta-primary v12-signup-submit">
        Join Free
        <span className="v8-cta-arrow" aria-hidden="true">→</span>
      </button>
    </form>
  );
}
