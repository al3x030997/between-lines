'use client';

type Props = {
  onReader?: () => void;
  onWriter?: () => void;
};

type MiniBook = {
  title: string;
  italicWords?: number[];
  authorMono: string;
  publisher: string;
  coverBg: string;
  coverFg: 'light' | 'dark';
};

const offerCover = (filename: string) =>
  `linear-gradient(180deg, rgba(8, 8, 8, 0.04) 0%, rgba(8, 8, 8, 0.38) 56%, rgba(8, 8, 8, 0.66) 100%), url('/covers/${filename}.jpg') center/cover no-repeat`;

const MINI_BOOKS: MiniBook[] = [
  {
    title: 'Hollow Latitude',
    italicWords: [1],
    authorMono: 'M. OSEI',
    publisher: 'BETWEENREADS',
    coverBg: offerCover('hollow-latitude'),
    coverFg: 'light',
  },
  {
    title: 'Ash & Anise',
    italicWords: [2],
    authorMono: 'P. NAIR',
    publisher: 'BETWEENREADS',
    coverBg: offerCover('ash-and-anise'),
    coverFg: 'light',
  },
  {
    title: 'The Undertow Hours',
    italicWords: [1],
    authorMono: 'J.T. CALLOWAY',
    publisher: 'BETWEENREADS',
    coverBg: offerCover('the-undertow-hours'),
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
    if (italicWords.includes(wordIdx)) return <em key={i}>{part}</em>;
    return <span key={i}>{part}</span>;
  });
}

