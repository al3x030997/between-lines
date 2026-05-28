'use client';

type FilterDef = {
  label: FilterGroup;
  items: { emoji: string; label: string }[];
};

export type FilterGroup = 'Mood' | 'Genre' | 'Type';
export type FilterState = Record<string, boolean>;
export type SidebarShelfId = 'all' | 'foryou' | 'readerpicks' | 'memberpicks' | 'new';

const SHELF_FILTERS: { id: SidebarShelfId; label: string; meta: string }[] = [
  { id: 'all', label: 'All', meta: 'Full shelf' },
  { id: 'foryou', label: 'For You', meta: 'Matched' },
  { id: 'readerpicks', label: 'Reader Picks', meta: 'Community' },
  { id: 'memberpicks', label: 'Member Picks', meta: 'Co-op' },
  { id: 'new', label: 'New This Week', meta: 'Fresh' },
];

const FILTERS: FilterDef[] = [
  {
    label: 'Mood',
    items: [
      { emoji: '🌿', label: 'Calming' },
      { emoji: '🌍', label: 'Escapist' },
      { emoji: '😊', label: 'Feel-good' },
      { emoji: '😂', label: 'Funny' },
      { emoji: '🔥', label: 'Intense' },
      { emoji: '💭', label: 'Reflective' },
      { emoji: '😨', label: 'Scary' },
      { emoji: '🕯️', label: 'Slow Burn' },
      { emoji: '🎲', label: 'Surprise Me' },
    ],
  },
  {
    label: 'Genre',
    items: [
      { emoji: '🔮', label: 'Fantasy' },
      { emoji: '🏛️', label: 'Historical' },
      { emoji: '👻', label: 'Horror' },
      { emoji: '📖', label: 'Literary Fiction' },
      { emoji: '🔍', label: 'Mystery' },
      { emoji: '💕', label: 'Romance' },
      { emoji: '🪐', label: 'Sci-fi' },
      { emoji: '⚡', label: 'Thriller' },
      { emoji: '🧒', label: 'Young Adult' },
    ],
  },
  {
    label: 'Type',
    items: [
      { emoji: '⚡', label: 'Flash Fiction' },
      { emoji: '📄', label: 'Short Story' },
      { emoji: '📝', label: 'Novelette' },
      { emoji: '📘', label: 'Novella' },
      { emoji: '📗', label: 'Novel' },
      { emoji: '📚', label: 'Classic' },
      { emoji: '🌸', label: 'Poetry' },
    ],
  },
];

const GENRE_COUNTS: Record<string, number> = {
  Fantasy: 128,
  Historical: 94,
  Horror: 72,
  'Literary Fiction': 156,
  Mystery: 118,
  Romance: 142,
  'Sci-fi': 89,
  Thriller: 101,
  'Young Adult': 76,
};

const SAVED_FILTERS: { label: string; meta: string; count: number }[] = [
  { label: 'Weekend reads', meta: 'Calming, Short Story, Novella', count: 12 },
  { label: 'Epic fantasy', meta: 'Fantasy, Novel, 80k+ words', count: 28 },
];

export function filterKey(group: FilterGroup, label: string): string {
  return `${group}:${label}`;
}

/**
 * Bucket the selected filter keys by group. Each value is the list of
 * selected labels in that group.
 */
export function selectedByGroup(filters: FilterState): Record<FilterGroup, string[]> {
  const out: Record<FilterGroup, string[]> = { Mood: [], Genre: [], Type: [] };
  for (const [key, on] of Object.entries(filters)) {
    if (!on) continue;
    const [group, label] = key.split(':') as [FilterGroup, string];
    if (out[group]) out[group].push(label);
  }
  return out;
}

/**
 * AND across groups, OR within a group. A "Surprise Me" selection in Mood
 * acts as a wildcard for that group.
 */
export function matchesFilters(tags: string[], filters: FilterState): boolean {
  const groups = selectedByGroup(filters);
  for (const [, labels] of Object.entries(groups)) {
    if (labels.length === 0) continue;
    if (labels.includes('Surprise Me')) continue;
    if (!labels.some((l) => tags.includes(l))) return false;
  }
  return true;
}

export function hasActiveFilters(filters: FilterState): boolean {
  return Object.values(filters).some(Boolean);
}

type FilterSidebarProps = {
  filters: FilterState;
  onToggle: (key: string) => void;
  selectedShelf: SidebarShelfId;
  onShelfChange: (id: SidebarShelfId) => void;
};

export function FilterSidebar({ filters, onToggle, selectedShelf, onShelfChange }: FilterSidebarProps) {
  return (
    <aside className="br-fsidebar" aria-label="Filter books">
      <div className="br-fs-section br-fs-section-shelf">
        <span className="br-fs-label">BetweenReads</span>
        <div className="br-fs-shelf-grid">
          {SHELF_FILTERS.map((item) => {
            const on = selectedShelf === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`br-fs-shelf-btn ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => onShelfChange(item.id)}
              >
                <span>{item.label}</span>
                <em>{item.meta}</em>
              </button>
            );
          })}
        </div>
      </div>

      {FILTERS.map((group) => {
        const isPillGrid = group.label === 'Mood';
        const showCount = group.label === 'Genre';
        return (
          <div className="br-fs-section" key={group.label}>
            <span className="br-fs-label">{group.label}</span>
            {isPillGrid ? (
              <div className="br-fs-pills">
                {group.items.map((it) => {
                  const key = filterKey(group.label, it.label);
                  const on = !!filters[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`br-fs-pill ${on ? 'is-on' : ''}`}
                      aria-pressed={on}
                      onClick={() => onToggle(key)}
                    >
                      <span aria-hidden="true">{it.emoji}</span>
                      <span>{it.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              group.items.map((it) => {
                const key = filterKey(group.label, it.label);
                const on = !!filters[key];
                return (
                  <button
                    key={key}
                    type="button"
                    className={`br-fs-row ${on ? 'is-on' : ''}`}
                    aria-pressed={on}
                    onClick={() => onToggle(key)}
                  >
                    <span className="br-fs-row-emoji" aria-hidden="true">{it.emoji}</span>
                    <span className="br-fs-row-label">{it.label}</span>
                    {showCount ? (
                      <span className="br-fs-count">{GENRE_COUNTS[it.label]}</span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        );
      })}

      <button type="button" className="br-fs-more" aria-disabled="true">
        <span>More filters</span>
        <span aria-hidden="true">→</span>
      </button>

      <div className="br-fs-saved">
        <div className="br-fs-saved-head">
          <span className="br-fs-label">Saved filters</span>
          <span className="br-fs-saved-gear" aria-hidden="true">⚙</span>
        </div>
        {SAVED_FILTERS.map((s) => (
          <button key={s.label} type="button" className="br-fs-saved-item">
            <span className="br-fs-saved-bookmark" aria-hidden="true">🔖</span>
            <span className="br-fs-saved-body">
              <span className="br-fs-saved-title">{s.label}</span>
              <span className="br-fs-saved-meta">{s.meta}</span>
            </span>
            <span className="br-fs-saved-count">{s.count}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
