'use client';

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import {
  FilterSidebar,
  type FilterState,
  type SidebarShelfId,
  type SidebarMvpSection,
} from '@/components/FilterSidebar';
import { StoreTabs, type TabDef } from '@/components/StoreTabs';
import { DiscoverSearch } from '@/components/read/DiscoverSearch';
import { RailScroller } from '@/components/read/RailScroller';
import { BetaReadingHub } from '@/components/read/BetaReadingHub';
import {
  KidCategoryChips,
  KID_CATEGORY_TERMS,
  type KidCategory,
} from '@/components/read/KidCategoryChips';
import {
  accountMaturity,
  getBooksBySection,
  getInProgressBooks,
  getLaunchOriginals,
  sections,
  type Section,
  type Book,
} from '@/lib/mock-books';
import { BuildingBanner } from '@/components/BuildingBanner';
import { useMockSession } from '@/lib/useMockSession';
import { GuestNudgeProvider, useGuestNudge } from '@/components/SignupNudge';
import { GuestReaderStarter } from '@/components/read/GuestReaderStarter';

// The single book a logged-out guest may open in full as a sample. Every other
// poster fires the sign-up nudge instead of navigating (the deeper /read/<book>
// routes stay gated — see SessionGate PUBLIC_EXACT).
const SAMPLE_SLUG = 'small-fires-soft-rain';

type DiscoverTabId =
  | 'foryou'
  | 'betweenlines'
  | 'betareading'
  | 'audio'
  | 'magazine'
  | 'community';

const tabs: TabDef<DiscoverTabId>[] = [
  { id: 'foryou', label: 'For You' },
  { id: 'betweenlines', label: 'BetweenLines' },
  { id: 'betareading', label: 'Beta Reading' },
  { id: 'audio', label: 'Audio' },
  { id: 'magazine', label: 'Magazine' },
  { id: 'community', label: 'Community' },
];

// Kids get a stripped-down set: Read (For You), Audio, Community. No
// BetweenLines / Beta Reading / Magazine.
const KID_TAB_IDS: DiscoverTabId[] = ['foryou', 'audio', 'community'];
const kidTabs: TabDef<DiscoverTabId>[] = [
  { id: 'foryou', label: 'Read' },
  { id: 'audio', label: 'Audio' },
  { id: 'community', label: 'Community' },
];

// Sections that live in the left sidebar for grown-up readers. Beta Reading and
// Community were promoted to the global top bar (ReaderNav), so they're not here.
const sidebarSections: { id: DiscoverTabId; label: string }[] = [
  { id: 'foryou', label: 'For You' },
  { id: 'betweenlines', label: 'BetweenLines' },
  { id: 'audio', label: 'Audio' },
  { id: 'magazine', label: 'Magazine' },
];

const visibility: Record<DiscoverTabId, Section['id'][]> = {
  foryou: ['foryou', 'new', 'bl', 'classics'],
  betweenlines: ['bl'],
  betareading: [],
  audio: [],
  magazine: [],
  community: [],
};

const stubContent: Record<DiscoverTabId, { title: string; body: string } | null> = {
  foryou: null,
  betweenlines: null,
  betareading: null,
  audio: {
    title: 'Audio',
    body: 'Listen to stories and journal pieces narrated by their writers. Coming soon.',
  },
  magazine: {
    title: 'Magazine',
    body: 'Long-form essays and interviews from the BetweenLines editorial team. Coming soon.',
  },
  community: {
    title: 'Community',
    body: 'Reading clubs, writer Q&As, and the BetweenReads activity feed. Coming soon.',
  },
};

const sectionKickers: Record<Section['id'], string> = {
  bl: 'Journal-first fiction',
  foryou: 'Picked for you',
  new: 'Fresh this week',
  classics: 'Timeless & free',
};

/**
 * Guest interaction channel for posters rendered deep in the rail tree. In
 * member mode it's inert (guest=false, no-op onPeek), so the Discover screen
 * behaves exactly as before.
 */
