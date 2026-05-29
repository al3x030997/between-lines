'use client';

import type { SidebarShelfId } from '@/components/FilterSidebar';

const SHELVES: { id: SidebarShelfId; label: string; group: 'browse' | 'mine' }[] = [
  { id: 'all', label: 'All', group: 'browse' },
  { id: 'foryou', label: 'For You', group: 'browse' },
  { id: 'readerpicks', label: 'Reader Picks', group: 'browse' },
  { id: 'memberpicks', label: 'Member Picks', group: 'browse' },
  { id: 'new', label: 'New This Week', group: 'browse' },
  { id: 'continue', label: 'Continue', group: 'mine' },
  { id: 'readinglist', label: 'Reading List', group: 'mine' },
  { id: 'finished', label: 'Finished', group: 'mine' },
];

type Props = {
  active: SidebarShelfId;
  onChange: (id: SidebarShelfId) => void;
};

export function ShelfChips({ active, onChange }: Props) {
  return (
    <div className="br-shelf-chips" aria-label="Shelves">
      <span className="br-shelf-chips-label">Shelves</span>
      <div className="br-shelf-chips-track">
        {SHELVES.map((s, i) => {
          const prev = SHELVES[i - 1];
          const showDivider = prev && prev.group !== s.group;
          return (
            <span key={s.id} className="br-shelf-chips-wrap">
              {showDivider ? <span className="br-shelf-chips-divider" aria-hidden="true" /> : null}
              <button
                type="button"
                className={`br-shelf-chip ${active === s.id ? 'is-active' : ''}`}
                onClick={() => onChange(s.id)}
                aria-pressed={active === s.id}
              >
                {s.label}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
