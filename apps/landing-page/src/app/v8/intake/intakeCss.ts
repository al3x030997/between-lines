export const INTAKE_CSS = `
.v8-intake {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: clamp(28px, 4vw, 48px) clamp(20px, 4vw, 56px) clamp(64px, 8vw, 120px);
  display: flex;
  flex-direction: column;
  gap: 36px;
  font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
  color: var(--v6-text);
  position: relative;
  z-index: 3;
}

/* === Back link === */
.v8-intake-back {
  appearance: none;
  background: transparent;
  border: 0;
  font: inherit;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--v6-text-muted);
  cursor: pointer;
  padding: 0;
  margin-bottom: 6px;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 180ms var(--v6-ease), transform 180ms var(--v6-ease);
}
.v8-intake-back:hover,
.v8-intake-back:focus-visible {
  color: var(--v6-accent);
  transform: translateX(-2px);
}

/* === Top toggle (compressed doors) === */
.v8-intake-toggle {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  border-top: 1px solid var(--v6-divider);
  border-bottom: 1px solid var(--v6-divider);
  margin-bottom: 8px;
}
.v8-intake-toggle-btn {
  appearance: none;
  background: transparent;
  border: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
  cursor: pointer;
  padding: 20px 16px 22px;
  color: var(--v6-text-muted);
  opacity: 0.62;
  transition: opacity 200ms var(--v6-ease), color 200ms var(--v6-ease);
}
.v8-intake-toggle-btn:hover,
.v8-intake-toggle-btn:focus-visible {
  opacity: 1;
  color: var(--v6-text-strong);
}
.v8-intake-toggle-btn.is-active {
  opacity: 1;
  color: var(--v6-text-strong);
}
.v8-intake-toggle-bar {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50%;
  height: 2px;
  background: var(--v6-accent);
  transform-origin: left center;
  transition: transform 320ms var(--v6-ease);
  pointer-events: none;
}
.v8-intake-toggle.is-reader .v8-intake-toggle-bar {
  transform: translateX(100%);
}

/* === Form swap === */
.v8-intake-formslot {
  position: relative;
  display: grid;
  grid-template-areas: 'stack';
}
.v8-intake-form {
  grid-area: stack;
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: v8-intake-fade-in 320ms var(--v6-ease) both;
}
@keyframes v8-intake-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

/* === Question group === */
.v8-intake-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.v8-intake-label {
  display: none;
}
.v8-intake-prompt {
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  flex-wrap: wrap;
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-variation-settings: 'wdth' 96, 'opsz' 32;
  font-size: clamp(20px, 2.2vw, 26px);
  line-height: 1.18;
  letter-spacing: -0.005em;
  color: var(--v6-accent);
  margin: 0 0 4px;
  text-wrap: balance;
}
.v8-intake-prompt-num {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  font-size: 0.62em;
  letter-spacing: 0.04em;
  color: var(--v6-text-muted);
  opacity: 0.48;
  margin-right: 0.1em;
  transform: translateY(-0.18em);
  display: inline-block;
}
.v8-intake-prompt-text {
  display: inline-block;
}
.v8-intake-helper {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: var(--v6-text-muted);
  opacity: 0.7;
  margin-top: -4px;
}

/* === Sub-group (How do you read?) === */
.v8-intake-subgroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.v8-intake-sublabel {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--v6-text-muted);
  letter-spacing: 0.04em;
}

/* === Chip row === */
.v8-intake-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.v8-chip {
  appearance: none;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  padding: 11px 18px;
  border-radius: 999px;
  border: 1px solid var(--v6-divider);
  background: rgba(14, 14, 12, 0.05);
  color: var(--v6-text-strong);
  cursor: pointer;
  transition: background 180ms var(--v6-ease), border-color 180ms var(--v6-ease), color 180ms var(--v6-ease), transform 180ms var(--v6-ease), opacity 180ms var(--v6-ease);
  -webkit-tap-highlight-color: transparent;
  line-height: 1.2;
}
.v8-chip:hover,
.v8-chip:focus-visible {
  background: var(--v6-accent-soft);
  border-color: var(--v6-accent);
}
.v8-chip.is-selected {
  background: var(--v6-accent);
  color: #fff;
  border-color: var(--v6-accent);
}
.v8-root.is-palette-forest .v8-chip.is-selected { color: #F5EDE0; }
.v8-chip[aria-disabled='true'] {
  opacity: 0.4;
  cursor: not-allowed;
}
.v8-chip[aria-disabled='true']:hover {
  background: transparent;
  border-color: var(--v6-divider);
}
.v8-chip.is-more {
  font-style: italic;
  color: var(--v6-text-muted);
  border-style: dashed;
}
.v8-chip.is-more.is-open {
  color: var(--v6-accent);
  border-color: var(--v6-accent);
  border-style: solid;
  background: var(--v6-accent-soft);
}

/* Expand row for "More…" and "Select from list" */
.v8-intake-expand {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 280ms var(--v6-ease);
}
.v8-intake-expand.is-open {
  grid-template-rows: 1fr;
}
.v8-intake-expand-inner {
  overflow: hidden;
  min-height: 0;
}
.v8-intake-expand-inner > .v8-intake-chips {
  padding-top: 10px;
}

/* === Toggle chip (single-toggle, like a checkbox) === */
.v8-toggle-chip {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  padding: 12px 20px 12px 16px;
  border-radius: 999px;
  border: 1px solid var(--v6-divider);
  background: transparent;
  color: var(--v6-text-strong);
  cursor: pointer;
  appearance: none;
  transition: background 180ms var(--v6-ease), border-color 180ms var(--v6-ease);
  text-align: left;
  line-height: 1.3;
}
.v8-toggle-chip-box {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--v6-divider);
  transition: background 180ms var(--v6-ease), color 180ms var(--v6-ease);
}
.v8-toggle-chip-tick {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 160ms var(--v6-ease), transform 200ms var(--v6-ease);
}
.v8-toggle-chip.is-on .v8-toggle-chip-box {
  background: var(--v6-accent);
  border-color: var(--v6-accent);
  color: #fff;
}
.v8-root.is-palette-forest .v8-toggle-chip.is-on .v8-toggle-chip-box { color: #F5EDE0; }
.v8-toggle-chip.is-on .v8-toggle-chip-tick {
  opacity: 1;
  transform: scale(1);
}
.v8-toggle-chip:hover,
.v8-toggle-chip:focus-visible {
  border-color: var(--v6-accent);
}
.v8-toggle-chip-sub {
  display: block;
  font-size: 12px;
  font-weight: 400;
  color: var(--v6-text-muted);
  opacity: 0.7;
  margin-top: 2px;
}

/* === File upload === */
.v8-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.v8-upload-dropzone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border: 1.5px dashed var(--v6-divider);
  border-radius: 14px;
  background: transparent;
  cursor: pointer;
  transition: border-color 200ms var(--v6-ease), background 200ms var(--v6-ease);
}
.v8-upload-dropzone:hover,
.v8-upload-dropzone:focus-within {
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
.v8-upload-dropzone.has-file {
  border-style: solid;
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
.v8-upload-dropzone.has-error {
  border-color: var(--v6-accent);
  background: transparent;
}
.v8-upload-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: 'Outfit', sans-serif;
}
.v8-upload-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--v6-text-strong);
}
.v8-upload-sub {
  font-size: 12px;
  color: var(--v6-text-muted);
  opacity: 0.75;
}
.v8-upload-icon {
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-variation-settings: 'opsz' 144, 'SOFT' 50;
  font-size: 26px;
  color: var(--v6-accent);
  font-style: italic;
  font-weight: 500;
  line-height: 1;
}
.v8-upload-error {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: var(--v6-accent);
  padding-left: 4px;
}
.v8-upload-clear {
  appearance: none;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 12px;
  color: var(--v6-text-muted);
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  align-self: flex-start;
}
.v8-upload-clear:hover { color: var(--v6-accent); }

/* === Action row (CTAs) === */
.v8-intake-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}
.v8-cta {
  appearance: none;
  font: inherit;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.04em;
  padding: 16px 28px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 180ms var(--v6-ease), color 180ms var(--v6-ease), border-color 180ms var(--v6-ease), transform 180ms var(--v6-ease);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.v8-cta-primary {
  background: var(--v6-accent);
  color: #fff;
  border: 1px solid var(--v6-accent);
}
.v8-root.is-palette-forest .v8-cta-primary { color: #F5EDE0; }
.v8-cta-primary:hover,
.v8-cta-primary:focus-visible {
  transform: translateY(-1px);
}
.v8-cta-secondary {
  background: transparent;
  color: var(--v6-text-strong);
  border: 1px solid var(--v6-divider);
}
.v8-cta-secondary:hover,
.v8-cta-secondary:focus-visible {
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
.v8-cta-arrow {
  display: inline-block;
  transition: transform 200ms var(--v6-ease);
}
.v8-cta:hover .v8-cta-arrow { transform: translateX(3px); }

/* === Caption / footnote === */
.v8-intake-caption {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  line-height: 1.55;
  color: var(--v6-text-muted);
  opacity: 0.78;
  max-width: 56ch;
  text-wrap: pretty;
}
.v8-intake-caption strong {
  font-weight: 600;
  color: var(--v6-text-strong);
}

/* === FOMO hook block === */
.v8-intake-fomo {
  margin-top: 10px;
  padding: 14px 18px;
  border-left: 2px solid var(--v6-accent);
  background: var(--v6-accent-soft);
  font-family: 'Outfit', sans-serif;
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--v6-text-strong);
  border-radius: 0 8px 8px 0;
}
.v8-intake-fomo strong {
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  color: var(--v6-accent);
}

/* === Section divider === */
.v8-intake-rule {
  border: 0;
  border-top: 1px solid var(--v6-divider);
  margin: 4px 0;
}

@media (max-width: 640px) {
  .v8-intake { padding-left: 18px; padding-right: 18px; }
  .v8-intake-toggle-btn { padding: 16px 12px 18px; font-size: 17px; }
  .v8-intake-prompt { font-size: 22px; }
}
`;
