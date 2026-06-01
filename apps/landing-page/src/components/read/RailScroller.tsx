'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  /** Left side of the rail head — typically a kicker + heading. */
  head: ReactNode;
  /** Optional extra actions rendered after the scroll arrows (e.g. a "See all" link). */
  actions?: ReactNode;
  /** Value for the section's aria-labelledby (should match the heading's id). */
  labelledById?: string;
  /** The horizontally-scrolling track contents (poster cards). */
  children: ReactNode;
};

/**
 * Generic horizontally-scrolling rail with ‹ › paging arrows that enable/disable
 * at the track edges. Owns only the scroll mechanics; callers supply the head,
 * optional actions, and the cards. Reused by the Discover book rails and the
 * Beta Reading hub rails.
 */
export function RailScroller({ head, actions, labelledById, children }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  const showNav = !atStart || !atEnd;

  return (
    <section aria-labelledby={labelledById} className="br-gallery-rail">
      <div className="br-gallery-rail-head">
        <div>{head}</div>
        <div className="br-gallery-rail-actions">
          {showNav ? (
            <div className="br-gallery-rail-nav" aria-label="Scroll books">
              <button
                type="button"
                className="br-gallery-rail-arrow"
                onClick={() => scrollByPage(-1)}
                disabled={atStart}
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                type="button"
                className="br-gallery-rail-arrow"
                onClick={() => scrollByPage(1)}
                disabled={atEnd}
                aria-label="Next"
              >
                ›
              </button>
            </div>
          ) : null}
          {actions}
        </div>
      </div>
      <div className="br-gallery-track" ref={trackRef}>
        {children}
      </div>
    </section>
  );
}
