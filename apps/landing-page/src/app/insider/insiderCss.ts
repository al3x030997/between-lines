export const INSIDER_CSS = `
.bl-page {
  /* Surface stays dark navy — countless inner overlays depend on it. */
  --bl-bg: var(--bl-section-bg);
  --bl-bg-soft: var(--bl-section-bg-soft);
  --bl-fg: var(--bl-section-fg);
  --bl-fg-muted: var(--bl-section-fg-muted);
  --bl-fg-faint: var(--bl-section-fg-faint);
  --bl-accent-soft: rgba(233, 75, 54, 0.14);
  --bl-divider: var(--bl-section-divider);
  --bl-divider-strong: var(--bl-section-divider-strong);
  /* Font system aligned with landing: Fraunces serif display (was Cormorant), Bricolage sans, Outfit body */
  --bl-display: var(--bl-font-serif);
  --bl-serif: var(--bl-font-serif);
  --bl-sans: var(--bl-font-eyebrow);
  --bl-body: var(--bl-font-body);
  --bl-mono: var(--bl-font-mono);
  --bl-script: var(--bl-font-script);
}

/* Grain overlay — fixed, multiply blend, ~7% */
.bl-page::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.07;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.65 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 240px 240px;
}

.bl-page {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 40px) clamp(80px, 10vw, 140px);
  display: flex;
  flex-direction: column;
  gap: clamp(56px, 8vw, 104px);
  color: var(--bl-fg);
  font-family: var(--bl-body);
  position: relative;
}
.bl-page > * { position: relative; z-index: 2; }

/* === Masthead === */
.bl-masthead {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: clamp(14px, 2vw, 24px);
  padding: clamp(20px, 3vw, 32px) 0 clamp(18px, 2.5vw, 28px);
  margin-bottom: clamp(8px, 1.5vw, 18px);
  border-bottom: 1px solid var(--bl-divider);
}
.bl-masthead::before,
.bl-masthead::after {
  content: '';
  height: 1px;
  background: var(--bl-divider-strong);
}
.bl-masthead-inner {
  display: inline-flex;
  align-items: baseline;
  gap: clamp(10px, 1.8vw, 18px);
  flex-wrap: wrap;
  justify-content: center;
  font-family: var(--bl-display);
  font-weight: 500;
  font-size: clamp(11px, 1vw, 13px);
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bl-fg);
}
.bl-masthead-brand { color: var(--bl-fg); }
.bl-masthead-sep {
  color: var(--bl-accent);
  font-family: var(--bl-display);
  font-style: italic;
  letter-spacing: 0;
}
.bl-masthead-issue {
  font-variant-numeric: tabular-nums;
  color: var(--bl-fg-muted);
}
.bl-masthead-tag {
  font-family: var(--bl-serif);
  font-style: italic;
  text-transform: lowercase;
  letter-spacing: 0;
  font-size: clamp(13px, 1.1vw, 15px);
  color: var(--bl-accent);
}

/* === Hero === */
.bl-hero {
  display: flex;
  flex-direction: column;
  gap: 22px;
  position: relative;
  padding-top: clamp(12px, 3vw, 28px);
}
.bl-hero-kicker {
  font-family: var(--bl-sans);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--bl-fg-faint);
  margin: 0;
}
.bl-hero-kicker-mark {
  color: var(--bl-accent);
  margin-right: 8px;
}
.bl-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--bl-sans);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0;
}
.bl-eyebrow-dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--bl-accent);
  display: inline-block;
}
.bl-h1 {
  font-family: var(--bl-serif);
  font-weight: 400;
  font-style: italic;
  font-size: clamp(40px, 6.6vw, 84px);
  letter-spacing: -0.025em;
  line-height: 1.0;
  margin: 0;
  text-wrap: balance;
  max-width: 16ch;
  color: var(--bl-fg);
  font-feature-settings: "kern", "liga", "calt", "dlig";
  text-rendering: optimizeLegibility;
}
.bl-h1-accent {
  color: var(--bl-accent);
  font-style: italic;
  font-family: var(--bl-serif);
  font-weight: 500;
}
.bl-h1-roman {
  font-family: var(--bl-display);
  font-style: normal;
  font-weight: 500;
  color: var(--bl-fg);
}
.bl-pitch {
  font-family: var(--bl-body);
  font-size: clamp(16px, 1.4vw, 19px);
  line-height: 1.55;
  color: var(--bl-fg-muted);
  margin: 0;
  max-width: 56ch;
  text-wrap: pretty;
}
.bl-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

/* === Chapter eyebrow (section heading) === */
.bl-section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.bl-section-titles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bl-chapter-eyebrow {
  font-family: var(--bl-sans);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
  font-variant-numeric: tabular-nums;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
  margin: 0;
}
.bl-chapter-eyebrow::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 56px;
  background: var(--bl-accent);
}
.bl-chapter-eyebrow .bl-chapter-num {
  font-family: var(--bl-display);
  font-style: italic;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.04em;
  color: var(--bl-accent);
  text-transform: none;
  margin-right: 10px;
}
.bl-h2 {
  font-family: var(--bl-display);
  font-weight: 500;
  font-size: clamp(26px, 3.2vw, 40px);
  letter-spacing: -0.02em;
  line-height: 1.08;
  margin: 0;
  text-wrap: balance;
  color: var(--bl-fg);
  font-feature-settings: "kern", "liga", "calt", "dlig";
  text-rendering: optimizeLegibility;
}
.bl-h2-italic {
  font-style: italic;
  font-family: var(--bl-serif);
  font-weight: 400;
  color: var(--bl-fg);
}
.bl-section-note {
  font-family: var(--bl-body);
  font-size: 14px;
  color: var(--bl-fg-faint);
  margin: 0;
  max-width: 36ch;
  text-align: right;
}

/* === Asterism intermission === */
.bl-intermission {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(20px, 4vw, 40px);
  margin: 0 auto;
  width: 100%;
  max-width: 480px;
  color: var(--bl-fg-faint);
}
.bl-intermission::before,
.bl-intermission::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--bl-divider-strong), transparent);
}
.bl-intermission-mark {
  font-family: var(--bl-serif);
  font-style: italic;
  font-size: 22px;
  letter-spacing: 0.1em;
  color: var(--bl-accent);
  line-height: 1;
}

/* === Pills / chips === */
.bl-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--bl-divider-strong);
  font-family: var(--bl-sans);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--bl-fg);
  background: transparent;
  text-transform: lowercase;
  line-height: 1;
}
.bl-chip.is-accent {
  background: var(--bl-accent-soft);
  border-color: rgba(233, 75, 54, 0.42);
  color: var(--bl-fg);
}
.bl-chip.is-mono {
  font-family: var(--bl-mono);
  text-transform: uppercase;
  font-size: 10.5px;
  letter-spacing: 0.16em;
  padding: 5px 10px;
}
.bl-chip.is-locked {
  position: relative;
  color: var(--bl-fg-faint);
  border-color: var(--bl-divider);
  background: rgba(255, 255, 255, 0.025);
  filter: blur(0.5px);
}
.bl-chip.is-locked::after {
  content: '·';
  margin-left: 8px;
  color: var(--bl-accent);
  filter: none;
}
.bl-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* === Buttons === */
.bl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 999px;
  font-family: var(--bl-sans);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.02em;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 180ms var(--bl-ease), background 180ms var(--bl-ease), border-color 180ms var(--bl-ease);
}
.bl-btn.is-primary {
  background: var(--bl-accent);
  color: #fff;
}
.bl-btn.is-primary:hover {
  transform: translateY(-1px);
  background: #f15942;
}
.bl-btn.is-ghost {
  background: transparent;
  color: var(--bl-fg);
  border-color: var(--bl-divider-strong);
}
.bl-btn.is-ghost:hover {
  border-color: var(--bl-fg);
  background: rgba(242, 239, 232, 0.04);
}
.bl-btn.is-small {
  padding: 8px 14px;
  font-size: 12.5px;
}

/* === Card primitive === */
.bl-card {
  position: relative;
  border: 1px solid var(--bl-divider);
  border-radius: 18px;
  padding: 26px;
  background:
    radial-gradient(120% 70% at 0% 0%, rgba(255,255,255,0.05), transparent 55%),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
  transition: border-color 220ms var(--bl-ease), transform 220ms var(--bl-ease), background 220ms var(--bl-ease), box-shadow 220ms var(--bl-ease);
}
.bl-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 18px;
  border-top: 2px solid var(--bl-accent);
  opacity: 0;
  transition: opacity 220ms var(--bl-ease);
  pointer-events: none;
}
.bl-card:hover {
  border-color: rgba(242, 239, 232, 0.28);
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
}
.bl-card:hover::before { opacity: 0.6; }

/* === Countdown strip === */
.bl-countdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(16px, 3vw, 32px);
  padding: 18px clamp(20px, 3vw, 28px);
  border: 1px solid var(--bl-divider-strong);
  border-left: 3px solid var(--bl-accent);
  border-radius: 14px;
  background:
    radial-gradient(80% 100% at 0% 50%, rgba(233, 75, 54, 0.08), transparent 70%),
    rgba(255, 255, 255, 0.02);
  flex-wrap: wrap;
}
.bl-countdown-label {
  font-family: var(--bl-sans);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-fg-faint);
  margin: 0 0 6px;
}
.bl-countdown-line {
  font-family: var(--bl-serif);
  font-style: italic;
  font-size: clamp(17px, 1.6vw, 21px);
  line-height: 1.3;
  color: var(--bl-fg);
  margin: 0;
  text-wrap: balance;
}
.bl-countdown-value {
  font-family: var(--bl-mono);
  font-style: normal;
  font-weight: 500;
  color: var(--bl-accent);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}
.bl-countdown-when {
  font-family: var(--bl-body);
  font-size: 13px;
  color: var(--bl-fg-faint);
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

/* === Proof-of-life ribbon === */
.bl-proof {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--bl-divider);
  background: rgba(255, 255, 255, 0.025);
  font-family: var(--bl-body);
  font-size: 13.5px;
  color: var(--bl-fg-muted);
  margin-bottom: 22px;
  letter-spacing: 0.01em;
  width: fit-content;
}
.bl-proof-pulse {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--bl-accent);
  box-shadow: 0 0 0 0 rgba(233, 75, 54, 0.65);
  animation: bl-pulse 2.2s var(--bl-ease) infinite;
  flex-shrink: 0;
}
.bl-proof-num {
  font-family: var(--bl-display);
  font-style: italic;
  font-weight: 600;
  color: var(--bl-fg);
  font-variant-numeric: tabular-nums;
  margin-right: 2px;
}
@keyframes bl-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(233, 75, 54, 0.55); }
  70%  { box-shadow: 0 0 0 9px rgba(233, 75, 54, 0); }
  100% { box-shadow: 0 0 0 0 rgba(233, 75, 54, 0); }
}

/* === Referral card === */
.bl-referral {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
  padding: clamp(26px, 3.5vw, 36px);
  border-radius: 22px;
  border: 1px solid rgba(233, 75, 54, 0.42);
  background:
    radial-gradient(80% 80% at 100% 0%, rgba(233, 75, 54, 0.16), transparent 60%),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
  position: relative;
  overflow: hidden;
}
@media (min-width: 720px) {
  .bl-referral { grid-template-columns: 1.3fr 1fr; align-items: center; }
}
.bl-referral-eyebrow {
  font-family: var(--bl-sans);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0 0 14px;
}
.bl-referral-title {
  font-family: var(--bl-serif);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(24px, 2.6vw, 32px);
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 0 0 12px;
  color: var(--bl-fg);
  text-wrap: balance;
}
.bl-referral-body {
  font-family: var(--bl-body);
  font-size: 15px;
  line-height: 1.55;
  color: var(--bl-fg-muted);
  margin: 0 0 20px;
  max-width: 44ch;
  text-wrap: pretty;
}
.bl-referral-action {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bl-referral-field {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px 10px 16px;
  border: 1px solid var(--bl-divider-strong);
  border-radius: 999px;
  background: rgba(11, 23, 51, 0.4);
}
.bl-referral-link {
  flex: 1;
  font-family: var(--bl-mono);
  font-size: 13px;
  color: var(--bl-fg-muted);
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bl-referral-copy {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--bl-accent);
  color: #fff;
  font-family: var(--bl-sans);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: background 180ms var(--bl-ease), transform 180ms var(--bl-ease);
}
.bl-referral-copy:hover { background: #f15942; transform: translateY(-1px); }
.bl-referral-copy.is-copied { background: rgba(242, 239, 232, 0.16); color: var(--bl-fg); }
.bl-referral-foot {
  font-family: var(--bl-body);
  font-size: 12.5px;
  color: var(--bl-fg-faint);
  margin: 0;
  padding-left: 16px;
  letter-spacing: 0.02em;
}

/* === Confirmation strip === */
.bl-confirm {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px 24px;
  border: 1px dashed var(--bl-divider-strong);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
}
.bl-confirm-label {
  font-family: var(--bl-sans);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-fg-faint);
  margin: 0;
}
.bl-confirm-edit {
  align-self: flex-start;
  font-family: var(--bl-body);
  font-size: 13px;
  color: var(--bl-fg-muted);
  text-decoration: none;
  border-bottom: 1px solid var(--bl-divider-strong);
  padding-bottom: 1px;
}
.bl-confirm-edit:hover { color: var(--bl-fg); border-color: var(--bl-fg); }

/* === Shelf grid (reader stories) === */
.bl-shelf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
.bl-shelf-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.bl-shelf-cover {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  margin-bottom: 18px;
  overflow: hidden;
  border: 1px solid var(--bl-divider);
}
.bl-shelf-cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(120% 80% at 20% 10%, rgba(255,255,255,0.18), transparent 60%);
  pointer-events: none;
}
.bl-shelf-spine {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 8px;
  background: var(--bl-accent);
}
.bl-shelf-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.bl-shelf-title {
  font-family: var(--bl-serif);
  font-weight: 500;
  font-style: italic;
  font-size: 23px;
  line-height: 1.12;
  letter-spacing: -0.01em;
  margin: 0 0 4px;
  text-wrap: balance;
  color: var(--bl-fg);
}
.bl-shelf-byline {
  font-family: var(--bl-display);
  font-style: italic;
  font-size: 14px;
  color: var(--bl-fg-faint);
  margin: 0 0 12px;
  letter-spacing: 0.02em;
}
.bl-shelf-blurb {
  font-family: var(--bl-body);
  font-size: 14px;
  line-height: 1.55;
  color: var(--bl-fg-muted);
  margin: 0 0 18px;
}
.bl-shelf-actions {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}
.bl-shelf-save {
  font-family: var(--bl-body);
  font-size: 13px;
  color: var(--bl-fg-faint);
  text-decoration: none;
  border-bottom: 1px solid var(--bl-divider);
  padding-bottom: 1px;
}
.bl-shelf-save:hover { color: var(--bl-fg); border-color: var(--bl-fg); }

/* === Schedule rows === */
.bl-schedule {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--bl-divider);
}
.bl-schedule-row {
  display: grid;
  grid-template-columns: 92px 110px 1fr auto;
  align-items: center;
  gap: clamp(12px, 2vw, 24px);
  padding: 20px 4px;
  border-bottom: 1px solid var(--bl-divider);
  font-family: var(--bl-body);
  transition: background 180ms var(--bl-ease);
}
.bl-schedule-row:hover { background: rgba(255, 255, 255, 0.015); }
.bl-schedule-row.is-next {
  background:
    linear-gradient(90deg, var(--bl-accent-soft) 0%, transparent 60%);
}
@media (max-width: 640px) {
  .bl-schedule-row {
    grid-template-columns: 1fr auto;
    gap: 10px;
  }
  .bl-schedule-date { grid-column: 1 / -1; }
  .bl-schedule-chip { grid-column: 1; }
  .bl-schedule-title { grid-column: 1 / -1; font-size: 16px; }
}
.bl-schedule-date {
  font-family: var(--bl-mono);
  font-size: 11.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-fg-faint);
}
.bl-schedule-title {
  font-family: var(--bl-display);
  font-weight: 500;
  font-size: 19px;
  letter-spacing: -0.01em;
  line-height: 1.18;
  color: var(--bl-fg);
  text-wrap: balance;
}
.bl-schedule-byline {
  font-family: var(--bl-body);
  font-style: italic;
  font-size: 13px;
  color: var(--bl-fg-faint);
  letter-spacing: 0.02em;
  text-align: right;
}

/* === Stat tiles === */
.bl-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.bl-stat-tile {
  padding: 24px 22px 20px;
  border: 1px solid var(--bl-divider);
  border-radius: 16px;
  background:
    radial-gradient(120% 70% at 0% 0%, rgba(255,255,255,0.05), transparent 55%),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
}
.bl-stat-num {
  font-family: var(--bl-display);
  font-weight: 600;
  font-size: clamp(40px, 5vw, 60px);
  letter-spacing: -0.035em;
  line-height: 1;
  margin: 0 0 8px;
  color: var(--bl-fg);
  font-variant-numeric: tabular-nums;
}
.bl-stat-num-accent {
  color: var(--bl-accent);
  font-style: italic;
}
.bl-stat-label {
  font-family: var(--bl-body);
  font-size: 13.5px;
  color: var(--bl-fg-muted);
  margin: 0;
  line-height: 1.45;
  text-wrap: balance;
}

/* === Stepper === */
.bl-stepper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  position: relative;
  margin-top: 6px;
}
.bl-stepper::before {
  content: '';
  position: absolute;
  top: 11px;
  left: 12.5%;
  right: 12.5%;
  height: 1px;
  background: var(--bl-divider-strong);
}
.bl-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  position: relative;
  padding: 0 6px;
}
.bl-step-dot {
  position: relative;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1px solid var(--bl-divider-strong);
  background: var(--bl-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--bl-display);
  font-style: italic;
  font-size: 12px;
  font-weight: 600;
  color: var(--bl-fg-faint);
}
.bl-step.is-done .bl-step-dot {
  background: var(--bl-accent);
  border-color: var(--bl-accent);
  color: #fff;
  font-style: normal;
}
.bl-step.is-current .bl-step-dot {
  border-color: var(--bl-accent);
  color: var(--bl-accent);
  box-shadow: 0 0 0 4px var(--bl-accent-soft);
}
.bl-step-label {
  font-family: var(--bl-sans);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--bl-fg-muted);
}
.bl-step.is-current .bl-step-label { color: var(--bl-fg); }
.bl-step-sub {
  font-family: var(--bl-body);
  font-size: 12px;
  color: var(--bl-fg-faint);
}

/* === Submission card === */
.bl-submission {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
  padding: 28px;
  border: 1px solid var(--bl-divider-strong);
  border-radius: 20px;
  background:
    radial-gradient(120% 70% at 0% 0%, rgba(233, 75, 54, 0.10), transparent 55%),
    linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
}
.bl-submission-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 14px;
  justify-content: space-between;
}
.bl-submission-file {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--bl-sans);
}
.bl-submission-fname {
  font-family: var(--bl-display);
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--bl-fg);
  word-break: break-all;
}
.bl-submission-fmeta {
  font-family: var(--bl-mono);
  font-size: 11.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bl-fg-faint);
}

/* === Editorial cards === */
.bl-editorial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}
.bl-editorial-grid.has-lede {
  grid-template-columns: 1fr;
}
@media (min-width: 820px) {
  .bl-editorial-grid.has-lede {
    grid-template-columns: 1.4fr 1fr 1fr;
  }
  .bl-editorial-grid.has-lede .bl-card.is-lede {
    grid-row: span 1;
  }
}
.bl-card.is-lede {
  padding: 32px;
  background:
    radial-gradient(80% 70% at 0% 0%, rgba(233, 75, 54, 0.10), transparent 55%),
    linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
}
.bl-card.is-lede .bl-editorial-title { font-size: 26px; }
.bl-editorial-kicker {
  font-family: var(--bl-sans);
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0 0 14px;
  font-variant-numeric: tabular-nums;
}
.bl-editorial-title {
  font-family: var(--bl-display);
  font-weight: 500;
  font-size: 22px;
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 0 0 10px;
  color: var(--bl-fg);
  text-wrap: balance;
}
.bl-editorial-body {
  font-family: var(--bl-body);
  font-size: 14px;
  line-height: 1.55;
  color: var(--bl-fg-muted);
  margin: 0 0 16px;
  text-wrap: pretty;
}
.bl-editorial-link {
  font-family: var(--bl-sans);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--bl-fg);
  text-decoration: none;
  border-bottom: 1px solid var(--bl-accent);
  padding-bottom: 2px;
}
.bl-editorial-link:hover { color: var(--bl-accent); }

/* === Reader club === */
.bl-club {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 32px;
  border-radius: 22px;
  border: 1px solid rgba(233, 75, 54, 0.36);
  background:
    radial-gradient(80% 70% at 100% 0%, rgba(233, 75, 54, 0.16), transparent 65%),
    linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  position: relative;
  overflow: hidden;
}
@media (min-width: 720px) {
  .bl-club { grid-template-columns: 1.2fr 1fr; align-items: center; }
}
.bl-club-when {
  font-family: var(--bl-mono);
  font-size: 11.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0 0 12px;
}
.bl-club-title {
  font-family: var(--bl-display);
  font-weight: 500;
  font-size: clamp(24px, 2.8vw, 34px);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 14px;
  text-wrap: balance;
  color: var(--bl-fg);
}
.bl-club-title em { font-family: var(--bl-serif); font-style: italic; font-weight: 400; }
.bl-club-body {
  font-family: var(--bl-body);
  font-size: 15px;
  line-height: 1.55;
  color: var(--bl-fg-muted);
  margin: 0 0 20px;
}
.bl-club-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: 14px;
  background: rgba(11, 23, 51, 0.55);
  border: 1px solid var(--bl-divider);
}
.bl-club-side-label {
  font-family: var(--bl-sans);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-fg-faint);
}
.bl-club-side-quote {
  font-family: var(--bl-serif);
  font-style: italic;
  font-weight: 400;
  font-size: 17px;
  line-height: 1.4;
  color: var(--bl-fg);
  margin: 0;
  text-wrap: balance;
}
.bl-club-side-attrib {
  font-family: var(--bl-display);
  font-style: italic;
  font-size: 13px;
  color: var(--bl-fg-faint);
  margin: 0;
}

/* === Next-issue tease === */
.bl-tease {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: clamp(28px, 4vw, 44px);
  border: 1px solid var(--bl-divider-strong);
  border-radius: 22px;
  background:
    radial-gradient(60% 100% at 100% 50%, rgba(233, 75, 54, 0.10), transparent 70%),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
  position: relative;
  overflow: hidden;
}
@media (min-width: 760px) {
  .bl-tease { grid-template-columns: 1fr 1fr; align-items: center; gap: 40px; }
}
.bl-tease-stamp {
  font-family: var(--bl-sans);
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0 0 12px;
  font-variant-numeric: tabular-nums;
}
.bl-tease-title {
  font-family: var(--bl-serif);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(26px, 3.2vw, 40px);
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0 0 14px;
  color: var(--bl-fg);
  text-wrap: balance;
}
.bl-tease-blurb {
  font-family: var(--bl-body);
  font-size: 15px;
  line-height: 1.55;
  color: var(--bl-fg-muted);
  margin: 0;
  max-width: 38ch;
}
.bl-tease-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bl-tease-item {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--bl-divider);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 220ms var(--bl-ease);
}
.bl-tease-item.is-open { border-color: rgba(233, 75, 54, 0.5); background: rgba(233, 75, 54, 0.06); }
.bl-tease-item.is-locked .bl-tease-item-title { color: var(--bl-fg-faint); filter: blur(2.5px); user-select: none; }
.bl-tease-item.is-locked .bl-tease-item-byline { color: var(--bl-fg-faint); filter: blur(2px); user-select: none; }
.bl-tease-item-num {
  font-family: var(--bl-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--bl-accent);
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  min-width: 24px;
}
.bl-tease-item-body { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.bl-tease-item-title {
  font-family: var(--bl-display);
  font-weight: 500;
  font-size: 16px;
  line-height: 1.2;
  color: var(--bl-fg);
  margin: 0;
}
.bl-tease-item-byline {
  font-family: var(--bl-body);
  font-style: italic;
  font-size: 12.5px;
  color: var(--bl-fg-faint);
  margin: 0;
}
.bl-tease-item-mark {
  font-family: var(--bl-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-fg-faint);
  flex-shrink: 0;
}
.bl-tease-item.is-open .bl-tease-item-mark { color: var(--bl-accent); }

/* === Footer microcopy === */
.bl-footnote {
  border-top: 1px solid var(--bl-divider);
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 64ch;
}
.bl-footnote-line {
  font-family: var(--bl-serif);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(17px, 1.5vw, 20px);
  line-height: 1.45;
  color: var(--bl-fg);
  margin: 0;
  text-wrap: balance;
}
.bl-footnote-detail {
  font-family: var(--bl-body);
  font-size: 13.5px;
  color: var(--bl-fg-faint);
  line-height: 1.55;
  margin: 0;
  text-wrap: pretty;
}
.bl-footnote-sign {
  font-family: var(--bl-script);
  font-size: 22px;
  color: var(--bl-accent);
  margin: 4px 0 0;
  line-height: 1;
}

/* === Empty state === */
.bl-empty {
  max-width: 620px;
  margin: 0 auto;
  text-align: left;
  padding: clamp(40px, 6vw, 80px) 0;
}
.bl-empty .bl-h1 { margin-bottom: 18px; }
.bl-empty .bl-pitch { margin-bottom: 28px; }
`;
