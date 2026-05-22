export const INSIDER_CSS = `
:root {
  --bl-bg: #0B1733;
  --bl-bg-soft: #131F40;
  --bl-fg: #F2EFE8;
  --bl-fg-muted: rgba(242, 239, 232, 0.72);
  --bl-fg-faint: rgba(242, 239, 232, 0.42);
  --bl-accent: #e94b36;
  --bl-accent-soft: rgba(233, 75, 54, 0.14);
  --bl-divider: rgba(242, 239, 232, 0.12);
  --bl-divider-strong: rgba(242, 239, 232, 0.22);
  --bl-ease: cubic-bezier(.22, 1, .36, 1);
}

.bl-page {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 40px) clamp(80px, 10vw, 140px);
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 7vw, 96px);
  color: var(--bl-fg);
  font-family: 'Outfit', system-ui, sans-serif;
}

/* === Hero === */
.bl-hero {
  padding-top: clamp(32px, 6vw, 72px);
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
}
.bl-hero::after {
  content: '';
  position: absolute;
  inset: auto 0 -36px 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--bl-divider-strong), transparent);
  pointer-events: none;
}
.bl-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Bricolage Grotesque', sans-serif;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(34px, 5.4vw, 64px);
  letter-spacing: -0.035em;
  line-height: 1.02;
  margin: 0;
  text-wrap: balance;
  max-width: 18ch;
}
.bl-h1-accent {
  color: var(--bl-accent);
  font-style: italic;
  font-family: 'Fraunces', 'Bricolage Grotesque', serif;
  font-weight: 600;
}
.bl-pitch {
  font-family: 'Outfit', sans-serif;
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
  margin-top: 8px;
}

/* === Section heading === */
.bl-section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.bl-h2 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: clamp(22px, 2.4vw, 30px);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
  text-wrap: balance;
}
.bl-section-note {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: var(--bl-fg-faint);
  margin: 0;
}

/* === Pills / chips === */
.bl-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--bl-divider-strong);
  font-family: 'Bricolage Grotesque', sans-serif;
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
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  text-transform: uppercase;
  font-size: 10.5px;
  letter-spacing: 0.16em;
  padding: 5px 10px;
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
  font-family: 'Bricolage Grotesque', sans-serif;
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
  border: 1px solid var(--bl-divider-strong);
  border-radius: 18px;
  padding: 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03));
  transition: border-color 220ms var(--bl-ease), transform 220ms var(--bl-ease), background 220ms var(--bl-ease);
}
.bl-card:hover {
  border-color: rgba(242, 239, 232, 0.32);
  transform: translateY(-2px);
}

/* === Confirmation strip === */
.bl-confirm {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px 24px;
  border: 1px dashed var(--bl-divider-strong);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
}
.bl-confirm-label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-fg-faint);
  margin: 0;
}
.bl-confirm-edit {
  align-self: flex-start;
  font-family: 'Outfit', sans-serif;
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
  font-family: 'Fraunces', 'Bricolage Grotesque', serif;
  font-weight: 600;
  font-style: italic;
  font-size: 22px;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 4px;
  text-wrap: balance;
}
.bl-shelf-byline {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: var(--bl-fg-faint);
  margin: 0 0 12px;
  letter-spacing: 0.04em;
}
.bl-shelf-blurb {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  line-height: 1.5;
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
  font-family: 'Outfit', sans-serif;
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
  padding: 18px 4px;
  border-bottom: 1px solid var(--bl-divider);
  font-family: 'Outfit', sans-serif;
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
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 11.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-fg-faint);
}
.bl-schedule-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 17px;
  letter-spacing: -0.01em;
  color: var(--bl-fg);
  text-wrap: balance;
}
.bl-schedule-byline {
  font-family: 'Outfit', sans-serif;
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
  padding: 22px 22px 20px;
  border: 1px solid var(--bl-divider-strong);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035));
}
.bl-stat-num {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(36px, 4.5vw, 52px);
  letter-spacing: -0.04em;
  line-height: 1;
  margin: 0 0 6px;
  color: var(--bl-fg);
}
.bl-stat-num-accent {
  color: var(--bl-accent);
}
.bl-stat-label {
  font-family: 'Outfit', sans-serif;
  font-size: 13.5px;
  color: var(--bl-fg-muted);
  margin: 0;
  line-height: 1.4;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: var(--bl-fg-faint);
}
.bl-step.is-done .bl-step-dot {
  background: var(--bl-accent);
  border-color: var(--bl-accent);
  color: #fff;
}
.bl-step.is-current .bl-step-dot {
  border-color: var(--bl-accent);
  color: var(--bl-accent);
  box-shadow: 0 0 0 4px var(--bl-accent-soft);
}
.bl-step-label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--bl-fg-muted);
}
.bl-step.is-current .bl-step-label { color: var(--bl-fg); }
.bl-step-sub {
  font-family: 'Outfit', sans-serif;
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
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025));
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
  font-family: 'Bricolage Grotesque', sans-serif;
}
.bl-submission-fname {
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--bl-fg);
  word-break: break-all;
}
.bl-submission-fmeta {
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
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
.bl-editorial-kicker {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0 0 14px;
}
.bl-editorial-title {
  font-family: 'Fraunces', 'Bricolage Grotesque', serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0 0 10px;
  color: var(--bl-fg);
  text-wrap: balance;
}
.bl-editorial-body {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  line-height: 1.55;
  color: var(--bl-fg-muted);
  margin: 0 0 16px;
  text-wrap: pretty;
}
.bl-editorial-link {
  font-family: 'Bricolage Grotesque', sans-serif;
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
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025));
  position: relative;
  overflow: hidden;
}
@media (min-width: 720px) {
  .bl-club { grid-template-columns: 1.2fr 1fr; align-items: center; }
}
.bl-club-when {
  font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  font-size: 11.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0 0 12px;
}
.bl-club-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: clamp(22px, 2.6vw, 30px);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 12px;
  text-wrap: balance;
}
.bl-club-body {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: var(--bl-fg-muted);
  margin: 0 0 18px;
}
.bl-club-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border-radius: 14px;
  background: rgba(11, 23, 51, 0.55);
  border: 1px solid var(--bl-divider);
}
.bl-club-side-label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-fg-faint);
}
.bl-club-side-quote {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 16px;
  line-height: 1.4;
  color: var(--bl-fg);
  margin: 0;
  text-wrap: balance;
}
.bl-club-side-attrib {
  font-family: 'Outfit', sans-serif;
  font-size: 12.5px;
  color: var(--bl-fg-faint);
  margin: 0;
}

/* === Footer microcopy === */
.bl-footnote {
  border-top: 1px solid var(--bl-divider);
  padding-top: 28px;
  font-family: 'Outfit', sans-serif;
  font-size: 13.5px;
  color: var(--bl-fg-faint);
  line-height: 1.55;
  text-wrap: pretty;
  max-width: 64ch;
}
.bl-footnote strong {
  color: var(--bl-fg-muted);
  font-weight: 600;
}

/* === Empty state === */
.bl-empty {
  max-width: 580px;
  margin: 0 auto;
  text-align: left;
  padding: clamp(40px, 6vw, 80px) 0;
}
.bl-empty .bl-h1 { margin-bottom: 14px; }
.bl-empty .bl-pitch { margin-bottom: 28px; }
`;
