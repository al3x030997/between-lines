'use client';
import { useState, type ReactNode } from 'react';
import type { Palette } from '@/lib/palettes';

export function Chip({ label, on, onClick, P }: { label: string; on: boolean; onClick: () => void; P: Palette }) {
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none',
        border: `1.5px solid ${on ? P.accent : P.mute + '33'}`,
        background: on ? `${P.accent}18` : P.bg,
        color: on ? P.accent : P.primary,
        padding: '9px 18px',
        borderRadius: 100,
        fontSize: 14,
        fontFamily: "'Outfit',sans-serif",
        fontWeight: on ? 500 : 400,
        cursor: 'pointer',
        transition: 'all .2s',
      }}
    >
      {label}
    </button>
  );
}

type ChipsProps =
  | { options: string[]; selected: string[]; onToggle: (v: string) => void; multi: true; P: Palette }
  | { options: string[]; selected: string; onToggle: (v: string) => void; multi?: false; P: Palette };

export function Chips(props: ChipsProps) {
  const { options, onToggle, P } = props;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => {
        const on = props.multi ? props.selected.includes(o) : props.selected === o;
        return <Chip key={o} label={o} on={on} onClick={() => onToggle(o)} P={P} />;
      })}
    </div>
  );
}

export function TxtIn({ value, onChange, placeholder, P }: { value: string; onChange: (v: string) => void; placeholder: string; P: Palette }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '12px 16px', borderRadius: 10,
        border: `1.5px solid ${P.mute}33`, background: P.bg, color: P.primary,
        fontSize: 15, fontFamily: "'Outfit',sans-serif",
      }}
      onFocus={e => (e.target.style.borderColor = P.accent)}
      onBlur={e => (e.target.style.borderColor = P.mute + '33')}
    />
  );
}

export function TxtArea({ value, onChange, placeholder, P, rows }: { value: string; onChange: (v: string) => void; placeholder: string; P: Palette; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows || 3}
      style={{
        width: '100%', padding: '12px 16px', borderRadius: 10,
        border: `1.5px solid ${P.mute}33`, background: P.bg, color: P.primary,
        fontSize: 15, fontFamily: "'Outfit',sans-serif", resize: 'vertical', lineHeight: 1.6,
      }}
      onFocus={e => (e.target.style.borderColor = P.accent)}
      onBlur={e => (e.target.style.borderColor = P.mute + '33')}
    />
  );
}

export function IQ({ label, sub, children, P }: { label: string; sub?: string; children: ReactNode; P: Palette }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ color: P.primary, fontSize: 16, fontWeight: 500, fontFamily: "'Outfit',sans-serif", marginBottom: sub ? 4 : 8 }}>{label}</p>
      {sub && <p style={{ color: P.mute, fontSize: 13, fontFamily: "'Outfit',sans-serif", marginBottom: 10, lineHeight: 1.5 }}>{sub}</p>}
      {children}
    </div>
  );
}

export function Prog({ step, total, P }: { step: number; total: number; P: Palette }) {
  return (
    <div style={{ display: 'flex', gap: 5, marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? P.accent : `${P.mute}33`,
            transition: 'background .3s',
          }}
        />
      ))}
    </div>
  );
}

export function ChHd({ ch, title, P }: { ch: number; title: string; P: Palette }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ color: P.accent, fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
        Chapter {ch}
      </p>
      <h2 style={{ color: P.primary, fontSize: 28, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.15, letterSpacing: '-.02em' }}>
        {title}
      </h2>
    </div>
  );
}

export function Acts({ onNext, onSkip, P, label, noSkip }: { onNext: () => void; onSkip?: () => void; P: Palette; label?: string; noSkip?: boolean }) {
  const [hover, setHover] = useState(false);
  const isPub = P.bg === '#1A1310';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 28 }}>
      <button
        onClick={onNext}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          appearance: 'none', border: 0,
          background: hover ? P.accent : P.cardBg,
          color: hover ? (isPub ? P.bg : '#fff') : P.cardText,
          padding: '12px 28px', borderRadius: 100,
          fontSize: 15, fontWeight: 500, fontFamily: "'Outfit',sans-serif",
          cursor: 'pointer', transition: 'all .25s',
        }}
      >
        {label || 'Continue'}
      </button>
      {!noSkip && onSkip && (
        <span onClick={onSkip} style={{ color: P.mute, fontSize: 14, fontFamily: "'Outfit',sans-serif", cursor: 'pointer' }}>
          Skip
        </span>
      )}
    </div>
  );
}

export function ICheck({ on, toggle, P }: { on: boolean; toggle: () => void; P: Palette }) {
  return (
    <button
      onClick={toggle}
      style={{
        appearance: 'none', width: 20, height: 20, borderRadius: 5, flexShrink: 0,
        border: `1.5px solid ${on ? P.accent : P.mute + '33'}`,
        background: on ? P.accent : P.bg,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 12, fontWeight: 700,
      }}
      aria-pressed={on}
    >
      {on ? '✓' : ''}
    </button>
  );
}
