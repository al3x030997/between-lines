'use client';

import { useEffect, useRef, useState } from 'react';
import type { TabDef } from '@/components/StoreTabs';
import {
  filterKey,
  selectedByGroup,
  type FilterGroup,
  type FilterState,
} from '@/components/FilterSidebar';

const FILTER_GROUPS: { label: FilterGroup; items: string[] }[] = [
  {
    label: 'Mood',
    items: ['Calming', 'Escapist', 'Feel-good', 'Funny', 'Intense', 'Reflective', 'Scary', 'Slow Burn', 'Surprise Me'],
  },
  {
    label: 'Genre',
    items: ['Fantasy', 'Historical', 'Horror', 'Literary Fiction', 'Mystery', 'Romance', 'Sci-fi', 'Thriller', 'Young Adult'],
  },
  {
    label: 'Type',
    items: ['Flash Fiction', 'Short Story', 'Novelette', 'Novella', 'Novel', 'Classic', 'Poetry'],
  },
];

type Props<T extends string> = {
  tabs: TabDef<T>[];
  active: T;
  onChange: (id: T) => void;
  query: string;
  onQueryChange: (next: string) => void;
  filters: FilterState;
  onFilterToggle: (key: string) => void;
  onFiltersClear: () => void;
};

export function DiscoverBar<T extends string>({
  tabs,
  active,
  onChange,
  query,
  onQueryChange,
  filters,
  onFilterToggle,
  onFiltersClear,
}: Props<T>) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const groups = selectedByGroup(filters);
  const activeCount = (Object.values(groups) as string[][]).reduce((sum, arr) => sum + arr.length, 0);

  useEffect(() => {
    if (!filtersOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!filtersRef.current?.contains(e.target as Node)) setFiltersOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFiltersOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [filtersOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (query.length > 0) setSearchOpen(true);
  }, [query]);

  return (
    <div className="br-discover-bar" role="navigation" aria-label="Discover">
      <div className="br-discover-bar-inner">
        <div className="br-discover-bar-tabs" role="tablist" aria-label="Discover sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              className={`br-discover-bar-tab ${active === t.id ? 'is-active' : ''}`}
              onClick={() => onChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="br-discover-bar-tools">
          <div className={`br-discover-bar-search ${searchOpen || query ? 'is-open' : ''}`}>
            <button
              type="button"
              className="br-discover-bar-search-trigger"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <input
              ref={searchInputRef}
              type="search"
              className="br-discover-bar-search-input"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onBlur={() => {
                if (!query) setSearchOpen(false);
              }}
              placeholder="Title, author, mood"
              aria-label="Search stories"
            />
            {query ? (
              <button
                type="button"
                className="br-discover-bar-search-clear"
                onClick={() => onQueryChange('')}
                aria-label="Clear search"
              >
                ×
              </button>
            ) : null}
          </div>

          <div className="br-discover-bar-filters" ref={filtersRef}>
            <button
              type="button"
              className={`br-discover-bar-filter-btn ${activeCount > 0 ? 'is-active' : ''}`}
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              aria-haspopup="dialog"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path
                  d="M3 5h14M5 10h10M8 15h4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <span>Filters</span>
              {activeCount > 0 ? <em>{activeCount}</em> : null}
            </button>

            {filtersOpen ? (
              <div className="br-discover-bar-filter-pop" role="dialog" aria-label="Filter stories">
                <div className="br-discover-bar-filter-pop-head">
                  <span>Mood, genre &amp; format</span>
                  {activeCount > 0 ? (
                    <button type="button" className="br-discover-bar-filter-clear" onClick={onFiltersClear}>
                      Clear all
                    </button>
                  ) : null}
                </div>
                {FILTER_GROUPS.map((g) => (
                  <div className="br-discover-bar-filter-group" key={g.label}>
                    <p className="br-discover-bar-filter-label">{g.label}</p>
                    <div className="br-discover-bar-filter-chips">
                      {g.items.map((label) => {
                        const key = filterKey(g.label, label);
                        const on = !!filters[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            className={`br-discover-bar-filter-chip ${on ? 'is-on' : ''}`}
                            aria-pressed={on}
                            onClick={() => onFilterToggle(key)}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {activeCount > 0 ? (
        <div className="br-discover-bar-active" aria-label="Active filters">
          {(Object.entries(groups) as [FilterGroup, string[]][]).map(([group, labels]) =>
            labels.map((label) => {
              const key = filterKey(group, label);
              return (
                <button
                  key={key}
                  type="button"
                  className="br-discover-bar-active-chip"
                  onClick={() => onFilterToggle(key)}
                  aria-label={`Remove ${group}: ${label}`}
                >
                  <span className="br-discover-bar-active-group">{group}</span>
                  <span>{label}</span>
                  <span aria-hidden="true">×</span>
                </button>
              );
            }),
          )}
          <button type="button" className="br-discover-bar-active-clear" onClick={onFiltersClear}>
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}
