'use client';

import { ACCOUNT_PROFILES, type AccountProfile } from '@/lib/account-profiles';

type Props = {
  className?: string;
  currentUser?: string | null;
  headingAs?: 'h1' | 'h2';
  headingId?: string;
  onAddAccount: () => void;
  onManageProfiles: () => void;
  onSelectProfile: (profile: AccountProfile) => void;
};

export function AccountProfilePicker({
  className,
  currentUser,
  headingAs = 'h2',
  headingId = 'br-acct-headline',
  onAddAccount,
  onManageProfiles,
  onSelectProfile,
}: Props) {
  const Heading = headingAs;

  return (
    <div className={`br-acct-modal ${className ?? ''}`}>
      <Heading id={headingId} className="br-acct-headline">Who&rsquo;s reading?</Heading>
      <p className="br-acct-sub">Pick a profile to continue</p>

      <div className="br-acct-grid">
        {ACCOUNT_PROFILES.map((p) => {
          const isCurrent = currentUser === p.user;
          return (
            <button
              key={p.id}
              type="button"
              className={`br-acct-tile ${isCurrent ? 'is-current' : ''}`}
              onClick={() => onSelectProfile(p)}
              aria-current={isCurrent ? 'true' : undefined}
            >
              <div
                className="br-acct-avatar"
                style={{ background: p.avatarBg, color: p.avatarInk }}
                aria-hidden="true"
              >
                {p.initial}
                {p.badge === 'kids' ? (
                  <span className="br-acct-avatar-tag">KIDS</span>
                ) : null}
              </div>
              <span className="br-acct-name">{p.user}</span>
            </button>
          );
        })}

        <button
          type="button"
          className="br-acct-tile is-add"
          onClick={onAddAccount}
        >
          <div className="br-acct-avatar is-add" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path
                d="M12 5v14M5 12h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="br-acct-name">Add account</span>
        </button>
      </div>

      <button
        type="button"
        className="br-acct-manage"
        onClick={onManageProfiles}
      >
        Manage profiles
      </button>
    </div>
  );
}
