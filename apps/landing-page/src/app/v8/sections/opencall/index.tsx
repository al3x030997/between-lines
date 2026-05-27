'use client';

import { useEffect, useState, type ComponentType } from 'react';
import OpenCallV1 from './OpenCallV1';
import OpenCallV2 from './OpenCallV2';
import OpenCallV7 from './OpenCallV7';
import { SketchDefs } from './shared';

type Props = {
  onReader: () => void;
  onWriter: () => void;
};

type VariantKey = 'v1' | 'v2' | 'v7';

type VariantMeta = {
  key: VariantKey;
  label: string;
  subtitle: string;
  Component: ComponentType<Props>;
};

const VARIANTS: VariantMeta[] = [
  { key: 'v1', label: 'Issue cover', subtitle: 'Static editorial mock', Component: OpenCallV1 },
  { key: 'v2', label: 'First-line reel', subtitle: 'Single opening line, expandable', Component: OpenCallV2 },
  { key: 'v7', label: 'BetweenCharacters', subtitle: 'Quotes + mood + add yours', Component: OpenCallV7 },
];

const STORAGE_KEY = 'bl-opencall-variant';
const DEFAULT_KEY: VariantKey = 'v7';

function isVariantKey(v: string | null): v is VariantKey {
  return v !== null && /^v(1|2|7)$/.test(v);
}

export default function OpenCall({ onReader, onWriter }: Props) {
  const [variant, setVariant] = useState<VariantKey>(DEFAULT_KEY);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isVariantKey(stored)) setVariant(stored);
    } catch {
      // localStorage unavailable — keep default
    }
  }, []);

  const choose = (key: VariantKey) => {
    setVariant(key);
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, key);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (t && !t.closest('.bl-opencall-picker')) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const current = VARIANTS.find((v) => v.key === variant) ?? VARIANTS[0];
  const Body = current.Component;
  const numeral = String(VARIANTS.findIndex((v) => v.key === current.key) + 1).padStart(2, '0');

  return (
    <div className="bl-opencall-wrap">
      <style>{STYLES}</style>
      <SketchDefs />

      <div className={`bl-opencall-picker${open ? ' is-open' : ''}`}>
        <button
          type="button"
          className={`bl-opencall-picker-trigger${open ? ' is-open' : ''}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="bl-opencall-picker-tag">Variant</span>
          <span className="bl-opencall-picker-num">Nº&nbsp;{numeral}</span>
          <span className="bl-opencall-picker-name">{current.label}</span>
          <span className="bl-opencall-picker-chev" aria-hidden="true">▾</span>
        </button>
        <div className={`bl-opencall-picker-panel${open ? ' is-open' : ''}`} role="listbox">
          {VARIANTS.map((v, i) => {
            const active = v.key === current.key;
            return (
              <button
                type="button"
                key={v.key}
                role="option"
                aria-selected={active}
                className={`bl-opencall-picker-option${active ? ' is-active' : ''}`}
                onClick={() => choose(v.key)}
              >
                <span className="bl-opencall-picker-opt-num">Nº&nbsp;{String(i + 1).padStart(2, '0')}</span>
                <span className="bl-opencall-picker-opt-label">{v.label}</span>
                <span className="bl-opencall-picker-opt-sub">{v.subtitle}</span>
                <span className="bl-opencall-picker-opt-check" aria-hidden="true">
                  {active ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={mounted ? current.key : 'ssr'}
        className="bl-opencall-frame"
      >
        <Body onReader={onReader} onWriter={onWriter} />
      </div>
    </div>
  );
}

const STYLES = `
.bl-opencall-wrap {
  position: relative;
}
.bl-opencall-frame {
  animation: bl-oc-fade 240ms cubic-bezier(.22, 1, .36, 1);
}
@keyframes bl-oc-fade {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}

.bl-opencall-picker {
  position: absolute;
  top: clamp(16px, 2.4vw, 28px);
  right: clamp(16px, 2.4vw, 28px);
  z-index: 9;
  font-family: var(--bl-font-eyebrow);
}
.bl-opencall-picker-trigger {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid rgba(14,14,12,0.14);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--bl-ink);
  font: inherit;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms ease, border-color 200ms ease, color 200ms ease;
  box-shadow: 0 4px 14px rgba(14,14,12,0.06);
  font-variant-numeric: tabular-nums;
}
.bl-opencall-picker-trigger:hover,
.bl-opencall-picker-trigger:focus-visible {
  border-color: rgba(14,14,12,0.32);
  outline: none;
}
.bl-opencall-picker-trigger.is-open {
  background: var(--bl-ink);
  color: var(--bl-surface);
  border-color: var(--bl-ink);
}
.bl-opencall-picker-tag { opacity: 0.5; font-weight: 500; }
.bl-opencall-picker-trigger.is-open .bl-opencall-picker-tag { opacity: 0.7; }
.bl-opencall-picker-num {
  color: var(--bl-accent);
  font-weight: 700;
  letter-spacing: 0.12em;
}
.bl-opencall-picker-trigger.is-open .bl-opencall-picker-num { color: var(--bl-surface); }
.bl-opencall-picker-name {
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: none;
  font-family: var(--bl-font-display);
  font-size: 12px;
}
.bl-opencall-picker-chev {
  font-size: 9px;
  opacity: 0.6;
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.bl-opencall-picker-trigger.is-open .bl-opencall-picker-chev { transform: rotate(180deg); }

.bl-opencall-picker-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 280px;
  background: var(--bl-surface);
  border: 1px solid rgba(14,14,12,0.1);
  border-radius: 14px;
  box-shadow: 0 18px 48px rgba(14,14,12,0.14);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition: opacity 200ms ease, transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.bl-opencall-picker-panel.is-open {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.bl-opencall-picker-option {
  appearance: none;
  display: grid;
  grid-template-columns: 38px 1fr auto;
  grid-template-rows: auto auto;
  column-gap: 10px;
  align-items: center;
  border: 0;
  background: transparent;
  padding: 10px 12px 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition: background 160ms ease;
}
.bl-opencall-picker-option:hover { background: rgba(14,14,12,0.05); }
.bl-opencall-picker-option.is-active { background: rgba(14,14,12,0.08); }
.bl-opencall-picker-opt-num {
  grid-row: 1 / span 2;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--bl-accent);
  font-variant-numeric: tabular-nums;
  text-transform: uppercase;
}
.bl-opencall-picker-opt-label {
  grid-column: 2;
  grid-row: 1;
  font-family: var(--bl-font-display);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: var(--bl-ink);
}
.bl-opencall-picker-opt-sub {
  grid-column: 2;
  grid-row: 2;
  font-family: var(--bl-font-body);
  font-size: 11px;
  color: var(--bl-ink-muted);
  letter-spacing: 0.01em;
}
.bl-opencall-picker-opt-check {
  grid-column: 3;
  grid-row: 1 / span 2;
  font-size: 14px;
  color: var(--bl-accent);
  font-weight: 700;
}

@media (max-width: 600px) {
  .bl-opencall-picker-trigger {
    padding: 6px 10px;
    gap: 6px;
  }
  .bl-opencall-picker-name { display: none; }
  .bl-opencall-picker-panel { min-width: 240px; }
}
`;
