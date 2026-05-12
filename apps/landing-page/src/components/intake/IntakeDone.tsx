'use client';
import type { Palette } from '@/lib/palettes';

export function IntakeDone({ P, type, onClose }: { P: Palette; type: 'reader' | 'writer'; onClose: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
      <h2 style={{ color: P.primary, fontSize: 28, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600 }}>
        Welcome to BetweenLines
      </h2>
      <p style={{ color: P.mute, fontSize: 15, fontFamily: "'Outfit',sans-serif", marginTop: 10, lineHeight: 1.6 }}>
        {type === 'reader'
          ? 'Your reader profile is ready. Curating your first picks now.'
          : 'Your writer profile is ready. Packaging your submission now.'}
      </p>
      <div onClick={onClose} style={{ marginTop: 24, color: P.accent, fontSize: 14, fontFamily: "'Outfit',sans-serif", cursor: 'pointer' }}>
        ← Back to home
      </div>
    </div>
  );
}
