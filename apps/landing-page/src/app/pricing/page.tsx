'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WaitlistOverlay } from '../v8/WaitlistForm';
import Footer from '../v8/sections/Footer';

const PRICING_CSS = `
.pricing-root {
  --v6-accent: var(--bl-accent);
  --v6-accent-soft: var(--bl-accent-soft);
  --v6-text: var(--bl-ink);
  --v6-text-strong: var(--bl-ink);
  --v6-text-muted: #14140f;
  --v6-surface: var(--bl-surface);
  --v6-divider: var(--bl-divider);
  --v6-ease: var(--bl-ease);
  min-height: 100vh;
  background: var(--v6-surface);
  font-family: var(--bl-font-body);
  color: var(--v6-text);
}
/* Pricing inherits the brand defaults from globals.css:
   white surface, green accent, ink text. Matches FAQ page style. */

/* === nav (mirrors v9) === */
.pricing-nav {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 3.5vw, 56px);
  border-bottom: 1px solid rgba(14,14,12,0.1);
  background: var(--v6-surface);
  color: var(--bl-ink);
}
.pricing-brand {
  display: inline-flex;
  align-items: baseline;
  color: var(--v6-text-strong);
  text-decoration: none;
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.02em;
  font-variation-settings: 'wdth' 95;
}
.pricing-brand-dot {
  color: var(--bl-accent);
  padding: 0 4px;
  font-weight: 800;
  transform: translateY(-1px);
}
.pricing-nav-left {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 38px);
}
.pricing-nav-links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 24px);
  font-family: var(--bl-font-eyebrow);
}
.pricing-nav-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--v6-text-strong);
  text-decoration: none;
  padding: 4px 0;
  position: relative;
  transition: color 200ms ease;
}
.pricing-nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--bl-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms var(--bl-ease);
}
.pricing-nav-link:hover { color: var(--bl-accent); }
.pricing-nav-link:hover::after { transform: scaleX(1); }
.pricing-nav-link.is-active { color: var(--bl-accent); }
.pricing-nav-link.is-active::after { transform: scaleX(1); }
.pricing-nav-cta {
  appearance: none;
  border: 0;
  background: var(--v6-text-strong);
  color: #f6f1e3;
  padding: 10px 20px;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease, box-shadow 200ms ease;
}
.pricing-nav-cta:hover,
.pricing-nav-cta:focus-visible {
  background: var(--bl-accent);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(14, 14, 12, 0.16);
  outline: none;
}
@media (max-width: 760px) {
  .pricing-nav-links { display: none; }
}

/* === hero === */
.pricing-hero {
  text-align: center;
  padding: clamp(48px, 7vh, 88px) clamp(20px, 4vw, 40px) clamp(32px, 5vh, 56px);
  max-width: 720px;
  margin: 0 auto;
}
.pricing-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin-bottom: 14px;
  display: inline-block;
}
.pricing-hero-title {
  margin: 0 0 18px;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(38px, 5.4vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.035em;
  color: var(--v6-text-strong);
  text-wrap: balance;
}
.pricing-hero-sub {
  margin: 0 0 36px;
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(16px, 1.45vw, 19px);
  line-height: 1.6;
  color: var(--v6-text-muted);
  max-width: 58ch;
  margin-left: auto;
  margin-right: auto;
  text-wrap: pretty;
}

/* billing toggle */
.pricing-billing {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 0 auto;
}
.pricing-billing-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 500;
  color: rgba(14,14,12,0.5);
  letter-spacing: 0.04em;
}
.pricing-billing-label.is-active {
  color: var(--v6-text-strong);
  font-weight: 700;
}
.pricing-billing-toggle {
  width: 48px;
  height: 26px;
  background: var(--v6-text-strong);
  border: 0;
  border-radius: 999px;
  padding: 0;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 240ms var(--bl-ease);
}
.pricing-billing-toggle::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: transform 240ms var(--bl-ease);
}
.pricing-billing-toggle.is-annual { background: var(--bl-accent); }
.pricing-billing-toggle.is-annual::after { transform: translateX(22px); }
.pricing-billing-save {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--bl-accent-soft);
  color: var(--bl-accent);
  padding: 4px 10px;
  border-radius: 999px;
}

/* === membership banner === */
.pricing-member-wrap {
  max-width: 980px;
  margin: 0 auto clamp(40px, 6vh, 64px);
  padding: 0 clamp(20px, 4vw, 40px);
}
.pricing-member {
  position: relative;
  background: #0a0a0a;
  color: #f6f1e3;
  border-radius: 20px;
  padding: clamp(28px, 4vw, 40px) clamp(28px, 4vw, 44px);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: clamp(20px, 4vw, 44px);
  align-items: flex-start;
  /* Soft ambient shadow — dark card floating, no offset block. */
  box-shadow:
    0 4px 10px rgba(14,14,12,0.10),
    0 18px 40px rgba(14,14,12,0.20),
    0 36px 72px rgba(14,14,12,0.12);
  overflow: hidden;
  isolation: isolate;
}
.pricing-member::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  mix-blend-mode: overlay;
  opacity: 0.07;
  z-index: 0;
}
.pricing-member > * { position: relative; z-index: 1; }
.pricing-member-badge {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6BC480;
  margin-bottom: 10px;
}
.pricing-member-title {
  margin: 0 0 10px;
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(24px, 2.4vw, 32px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #fff;
  text-wrap: balance;
  max-width: 22ch;
}
.pricing-member-sub {
  margin: 0 0 20px;
  font-family: var(--bl-font-serif);
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(246,241,227,0.72);
  max-width: 52ch;
}
.pricing-member-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pricing-mbenefit {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 500;
  color: #9FDDB0;
  background: rgba(107,196,128,0.08);
  border: 0.5px solid rgba(159,221,176,0.32);
  padding: 5px 12px;
  border-radius: 999px;
  letter-spacing: 0.01em;
}
.pricing-member-price {
  text-align: right;
  min-width: 220px;
}
.pricing-member-amount {
  font-family: var(--bl-font-serif);
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(40px, 4.4vw, 52px);
  font-weight: 500;
  color: #fff;
  line-height: 1;
}
.pricing-member-period {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  color: rgba(246,241,227,0.62);
  margin-top: 6px;
  margin-bottom: 18px;
  letter-spacing: 0.02em;
}
.pricing-member-cta {
  appearance: none;
  background: var(--bl-accent);
  color: #ffffff;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 11px 22px;
  border-radius: 10px;
  border: 0;
  cursor: pointer;
  transition: background 200ms var(--bl-ease), transform 200ms var(--bl-ease), box-shadow 200ms var(--bl-ease);
  white-space: nowrap;
}
.pricing-member-cta:hover,
.pricing-member-cta:focus-visible {
  background: var(--bl-accent-strong);
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(31, 122, 62, 0.28);
  outline: none;
}
.pricing-member-math {
  font-family: var(--bl-font-body);
  font-size: 11px;
  color: rgba(246,241,227,0.62);
  margin-top: 12px;
  line-height: 1.65;
  text-align: right;
}
.pricing-member-math strong { color: #9FDDB0; font-weight: 700; }

@media (max-width: 760px) {
  .pricing-member { grid-template-columns: 1fr; }
  .pricing-member-price { text-align: left; min-width: 0; }
  .pricing-member-math { text-align: left; }
}

/* === plan sections === */
.pricing-section {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 40px) clamp(20px, 3vh, 32px);
}
.pricing-section-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(14,14,12,0.55);
  margin-bottom: 16px;
}
.pricing-plans-grid {
  display: grid;
  gap: 14px;
  margin-bottom: clamp(28px, 4vh, 40px);
}
.pricing-plans-grid.cols-2 { grid-template-columns: 1fr 1fr; }
.pricing-plans-grid.cols-1 { grid-template-columns: 1fr; }
@media (max-width: 760px) {
  .pricing-plans-grid.cols-2 { grid-template-columns: 1fr; }
}

.pricing-plan {
  background: #fff;
  border-radius: 16px;
  border: 0.5px solid var(--v6-divider);
  padding: clamp(22px, 2.4vw, 28px);
  display: flex;
  flex-direction: column;
}
.pricing-plan.is-featured {
  border-color: var(--bl-accent);
  background: rgba(31, 122, 62,0.04);
}
.pricing-plan.is-pro {
  border-color: var(--bl-accent);
  background: #fff;
  /* Soft ambient lift for the pro tier — distinguished by border + shadow,
     not an offset stamp. */
  box-shadow:
    0 2px 6px rgba(14,14,12,0.05),
    0 12px 28px rgba(14,14,12,0.10),
    0 28px 56px rgba(14,14,12,0.06);
}
.pricing-plan-icon {
  font-size: 24px;
  line-height: 1;
  margin-bottom: 10px;
}
.pricing-plan-name {
  font-family: var(--bl-font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--v6-text-strong);
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}
.pricing-plan-tagline {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-size: 13px;
  color: rgba(14,14,12,0.6);
  margin: 0 0 18px;
  line-height: 1.5;
}
.pricing-plan-price { margin-bottom: 16px; }
.pricing-plan-amount {
  font-family: var(--bl-font-serif);
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: 34px;
  font-weight: 500;
  color: var(--v6-text-strong);
  line-height: 1;
}
.pricing-plan-amount.is-free {
  font-size: 28px;
  color: rgba(14,14,12,0.7);
}
.pricing-plan-period {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  color: rgba(14,14,12,0.55);
  margin-top: 5px;
  letter-spacing: 0.02em;
}
.pricing-plan-period .alt {
  font-size: 11px;
  color: rgba(14,14,12,0.5);
  display: block;
  margin-top: 3px;
  font-style: italic;
  font-family: var(--bl-font-serif);
  letter-spacing: 0;
}
.pricing-plan-divider {
  border: 0;
  border-top: 0.5px solid rgba(14,14,12,0.1);
  margin: 16px 0;
}
.pricing-plan-features {
  list-style: none;
  margin: 0 0 20px;
  padding: 0;
  flex: 1;
}
.pricing-plan-features li {
  font-family: var(--bl-font-body);
  font-size: 13px;
  color: rgba(14,14,12,0.78);
  padding: 6px 0;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  line-height: 1.5;
}
.pricing-plan-features li::before {
  content: '✓';
  color: var(--bl-accent);
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
  font-size: 13px;
}
.pricing-plan-features li.no::before {
  content: '—';
  color: rgba(14,14,12,0.2);
}
.pricing-plan-features li.no { color: rgba(14,14,12,0.35); }

.pricing-plan-cta {
  appearance: none;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  border: 0;
  transition: transform 200ms var(--bl-ease), box-shadow 200ms var(--bl-ease), background 200ms ease;
}
.pricing-plan-cta.is-outline {
  background: #fff;
  color: var(--v6-text-strong);
  border: 0.5px solid rgba(14,14,12,0.22);
}
.pricing-plan-cta.is-outline:hover {
  border-color: var(--bl-accent);
  color: var(--bl-accent);
}
.pricing-plan-cta.is-solid {
  background: var(--bl-accent);
  color: #fff;
}
.pricing-plan-cta.is-solid:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(31, 122, 62,0.24);
}

.pricing-member-saving {
  font-family: var(--bl-font-body);
  font-size: 11px;
  color: var(--bl-accent);
  background: rgba(31, 122, 62,0.06);
  border: 0.5px solid rgba(31, 122, 62,0.2);
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 14px;
  line-height: 1.5;
}
.pricing-member-saving strong { font-weight: 700; }

/* AgentReadyPro full-width inner grid */
.pricing-pro-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: clamp(20px, 3vw, 40px);
  align-items: start;
}
.pricing-pro-feats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 clamp(20px, 3vw, 36px);
}
.pricing-pro-feats .pricing-plan-features { margin-bottom: 0; }
.pricing-pro-right {
  text-align: right;
  flex-shrink: 0;
  min-width: 180px;
}
.pricing-pro-right .pricing-plan-amount { font-size: 38px; }
.pricing-pro-right .pricing-plan-cta { width: 160px; margin-top: 16px; }
.pricing-pro-fineprint {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  color: rgba(14,14,12,0.5);
  margin-top: 10px;
  letter-spacing: 0.04em;
}
@media (max-width: 760px) {
  .pricing-pro-inner { grid-template-columns: 1fr; }
  .pricing-pro-feats { grid-template-columns: 1fr; }
  .pricing-pro-right { text-align: left; min-width: 0; }
}

/* === add-ons === */
.pricing-addon-section {
  max-width: 980px;
  margin: 0 auto clamp(28px, 4vh, 40px);
  padding: 0 clamp(20px, 4vw, 40px);
}
.pricing-addon {
  background: #fff;
  border-radius: 16px;
  border: 0.5px solid var(--v6-divider);
  padding: clamp(22px, 2.4vw, 28px);
  margin-bottom: 16px;
}
.pricing-addon:last-child { margin-bottom: 0; }
.pricing-addon-icon { font-size: 22px; margin-bottom: 8px; line-height: 1; }
.pricing-addon-name {
  font-family: var(--bl-font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--v6-text-strong);
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}
.pricing-addon-desc {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-size: 13px;
  color: rgba(14,14,12,0.6);
  margin: 0 0 18px;
  line-height: 1.55;
  max-width: 72ch;
}
.pricing-tier-grid {
  display: grid;
  gap: 12px;
}
.pricing-tier-grid.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.pricing-tier-grid.cols-2 { grid-template-columns: 1fr 1fr; }
@media (max-width: 760px) {
  .pricing-tier-grid.cols-3,
  .pricing-tier-grid.cols-2 { grid-template-columns: 1fr; }
}
.pricing-tier {
  background: rgba(14,14,12,0.025);
  border: 0.5px solid var(--v6-divider);
  border-radius: 12px;
  padding: 16px;
}
.pricing-tier-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  color: rgba(14,14,12,0.55);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 8px;
}
.pricing-tier-price {
  font-family: var(--bl-font-serif);
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: 24px;
  font-weight: 500;
  color: var(--v6-text-strong);
  line-height: 1;
}
.pricing-tier-period {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  color: rgba(14,14,12,0.55);
  margin-top: 4px;
  margin-bottom: 10px;
  letter-spacing: 0.02em;
}
.pricing-tier-save {
  color: #2f7a3a;
  font-weight: 700;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-left: 4px;
}
.pricing-tier-desc {
  font-family: var(--bl-font-body);
  font-size: 12px;
  color: rgba(14,14,12,0.6);
  line-height: 1.55;
  margin-bottom: 12px;
  min-height: 36px;
}
.pricing-tier-cta {
  appearance: none;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 7px 14px;
  border-radius: 8px;
  border: 0.5px solid rgba(14,14,12,0.22);
  background: #fff;
  color: rgba(14,14,12,0.7);
  cursor: pointer;
  transition: color 180ms ease, border-color 180ms ease;
}
.pricing-tier-cta:hover {
  color: var(--bl-accent);
  border-color: var(--bl-accent);
}

/* === savings card === */
.pricing-savings-section {
  max-width: 980px;
  margin: 0 auto clamp(40px, 6vh, 64px);
  padding: 0 clamp(20px, 4vw, 40px);
}
.pricing-savings-card {
  background: #fff;
  border-radius: 16px;
  border: 0.5px solid var(--v6-divider);
  padding: clamp(24px, 3vw, 36px);
}
.pricing-savings-title {
  font-family: var(--bl-font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--v6-text-strong);
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}
.pricing-savings-sub {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-size: 13px;
  color: rgba(14,14,12,0.55);
  margin: 0 0 22px;
}
.pricing-savings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
}
@media (max-width: 760px) {
  .pricing-savings-grid { grid-template-columns: 1fr; }
}
.pricing-scenario {
  background: rgba(14,14,12,0.025);
  border-radius: 12px;
  padding: 18px;
  border: 0.5px solid var(--v6-divider);
}
.pricing-scenario-title {
  font-family: var(--bl-font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--v6-text-strong);
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}
.pricing-scenario-row {
  display: flex;
  justify-content: space-between;
  font-family: var(--bl-font-body);
  font-size: 12px;
  color: rgba(14,14,12,0.6);
  padding: 4px 0;
  border-bottom: 0.5px solid rgba(14,14,12,0.08);
}
.pricing-scenario-row:last-of-type { border-bottom: none; }
.pricing-scenario-row.is-saving { color: #2f7a3a; font-weight: 600; }
.pricing-scenario-row.is-saving span:last-child { color: #2f7a3a; }
.pricing-scenario-row.is-total {
  font-weight: 700;
  color: var(--v6-text-strong);
  font-size: 13px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 0.5px solid rgba(14,14,12,0.18);
}
.pricing-payback {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin-top: 10px;
  text-align: center;
}
.pricing-payback.is-positive { color: #1f6a32; }

/* === FAQ === */
.pricing-faq-section {
  max-width: 720px;
  margin: 0 auto clamp(56px, 8vh, 96px);
  padding: 0 clamp(20px, 4vw, 40px);
}
.pricing-faq-title {
  font-family: var(--bl-font-display);
  font-size: clamp(24px, 2.4vw, 30px);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
  margin: 0 0 24px;
  color: var(--v6-text-strong);
}
.pricing-faq-item {
  border-bottom: 0.5px solid rgba(14,14,12,0.18);
}
.pricing-faq-q {
  appearance: none;
  width: 100%;
  background: transparent;
  border: 0;
  padding: 18px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  text-align: left;
  cursor: pointer;
  font-family: var(--bl-font-display);
  font-size: 15px;
  font-weight: 500;
  color: var(--v6-text-strong);
  letter-spacing: -0.005em;
  transition: color 180ms ease;
}
.pricing-faq-q:hover { color: var(--bl-accent); }
.pricing-faq-q-icon {
  font-family: var(--bl-font-eyebrow);
  font-size: 20px;
  color: rgba(14,14,12,0.4);
  line-height: 1;
  flex-shrink: 0;
  transition: color 180ms ease, transform 240ms var(--bl-ease);
}
.pricing-faq-item.is-open .pricing-faq-q-icon { color: var(--bl-accent); }
.pricing-faq-a {
  font-family: var(--bl-font-serif);
  font-size: 14px;
  color: rgba(14,14,12,0.65);
  line-height: 1.75;
  padding: 0 0 18px;
  max-width: 62ch;
}

.pricing-root :where(button, a, [role="button"], input):focus-visible {
  outline: 2px solid var(--bl-accent);
  outline-offset: 3px;
}
`;

