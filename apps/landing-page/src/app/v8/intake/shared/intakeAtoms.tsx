'use client';

import { createContext, useContext, type ReactNode } from 'react';

const GroupNumContext = createContext<string | null>(null);

export function Group({
  num,
  label,
  children,
}: {
  num: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <GroupNumContext.Provider value={num}>
      <section className="v8-intake-group" aria-label={label}>
        {children}
      </section>
    </GroupNumContext.Provider>
  );
}

export function Prompt({ children }: { children: ReactNode }) {
  const num = useContext(GroupNumContext);
  return (
    <h3 className="v8-intake-prompt">
      {num && <span className="v8-intake-prompt-num" aria-hidden="true">{num}.</span>}
      <span className="v8-intake-prompt-text">{children}</span>
    </h3>
  );
}

export function Chips({ children }: { children: ReactNode }) {
  return <div className="v8-intake-chips">{children}</div>;
}

export function Chip({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`v8-chip${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
    >
      {children}
    </button>
  );
}

export function ToggleChip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`v8-toggle-chip${on ? ' is-on' : ''}`}
      aria-pressed={on}
      onClick={onClick}
    >
      <span className="v8-toggle-chip-box" aria-hidden="true">
        <svg className="v8-toggle-chip-tick" viewBox="0 0 16 16">
          <polyline points="3 8.5 6.5 12 13 4.5" />
        </svg>
      </span>
      <span>{children}</span>
    </button>
  );
}

export function ExpandRow({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`v8-intake-expand${open ? ' is-open' : ''}`}>
      <div className="v8-intake-expand-inner">{children}</div>
    </div>
  );
}
