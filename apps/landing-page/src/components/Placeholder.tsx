'use client';
import type { Palette } from '@/lib/palettes';

type Props = { title: string; sub: string; onBack: () => void; P: Palette };

export function Placeholder({ title, sub, onBack, P }: Props) {
  return (
    <div style={{ height: '100vh', background: P.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '48px 40px', maxWidth: 440, width: '100%', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
        <h2 style={{ color: P.primary, fontSize: 30, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600 }}>{title}</h2>
        <p style={{ color: P.mute, fontSize: 15, fontFamily: "'Outfit',sans-serif", marginTop: 12, lineHeight: 1.6 }}>{sub}</p>
        <div onClick={onBack} style={{ marginTop: 24, color: P.accent, fontSize: 14, fontFamily: "'Outfit',sans-serif", cursor: 'pointer' }}>
          ← Back
        </div>
      </div>
    </div>
  );
}