type Billing = 'monthly' | 'annual';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'What exactly is a co-op membership?',
    a: "A co-op membership means you're not just a subscriber — you're a co-owner. You get a vote in the weekly BetweenReads Member Picks, a share in any profit distributions if the platform generates surplus, and a Member badge on your profile. It's a $50 annual investment in the platform and in yourself as a reader or writer.",
  },
  {
    q: 'Does the 10% membership discount stack with annual billing savings?',
    a: 'Yes. If you pay annually and are a member, you get both the annual discount and your 10% membership discount. A PowerReader member paying annually pays $90/year instead of $120/year — a total saving of $30 on that plan alone.',
  },
  {
    q: 'Can I be both a Reader and a Writer on the platform?',
    a: 'Yes. Many members are both. Your profile shows both identities. You can hold a PowerReader and PowerCreator plan simultaneously, and your membership discount applies to both. Writers are supposed to read — we encourage it.',
  },
  {
    q: 'What are ReadCredits?',
    a: 'ReadCredits are earned by reading, reviewing, adding quotes to the Wall, maintaining your streak, and completing beta reads. They can be used to unlock premium content, tip writers, or access special features. Members receive a 100 RC welcome bonus on joining. Co-op members earn 2× credits on all activity.',
  },
  {
    q: 'What is SecureBetaReads?',
    a: 'SecureBetaReads is our manuscript protection system for writers sharing unpublished work with beta readers. Manuscripts are watermarked on upload, copy is disabled, and beta readers can only access work on the platform. We never train AI on your content. Writers control exactly who reads their work and can revoke access at any time.',
  },
  {
    q: 'Is there a free trial for Power plans?',
    a: 'Yes — all Power plans include a 14-day free trial. No card required to start. You’ll be prompted to add payment details before your trial ends.',
  },
  {
    q: 'How does BetweenReads for Kids work?',
    a: 'BetweenReads for Kids is an add-on to any parent account. Child profiles show avatars only — no photos. Display names are platform-generated by default. All content is filtered through our Young Readers content layer. Every child profile is linked to a verified parent or guardian account, and any profile changes require guardian approval.',
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [waitlist, setWaitlist] = useState<{ open: boolean; eyebrow?: string }>({ open: false });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openWaitlist = (eyebrow?: string) => setWaitlist({ open: true, eyebrow });
  const closeWaitlist = () => setWaitlist({ open: false });
  const isAnnual = billing === 'annual';

  const powerPrice = isAnnual ? '$100' : '$10';
  const powerPeriod = isAnnual ? 'per year · billed annually' : 'per month · billed monthly';
  const powerAlt = isAnnual ? 'save $20 vs monthly' : 'or $100/year — save $20';

  return (
    <main className="pricing-root">
      <style dangerouslySetInnerHTML={{ __html: PRICING_CSS }} />

      {/* === nav === */}
      <nav className="pricing-nav">
        <div className="pricing-nav-left">
          <Link className="pricing-brand" href="/" aria-label="BetweenReads, home">
            <span>between</span>
            <span className="pricing-brand-dot">.</span>
            <span>reads</span>
          </Link>
          <div className="pricing-nav-links">
            <Link className="pricing-nav-link" href="/betweenlines">BetweenLines</Link>
            <Link className="pricing-nav-link" href="/readers">Readers</Link>
            <Link className="pricing-nav-link" href="/creators">Creators</Link>
            <Link className="pricing-nav-link is-active" href="/pricing" aria-current="page">Pricing</Link>
            <Link className="pricing-nav-link" href="/faq">FAQ</Link>
          </div>
        </div>
        <button type="button" className="pricing-nav-cta" onClick={() => openWaitlist()}>
          Join free
        </button>
      </nav>

      {/* === hero === */}
      <section className="pricing-hero">
        <span className="pricing-eyebrow">Pricing</span>
        <h1 className="pricing-hero-title">For wandering readers and writers</h1>
        <p className="pricing-hero-sub">
          Start free. Grow with us. Become a member when you&apos;re ready. Every plan is built around the reading and writing life — not the algorithm.
        </p>
        <div className="pricing-billing">
          <span className={`pricing-billing-label${!isAnnual ? ' is-active' : ''}`}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            aria-label="Toggle annual billing"
            className={`pricing-billing-toggle${isAnnual ? ' is-annual' : ''}`}
            onClick={() => setBilling(isAnnual ? 'monthly' : 'annual')}
          />
          <span className={`pricing-billing-label${isAnnual ? ' is-active' : ''}`}>Annual</span>
          <span className="pricing-billing-save">Save 17%</span>
        </div>
      </section>

      {/* === membership banner === */}
      <div className="pricing-member-wrap">
        <div className="pricing-member">
          <div>
            <div className="pricing-member-badge">✦ BetweenReads Membership</div>
            <h2 className="pricing-member-title">The co-op membership that pays for itself</h2>
            <p className="pricing-member-sub">
              One annual membership. Every plan on the platform gets 10% off. ReadCredits welcome bonus. Vote for Member Reading Picks.
            </p>
            <div className="pricing-member-benefits">
              <span className="pricing-mbenefit">10% off PowerReader, PowerCreator, AgentReadyPro &amp; Kids</span>
              <span className="pricing-mbenefit">20% off store purchases</span>
              <span className="pricing-mbenefit">20% off Volume plans</span>
              <span className="pricing-mbenefit">2× ReadCredits on all activity</span>
              <span className="pricing-mbenefit">100 RC welcome bonus</span>
              <span className="pricing-mbenefit">Early access to new content</span>
              <span className="pricing-mbenefit">BetweenLines Inaugural Issue free</span>
              <span className="pricing-mbenefit">Member badge on profile</span>
              <span className="pricing-mbenefit">Vote — weekly Member Picks</span>
              <span className="pricing-mbenefit">Priority beta reader matching</span>
              <span className="pricing-mbenefit">BetweenCharacters featured rotation</span>
            </div>
          </div>
          <div className="pricing-member-price">
            <div className="pricing-member-amount">$50</div>
            <div className="pricing-member-period">per year · one membership covers everything</div>
            <button
              type="button"
              className="pricing-member-cta"
              onClick={() => openWaitlist('BetweenReads Membership')}
            >
              Become a member
            </button>
            <div className="pricing-member-math">
              A PowerCreator member saves <strong>$12/yr</strong> on their plan alone.<br />
              Add AgentReadyPro and they save <strong>$48/yr</strong> more.<br />
              Total savings: <strong>$60/yr</strong> — membership pays for itself.
            </div>
          </div>
        </div>
      </div>

      {/* === free plans === */}
      <section className="pricing-section">
        <div className="pricing-section-label">Free forever</div>
        <div className="pricing-plans-grid cols-2">
          <article className="pricing-plan">
            <div className="pricing-plan-icon" aria-hidden="true">📖</div>
            <h3 className="pricing-plan-name">EmergingReader</h3>
            <p className="pricing-plan-tagline">Discover writers, build your reading identity, join the community.</p>
            <div className="pricing-plan-price">
              <div className="pricing-plan-amount is-free">Free</div>
              <div className="pricing-plan-period">Forever · No card required</div>
            </div>
            <hr className="pricing-plan-divider" />
            <ul className="pricing-plan-features">
              <li>BetweenPages reader profile</li>
              <li>BetweenCharacters Wall — read and submit quotes</li>
              <li>Public content and free chapters</li>
              <li>Reading streak and ReadCredits</li>
              <li>Join Reader&apos;s Clubs</li>
              <li>Daily 150-word public domain excerpts</li>
              <li className="no">Premium chapters and exclusive content</li>
              <li className="no">Reader Pods</li>
              <li className="no">BetweenLines journal</li>
            </ul>
            <button
              type="button"
              className="pricing-plan-cta is-outline"
              onClick={() => openWaitlist('EmergingReader')}
            >
              Start reading free
            </button>
          </article>

          <article className="pricing-plan">
            <div className="pricing-plan-icon" aria-hidden="true">✍️</div>
            <h3 className="pricing-plan-name">EmergingCreator</h3>
            <p className="pricing-plan-tagline">Publish your writing, find your readers, build your presence.</p>
            <div className="pricing-plan-price">
              <div className="pricing-plan-amount is-free">Free</div>
              <div className="pricing-plan-period">Forever · No card required</div>
            </div>
            <hr className="pricing-plan-divider" />
            <ul className="pricing-plan-features">
              <li>Writer profile — full BetweenPages identity</li>
              <li>Publish up to 3 works publicly</li>
              <li>BetweenCharacters Wall</li>
              <li>Writing streak and credits</li>
              <li>Join Reader&apos;s Clubs and Writer Clubs</li>
              <li>Basic reader matching</li>
              <li className="no">SecureBetaReads manuscripts</li>
              <li className="no">Reader Pods and Writer Pods</li>
              <li className="no">AgentReady tools</li>
            </ul>
            <button
              type="button"
              className="pricing-plan-cta is-outline"
              onClick={() => openWaitlist('EmergingCreator')}
            >
              Start writing free
            </button>
          </article>
        </div>

        {/* === power plans === */}
        <div className="pricing-section-label">Power plans</div>
        <div className="pricing-plans-grid cols-2">
          <article className="pricing-plan is-featured">
            <div className="pricing-plan-icon" aria-hidden="true">🔖</div>
            <h3 className="pricing-plan-name">PowerReader</h3>
            <p className="pricing-plan-tagline">For the power reader. More content, deeper community, early access to everything.</p>
            <div className="pricing-plan-price">
              <div className="pricing-plan-amount">{powerPrice}</div>
              <div className="pricing-plan-period">
                {powerPeriod}
                <span className="alt">{powerAlt}</span>
              </div>
            </div>
            <div className="pricing-member-saving">
              ✦ Members pay <strong>$90/yr</strong> — saving $10 on top
            </div>
            <hr className="pricing-plan-divider" />
            <ul className="pricing-plan-features">
              <li>Everything in EmergingReader</li>
              <li>Unlimited premium chapters</li>
              <li>BetweenLines journal — all issues</li>
              <li>Reader Pods — join writer inner circles</li>
              <li>Early access to new content</li>
              <li>Priority beta reader matching</li>
              <li>BetweenCharacters featured rotation eligible</li>
              <li>Mood-based discovery — full access</li>
            </ul>
            <button
              type="button"
              className="pricing-plan-cta is-solid"
              onClick={() => openWaitlist('PowerReader')}
            >
              Start PowerReader
            </button>
          </article>

          <article className="pricing-plan is-featured">
            <div className="pricing-plan-icon" aria-hidden="true">🖊️</div>
            <h3 className="pricing-plan-name">PowerCreator</h3>
            <p className="pricing-plan-tagline">For serious writers and illustrators. Protect your work, grow your readership, build your craft.</p>
            <div className="pricing-plan-price">
              <div className="pricing-plan-amount">{powerPrice}</div>
              <div className="pricing-plan-period">
                {powerPeriod}
                <span className="alt">{powerAlt}</span>
              </div>
            </div>
            <div className="pricing-member-saving">
              ✦ Members pay <strong>$90/yr</strong> — saving $10 on top
            </div>
            <hr className="pricing-plan-divider" />
            <ul className="pricing-plan-features">
              <li>Everything in EmergingCreator</li>
              <li>Unlimited published works</li>
              <li>SecureBetaReads — watermarked manuscripts</li>
              <li>Reader Pods — host up to 6 readers</li>
              <li>Writer Pods — peer craft circles, max 4</li>
              <li>Advanced reader matching by genre</li>
              <li>Priority placement in Reader Picks</li>
              <li>BetweenLines journal — submit to editorial</li>
            </ul>
            <button
              type="button"
              className="pricing-plan-cta is-solid"
              onClick={() => openWaitlist('PowerCreator')}
            >
              Start PowerCreator
            </button>
          </article>
        </div>

        {/* === AgentReadyPro === */}
        <div className="pricing-section-label">Professional</div>
        <div className="pricing-plans-grid cols-1">
          <article className="pricing-plan is-pro">
            <div className="pricing-pro-inner">
              <div>
                <div className="pricing-plan-icon" aria-hidden="true">📋</div>
                <h3 className="pricing-plan-name">AgentReadyPro</h3>
                <p className="pricing-plan-tagline">
                  The professional tool for writers querying literary agents. Query packages, agent matching, manuscript packages, response tracking — everything in one place.
                </p>
                <div className="pricing-member-saving" style={{ maxWidth: 480 }}>
                  ✦ Members pay <strong>$35.99/mo</strong> — saving $48/year on this plan alone
                </div>
                <hr className="pricing-plan-divider" />
                <div className="pricing-pro-feats">
                  <ul className="pricing-plan-features">
                    <li>Upload and analyse your manuscript</li>
                    <li>Auto-generated query letter</li>
                    <li>Synopsis — 1 page and 2 page</li>
                    <li>Personalised opening paragraph per agent</li>
                    <li>Full submission package — 5 documents</li>
                  </ul>
                  <ul className="pricing-plan-features">
                    <li>Agent matching by genre and wishlist</li>
                    <li>Live agent status — open or closed</li>
                    <li>Response time indicators</li>
                    <li>Submission tracking — who, when, what</li>
                    <li>Response analysis — upload and review</li>
                  </ul>
                </div>
              </div>
              <div className="pricing-pro-right">
                <div className="pricing-plan-amount">$39.99</div>
                <div className="pricing-plan-period">per month</div>
                <button
                  type="button"
                  className="pricing-plan-cta is-solid"
                  onClick={() => openWaitlist('AgentReadyPro')}
                >
                  Start AgentReadyPro
                </button>
                <div className="pricing-pro-fineprint">Cancel anytime</div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* === add-ons === */}
      <section className="pricing-addon-section">
        <div className="pricing-section-label">Add-ons — coming soon</div>

        <div className="pricing-addon">
          <div className="pricing-addon-icon" aria-hidden="true">🎧</div>
          <h3 className="pricing-addon-name">ListenerPro</h3>
          <p className="pricing-addon-desc">
            Everything in PowerReader plus audio. Three tiers based on narration type — pick the one that fits how you listen.
          </p>
          <div className="pricing-tier-grid cols-3">
            <div className="pricing-tier">
              <div className="pricing-tier-label">Volume Add-on</div>
              <div className="pricing-tier-price">$9.99</div>
              <div className="pricing-tier-period">per month</div>
              <div className="pricing-tier-desc">PowerReader + one writer&apos;s full audio catalogue</div>
              <button
                type="button"
                className="pricing-tier-cta"
                onClick={() => openWaitlist('ListenerPro · Volume Add-on')}
              >
                Join waitlist
              </button>
            </div>
            <div className="pricing-tier">
              <div className="pricing-tier-label">Volume</div>
              <div className="pricing-tier-price">$19.99</div>
              <div className="pricing-tier-period">per month</div>
              <div className="pricing-tier-desc">PowerReader + AI narration across the platform</div>
              <button
                type="button"
                className="pricing-tier-cta"
                onClick={() => openWaitlist('ListenerPro · Volume')}
              >
                Join waitlist
              </button>
            </div>
            <div className="pricing-tier">
              <div className="pricing-tier-label">Volume+</div>
              <div className="pricing-tier-price">$29.99</div>
              <div className="pricing-tier-period">per month</div>
              <div className="pricing-tier-desc">PowerReader + AI narration + author narration where available</div>
              <button
                type="button"
                className="pricing-tier-cta"
                onClick={() => openWaitlist('ListenerPro · Volume+')}
              >
                Join waitlist
              </button>
            </div>
          </div>
        </div>

        <div className="pricing-addon">
          <div className="pricing-addon-icon" aria-hidden="true">🌟</div>
          <h3 className="pricing-addon-name">BetweenReads for Kids</h3>
          <p className="pricing-addon-desc">
            A safe, curated reading world for young readers. Linked to a parent or guardian account. Age-filtered content, avatars only, platform-generated display names.
          </p>
          <div className="pricing-tier-grid cols-2">
            <div className="pricing-tier">
              <div className="pricing-tier-label">Standalone</div>
              <div className="pricing-tier-price">$69.99</div>
              <div className="pricing-tier-period">per year</div>
              <div className="pricing-tier-desc">Pairs with EmergingReader or any parent account</div>
              <button
                type="button"
                className="pricing-tier-cta"
                onClick={() => openWaitlist('BetweenReads for Kids · Standalone')}
              >
                Join waitlist
              </button>
            </div>
            <div className="pricing-tier">
              <div className="pricing-tier-label">Bundled with PowerReader</div>
              <div className="pricing-tier-price">$62.99</div>
              <div className="pricing-tier-period">
                per year · <span className="pricing-tier-save">save 10%</span>
              </div>
              <div className="pricing-tier-desc">10% off when added to a PowerReader plan</div>
              <button
                type="button"
                className="pricing-tier-cta"
                onClick={() => openWaitlist('BetweenReads for Kids · Bundled')}
              >
                Join waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* === savings === */}
      <section className="pricing-savings-section">
        <div className="pricing-savings-card">
          <div className="pricing-savings-title">The membership maths — see what you save</div>
          <div className="pricing-savings-sub">The $50 membership pays for itself. Here&apos;s how.</div>
          <div className="pricing-savings-grid">
            <div className="pricing-scenario">
              <div className="pricing-scenario-title">📖 Power Reader</div>
              <div className="pricing-scenario-row"><span>PowerReader annual</span><span>$100</span></div>
              <div className="pricing-scenario-row"><span>Membership</span><span>$50</span></div>
              <div className="pricing-scenario-row is-saving"><span>10% off PowerReader</span><span>−$10</span></div>
              <div className="pricing-scenario-row is-saving"><span>2× RC earned (est. value)</span><span>−$10</span></div>
              <div className="pricing-scenario-row is-saving"><span>20% off store (est. $30)</span><span>−$6</span></div>
              <div className="pricing-scenario-row is-total"><span>Net cost of membership</span><span>$24</span></div>
              <div className="pricing-payback">Pays back in month 5</div>
            </div>
            <div className="pricing-scenario">
              <div className="pricing-scenario-title">🖊️ Serious Writer</div>
              <div className="pricing-scenario-row"><span>PowerCreator annual</span><span>$100</span></div>
              <div className="pricing-scenario-row"><span>Membership</span><span>$50</span></div>
              <div className="pricing-scenario-row is-saving"><span>10% off PowerCreator</span><span>−$10</span></div>
              <div className="pricing-scenario-row is-saving"><span>100 RC welcome bonus</span><span>~−$10</span></div>
              <div className="pricing-scenario-row is-saving"><span>20% off store (est. $30)</span><span>−$6</span></div>
              <div className="pricing-scenario-row is-total"><span>Net cost of membership</span><span>$24</span></div>
              <div className="pricing-payback">Pays back in month 5</div>
            </div>
            <div className="pricing-scenario">
              <div className="pricing-scenario-title">📋 Querying Writer</div>
              <div className="pricing-scenario-row"><span>AgentReadyPro annual</span><span>$480</span></div>
              <div className="pricing-scenario-row"><span>PowerCreator annual</span><span>$100</span></div>
              <div className="pricing-scenario-row"><span>Membership</span><span>$50</span></div>
              <div className="pricing-scenario-row is-saving"><span>10% off AgentReadyPro</span><span>−$48</span></div>
              <div className="pricing-scenario-row is-saving"><span>10% off PowerCreator</span><span>−$10</span></div>
              <div className="pricing-scenario-row is-saving"><span>20% off Volume audio</span><span>−$20+</span></div>
              <div className="pricing-scenario-row is-total"><span>Net cost of membership</span><span>−$28</span></div>
              <div className="pricing-payback is-positive">More than pays for itself</div>
            </div>
          </div>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="pricing-faq-section">
        <h2 className="pricing-faq-title">Questions</h2>
        {FAQS.map((item, i) => {
          const isOpen = openFaq === i;
          return (
            <div key={i} className={`pricing-faq-item${isOpen ? ' is-open' : ''}`}>
              <button
                type="button"
                className="pricing-faq-q"
                aria-expanded={isOpen}
                onClick={() => setOpenFaq(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="pricing-faq-q-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="pricing-faq-a" role="region">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <Footer />

      <WaitlistOverlay
        open={waitlist.open}
        eyebrow={waitlist.eyebrow}
        onClose={closeWaitlist}
      />
    </main>
  );
}
