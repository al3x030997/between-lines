'use client';
import { useState } from 'react';
import type { Palette } from '@/lib/palettes';

export function Nav({ P }: { P: Palette }) {
  const [hover, setHover] = useState(false);
  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36, fontFamily: "'Outfit',sans-serif" }}>
      <span style={{ color: P.primary, fontSize: 18, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", letterSpacing: '-.01em' }}>
        draft2publish
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ color: P.mute, fontSize: 13, cursor: 'pointer' }}>About</span>
        <span
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ color: hover ? P.primary : P.mute, fontSize: 13, cursor: 'pointer', fontWeight: 500, transition: 'color .2s' }}
        >
          Sign in
        </span>
      </div>
    </nav>
  );
}
