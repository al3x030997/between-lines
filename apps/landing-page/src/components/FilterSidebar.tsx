'use client';

import { useState } from 'react';

type FilterDef = {
  label: string;
  items: { emoji: string; label: string }[];
};

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

export function FilterSidebar() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setOn((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside className="br-fsidebar" aria-label="Filter books">
      {FILTERS.map((group) => (
        <div className="br-fs-section" key={group.label}>
          <span className="br-fs-label">{group.label}</span>
          {group.items.map((it) => {
            const key = `${group.label}:${it.label}`;
            return (
              <button
                key={key}
                type="button"
                className={`br-fs-btn ${on[key] ? 'is-on' : ''}`}
                onClick={() => toggle(key)}
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
