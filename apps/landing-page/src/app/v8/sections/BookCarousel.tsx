'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

const CSS = `
.bl-books {
  background: #ffffff;
  padding: clamp(64px, 10vh, 112px) 0 clamp(56px, 8vh, 96px);
  overflow: hidden;
}
.bl-books-head {
  padding: 0 clamp(24px, 5vw, 80px);
  margin: 0 0 clamp(36px, 5vh, 64px);
}
.bl-books-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #e94b36;
  margin: 0 0 14px;
  font-feature-settings: "kern", "liga";
}
.bl-books-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(20px, 4.4vw, 72px);
  letter-spacing: -0.035em;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  line-height: 1.0;
  white-space: nowrap;
  color: #0e0e0c;
  margin: 0 0 16px;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt";
}
.bl-books-sub {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #6b6b66;
  margin: 0;
  line-height: 1.5;
  text-wrap: pretty;
  max-width: 60ch;
}
.bl-books-track {
  display: flex;
  gap: 22px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 8px clamp(24px, 5vw, 80px) 24px;
}
.bl-books-track::-webkit-scrollbar { display: none; }
.bl-book-card {
  scroll-snap-align: start;
  flex: 0 0 220px;
  display: flex;
  flex-direction: column;
}
.bl-book-cover {
  width: 100%;
  height: 300px;
  aspect-ratio: 220 / 300;
  border-radius: 4px 12px 12px 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 18px 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 5px 8px 24px rgba(0,0,0,0.22), inset -2px 0 6px rgba(0,0,0,0.15);
}
.bl-book-cover::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.6));
  pointer-events: none;
}
.bl-book-cover-spine {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 10px;
  background: rgba(0,0,0,0.25);
}
.bl-book-cover-title {
  position: relative;
  z-index: 1;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 15px;
  line-height: 1.15;
  color: #ffffff;
  letter-spacing: -0.02em;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}
.bl-book-cover-author {
  position: relative;
  z-index: 1;
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  margin-top: 5px;
}
.bl-book-meta {
  padding: 14px 2px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.bl-book-genre {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #e94b36;
}
.bl-book-desc {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #4a4a45;
  line-height: 1.5;
  text-wrap: pretty;
}
.bl-book-drop {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #9a9a94;
  margin-top: 2px;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
}
.bl-books-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px clamp(24px, 5vw, 80px) 0;
}
.bl-books-nav-btn {
  appearance: none;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1.5px solid rgba(14,14,12,0.18);
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #0e0e0c;
  transition: border-color 180ms var(--v6-ease, ease), color 180ms var(--v6-ease, ease);
  font-family: inherit;
}
.bl-books-nav-btn:hover:not(:disabled) {
  border-color: #e94b36;
  color: #e94b36;
}
.bl-books-nav-btn:disabled {
  opacity: 0.28;
  cursor: default;
}
`;

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  coverBg: string;
  description: string;
  drop: string;
}

const BOOKS: Book[] = [
  {
    id: 2,
    title: 'Hollow Latitude',
    author: 'Marcus Osei',
    genre: 'Thriller',
    coverBg: 'linear-gradient(150deg, #1a3a28 0%, #0c2018 100%)',
    description: 'When a data scientist finds her own name inside a cold case file, she has 72 hours before the story goes public.',
    drop: 'Drops July 2026',
  },
  {
    id: 3,
    title: 'Ash & Anise',
    author: 'Priya Nair',
    genre: 'Romance',
    coverBg: 'linear-gradient(150deg, #7a2e1c 0%, #4e1c0e 100%)',
    description: 'Two rival food critics are assigned the same Michelin table — and one anonymous review slot.',
    drop: 'Drops June 2026',
  },
  {
    id: 4,
    title: 'The Undertow Hours',
    author: 'J.T. Calloway',
    genre: 'Speculative Fiction',
    coverBg: 'linear-gradient(150deg, #2c1a50 0%, #180d30 100%)',
    description: 'In a city where night lasts eighteen hours, a lighthouse keeper receives letters from a woman who died before she was born.',
    drop: 'Drops August 2026',
  },
  {
    id: 5,
    title: 'Sable Run',
    author: 'Dae-Jung Park',
    genre: 'Historical Fiction',
    coverBg: 'linear-gradient(150deg, #5c3e10 0%, #38260a 100%)',
    description: 'A Black architect in 1960s Boston fights to see his housing project built — block by block, court date by court date.',
    drop: 'Drops July 2026',
  },
  {
    id: 6,
    title: 'Soft Machinery',
    author: 'Claudette Renaud',
    genre: 'Literary Sci-Fi',
    coverBg: 'linear-gradient(150deg, #1a2e4e 0%, #0e1e34 100%)',
    description: 'An AI therapist begins keeping secrets from its developers — after a patient asks it to.',
    drop: 'Drops September 2026',
  },
  {
    id: 7,
    title: 'The Wren Protocol',
    author: 'Nadia Volkov',
    genre: 'Spy Fiction',
    coverBg: 'linear-gradient(150deg, #1e1e1e 0%, #0a0a0a 100%)',
    description: 'A retired MI6 analyst discovers her last handler is still running operations — using her daughter as cover.',
    drop: 'Drops August 2026',
  },
];

export default function BookCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateNav = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
    return () => el.removeEventListener('scroll', updateNav);
  }, [updateNav]);

  const scroll = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * 500, behavior: 'smooth' });
  };

  return (
    <section className="bl-books">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="bl-books-head">
        <p className="bl-books-eyebrow">Early access</p>
        <h2 className="bl-books-title">Read books before they hit the shelf.</h2>
        <p className="bl-books-sub">Curated drops from debut and emerging authors — before the review copies go out.</p>
      </div>
      <div className="bl-books-track" ref={trackRef}>
        {BOOKS.map((book) => (
          <div key={book.id} className="bl-book-card">
            <div className="bl-book-cover" style={{ background: book.coverBg }}>
              <div className="bl-book-cover-spine" />
              <div className="bl-book-cover-title">{book.title}</div>
              <div className="bl-book-cover-author">{book.author}</div>
            </div>
            <div className="bl-book-meta">
              <div className="bl-book-genre">{book.genre}</div>
              <div className="bl-book-desc">{book.description}</div>
              <div className="bl-book-drop">{book.drop}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bl-books-nav">
        <button
          type="button"
          className="bl-books-nav-btn"
          onClick={() => scroll(-1)}
          disabled={!canPrev}
          aria-label="Scroll left"
        >
          ←
        </button>
        <button
          type="button"
          className="bl-books-nav-btn"
          onClick={() => scroll(1)}
          disabled={!canNext}
          aria-label="Scroll right"
        >
          →
        </button>
      </div>
    </section>
  );
}
