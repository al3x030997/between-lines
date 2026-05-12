'use client';

import { useEffect, useState } from 'react';

type Region = 'author' | 'reader' | 'both';

const LABELS: Record<Region, string> = {
  author: 'I’m an author',
  reader: 'I’m a reader',
  both: 'I’m both',
};

const SUBTITLES: Record<Region, string> = {
  author: 'Be discovered. Build an audience. Get published.',
  reader: 'Read fiction before it hits the shelf.',
  both: 'Discover and be discovered.',
};

const EYEBROWS: Record<Region, string> = {
  author: '01 / WRITE',
  reader: '02 / READ',
  both: '03 / BOTH',
};

export default function V6Page() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<Region | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#ffffff';
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  const regionProps = (region: Region) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `${LABELS[region]}. ${SUBTITLES[region]}`,
    onMouseEnter: () => setHovered(region),
    onMouseLeave: () => setHovered((r) => (r === region ? null : r)),
    onFocus: () => setHovered(region),
    onBlur: () => setHovered((r) => (r === region ? null : r)),
    onClick: () => {
      /* no-op for v6 prototype */
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
    },
  });

  return (
    <main className={`v6-root ${mounted ? 'is-mounted' : ''}`}>
      <div className="v6-bg" aria-hidden="true" />
      <div className="v6-bg-scrim" aria-hidden="true" />

      <nav className="v6-nav">
        <a className="v6-brand" href="#" aria-label="Between Lines, home">
          <span>between</span>
          <span className="v6-brand-dot">·</span>
          <span>lines</span>
        </a>
        <div className="v6-nav-meta">
          <span className="v6-nav-issue">Issue №01</span>
          <span className="v6-nav-sep" aria-hidden="true" />
          <a href="#" className="v6-nav-link">About</a>
          <a href="#" className="v6-nav-link">Sign in</a>
        </div>
      </nav>

      <div className="v6-stage">
        <svg
          className="v6-canvas"
          viewBox="0 0 1600 1000"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Between Lines</title>
          <desc>Choose your role: author, reader, or both.</desc>

          <defs>
            <filter id="v6-rough" x="-4%" y="-4%" width="108%" height="108%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.022"
                numOctaves={2}
                seed={9}
              />
              <feDisplacementMap in="SourceGraphic" scale={3.2} />
            </filter>
          </defs>

          <g
            className={`v6-region v6-region-author${hovered === 'author' ? ' is-hovered' : ''}`}
            {...regionProps('author')}
          >
            <path
              className="v6-region-fill"
              d="M -10 -10 L 700 -10 C 695 150 670 320 660 460 C 530 620 350 800 180 1010 L -10 1010 Z"
              pointerEvents="all"
            />
            <text className="v6-region-eyebrow" textAnchor="middle" x={332} y={208}>
              {EYEBROWS.author}
            </text>
            <text className="v6-region-label" textAnchor="middle" x={332} y={302}>
              {LABELS.author}
            </text>
            <text className="v6-region-sub" textAnchor="middle" x={332} y={358}>
              {SUBTITLES.author}
            </text>
          </g>

          <g
            className={`v6-region v6-region-reader${hovered === 'reader' ? ' is-hovered' : ''}`}
            {...regionProps('reader')}
          >
            <path
              className="v6-region-fill"
              d="M 700 -10 L 1610 -10 L 1610 1010 L 1440 1010 C 1160 810 870 620 660 460 C 670 320 695 150 700 -10 Z"
              pointerEvents="all"
            />
            <text className="v6-region-eyebrow" textAnchor="middle" x={1135} y={208}>
              {EYEBROWS.reader}
            </text>
            <text className="v6-region-label" textAnchor="middle" x={1135} y={302}>
              {LABELS.reader}
            </text>
            <text className="v6-region-sub" textAnchor="middle" x={1135} y={358}>
              {SUBTITLES.reader}
            </text>
          </g>

          <g
            className={`v6-region v6-region-both${hovered === 'both' ? ' is-hovered' : ''}`}
            {...regionProps('both')}
          >
            <path
              className="v6-region-fill"
              d="M 660 460 C 870 620 1160 810 1440 1010 L 180 1010 C 350 800 530 620 660 460 Z"
              pointerEvents="all"
            />
            <text className="v6-region-eyebrow" textAnchor="middle" x={748} y={668}>
              {EYEBROWS.both}
            </text>
            <text className="v6-region-label" textAnchor="middle" x={748} y={758}>
              {LABELS.both}
            </text>
            <text className="v6-region-sub" textAnchor="middle" x={748} y={812}>
              {SUBTITLES.both}
            </text>
          </g>

          <g className="v6-dividers" filter="url(#v6-rough)" pointerEvents="none">
            <path
              className="v6-divider v6-divider-up"
              d="M 700 -10 C 695 150 670 320 660 460"
              pathLength={1}
            />
            <path
              className="v6-divider v6-divider-left"
              d="M 660 460 C 530 620 350 800 180 1010"
              pathLength={1}
            />
            <path
              className="v6-divider v6-divider-right"
              d="M 660 460 C 870 620 1160 810 1440 1010"
              pathLength={1}
            />
          </g>
        </svg>
      </div>

      <style jsx global>{`
        .v6-root {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          overflow: hidden;
          opacity: 0;
          transition: opacity 700ms ease;
          font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
          font-optical-sizing: auto;
          color: #0e0e0c;
        }
        .v6-root.is-mounted {
          opacity: 1;
        }

        .v6-bg {
          position: absolute;
          inset: -120px;
          background: url('/v6-hero.jpg') center/cover no-repeat;
          filter: blur(48px) saturate(0.95) brightness(1.05);
          transform: scale(1.05);
          z-index: 0;
          opacity: 0;
          transition: opacity 1400ms ease;
        }
        .v6-root.is-mounted .v6-bg {
          opacity: 0.34;
        }

        .v6-bg-scrim {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(140% 90% at 50% 35%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.78) 60%, rgba(255, 255, 255, 0.92) 100%);
          z-index: 1;
          pointer-events: none;
        }

        .v6-nav {
          position: relative;
          z-index: 4;
          flex: 0 0 auto;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(20px, 3.5vw, 56px);
          border-bottom: 1px solid rgba(14, 14, 12, 0.08);
        }

        .v6-brand {
          display: inline-flex;
          align-items: baseline;
          gap: 0;
          color: #0e0e0c;
          text-decoration: none;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 700;
          font-size: 19px;
          letter-spacing: -0.02em;
          font-variation-settings: 'wdth' 95;
        }
        .v6-brand-dot {
          color: #e94b36;
          padding: 0 4px;
          font-weight: 800;
          transform: translateY(-1px);
        }

        .v6-nav-meta {
          display: flex;
          align-items: center;
          gap: 22px;
          font-family: 'Bricolage Grotesque', sans-serif;
        }
        .v6-nav-issue {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #e94b36;
        }
        .v6-nav-sep {
          width: 1px;
          height: 14px;
          background: rgba(14, 14, 12, 0.18);
        }
        .v6-nav-link {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #0e0e0c;
          text-decoration: none;
          transition: color 200ms ease;
        }
        .v6-nav-link:hover {
          color: #e94b36;
        }

        .v6-stage {
          position: relative;
          z-index: 2;
          flex: 1 1 auto;
          overflow: hidden;
        }

        .v6-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .v6-region {
          cursor: pointer;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }
        .v6-region-fill {
          fill: rgba(233, 75, 54, 0);
          transition: fill 500ms ease;
        }
        .v6-region.is-hovered .v6-region-fill,
        .v6-region:focus-visible .v6-region-fill {
          fill: rgba(233, 75, 54, 0.05);
        }

        .v6-region-eyebrow {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.28em;
          fill: #e94b36;
          opacity: 0;
          transition: opacity 700ms ease;
        }

        .v6-region-label {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800;
          font-size: 104px;
          letter-spacing: -0.035em;
          font-variation-settings: 'wdth' 92, 'opsz' 96;
          fill: #0e0e0c;
          opacity: 0;
          transition: opacity 900ms ease, fill 300ms ease;
        }

        .v6-region-sub {
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 22px;
          letter-spacing: 0;
          fill: #4d4d47;
          opacity: 0;
          transition: opacity 800ms ease, fill 300ms ease;
        }

        .v6-region.is-hovered .v6-region-label,
        .v6-region:focus-visible .v6-region-label {
          fill: #e94b36;
        }
        .v6-region.is-hovered .v6-region-sub,
        .v6-region:focus-visible .v6-region-sub {
          fill: #0e0e0c;
        }

        .v6-root.is-mounted .v6-region-author .v6-region-eyebrow {
          opacity: 1;
          transition-delay: 800ms;
        }
        .v6-root.is-mounted .v6-region-author .v6-region-label {
          opacity: 1;
          transition-delay: 950ms;
        }
        .v6-root.is-mounted .v6-region-author .v6-region-sub {
          opacity: 1;
          transition-delay: 1100ms;
        }

        .v6-root.is-mounted .v6-region-reader .v6-region-eyebrow {
          opacity: 1;
          transition-delay: 1000ms;
        }
        .v6-root.is-mounted .v6-region-reader .v6-region-label {
          opacity: 1;
          transition-delay: 1150ms;
        }
        .v6-root.is-mounted .v6-region-reader .v6-region-sub {
          opacity: 1;
          transition-delay: 1300ms;
        }

        .v6-root.is-mounted .v6-region-both .v6-region-eyebrow {
          opacity: 1;
          transition-delay: 1200ms;
        }
        .v6-root.is-mounted .v6-region-both .v6-region-label {
          opacity: 1;
          transition-delay: 1350ms;
        }
        .v6-root.is-mounted .v6-region-both .v6-region-sub {
          opacity: 1;
          transition-delay: 1500ms;
        }

        .v6-divider {
          stroke: #0e0e0c;
          stroke-width: 1.7;
          stroke-linecap: round;
          fill: none;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }
        .v6-root.is-mounted .v6-divider-up {
          animation: v6-draw 1.4s cubic-bezier(0.65, 0.05, 0.36, 1) 0.15s forwards;
        }
        .v6-root.is-mounted .v6-divider-left {
          animation: v6-draw 1.3s cubic-bezier(0.65, 0.05, 0.36, 1) 0.4s forwards;
        }
        .v6-root.is-mounted .v6-divider-right {
          animation: v6-draw 1.5s cubic-bezier(0.65, 0.05, 0.36, 1) 0.55s forwards;
        }

        @keyframes v6-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .v6-root,
          .v6-bg,
          .v6-region-eyebrow,
          .v6-region-label,
          .v6-region-sub,
          .v6-divider {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            stroke-dashoffset: 0 !important;
          }
          .v6-root .v6-bg {
            opacity: 0.34 !important;
          }
        }
      `}</style>
    </main>
  );
}
