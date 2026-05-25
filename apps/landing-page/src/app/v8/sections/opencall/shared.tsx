'use client';

import { useCallback, useState } from 'react';
import type { Manuscript } from './data';

export function SketchDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      <defs>
        <filter id="bl-sketch" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={7} />
          <feDisplacementMap in="SourceGraphic" scale={2.5} />
        </filter>
        <filter id="bl-sketch-rough" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={3} />
          <feDisplacementMap in="SourceGraphic" scale={3.2} />
        </filter>
      </defs>
    </svg>
  );
}

type FauxCoverProps = {
  ms: Manuscript;
  size?: 'sm' | 'md' | 'lg';
  rotate?: number;
  index?: number;
};

const SIZE_VARS = {
  sm: { w: 96, title: 11, author: 8, spine: 8 },
  md: { w: 140, title: 14, author: 9, spine: 9 },
  lg: { w: 200, title: 19, author: 11, spine: 10 },
} as const;

export function FauxCover({ ms, size = 'md', rotate = 0, index }: FauxCoverProps) {
  const dims = SIZE_VARS[size];
  const hue = ms.coverHue;
  const bg = `linear-gradient(155deg, hsl(${hue} 38% 32%) 0%, hsl(${(hue + 22) % 360} 30% 22%) 65%, hsl(${(hue + 340) % 360} 26% 18%) 100%)`;
  return (
    <div
      className="bl-cover"
      style={{
        width: dims.w,
        aspectRatio: '3 / 4',
        background: bg,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
      data-cover-id={ms.id}
    >
      <span className="bl-cover-spine" aria-hidden="true" />
      <span className="bl-cover-noise" aria-hidden="true" />
      {index !== undefined && (
        <span className="bl-cover-num" style={{ fontSize: 9 }}>
          Nº&nbsp;{String(index + 1).padStart(2, '0')}
        </span>
      )}
      <span
        className="bl-cover-title"
        style={{
          fontSize: dims.title,
          lineHeight: 1.05,
        }}
      >
        {ms.title}
      </span>
      <span
        className="bl-cover-author"
        style={{ fontSize: dims.author }}
      >
        {ms.author}
      </span>
      <style>{COVER_CSS}</style>
    </div>
  );
}

const COVER_CSS = `
.bl-cover {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px 12px 12px 18px;
  color: #f6f1e3;
  font-family: var(--bl-font-display);
  border-radius: 2px;
  box-shadow:
    0 18px 32px rgba(22, 20, 16, 0.22),
    0 4px 10px rgba(22, 20, 16, 0.12),
    inset 0 0 0 1px rgba(255,255,255,0.06);
  transition: transform 320ms cubic-bezier(.22, 1, .36, 1), box-shadow 320ms cubic-bezier(.22, 1, .36, 1);
  isolation: isolate;
  overflow: hidden;
}
.bl-cover-spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 6px;
  width: 1px;
  background: rgba(246, 241, 227, 0.45);
}
.bl-cover-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.18;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.bl-cover-num {
  position: absolute;
  top: 8px;
  right: 9px;
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(246, 241, 227, 0.85);
  font-variant-numeric: tabular-nums;
}
.bl-cover-title {
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  letter-spacing: -0.025em;
  text-wrap: balance;
  font-feature-settings: "kern", "liga", "calt";
  margin-bottom: 6px;
  color: #f6f1e3;
}
.bl-cover-author {
  font-family: var(--bl-font-eyebrow);
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(246, 241, 227, 0.78);
}
`;

export function useSequentialIndex(length: number) {
  const [i, setI] = useState(0);
  const next = useCallback(() => setI((x) => (x + 1) % length), [length]);
  const prev = useCallback(() => setI((x) => (x - 1 + length) % length), [length]);
  const set = useCallback((n: number) => setI(((n % length) + length) % length), [length]);
  return { i, next, prev, set };
}
