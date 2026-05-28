'use client';

type FilterDef = {
  label: FilterGroup;
  items: { emoji: string; label: string }[];
};

export type FilterGroup = 'Mood' | 'Genre' | 'Type';
export type FilterState = Record<string, boolean>;

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
};

export function FilterSidebar({ filters, onToggle }: FilterSidebarProps) {
  return (
    <aside className="br-fsidebar" aria-label="Filter books">
      {FILTERS.map((group) => (
        <div className="br-fs-section" key={group.label}>
          <span className="br-fs-label">{group.label}</span>
          {group.items.map((it) => {
            const key = filterKey(group.label, it.label);
            const on = !!filters[key];
            return (
              <button
                key={key}
                type="button"
                className={`br-fs-btn ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => onToggle(key)}
              >
                <span aria-hidden="true">{it.emoji}</span> {it.label}
              </button>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