const GuestDiscoverContext = createContext<{
  guest: boolean;
  onPeek: (book: Book) => void;
}>({ guest: false, onPeek: () => {} });

// Stable sort that floats books matching the guest's chosen genres to the front
// of each rail — the visible "your picks re-sort the shelves" effect. No-op when
// no taste is selected (members, or a guest who hasn't picked yet).
function sortByTaste(books: Book[], taste: string[]): Book[] {
  if (taste.length === 0) return books;
  const set = new Set(taste);
  const score = (b: Book) => (b.tags.some((t) => set.has(t)) ? 1 : 0);
  return books
    .map((b, i) => [b, i] as const)
    .sort((a, b) => score(b[0]) - score(a[0]) || a[1] - b[1])
    .map(([b]) => b);
}

function RailPoster({ book, rank }: { book: Book; rank?: number }) {
  const { guest, onPeek } = useContext(GuestDiscoverContext);
  const { requestSignup } = useGuestNudge();
  const keywords = book.tags.slice(0, 3);
  // Readers think in time-to-read, not word counts — surface estRead
  // (e.g. "~4hr") as the metadata pill instead of the raw word total.
  const readTime = book.estRead ? `${book.estRead} read` : null;
  const isSample = book.slug === SAMPLE_SLUG;
  return (
    <Link
      className="br-gallery-poster"
      href={`/read/${book.slug}`}
      onClick={(e) => {
        if (!guest) return;
        // Clicking any poster fills the guest's "Now reading" slot; only the
        // sample actually opens — everything else nudges to sign up.
        onPeek(book);
        if (!isSample) {
          e.preventDefault();
          requestSignup('open-book');
        }
      }}
    >
      <span className="br-gallery-poster-cover" style={{ background: book.cover }}>
        {rank != null ? <span className="br-gallery-rank">{rank}</span> : null}
        {guest && !isSample ? (
          <span className="br-gallery-poster-lock" aria-hidden="true">
            Join to open
          </span>
        ) : null}
        {keywords.length > 0 ? (
          <span className="br-gallery-poster-keywords" aria-hidden="true">
            {keywords.map((kw) => (
              <span key={kw} className="br-gallery-poster-keyword">
                {kw}
              </span>
            ))}
          </span>
        ) : null}
      </span>
      <span className="br-gallery-poster-body">
        <span className="br-gallery-poster-title">{book.title}</span>
        <span className="br-gallery-poster-author">{book.author}</span>
        <span className="br-gallery-poster-blurb">{book.blurb}</span>
        <span className="br-gallery-poster-tags">
          <span className="br-gallery-poster-tag">{book.format}</span>
          {readTime ? <span className="br-gallery-poster-tag">{readTime}</span> : null}
          <span
            className={`br-gallery-poster-tag is-${book.access.type === 'free' ? 'free' : 'rc'}`}
          >
            {book.access.label}
          </span>
        </span>
      </span>
    </Link>
  );
}

function ContinueReadingBox({ handle }: { handle?: string }) {
  const inProgress = getInProgressBooks(handle);
  const current = inProgress[0];
  if (!current) return null;

  const { book, progress } = current;
  const isDark = book.coverIsDark === true;

  return (
    <div className="br-continue-wrap">
      <div className="br-continue" role="region" aria-label="Continue reading">
        <div className="br-continue-cover" style={{ background: book.cover }}>
          <div className="br-cover-inner">
            <div className={`br-cover-title ${isDark ? 'is-dark' : ''}`}>{book.title}</div>
            <div className={`br-cover-rule ${isDark ? 'is-dark' : ''}`} />
            <div className={`br-cover-author ${isDark ? 'is-dark' : ''}`}>{book.author}</div>
          </div>
        </div>

        <div className="br-continue-body">
          <span className="br-continue-eyebrow">Continue reading</span>
          <h3 className="br-continue-title">{book.title}</h3>
          <div className="br-continue-author">{book.author}</div>
          <div className="br-continue-meta">{book.format}</div>
        </div>

        <div className="br-continue-progress">
          <div className="br-continue-percent">{progress}% complete</div>
          <div className="br-continue-bar" aria-hidden="true">
            <div className="br-continue-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <Link
          href={`/read/${book.slug}`}
          className="br-btn br-btn-primary br-continue-cta"
        >
          Continue reading →
        </Link>
      </div>
    </div>
  );
}

