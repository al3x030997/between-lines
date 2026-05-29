'use client';

import { useState } from 'react';
import { FilterSidebar } from '@/components/FilterSidebar';
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
  const visible = new Set<Section['id']>(visibility[active]);

  return (
    <div className="br-discover">
      <FilterSidebar />
      <div className="br-discover-main">
        <StoreTabs<DiscoverTabId>
          tabs={tabs}
          active={active}
          onChange={setActive}
          ariaLabel="Discover sections"
        />
        <div className="br-stage">
          {sections.map((s) => {
            if (!visible.has(s.id)) return null;
            const books = getBooksBySection(s.id);
            if (books.length === 0) return null;
            return (
              <section key={s.id} aria-labelledby={`br-sec-${s.id}`}>
                <div className="br-sec-head">
                  <h2 id={`br-sec-${s.id}`} className="br-sec-title">
                    {s.label}
                  </h2>
                  <a className="br-sec-link">See all</a>
                </div>
                <div className="br-grid">{books.map(bookToCard)}</div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
