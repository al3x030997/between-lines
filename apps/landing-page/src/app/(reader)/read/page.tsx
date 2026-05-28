'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  FilterSidebar,
  type FilterState,
  hasActiveFilters,
  matchesFilters,
} from '@/components/FilterSidebar';
import { ProductCard } from '@/components/ProductCard';
import { StoreTabs, type TabDef } from '@/components/StoreTabs';
import { getBooksBySection, sections, type Section, type Book } from '@/lib/mock-books';

type DiscoverTabId =
  | 'all'
  | 'foryou'
  | 'readerpicks'
  | 'betapicks'
  | 'memberpicks'
  | 'betweenlines'
  | 'magazine'
  | 'new';

const tabs: TabDef<DiscoverTabId>[] = [
  { id: 'all', label: 'All' },
  { id: 'foryou', label: 'For You' },
  { id: 'readerpicks', label: 'Reader Picks' },
  { id: 'betapicks', label: 'Beta Picks' },
  { id: 'memberpicks', label: 'Member Picks' },
  { id: 'betweenlines', label: 'BetweenLines' },
  { id: 'magazine', label: 'Magazine' },
  { id: 'new', label: 'New this week' },
];

const visibility: Record<DiscoverTabId, Section['id'][]> = {
  all: ['bl', 'foryou', 'new', 'classics'],
  foryou: ['foryou'],
  readerpicks: ['foryou'],
  betapicks: ['foryou'],
  memberpicks: ['foryou'],
  betweenlines: ['bl'],
  magazine: ['bl'],
  new: ['new'],
};

function bookToCard(b: Book): React.ReactNode {
  const primaryBadge = b.badges[0];
  return (
    <ProductCard
      key={b.slug}
      kind="book"
      href={`/read/${b.slug}`}
      title={b.title}
      author={b.author}
      blurb={b.blurb}
      cover={b.cover}
      coverIsDark={b.coverIsDark}
      badge={primaryBadge ? { kind: primaryBadge.kind, label: primaryBadge.label } : undefined}
      format={b.format}
      access={b.access}
    />
  );
}

export default function DiscoverPage() {
  const [active, setActive] = useState<DiscoverTabId>('all');
  const [filters, setFilters] = useState<FilterState>({});
  const visible = new Set<Section['id']>(visibility[active]);
  const filtersActive = hasActiveFilters(filters);

  const toggle = useCallback((key: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => setFilters({}), []);

  const filteredSections = useMemo(() => {
    return sections
      .filter((s) => visible.has(s.id))
      .map((s) => ({ section: s, books: getBooksBySection(s.id).filter((b) => matchesFilters(b.tags, filters)) }))
      .filter(({ books }) => books.length > 0);
  }, [filters, visible]);

  const totalFiltered = filteredSections.reduce((n, x) => n + x.books.length, 0);

  return (
    <div className="br-discover">
      <FilterSidebar filters={filters} onToggle={toggle} />
      <div className="br-discover-main">
        <StoreTabs<DiscoverTabId>
          tabs={tabs}
          active={active}
          onChange={setActive}
          ariaLabel="Discover sections"
        />
        <div className="br-stage">
          {filtersActive && (
            <div className="br-filter-status" role="status" aria-live="polite">
              <span>
                {totalFiltered === 0
                  ? 'No books match your filters.'
                  : `${totalFiltered} book${totalFiltered === 1 ? '' : 's'} match your filters.`}
              </span>
              <button type="button" className="br-filter-clear" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
          {filteredSections.map(({ section: s, books }) => (
            <section key={s.id} aria-labelledby={`br-sec-${s.id}`}>
              <div className="br-sec-head">
                <h2 id={`br-sec-${s.id}`} className="br-sec-title">
                  {s.label}
                </h2>
                <a className="br-sec-link">See all</a>
              </div>
              <div className="br-grid">{books.map(bookToCard)}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