function isDiscoverTab(value: string | null): value is DiscoverTabId {
  return value != null && tabs.some((tab) => tab.id === value);
}

function DiscoverContent({ guest }: { guest: boolean }) {
  const { session } = useMockSession();
  const isKid = session?.isKid ?? false;
  const router = useRouter();
  const searchParams = useSearchParams();
  // The active section is URL-driven (?tab=) so the top-bar link highlight, the
  // sidebar highlight, and the rendered content never drift apart — whether the
  // user clicks a ReaderNav link or a sidebar section. replace() keeps history clean.
  const tabParam = searchParams.get('tab');
  const active: DiscoverTabId = isDiscoverTab(tabParam) ? tabParam : 'foryou';
  const setActive = useCallback(
    (id: DiscoverTabId) => {
      const base = guest ? '/read' : '/library';
      router.replace(`${base}?tab=${id}`, { scroll: false });
    },
    [router, guest],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedShelf, setSelectedShelf] = useState<SidebarShelfId>('all');
  // Guests start with the sidebar open so the "start your reader page" card is
  // the first thing they see; members keep the compact icon rail by default.
  const [sidebarOpen, setSidebarOpen] = useState(guest);
  const [kidCategory, setKidCategory] = useState<KidCategory>('all');
  const [launchSection, setLaunchSection] = useState<SidebarMvpSection>('all');
  // Guest "build your reader page" draft (drives the live re-sort + the card).
  const [taste, setTaste] = useState<string[]>([]);
  const [myLine, setMyLine] = useState<string | null>(null);
  const [nowReading, setNowReading] = useState<{ title: string; author: string } | null>(null);
  // Keep kids out of hidden tabs (e.g. a `?tab=betareading` deep link).
  const safeActive: DiscoverTabId = isKid && !KID_TAB_IDS.includes(active) ? 'foryou' : active;
  const visible = new Set<Section['id']>(visibility[safeActive]);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const kidTerms = isKid ? KID_CATEGORY_TERMS[kidCategory] : [];
  const matchesQuery = useCallback(
    (book: Book) => {
      const hay = [book.title, book.author, book.blurb, ...book.tags]
        .join(' ')
        .toLowerCase();
      if (normalizedQuery && !hay.includes(normalizedQuery)) return false;
      if (kidTerms.length > 0 && !kidTerms.some((t) => hay.includes(t))) return false;
      return true;
    },
    [normalizedQuery, kidTerms],
  );
  const handle = session?.handle;
  const isLaunch = accountMaturity(handle) === 'mvp';
  const showBuildingBanner = isLaunch;
  // Launch view renders its own content for the two catalogue tabs; everything
  // else (Beta Reading / Audio / Magazine / Community) still falls through.
  const launchContent = isLaunch && (safeActive === 'foryou' || safeActive === 'betweenlines');
  const launchOriginals = useMemo(() => getLaunchOriginals(), []);
  const launchClassics = useMemo(() => getBooksBySection('classics', handle), [handle]);
  const featuredBooks = useMemo(() => getBooksBySection('bl', handle), [handle]);
  // Hide the featured carousel for guests: its links bypass the poster nudge and
  // would hit gated book routes. The rails are the guest playground.
  const showFeatured =
    !guest && !isLaunch && !isKid && (safeActive === 'foryou' || safeActive === 'betweenlines');
  const showContinue = !isLaunch && session && (safeActive === 'foryou' || safeActive === 'betweenlines');
  const stub = stubContent[safeActive];

  const toggleGenre = useCallback((genre: string) => {
    setTaste((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  }, []);

  const handleToggle = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const guestPeek = useCallback((book: Book) => {
    setNowReading({ title: book.title, author: book.author });
  }, []);

  return (
    <GuestDiscoverContext.Provider value={{ guest, onPeek: guestPeek }}>
      <div className={`br-discover ${isKid ? 'is-kid' : ''} ${guest ? 'is-guest' : ''}`}>
        {!isKid && (
          <FilterSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onOpen={() => setSidebarOpen(true)}
            filters={filters}
            onToggle={handleToggle}
            selectedShelf={selectedShelf}
            onShelfChange={setSelectedShelf}
            sections={sidebarSections}
            activeSection={safeActive}
            onSectionChange={(id) => setActive(id as DiscoverTabId)}
            showFilters={safeActive === 'foryou' || safeActive === 'betweenlines'}
            query={searchQuery}
            onSearchChange={setSearchQuery}
            mvp={isLaunch}
            mvpSection={launchSection}
            onMvpSectionChange={setLaunchSection}
            headerSlot={
              guest ? (
                <GuestReaderStarter
                  genres={taste}
                  onToggleGenre={toggleGenre}
                  myLine={myLine}
                  onPickLine={setMyLine}
                  nowReading={nowReading}
                />
              ) : undefined
            }
          />
        )}
        <div className="br-discover-main">
          {showBuildingBanner && <BuildingBanner handle={handle} />}
          {isKid && (
            <div className="br-discover-tabsbar">
              <div className="br-discover-tabsbar-inner">
                <DiscoverSearch query={searchQuery} onChange={setSearchQuery} />
                <StoreTabs<DiscoverTabId>
                  tabs={kidTabs}
                  active={safeActive}
                  onChange={setActive}
                  ariaLabel="Discover sections"
                />
              </div>
            </div>
          )}
          {isKid ? (
            safeActive === 'foryou' && (
              <div className="br-discover-toolbar">
                <KidCategoryChips selected={kidCategory} onSelect={setKidCategory} />
              </div>
            )
          ) : null}

          {showContinue && <ContinueReadingBox handle={handle} />}

          {showFeatured && (
            <div className="br-discover-featured">
              <div className="br-discover-featured-head">
                <p className="br-discover-featured-kicker">Featured this week</p>
                <h2>Editor's spotlight</h2>
              </div>
              <FeaturedCarousel books={featuredBooks} />
            </div>
          )}

          {launchContent ? (
            <LaunchDiscover
              originals={launchOriginals}
              classics={launchClassics}
              section={launchSection}
              query={searchQuery}
            />
          ) : safeActive === 'betareading' ? (
            <BetaReadingHub />
          ) : stub ? (
            <div className="br-discover-stub" role="status">
              <p className="br-discover-stub-kicker">Coming soon</p>
              <h2 className="br-discover-stub-title">{stub.title}</h2>
              <p className="br-discover-stub-body">{stub.body}</p>
            </div>
          ) : (
            (() => {
              const renderedRails = sections
                .filter((s) => visible.has(s.id))
                .map((s) => {
                  const books = sortByTaste(
                    getBooksBySection(s.id, handle).filter(matchesQuery),
                    guest ? taste : [],
                  );
                  if (books.length === 0) return null;
                  return (
                    <Rail
                      key={s.id}
                      section={s}
                      kicker={sectionKickers[s.id]}
                      books={books}
                      showRank={s.id === 'bl'}
                    />
                  );
                })
                .filter(Boolean);
              if (renderedRails.length === 0 && (normalizedQuery || kidTerms.length > 0)) {
                return (
                  <div className="br-discover-stub" role="status">
                    <p className="br-discover-stub-kicker">No matches</p>
                    <h2 className="br-discover-stub-title">
                      {normalizedQuery ? `Nothing here for “${searchQuery}”` : 'Nothing here yet'}
                    </h2>
                    <p className="br-discover-stub-body">
                      {normalizedQuery
                        ? 'Try a different title, author, or tag.'
                        : 'Pick another category to keep exploring.'}
                    </p>
                  </div>
                );
              }
              return <div className="br-discover-rails">{renderedRails}</div>;
            })()
          )}
        </div>
      </div>
    </GuestDiscoverContext.Provider>
  );
}

/**
 * The Discover screen, shared between the member route (/library, guest=false)
 * and the logged-out playground (/read, guest=true). In guest mode it wraps the
 * screen in the sign-up nudge layer and turns on the "build your reader page"
 * starter + live re-sort; otherwise it's the original member experience.
 */
export function DiscoverExperience({ guest = false }: { guest?: boolean }) {
  return (
    <GuestNudgeProvider mode="reader" enabled={guest}>
      <Suspense fallback={null}>
        <DiscoverContent guest={guest} />
      </Suspense>
    </GuestNudgeProvider>
  );
}

// The launch (MVP) Discover view: one featured debut + a five-up row of the
// remaining originals under "Be among the first", then the free classics. No
// continue-reading, no carousel, no personalised rails — just the small
// catalogue we actually have at launch. The left sidebar filters between the
// two groups (see FilterSidebar mvp mode).
function LaunchDiscover({
  originals,
  classics,
  section,
  query,
}: {
  originals: Book[];
  classics: Book[];
  section: SidebarMvpSection;
  query: string;
}) {
  const q = query.trim().toLowerCase();
  const match = (book: Book) => {
    if (!q) return true;
    return [book.title, book.author, book.blurb, ...book.tags].join(' ').toLowerCase().includes(q);
  };

  const firstBooks = originals.filter(match);
  const classicBooks = classics.filter(match);
  const featured = firstBooks[0];
  const rowBooks = firstBooks.slice(1);

  const showFirst = (section === 'all' || section === 'first') && firstBooks.length > 0;
  const showClassics = (section === 'all' || section === 'classics') && classicBooks.length > 0;

  if (!showFirst && !showClassics) {
    return (
      <div className="br-discover-stub" role="status">
        <p className="br-discover-stub-kicker">No matches</p>
        <h2 className="br-discover-stub-title">
          {q ? `Nothing here for “${query}”` : 'Nothing here yet'}
        </h2>
        <p className="br-discover-stub-body">
          {q ? 'Try a different title, author, or tag.' : 'Check back soon — we’re just getting started.'}
        </p>
      </div>
    );
  }

  return (
    <div className="br-discover-rails">
      {showFirst && (
        <section className="br-launch-section" id="first-books" aria-labelledby="br-launch-first">
          <div className="br-discover-featured-head">
            <p className="br-discover-featured-kicker">Be among the first</p>
            <h2 id="br-launch-first">Read our first books</h2>
          </div>
          {featured && (
            <div className="br-discover-featured br-launch-featured">
              <FeaturedCarousel books={[featured]} />
            </div>
          )}
          {rowBooks.length > 0 && (
            <RailScroller
              labelledById="br-launch-first-row"
              head={<p className="br-gallery-kicker">More of our debut list</p>}
            >
              {rowBooks.map((book) => (
                <RailPoster key={book.slug} book={book} />
              ))}
            </RailScroller>
          )}
        </section>
      )}
      {showClassics && (
        <section className="br-launch-section" id="classics">
          <RailScroller
            labelledById="br-launch-classics"
            head={
              <>
                <p className="br-gallery-kicker">Free forever · Public domain</p>
                <h2 id="br-launch-classics">Timeless classics</h2>
              </>
            }
          >
            {classicBooks.map((book) => (
              <RailPoster key={book.slug} book={book} />
            ))}
          </RailScroller>
        </section>
      )}
    </div>
  );
}

function Rail({
  section,
  kicker,
  books,
  showRank,
}: {
  section: Section;
  kicker: string;
  books: Book[];
  showRank: boolean;
}) {
  return (
    <RailScroller
      labelledById={`br-sec-${section.id}`}
      head={
        <>
          <p className="br-gallery-kicker">{kicker}</p>
          <h2 id={`br-sec-${section.id}`}>{section.label}</h2>
        </>
      }
      actions={<a className="br-gallery-rail-link" role="button">See all</a>}
    >
      {books.map((book, idx) => (
        <RailPoster
          key={book.slug}
          book={book}
          rank={showRank ? idx + 1 : undefined}
        />
      ))}
    </RailScroller>
  );
}
