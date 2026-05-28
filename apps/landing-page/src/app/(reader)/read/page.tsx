'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FilterSidebar,
  type FilterState,
  hasActiveFilters,
  matchesFilters,
} from '@/components/FilterSidebar';
import { ProductCard, type CardVariant } from '@/components/ProductCard';
import { ContinueReadingHero } from '@/components/ContinueReadingHero';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
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
  | 'new'
  | 'betweencharacters';

const tabs: TabDef<DiscoverTabId>[] = [
  { id: 'all', label: 'All' },
  { id: 'foryou', label: 'For You' },
  { id: 'readerpicks', label: 'Reader Picks' },
  { id: 'betapicks', label: 'Beta Picks' },
  { id: 'memberpicks', label: 'Member Picks' },
  { id: 'betweenlines', label: 'BetweenLines' },
  { id: 'magazine', label: 'Magazine' },
  { id: 'new', label: 'New this week' },
  { id: 'betweencharacters', label: 'BetweenCharacters' },
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
  betweencharacters: [],
};

const betweenCharacterQuotes = [
  {
    tag: 'Feel-good',
    quote: 'You are braver than you believe, stronger than you seem, and smarter than you think.',
    source: 'Winnie the Pooh',
  },
  {
    tag: 'Reflective',
    quote: 'Not all those who wander are lost.',
    source: 'J.R.R. Tolkien',
  },
  {
    tag: 'Intense',
    quote: 'I write only because there is a voice within me that will not be still.',
    source: 'Sylvia Plath',
  },
];

function isDiscoverTabId(value: string | null): value is DiscoverTabId {
  return tabs.some((t) => t.id === value);
}

function bookToCard(b: Book, variant: CardVariant = 'default'): React.ReactNode {
  const primaryBadge = b.badges[0];
  return (
    <ProductCard
      key={b.slug}
      kind="book"
      variant={variant}
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

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<DiscoverTabId>('all');
  const [filters, setFilters] = useState<FilterState>({});
  const visible = new Set<Section['id']>(visibility[active]);
  const filtersActive = hasActiveFilters(filters);
  const showFeaturedLayout = active === 'all' && !filtersActive;
  const showBetweenCharacters = active === 'betweencharacters' && !filtersActive;

  useEffect(() => {
    const tab = searchParams.get('tab');
    setActive(isDiscoverTabId(tab) ? tab : 'all');
  }, [searchParams]);

  const toggle = useCallback((key: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => setFilters({}), []);

  const changeTab = useCallback(
    (id: DiscoverTabId) => {
      setActive(id);
      router.replace(id === 'all' ? '/read' : `/read?tab=${id}`, { scroll: false });
    },
    [router],
  );

  const filteredBooks = useMemo(() => {
    return sections
      .filter((s) => visible.has(s.id))
      .flatMap((s) => getBooksBySection(s.id))
      .filter((b) => matchesFilters(b.tags, filters));
  }, [filters, visible]);

  const featuredBooks = useMemo(() => getBooksBySection('bl'), []);
  const recommendedBooks = useMemo(
    () => [
      ...getBooksBySection('foryou'),
      ...getBooksBySection('new'),
      ...getBooksBySection('classics'),
    ],
    [],
  );

  return (
    <div className="br-discover">
      <FilterSidebar filters={filters} onToggle={toggle} />
      <div className="br-discover-main">
        <header className="br-discover-head">
          <div>
            <h1 className="br-discover-h1">Discover</h1>
            <p className="br-discover-sub">Stories matched to your current mood</p>
          </div>
          <div className="br-discover-actions">
            <button type="button" className="br-sort" aria-disabled="true">
              <span aria-hidden="true">↕</span> Sort: Relevance <span aria-hidden="true">▾</span>
            </button>
            <button type="button" className="br-btn br-btn-ghost br-discover-filters" aria-disabled="true">
              <span aria-hidden="true">⚙</span> Filters
            </button>
          </div>
        </header>

        <StoreTabs<DiscoverTabId>
          tabs={tabs}
          active={active}
          onChange={changeTab}
          ariaLabel="Discover sections"
        />

        <div className="br-stage">
          <ContinueReadingHero />

          {filtersActive && (
            <div className="br-filter-status" role="status" aria-live="polite">
              <span>
                {filteredBooks.length === 0
                  ? 'No books match your filters.'
                  : `${filteredBooks.length} book${filteredBooks.length === 1 ? '' : 's'} match your filters.`}
              </span>
              <button type="button" className="br-filter-clear" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}

          {showBetweenCharacters ? (
            <section aria-labelledby="br-sec-characters">
              <div className="br-sec-head">
                <h2 id="br-sec-characters" className="br-sec-label">BetweenCharacters</h2>
                <a className="br-sec-link">See all</a>
              </div>
              <div className="br-character-grid">
                {betweenCharacterQuotes.map((item) => (
                  <article key={item.source} className="br-character-card">
                    <div className="br-character-tag">{item.tag}</div>
                    <p className="br-character-quote">“{item.quote}”</p>
                    <div className="br-character-source">— {item.source}</div>
                  </article>
                ))}
              </div>
            </section>
          ) : showFeaturedLayout ? (
            <>
              <section aria-labelledby="br-sec-featured">
                <div className="br-sec-head">
                  <h2 id="br-sec-featured" className="br-sec-label">Featured this week</h2>
                  <a className="br-sec-link">View all</a>
                </div>
                <FeaturedCarousel books={featuredBooks} />
              </section>

              <section aria-labelledby="br-sec-recommended">
                <div className="br-sec-head">
                  <h2 id="br-sec-recommended" className="br-sec-label">Recommended for you</h2>
                  <a className="br-sec-link">View all</a>
                </div>
                <div className="br-recommended-row">
                  {recommendedBooks.map((b) => bookToCard(b))}
                </div>
              </section>
            </>
          ) : (
            <section aria-label="Filtered books">
              <div className="br-recommended-row">
                {filteredBooks.map((b) => bookToCard(b))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverContent />
    </Suspense>
  );
}
