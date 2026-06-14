'use client';

import { useEffect, useRef } from 'react';
import IntakeFlow, { type IntakeRegion } from '@/app/v12/intake/IntakeFlow';

/**
 * Pop-up wrapper around IntakeFlow. Opened from the home CTAs so the onboarding
 * questions surface in place over a blurred landing page instead of navigating
 * away to /start (which still works as a direct-link fallback).
 *
 * IntakeFlow's CSS references the `--v6-*` aliases that the home variant defines
 * on `.v12-root`; we redefine the same aliases on `.intake-dialog-root` so the
 * flow renders identically inside the modal (mirrors start/page.tsx's START_CSS).
 */

type Props = {
  mode: IntakeRegion;
  onClose: () => void;
};

const DIALOG_CSS = `
.intake-dialog-root {
  --v6-accent: var(--theme-accent);
  --v6-accent-soft: var(--theme-accent-soft);
  --v6-text: var(--theme-text);
  --v6-text-strong: var(--theme-text);
  --v6-text-muted: var(--theme-text-muted);
  --v6-surface: var(--theme-hero);
  --v6-divider: var(--theme-border);
  --v6-ease: cubic-bezier(.22, 1, .36, 1);
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(12px, 4vw, 32px);
  font-family: 'Outfit', system-ui, sans-serif;
}
.intake-dialog-backdrop {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--theme-overlay) 62%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: intake-dialog-fade 220ms var(--v6-ease);
}
.intake-dialog-panel {
  position: relative;
  z-index: 1;
  width: min(94vw, 640px);
  max-height: min(92vh, 880px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--theme-page);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  box-shadow: 0 30px 90px -20px rgb(var(--theme-shadow-rgb) / 0.45);
  animation: intake-dialog-rise 260ms var(--v6-ease);
}
.intake-dialog-inner {
  padding: clamp(18px, 2.6vw, 30px) clamp(20px, 3vw, 36px) clamp(20px, 2.6vw, 30px);
}

/* === Compact the intake flow so page 1 fits the pop-up without scrolling ===
   These overrides are scoped to the dialog; the full-page /start route keeps
   its roomier spacing. */
.intake-dialog-root .v8-intake {
  padding: 0;
  gap: 14px;
  max-width: none;
}
/* The ✕ already closes the pop-up — the BACK link is redundant here. */
.intake-dialog-root .v8-intake-back { display: none; }
.intake-dialog-root .v8-intake-form { gap: 14px; }
.intake-dialog-root .v8-intake-group { gap: 8px; }
.intake-dialog-root .v12-seg { margin-bottom: 2px; }
.intake-dialog-root .v8-intake .v8-intake-prompt {
  font-size: clamp(15px, 1.7vw, 18px);
  margin-bottom: 2px;
}
.intake-dialog-root .v8-intake-chips { gap: 8px; }
.intake-dialog-root .v8-chip { padding: 8px 14px; font-size: 14px; }
.intake-dialog-root .v8-toggle-chip { padding: 9px 16px 9px 14px; font-size: 14px; }
.intake-dialog-root .v8-favbooks { gap: 8px; }
.intake-dialog-root .v8-favbooks-input input { padding: 10px 16px; font-size: 14px; }
.intake-dialog-root .v8-favbooks-add { padding: 10px 18px; }
.intake-dialog-root .v12-email-capture { gap: 12px; margin-top: 12px; }
.intake-dialog-root .v12-email-title { font-size: clamp(26px, 3.4vw, 34px); }
.intake-dialog-root .v12-email-form { gap: 11px; }
.intake-dialog-root .v12-email-field { gap: 4px; }
.intake-dialog-root .v12-email-input { padding: 13px 16px; font-size: 17px; }
.intake-dialog-root .v12-email-consent { font-size: 12px; line-height: 1.4; }
.intake-dialog-root .v8-intake-actions { margin-top: 2px; }
.intake-dialog-root .v8-cta { padding: 12px 24px; }
/* The "one more page after this" footnote is implied by the step rail — drop it
   in the pop-up to save the row. */
.intake-dialog-root .v8-intake-caption { display: none; }
.intake-dialog-close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--theme-text-muted);
  font-size: 20px;
  line-height: 1;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background 160ms var(--v6-ease), color 160ms var(--v6-ease);
}
.intake-dialog-close:hover {
  background: var(--theme-surface-muted);
  color: var(--theme-text);
}
@keyframes intake-dialog-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes intake-dialog-rise {
  from { opacity: 0; transform: translateY(16px) scale(.985); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .intake-dialog-backdrop,
  .intake-dialog-panel { animation: none; }
}
`;

export default function IntakeDialog({ mode, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close, lock body scroll while open, and manage focus.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    // Move focus into the dialog so keyboard/screen-reader users land inside it.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="intake-dialog-root">
      <style dangerouslySetInnerHTML={{ __html: DIALOG_CSS }} />
      <div className="intake-dialog-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className="intake-dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Get started"
        tabIndex={-1}
      >
        <button
          type="button"
          className="intake-dialog-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="intake-dialog-inner">
          <IntakeFlow initialMode={mode} onBack={onClose} />
        </div>
      </div>
    </div>
  );
}
