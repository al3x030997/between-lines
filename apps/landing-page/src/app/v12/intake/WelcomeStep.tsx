'use client';

import { useState } from 'react';
import { quotesFor, welcomeActionsFor, type IntakeRole } from './roleData';

/**
 * Final screen of the flow (replaces the old "check your email" state).
 * Mirrors the prototype's welcome: a credits line, a row of next-step links,
 * and a closing literary quote. When `pending` is true the waitlist row was
 * persisted but Kit is still reconciling, so the insider cookie is not set
 * yet — the gated links unlock from the confirmation email instead.
 */

type Props = {
  role: IntakeRole;
  bookTitle?: string;
  pending?: boolean;
};

export default function WelcomeStep({ role, bookTitle, pending }: Props) {
  const actions = welcomeActionsFor(role, bookTitle);
  const [quote] = useState(() => {
    const list = quotesFor(role);
    return list[Math.floor(Math.random() * list.length)];
  });

  return (
    <div className="v12-welcome">
      <div className="v12-welcome-head">
        <h2 className="v12-welcome-title">Welcome.</h2>
        <p className="v12-welcome-credits">
          You&rsquo;ve been gifted <strong>100 reader credits</strong>.
        </p>
      </div>

      <div className="v12-welcome-actions">
        {actions.map((a) => (
          <a key={a.label} href={a.href} className="v12-welcome-action">
            {a.label}
          </a>
        ))}
      </div>

      {pending && (
        <p className="v12-welcome-pending">
          We&rsquo;ve emailed you a confirmation link — your profile unlocks the moment you click it.
        </p>
      )}

      {quote && (
        <figure className="v12-welcome-quote">
          <blockquote>{quote.text}</blockquote>
          <figcaption>— {quote.author}</figcaption>
        </figure>
      )}

      <p className="v12-welcome-about">
        <a href="/about">About Between Reads</a>
      </p>
    </div>
  );
}
