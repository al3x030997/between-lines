'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type Voice = {
  quote: string;
  name: string;
  mood: string;
  when: string;
};

// Mock community voices — same set across books for v1. Could be moved to
// mock-books.ts later if per-book curation matters.
const VOICES: Voice[] = [
  {
    quote:
      'I read this in one sitting. The chapter where she finds the third anomaly — I had to put the book down and walk around the room.',
    name: 'Margot R.',
    mood: 'Reflective reader',
    when: '5 days ago',
  },
  {
    quote:
      'Quiet, slow, devastating. The kind of book that makes you re-read paragraphs because you can’t believe what they did to you with so few words.',
    name: 'Theo K.',
    mood: 'Slow burn enthusiast',
    when: '2 weeks ago',
  },
  {
    quote:
      'This is what speculative fiction should be — the ideas are wild but the people stay human. Couldn’t put it down.',
    name: 'Anaya P.',
    mood: 'Sci-fi convert',
    when: '3 weeks ago',
  },
  {
    quote: 'I marked seventeen passages. Seventeen. The prose alone is worth the price of admission.',
    name: 'Sam D.',
    mood: 'Literary devotee',
    when: '1 month ago',
  },
  {
    quote: 'Started this between meetings on a Tuesday. Was useless to my coworkers by Friday.',
    name: 'Priyanka M.',
    mood: 'Escapist',
    when: '6 weeks ago',
  },
];

const AUTO_ADVANCE_MS = 12_000;

type CommunityVoicesProps = {
  rating?: number;
  addCommentHref?: string;
  actionLabel?: string;
};

export function CommunityVoices({ rating = 4.7, addCommentHref, actionLabel = 'Add comment' }: CommunityVoicesProps) {
  const [active, setActive] = useState(0);
  const count = VOICES.length;
  const ratingLabel = rating.toFixed(1);

  useEffect(() => {
    if (count <= 1) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % count), AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [active, count]);

  const advance = useCallback(
    (delta: number) => {
      setActive((i) => (i + delta + count) % count);
    },
    [count],
  );

  return (
    <section className="br-community" aria-label="What the community says">
      <div className="br-community-head">
        <div className="br-community-titleline">
          <span className="br-sec-label">What the community says</span>
          <span
            className="br-community-rating"
            aria-label={`Average reader rating ${ratingLabel} out of 5`}
          >
            <span className="br-community-rating-star" aria-hidden="true">
              ★
            </span>
            <span>{ratingLabel}</span>
          </span>
        </div>
        <div className="br-community-nav">
          <button
            type="button"
            className="br-community-arrow"
            onClick={() => advance(-1)}
            aria-label="Previous voice"
          >
            ‹
          </button>
          <button
            type="button"
            className="br-community-arrow"
            onClick={() => advance(1)}
            aria-label="Next voice"
          >
            ›
          </button>
        </div>
      </div>

      <div className="br-community-stage">
        {VOICES.map((v, i) => (
          <article
            key={i}
            className={`br-community-slide${i === active ? ' is-active' : ''}`}
            aria-hidden={i !== active}
            aria-roledescription="reader voice"
          >
            <p className="br-community-quote">“{v.quote}”</p>
            <div className="br-community-attr">
              <span className="br-community-name">{v.name}</span>
              <span className="br-community-sep" aria-hidden="true">·</span>
              <span className="br-community-mood">{v.mood}</span>
              <span className="br-community-sep" aria-hidden="true">·</span>
              <span className="br-community-when">{v.when}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="br-community-foot">
        <div className="br-community-dots" role="tablist" aria-label="Choose voice">
          {VOICES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Voice ${i + 1}`}
              className={`br-community-dot${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        {addCommentHref ? (
          <Link href={addCommentHref} className="br-community-add">
            {actionLabel}
          </Link>
        ) : (
          <button type="button" className="br-community-add">
            {actionLabel}
          </button>
        )}
      </div>
    </section>
  );
}