export default function SignupOffers({ onReader, onWriter }: Props) {
  const handle = (cb?: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    cb?.();
  };

  return (
    <section className="bl-offers" aria-label="Free reads and Volume audiobooks">
      <style>{CSS}</style>
      <div className="bl-offers-inner">
        <article
          className="bl-offers-panel bl-offers-reader"
          aria-labelledby="bl-offers-reader-title"
        >
          <h2 className="bl-offers-title" id="bl-offers-reader-title">
            Six emerging authors, publishing here. Read them <em>free.</em>
          </h2>
          <div className="bl-offers-covers" aria-hidden="true">
            {MINI_BOOKS.map((book, i) => (
              <div
                key={book.title}
                className={`bl-offers-cover${book.coverFg === 'dark' ? ' is-light' : ''}`}
                style={{
                  background: book.coverBg,
                  color: book.coverFg === 'light' ? '#F3EFE6' : '#0e0e0c',
                  transform: `rotate(${[-3, 0.5, 2.5][i]}deg)`,
                }}
              >
                <div className="bl-offers-cover-publisher">{book.publisher}</div>
                <div className="bl-offers-cover-title">
                  {renderTitle(book.title, book.italicWords)}
                </div>
                <div className="bl-offers-cover-foot">
                  <div className="bl-offers-cover-rule" />
                  <div className="bl-offers-cover-author">{book.authorMono}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="bl-offers-lede">
            Meet six debut authors — read them free when you join.
            Hand-selected fiction, yours to keep. No trial, no card.
          </p>
          <a
            href="/?intake=reader"
            className="bl-offers-cta"
            onClick={handle(onReader)}
          >
            Read now
            <span className="bl-offers-cta-arrow" aria-hidden="true">→</span>
          </a>
        </article>

        <div className="bl-offers-divider" aria-hidden="true" />

        <article
          className="bl-offers-panel bl-offers-volume"
          aria-labelledby="bl-offers-volume-title"
        >
          <p className="bl-offers-eyebrow">
            <span className="bl-offers-eyebrow-mark" aria-hidden="true" />
            Introducing
          </p>
          <h2 className="bl-offers-title" id="bl-offers-volume-title">
            <span className="bl-offers-volume-mark">Volume.</span>
            <span className="bl-offers-volume-sub">
              Audiobooks, voiced by <em>writers.</em>
            </span>
          </h2>
          <div className="bl-offers-audio" aria-hidden="true">
            <svg
              className="bl-offers-wave"
              viewBox="0 0 320 56"
              preserveAspectRatio="none"
              role="presentation"
            >
              {Array.from({ length: 48 }).map((_, i) => {
                const t = i / 47;
                const base = Math.sin(t * Math.PI * 3.2) * 0.45 + 0.55;
                const jitter = Math.sin(i * 7.13) * 0.18;
                const h = Math.max(0.08, Math.min(1, base + jitter));
                const height = 4 + h * 44;
                return (
                  <rect
                    key={i}
                    x={i * 6.4 + 1}
                    y={(56 - height) / 2}
                    width="3"
                    height={height}
                    rx="1.5"
                  />
                );
              })}
            </svg>
            <span className="bl-offers-play">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor" />
              </svg>
            </span>
          </div>
          <p className="bl-offers-lede">
            Narrate your work. Or choose a human narrator. Early access now forming.
          </p>
          <a
            href="/?intake=writer"
            className="bl-offers-cta bl-offers-cta-ghost"
            onClick={handle(onWriter)}
          >
            Sign up for early access
            <span className="bl-offers-cta-arrow" aria-hidden="true">→</span>
          </a>
        </article>
      </div>
    </section>
  );
}

const CSS = `
.bl-offers {
  position: relative;
  background: var(--bl-footer-bg);
  color: var(--bl-footer-fg);
  padding: clamp(72px, 10vh, 112px) clamp(24px, 5vw, 80px);
  overflow: hidden;
  font-family: var(--bl-font-display);
}
.bl-offers::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.06;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.bl-offers-inner {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: clamp(28px, 4vw, 64px);
  align-items: stretch;
}
.bl-offers-panel {
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 1.8vw, 24px);
  min-width: 0;
}
.bl-offers-divider {
  background: color-mix(in srgb, var(--bl-footer-fg) 18%, transparent);
  width: 1px;
  align-self: stretch;
}
.bl-offers-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.46em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--bl-footer-fg) 72%, transparent);
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 16px;
}
.bl-offers-eyebrow-mark {
  display: inline-block;
  width: 36px;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
}
.bl-offers-title {
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(30px, 3.6vw, 46px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--bl-footer-fg);
  margin: 0;
  text-wrap: balance;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-offers-title em {
  font-style: italic;
  font-weight: 500;
  color: var(--bl-footer-fg);
}
.bl-offers-volume-mark {
  display: block;
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-weight: 500;
  font-size: clamp(48px, 6vw, 78px);
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: var(--bl-footer-fg);
}
.bl-offers-volume-sub {
  display: block;
  margin-top: 8px;
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(22px, 2.2vw, 30px);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--bl-footer-fg);
}
.bl-offers-volume-sub em { color: var(--bl-footer-fg); }

.bl-offers-lede {
  font-family: var(--bl-font-body);
  font-size: 15.5px;
  line-height: 1.6;
  color: color-mix(in srgb, var(--bl-footer-fg) 74%, transparent);
  margin: 0;
  max-width: 46ch;
  text-wrap: pretty;
}

.bl-offers-covers {
  display: flex;
  gap: 12px;
  margin: 4px 0 6px;
  padding: 6px 0 4px;
  align-items: flex-end;
}
.bl-offers-cover {
  flex: 0 0 auto;
  width: clamp(72px, 9vw, 104px);
  aspect-ratio: 2 / 3;
  border-radius: 3px;
  padding: 9px 9px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
  font-family: var(--bl-font-serif);
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.bl-offers-cover:hover { transform: translateY(-2px) rotate(0deg) !important; }
.bl-offers-cover-publisher {
  font-family: var(--bl-font-eyebrow);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.22em;
  opacity: 0.85;
  text-transform: uppercase;
}
.bl-offers-cover-title {
  font-size: clamp(13px, 1.3vw, 17px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.01em;
}
.bl-offers-cover-title em { font-style: italic; font-weight: 500; }
.bl-offers-cover-foot {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.bl-offers-cover-rule { height: 1px; background: currentColor; opacity: 0.55; }
.bl-offers-cover-author {
  font-family: var(--bl-font-eyebrow);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.bl-offers-audio {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 0;
  margin: 2px 0 2px;
}
.bl-offers-wave {
  flex: 1;
  height: 48px;
  fill: color-mix(in srgb, var(--bl-footer-fg) 40%, transparent);
  display: block;
}
.bl-offers-play {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: var(--bl-accent);
  color: var(--bl-surface);
  flex: 0 0 auto;
  box-shadow: 0 8px 22px color-mix(in srgb, var(--bl-accent) 32%, transparent);
}

.bl-offers-cta {
  margin-top: auto;
  align-self: flex-start;
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--bl-footer-fg);
  color: var(--bl-footer-bg);
  padding: 15px 28px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), box-shadow 220ms ease;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--bl-footer-fg) 28%, transparent);
}
.bl-offers-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--bl-footer-fg) 40%, transparent);
}
.bl-offers-cta-ghost {
  background: transparent;
  color: var(--bl-footer-fg);
  box-shadow: none;
  border: 1px solid color-mix(in srgb, var(--bl-footer-fg) 55%, transparent);
}
.bl-offers-cta-ghost:hover {
  background: color-mix(in srgb, var(--bl-footer-fg) 6%, transparent);
  border-color: color-mix(in srgb, var(--bl-footer-fg) 85%, transparent);
  box-shadow: none;
}
.bl-offers-cta-arrow {
  display: inline-block;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-offers-cta:hover .bl-offers-cta-arrow { transform: translateX(3px); }

@media (max-width: 820px) {
  .bl-offers-inner {
    grid-template-columns: 1fr;
    gap: clamp(40px, 6vw, 56px);
  }
  .bl-offers-divider {
    width: auto;
    height: 1px;
  }
}
`;
