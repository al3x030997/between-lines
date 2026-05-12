'use client';
import { useState } from 'react';
import type { Palette } from '@/lib/palettes';

type Props = {
  label: string;
  title: string;
  sub: string;
  cta: string;
  onClick: () => void;
  pill?: boolean;
  P: Palette;
};

export function ChoiceCard({ label, title, sub, cta, onClick, pill, P }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: P.cardBg,
        borderRadius: 14,
        padding: '24px 28px 26px',
        cursor: 'pointer',
        transition: 'transform .25s ease, box-shadow .25s ease',
        transform: hover ? 'translateY(-2px)' : 'none',
        boxShadow: hover ? '0 8px 24px rgba(0,0,0,.15)' : '0 2px 8px rgba(0,0,0,.06)',
      }}
    >
      <p style={{ color: P.cardLabel, fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 14 }}>
        {label}
      </p>
      <h3 style={{ color: P.cardText, fontSize: 24, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, lineHeight: 1.2, margin: 0 }}>
        {title}
      </h3>
      <p style={{ color: P.cardSub, fontSize: 14, fontFamily: "'Outfit',sans-serif", fontWeight: 300, lineHeight: 1.6, marginTop: 10, textWrap: 'pretty' as const }}>
        {sub}
      </p>
      <div style={{ marginTop: 18 }}>
        {pill ? (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: hover ? P.cardCta : `${P.cardCta}22`,
              color: hover ? P.cardBg : P.cardText,
              padding: '9px 20px', borderRadius: 100,
              fontSize: 14, fontWeight: 500, fontFamily: "'Outfit',sans-serif",
              transition: 'all .25s ease',
            }}
          >
            {cta} →
          </span>
        ) : (
          <span style={{ color: P.cardCta, fontSize: 14, fontWeight: 500, fontFamily: "'Outfit',sans-serif" }}>
            {cta}{' '}
            <span style={{ display: 'inline-block', transition: 'transform .2s', transform: hover ? 'translateX(4px)' : 'none' }}>→</span>
          </span>
        )}
      </div>
    </div>
  );
}
