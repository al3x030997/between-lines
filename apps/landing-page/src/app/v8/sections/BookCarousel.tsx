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
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 600;
  font-size: clamp(36px, 5vw, 68px);
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: #0e0e0c;
  margin: 0 0 18px;
  max-width: 22ch;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-books-sub {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #6b6b66;
  margin: 0;
  line-height: 1.55;
  text-wrap: pretty;
  max-width: 60ch;
}
.bl-books-track {
  display: flex;
  gap: 26px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 8px clamp(24px, 5vw, 80px) 24px;
}
.bl-books-track::-webkit-scrollbar { display: none; }
.bl-book-card {
  scroll-snap-align: start;
  flex: 0 0 240px;
  display: flex;
  flex-direction: column;
}
.bl-book-cover {
  width: 100%;
  aspect-ratio: 240 / 340;
  border: 1.5px solid rgba(14,14,12,0.12);
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 20px 22px 22px;
  position: relative;
  overflow: hidden;
}
.bl-book-cover.is-light {
  border-color: rgba(14,14,12,0.18);
}
.bl-book-cover-publisher {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  text-align: center;
  opacity: 0.85;
}
.bl-book-cover-title {
  align-self: center;
  text-align: center;
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 600;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.05;
  letter-spacing: -0.01em;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-book-cover-title em {
  font-style: italic;
  font-weight: 500;
}
.bl-book-cover-foot {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: stretch;
}
.bl-book-cover-rule {
  width: 100%;
  height: 1px;
  background: currentColor;
  opacity: 0.55;
}
.bl-book-cover-author {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0.85;
}
.bl-book-meta {
  padding: 14px 2px 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}
.bl-book-genre {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #e94b36;
}
.bl-book-sample {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #9a9a94;
  font-variant-numeric: tabular-nums;
}
.bl-book-desc {
  display: none;
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
  /** Indices (0-based, by whitespace-split) of words to render italic. */
  italicWords?: number[];
  author: string;
  /** Author monogram for the bottom-of-cover label, e.g. "M. OSEI". */
  authorMono: string;
  publisher: string;
  genre: string;
  sampleMinutes: number;
  coverBg: string;
  coverFg: 'light' | 'dark';
}

const BOOKS: Book[] = [
  {
    id: 2,
    title: 'Hollow Latitude',
    italicWords: [1],
    author: 'Marcus Osei',
    authorMono: 'M. OSEI',
    publisher: 'MANUSCRIPT',
    genre: 'Thriller',
    sampleMinutes: 9,
    coverBg: '#C5283D',
    coverFg: 'light',
  },
  {
    id: 3,
    title: 'Ash & Anise',
    italicWords: [2],
    author: 'Priya Nair',
    authorMono: 'P. NAIR',
    publisher: 'MANUSCRIPT',
    genre: 'Romance',
    sampleMinutes: 8,
    coverBg: '#F3EFE6',
    coverFg: 'dark',
  },
  {
    id: 4,
    title: 'The Undertow Hours',
    italicWords: [1],
    author: 'J.T. Calloway',
    authorMono: 'J.T. CALLOWAY',
    publisher: 'MANUSCRIPT',
    genre: 'Speculative',
    sampleMinutes: 12,
    coverBg: '#1F3A8A',
    coverFg: 'light',
  },
  {
    id: 5,
    title: 'Sable Run',
    italicWords: [1],
    author: 'Dae-Jung Park',
    authorMono: 'D.-J. PARK',
    publisher: 'MANUSCRIPT',
    genre: 'Historical',
    sampleMinutes: 11,
    coverBg: '#B98740',
    coverFg: 'light',
  },
  {
    id: 6,
    title: 'Soft Machinery',
    italicWords: [1],
    author: 'Claudette Renaud',
    authorMono: 'C. RENAUD',
    publisher: 'MANUSCRIPT',
    genre: 'Literary Sci-Fi',
    sampleMinutes: 10,
    coverBg: '#2C5530',
    coverFg: 'light',
  },
  {
    id: 7,
    title: 'The Wren Protocol',
    italicWords: [1],
    author: 'Nadia Volkov',
    authorMono: 'N. VOLKOV',
    publisher: 'MANUSCRIPT',
    genre: 'Spy Fiction',
    sampleMinutes: 9,
    coverBg: '#1A1A1A',
    coverFg: 'light',
  },
];

function renderTitle(title: string, italicWords?: number[]) {
  if (!italicWords || italicWords.length === 0) return title;
  const parts = title.split(/(\s+)/);
  let wordIdx = -1;
  return parts.map((part, i) => {
    if (/\s+/.test(part)) return part;
    wordIdx += 1;
    if (italicWords.includes(wordIdx)) {
      return <em key={i}>{part}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

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
        <p className="bl-books-eyebrow">Open call</p>
        <h2 className="bl-books-title">Accepting submissions for our first journal.</h2>
        <p className="bl-books-sub">BetweenLines №01 is open for submissions. Below — early peeks from writers in the pipeline. Want to be next?</p>
      </div>
      <div className="bl-books-track" ref={trackRef}>
        {BOOKS.map((book) => (
          <div key={book.id} className="bl-book-card">
            <div
              className={`bl-book-cover${book.coverFg === 'dark' ? ' is-light' : ''}`}
              style={{
                background: book.coverBg,
                color: book.coverFg === 'light' ? '#F3EFE6' : '#0e0e0c',
              }}
            >
              <div className="bl-book-cover-publisher">{book.publisher}</div>
              <div className="bl-book-cover-title">
                {renderTitle(book.title, book.italicWords)}
              </div>
              <div className="bl-book-cover-foot">
                <div className="bl-book-cover-rule" />
                <div className="bl-book-cover-author">{book.authorMono}</div>
              </div>
            </div>
            <div className="bl-book-meta">
              <div className="bl-book-genre">{book.genre}</div>
              <div className="bl-book-sample">{book.sampleMinutes} min sample</div>
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
