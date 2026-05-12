'use client';
import { useState } from 'react';
import type { Palette } from '@/lib/palettes';

export function BothLink({ onClick, P }: { onClick: () => void; P: Palette }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? P.primary : P.proofText,
        fontSize: 14,
        fontFamily: "'Outfit',sans-serif",
        cursor: 'pointer',
        transition: 'color .25s',
        fontStyle: 'italic',
      }}
    >
      I&apos;m both{' '}
      <span style={{ display: 'inline-block', transition: 'transform .2s', transform: hover ? 'translateX(3px)' : 'none', fontStyle: 'normal' }}>
        →
      </span>
    </span>
  );
}
