'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';

export type NudgeMode = 'reader' | 'writer';

type GuestNudgeValue = {
  /** True only inside an enabled provider (i.e. a logged-out playground). */
  guest: boolean;
  /**
   * Open the sign-up nudge. `reason` selects the modal copy; unknown reasons
   * fall back to a generic message. No-op when not in guest mode, so callers
   * can wire it unconditionally.
   */
  requestSignup: (reason?: NudgeReason) => void;
};

export type NudgeReason =
  | 'bar'
  | 'open-book'
  | 'continue'
  | 'save'
  | 'credits'
  | 'feedback'
  | 'publish'
  | 'beta'
  | 'profile';

const GuestNudgeContext = createContext<GuestNudgeValue>({
  guest: false,
  requestSignup: () => {},
});

export function useGuestNudge(): GuestNudgeValue {
  return useContext(GuestNudgeContext);
}

const MODE_COPY: Record<
  NudgeMode,
  { startHref: string; barLead: string; barCta: string; signinLabel: string }
> = {
  reader: {
    startHref: '/start?mode=reader',
    barLead: "You're reading as a guest.",
    barCta: 'Create your free reader page',
    signinLabel: 'Sign in',
  },
  writer: {
    startHref: '/start?mode=writer',
    barLead: "You're drafting as a guest.",
    barCta: 'Claim your writer space — free',
    signinLabel: 'Sign in',
  },
};

const REASON_COPY: Record<NudgeReason, { title: string; body: string }> = {
  bar: {
    title: 'Keep what you start',
    body: 'Make a free account to save your place, your shelves, and your reader page.',
  },
  'open-book': {
    title: 'Open the full library',
    body: 'You can read this sample as a guest. Join free to open every title and keep your spot.',
  },
  continue: {
    title: 'Pick up where you left off',
    body: 'Sign up free and BetweenReads remembers your progress across every device.',
  },
  save: {
    title: 'Save it to your shelves',
    body: 'A free account gives you reading lists, finished shelves, and your own reader page.',
  },
  credits: {
    title: 'Unlock with credits',
    body: 'Reading credits are free to earn — create your account to start collecting them.',
  },
  feedback: {
    title: 'Leave feedback writers will read',
    body: 'Join free to comment, react, and become a beta reader for writers you love.',
  },
  publish: {
    title: 'Publish your work',
    body: 'Claim a free writer space to publish chapters and build your audience.',
  },
  beta: {
    title: 'Find your beta readers',
    body: 'Create a free writer space to recruit beta readers and gather notes.',
  },
  profile: {
    title: 'This could be your reader page',
    body: 'Everything you pick here carries over. Sign up free to make it yours.',
  },
};

function MarkReader() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5v-12ZM20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5A1.5 1.5 0 0 0 20 17.5v-12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NudgeModal({
  mode,
  reason,
  onClose,
}: {
  mode: NudgeMode;
  reason: NudgeReason;
  onClose: () => void;
}) {
  const copy = REASON_COPY[reason] ?? REASON_COPY.bar;
  const modeCopy = MODE_COPY[mode];
  return (
    <div
      className={`br-nudge-overlay br-nudge-${mode}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="br-nudge-title"
      onClick={onClose}
    >
      <div className="br-nudge-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="br-nudge-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        <span className="br-nudge-mark" aria-hidden="true">
          <MarkReader />
        </span>
        <h2 id="br-nudge-title" className="br-nudge-title">
          {copy.title}
        </h2>
        <p className="br-nudge-body">{copy.body}</p>
        <div className="br-nudge-actions">
          <Link href={modeCopy.startHref} className="br-nudge-cta">
            {modeCopy.barCta}
          </Link>
          <button type="button" className="br-nudge-keep" onClick={onClose}>
            Keep exploring
          </button>
        </div>
        <p className="br-nudge-foot">
          Already have an account?{' '}
          <Link href={modeCopy.startHref} className="br-nudge-link">
            {modeCopy.signinLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}

function GuestBar({
  mode,
  onSignup,
}: {
  mode: NudgeMode;
  onSignup: () => void;
}) {
  const modeCopy = MODE_COPY[mode];
  return (
    <div className={`br-guestbar br-nudge-${mode}`} role="region" aria-label="Guest preview">
      <span className="br-guestbar-dot" aria-hidden="true" />
      <span className="br-guestbar-lead">{modeCopy.barLead}</span>
      <Link href={modeCopy.startHref} className="br-guestbar-cta" onClick={onSignup}>
        {modeCopy.barCta} →
      </Link>
    </div>
  );
}

/**
 * Wraps a logged-out playground and provides `useGuestNudge()` to descendants.
 * Renders the persistent guest bar + an on-demand modal. When `enabled` is
 * false (a logged-in member viewing the same shared component) it's an inert
 * pass-through: no bar, no modal, and `requestSignup` is a no-op.
 */
export function GuestNudgeProvider({
  mode,
  enabled,
  children,
}: {
  mode: NudgeMode;
  enabled: boolean;
  children: ReactNode;
}) {
  const [reason, setReason] = useState<NudgeReason | null>(null);

  const requestSignup = useCallback(
    (next?: NudgeReason) => {
      if (!enabled) return;
      setReason(next ?? 'bar');
    },
    [enabled],
  );

  return (
    <GuestNudgeContext.Provider value={{ guest: enabled, requestSignup }}>
      {children}
      {enabled && <GuestBar mode={mode} onSignup={() => setReason(null)} />}
      {enabled && reason && (
        <NudgeModal mode={mode} reason={reason} onClose={() => setReason(null)} />
      )}
    </GuestNudgeContext.Provider>
  );
}
