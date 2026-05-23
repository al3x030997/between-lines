'use client';

import { useEffect, useRef, useState } from 'react';

type Quote = { text: string; author: string };

const QUOTES: Quote[] = [
  {
    text:
      "Half the world is composed of people who have something to say and can't, and the other half who have nothing to say and keep on saying it.",
    author: 'Robert Frost',
  },
  {
    text: 'There is no greater agony than bearing an untold story inside you.',
    author: 'Maya Angelou',
  },
  {
    text:
      'A reader lives a thousand lives before he dies. The man who never reads lives only one.',
    author: 'George R. R. Martin',
  },
  {
    text: 'The first draft of anything is shit.',
    author: 'Ernest Hemingway',
  },
  {
    text: 'We read to know we are not alone.',
    author: 'C. S. Lewis',
  },
];

const INTERVAL_MS = 8000;
const FADE_MS = 520;

export default function QuotesCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mq.matches;
    const onChange = () => {
      reducedMotion.current = mq.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (paused) return;
    if (reducedMotion.current) return;
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [index, paused]);

  const goPrev = () => setIndex((i) => (i - 1 + QUOTES.length) % QUOTES.length);
  const goNext = () => setIndex((i) => (i + 1) % QUOTES.length);

  const q = QUOTES[index];

  return (
    <section
      className="v8-quotes"
      aria-label="Quotes from authors"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <style>{CSS}</style>
      <span className="v8-quotes-mark" aria-hidden="true">
        &#10077;
      </span>
      <div className="v8-quotes-stage" aria-live="polite" aria-atomic="true">
        <blockquote key={index} className="v8-quotes-block">
          <p className="v8-quotes-text">{q.text}</p>
          <footer className="v8-quotes-attrib">
            <span className="v8-quotes-em" aria-hidden="true">&mdash;</span>
            <cite>{q.author}</cite>
          </footer>
        </blockquote>
      </div>

      <div className="v8-quotes-controls" aria-hidden={false}>
        <button
          type="button"
          className="v8-quotes-arrow"
          onClick={goPrev}
          aria-label="Previous quote"
        >
          &larr;
        </button>
        <ol className="v8-quotes-dots" role="tablist" aria-label="Select quote">
          {QUOTES.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Quote ${i + 1} of ${QUOTES.length}`}
                className={`v8-quotes-dot${i === index ? ' is-active' : ''}`}
                onClick={() => setIndex(i)}
              />
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="v8-quotes-arrow"
          onClick={goNext}
          aria-label="Next quote"
        >
          &rarr;
        </button>
      </div>
    </section>
  );
}

const CSS = `
.v8-quotes {
  position: relative;
  margin-top: clamp(24px, 4vh, 44px);
  padding: 0 0 0 clamp(20px, 2.4vw, 36px);
  max-width: 680px;
  pointer-events: auto;
  font-family: 'Cormorant Garamond', Georgia, serif;
  color: var(--v6-text-strong);
}
.v8-quotes-mark {
  position: absolute;
  left: -8px;
  top: -28px;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(56px, 7vw, 96px);
  line-height: 1;
  color: var(--v6-accent);
  opacity: 0.32;
  pointer-events: none;
  user-select: none;
}
.v8-quotes-stage {
  position: relative;
  min-height: clamp(108px, 14vh, 168px);
  display: flex;
  align-items: flex-start;
}
.v8-quotes-block {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: v8-quote-in 520ms cubic-bezier(.22, 1, .36, 1) both;
}
@keyframes v8-quote-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .v8-quotes-block { animation: none; }
}
.v8-quotes-text {
  margin: 0;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(17px, 1.55vw, 22px);
  line-height: 1.45;
  letter-spacing: 0.005em;
  color: var(--v6-text-strong);
  opacity: 0.88;
  text-wrap: pretty;
  max-width: 56ch;
}
.v8-quotes-attrib {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--v6-text-muted);
  opacity: 0.78;
}
.v8-quotes-em {
  color: var(--v6-accent);
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 16px;
  letter-spacing: 0;
  transform: translateY(-1px);
  opacity: 0.7;
}
.v8-quotes-attrib cite { font-style: normal; }

.v8-quotes-controls {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  margin-top: clamp(14px, 2vh, 22px);
}
.v8-quotes-arrow {
  appearance: none;
  background: transparent;
  border: 0;
  font: inherit;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 18px;
  color: var(--v6-text-muted);
  opacity: 0.55;
  cursor: pointer;
  padding: 4px 6px;
  line-height: 1;
  transition: opacity 200ms ease, color 200ms ease, transform 200ms cubic-bezier(.22, 1, .36, 1);
}
.v8-quotes-arrow:hover,
.v8-quotes-arrow:focus-visible {
  opacity: 1;
  color: var(--v6-accent);
  outline: none;
}
.v8-quotes-arrow:hover:first-of-type { transform: translateX(-2px); }
.v8-quotes-arrow:hover:last-of-type { transform: translateX(2px); }

.v8-quotes-dots {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.v8-quotes-dot {
  appearance: none;
  border: 0;
  background: var(--v6-text-strong);
  opacity: 0.22;
  width: 18px;
  height: 1px;
  padding: 0;
  cursor: pointer;
  transition: opacity 240ms ease, width 240ms cubic-bezier(.22, 1, .36, 1), background 240ms ease, height 240ms ease;
}
.v8-quotes-dot:hover { opacity: 0.55; }
.v8-quotes-dot.is-active {
  opacity: 1;
  width: 28px;
  height: 2px;
  background: var(--v6-accent);
}

@media (max-width: 760px) {
  .v8-quotes { padding-left: clamp(16px, 4vw, 28px); }
  .v8-quotes-mark { font-size: 48px; top: -20px; }
  .v8-quotes-text { font-size: 16px; }
  .v8-quotes-stage { min-height: 132px; }
}
`;
