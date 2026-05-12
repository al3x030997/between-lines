'use client';
import { useState } from 'react';

type CtaStyle = 'text' | 'pill';

export type Tweaks = {
  ctaStyle: CtaStyle;
  palette: 'forest' | 'folio' | 'pub';
};

type Props = {
  tweaks: Tweaks;
  onChange: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
};

function TweakRadio<T extends string>({
  label, value, options, onChange,
}: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontWeight: 500, color: 'rgba(0,0,0,.6)' }}>{label}</div>
      <div style={{ display: 'flex', borderRadius: 8, background: 'rgba(0,0,0,.06)', padding: 2 }}>
        {options.map(o => (
          <button
            key={o}
            onClick={() => onChange(o)}
            style={{
              flex: 1, border: 0, padding: '5px 8px', borderRadius: 6, cursor: 'default',
              font: 'inherit', fontWeight: 500,
              background: o === value ? '#fff' : 'transparent',
              boxShadow: o === value ? '0 1px 2px rgba(0,0,0,.1)' : 'none',
              color: 'inherit',
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TweaksPanel({ tweaks, onChange }: Props) {
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', right: 16, bottom: 16, zIndex: 2147483646,
          width: 36, height: 36, borderRadius: 18,
          background: 'rgba(255,255,255,.92)', border: '1px solid rgba(0,0,0,.08)',
          boxShadow: '0 6px 20px rgba(0,0,0,.1)',
          font: '14px/1 system-ui,sans-serif', cursor: 'pointer',
        }}
        aria-label="Open tweaks"
      >
        ⚙
      </button>
    );
  }
  return (
    <div
      style={{
        position: 'fixed', right: 16, bottom: 16, zIndex: 2147483646, width: 260,
        background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,0,0,.08)', borderRadius: 14,
        boxShadow: '0 12px 40px rgba(0,0,0,.1)',
        font: '11.5px/1.4 system-ui,sans-serif',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 10px 8px 14px' }}>
        <b style={{ fontSize: 12 }}>Tweaks</b>
        <button
          onClick={() => setOpen(false)}
          style={{ appearance: 'none', border: 0, background: 'transparent', color: 'rgba(0,0,0,.4)', width: 22, height: 22, fontSize: 13, cursor: 'pointer' }}
          aria-label="Close tweaks"
        >
          ✕
        </button>
      </div>
      <div style={{ padding: '2px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <TweakRadio
          label="CTA style"
          value={tweaks.ctaStyle}
          options={['text', 'pill'] as const}
          onChange={v => onChange('ctaStyle', v)}
        />
        <TweakRadio
          label="Palette"
          value={tweaks.palette}
          options={['forest', 'folio', 'pub'] as const}
          onChange={v => onChange('palette', v)}
        />
      </div>
    </div>
  );
}
