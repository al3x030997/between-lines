'use client';

export type TabDef<T extends string = string> = {
  id: T;
  label: string;
  emoji?: string;
};

type Props<T extends string> = {
  tabs: TabDef<T>[];
  active: T;
  onChange: (id: T) => void;
  ariaLabel?: string;
};

export function StoreTabs<T extends string>({ tabs, active, onChange, ariaLabel = 'Tabs' }: Props<T>) {
  return (
    <div className="br-tabs" role="tablist" aria-label={ariaLabel}>
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={active === t.id}
          className={`br-tab ${active === t.id ? 'is-active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.emoji ? <span aria-hidden="true">{t.emoji}</span> : null} {t.label}
        </button>
      ))}
    </div>
  );
}
