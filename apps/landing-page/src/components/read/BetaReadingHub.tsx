'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { RailScroller } from '@/components/read/RailScroller';
import {
  betaGenres,
  betaMoods,
  deadlineDays,
  getBetaReadingSections,
  getBetaReadingRequests,
  type BetaReadingRequest,
} from '@/lib/mock-beta-reading';

type SortKey = 'closing' | 'credits' | 'longest';

const sortOptions: { id: SortKey; label: string }[] = [
  { id: 'closing', label: 'Closing soon' },
  { id: 'credits', label: 'Most credits' },
  { id: 'longest', label: 'Longest read' },
];

function sortRequests(requests: BetaReadingRequest[], sort: SortKey): BetaReadingRequest[] {
  const copy = [...requests];
  switch (sort) {
    case 'credits':
      return copy.sort((a, b) => b.rewardCredits - a.rewardCredits);
    case 'longest':
      return copy.sort((a, b) => b.words - a.words);
    case 'closing':
    default:
      return copy.sort((a, b) => deadlineDays(a) - deadlineDays(b));
  }
}

function BetaPoster({ request }: { request: BetaReadingRequest }) {
  return (
    <Link className="br-gallery-poster br-beta-poster" href={`/read/beta/${request.slug}`}>
      <span className="br-gallery-poster-cover" style={{ background: request.cover }}>
        <span className="br-beta-poster-credits">
          <span className="br-badge br-badge-mp">{request.rewardCredits} Swap Credits</span>
        </span>
      </span>
      <span className="br-gallery-poster-body">
        <span className="br-gallery-poster-title">{request.title}</span>
        <span className="br-gallery-poster-author">{request.author}</span>
        <span className="br-gallery-poster-blurb">{request.blurb}</span>
        <span className="br-gallery-poster-tags">
          <span className="br-gallery-poster-tag">{request.genre}</span>
          <span className="br-gallery-poster-tag">{request.mood}</span>
        </span>
        <span className="br-beta-poster-foot">
          <span className="br-beta-poster-foot-item">{request.deadline} left</span>
          <span className="br-beta-poster-foot-item is-slots">
            {request.slotsOpen} {request.slotsOpen === 1 ? 'slot' : 'slots'} open
          </span>
        </span>
      </span>
    </Link>
  );
}

export function BetaReadingHub({ query }: { query: string }) {
  const [genre, setGenre] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('closing');

  const genres = useMemo(() => betaGenres(), []);
  const moods = useMemo(() => betaMoods(), []);
  const sections = useMemo(() => getBetaReadingSections(), []);

  const normalizedQuery = query.trim().toLowerCase();
  const isFiltering = genre !== null || mood !== null || normalizedQuery !== '';

  const filtered = useMemo(() => {
    const matches = (r: BetaReadingRequest) => {
      if (genre && r.genre !== genre) return false;
      if (mood && r.mood !== mood) return false;
      if (!normalizedQuery) return true;
      return (
        r.title.toLowerCase().includes(normalizedQuery)
        || r.author.toLowerCase().includes(normalizedQuery)
        || r.genre.toLowerCase().includes(normalizedQuery)
        || r.mood.toLowerCase().includes(normalizedQuery)
        || r.blurb.toLowerCase().includes(normalizedQuery)
      );
    };
    return sortRequests(getBetaReadingRequests().filter(matches), sort);
  }, [genre, mood, normalizedQuery, sort]);

  const toggle = (current: string | null, value: string) => (current === value ? null : value);

  return (
    <div className="br-beta-hub">
      <div className="br-beta-hub-intro">
        <p className="br-beta-hub-intro-eyebrow">Beta Reading</p>
        <h2 className="br-beta-hub-intro-title">Read manuscripts before the world does</h2>
        <p className="br-beta-hub-intro-body">
          Pick a draft, read a few chapters, and leave structured feedback. You earn Swap Credits for
          every response — and if a book you read goes on to be agented or published, you’re credited
          as an Early Discoverer on the author’s page.
        </p>
      </div>

      <div className="br-beta-hub-filters">
        <div className="br-beta-hub-filter-group">
          <span className="br-beta-hub-filter-label">Genre</span>
          <div className="br-beta-chips">
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                className={`br-beta-chip ${genre === g ? 'is-active' : ''}`}
                aria-pressed={genre === g}
                onClick={() => setGenre((c) => toggle(c, g))}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="br-beta-hub-filter-group">
          <span className="br-beta-hub-filter-label">Mood</span>
          <div className="br-beta-chips">
            {moods.map((m) => (
              <button
                key={m}
                type="button"
                className={`br-beta-chip ${mood === m ? 'is-active' : ''}`}
                aria-pressed={mood === m}
                onClick={() => setMood((c) => toggle(c, m))}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        {isFiltering && (
          <label className="br-beta-hub-sort">
            <span className="br-beta-hub-filter-label">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {isFiltering ? (
        filtered.length > 0 ? (
          <div className="br-beta-grid">
            {filtered.map((request) => (
              <BetaPoster key={request.slug} request={request} />
            ))}
          </div>
        ) : (
          <div className="br-discover-stub" role="status">
            <p className="br-discover-stub-kicker">No matches</p>
            <h2 className="br-discover-stub-title">No beta reads fit those filters</h2>
            <p className="br-discover-stub-body">Try another genre, mood, or search term.</p>
          </div>
        )
      ) : (
        <div className="br-discover-rails">
          {sections.map((section) => (
            <RailScroller
              key={section.id}
              labelledById={`br-beta-sec-${section.id}`}
              head={
                <>
                  <p className="br-gallery-kicker">{section.kicker}</p>
                  <h2 id={`br-beta-sec-${section.id}`}>{section.label}</h2>
                </>
              }
            >
              {section.requests.map((request) => (
                <BetaPoster key={request.slug} request={request} />
              ))}
            </RailScroller>
          ))}
        </div>
      )}
    </div>
  );
}
