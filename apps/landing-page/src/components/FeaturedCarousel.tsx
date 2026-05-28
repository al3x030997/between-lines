'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Book } from '@/lib/mock-books';

const AUTO_ADVANCE_MS = 10_000;

type Props = {
  books: Book[];
};

export function FeaturedCarousel({ books }: Props) {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const count = books.length;

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

  if (count === 0) return null;

  return (
    <div className="br-featured-carousel" aria-roledescription="carousel" aria-label="Featured this week">
      <div className="br-featured-stage">
        {books.map((b, i) => {
          const isActive = i === active;
          const isDark = b.coverIsDark === true;
          const eyebrow = b.badges[0]?.label ?? 'Featured';
          return (
            <article
              key={b.slug}
              className={`br-featured-slide${isActive ? ' is-active' : ''}`}
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${b.title}`}
            >
              <div className="br-featured-cover" style={{ background: b.cover }}>
                <div className="br-cover-inner">
                  <div className={`br-cover-title ${isDark ? 'is-dark' : ''}`}>{b.title}</div>
                  <div className={`br-cover-rule ${isDark ? 'is-dark' : ''}`} />
                  <div className={`br-cover-author ${isDark ? 'is-dark' : ''}`}>{b.author}</div>
                </div>
              </div>
              <div className="br-featured-body">
                <span className="br-featured-eyebrow">{eyebrow}</span>
                <h2 className="br-featured-title">{b.title}</h2>
                <div className="br-featured-author">{b.author}</div>
                <p className="br-featured-blurb">{b.blurb}</p>
                <div className="br-featured-foot">
                  <span className="br-featured-meta">{b.format}</span>
                  <button
                    type="button"
                    className="br-btn br-btn-primary br-featured-cta"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => router.push(`/read/${b.slug}`)}
                  >
                    Start reading →
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            className="br-featured-arrow br-featured-prev"
            onClick={() => advance(-1)}
            aria-label="Previous featured book"
          >
            ‹
          </button>
          <button
            type="button"
            className="br-featured-arrow br-featured-next"
            onClick={() => advance(1)}
            aria-label="Next featured book"
          >
            ›
          </button>

          <div className="br-featured-dots" role="tablist" aria-label="Choose featured book">
            {books.map((b, i) => (
              <button
                key={b.slug}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Slide ${i + 1}`}
                className={`br-featured-dot${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
