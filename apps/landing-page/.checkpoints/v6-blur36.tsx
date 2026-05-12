'use client';

import { useEffect, useState } from 'react';

const V6_CSS = `
.v6-root {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
  font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
  font-optical-sizing: auto;
  color: #0e0e0c;
}
.v6-bg {
  position: absolute;
  inset: -160px;
  background: url('/v6-hero.jpg') center/cover no-repeat;
  filter: blur(36px) saturate(1.05);
  transform: scale(1.08);
  z-index: 0;
}
.v6-bg-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.48) 50%, rgba(255,255,255,0.66) 100%);
  z-index: 1;
  pointer-events: none;
}
.v6-bg-grain {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
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
  border-bottom: 1px solid rgba(14,14,12,0.18);
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.v6-brand {
  display: inline-flex;
  align-items: baseline;
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
  background: rgba(14,14,12,0.18);
}
.v6-nav-link {
  font-size: 13px;
  font-weight: 500;
  color: #0e0e0c;
  text-decoration: none;
  transition: color 200ms ease;
}
.v6-nav-link:hover { color: #e94b36; }
.v6-stage {
  position: relative;
  z-index: 3;
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
  fill: rgba(233, 75, 54, 0.06);
}
.v6-region-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.28em;
  fill: #e94b36;
}
.v6-region-label {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 104px;
  letter-spacing: -0.035em;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  fill: #0e0e0c;
  paint-order: stroke fill;
  stroke: rgba(255,255,255,0.6);
  stroke-width: 4;
  stroke-linejoin: round;
  transition: fill 300ms ease;
}
.v6-region-sub {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 22px;
  fill: #14140f;
  paint-order: stroke fill;
  stroke: rgba(255,255,255,0.65);
  stroke-width: 3;
  stroke-linejoin: round;
  transition: fill 300ms ease;
}
.v6-region.is-hovered .v6-region-label,
.v6-region:focus-visible .v6-region-label { fill: #e94b36; }
.v6-region.is-hovered .v6-region-sub,
.v6-region:focus-visible .v6-region-sub { fill: #0e0e0c; }
.v6-divider {
  stroke: #0e0e0c;
  stroke-width: 2.2;
  stroke-linecap: round;
  fill: none;
}
`;

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
  const [hovered, setHovered] = useState<Region | null>(null);

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
    <main className="v6-root">
      <style dangerouslySetInnerHTML={{ __html: V6_CSS }} />
      <div className="v6-bg" aria-hidden="true" />
      <div className="v6-bg-scrim" aria-hidden="true" />
      <div className="v6-bg-grain" aria-hidden="true" />

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
            />
            <path
              className="v6-divider v6-divider-left"
              d="M 660 460 C 530 620 350 800 180 1010"
            />
            <path
              className="v6-divider v6-divider-right"
              d="M 660 460 C 870 620 1160 810 1440 1010"
            />
          </g>
        </svg>
      </div>

    </main>
  );
}
