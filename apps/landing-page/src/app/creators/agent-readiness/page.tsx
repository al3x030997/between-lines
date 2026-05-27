'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import { WaitlistOverlay } from '../../v8/WaitlistForm';
import Footer from '../../v8/sections/Footer';

const AGENTREADY_CSS = `
.ar-root {
  --ar-ease: var(--bl-ease);
  --ar-paper: #FBF9F4;
  --ar-rule: rgba(14, 14, 12, 0.10);
  --ar-rule-strong: rgba(14, 14, 12, 0.18);
  min-height: 100vh;
  background: var(--bl-surface);
  color: var(--bl-ink);
  font-family: var(--bl-font-body);
  font-feature-settings: "kern", "liga", "calt";
  -webkit-font-smoothing: antialiased;
}

/* === nav (mirrors /pricing) === */
.ar-nav {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 3.5vw, 56px);
  border-bottom: 1px solid var(--ar-rule);
  background: var(--bl-surface);
  color: var(--bl-ink);
}
.ar-brand {
  display: inline-flex;
  align-items: baseline;
  color: var(--bl-ink);
  text-decoration: none;
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.02em;
  font-variation-settings: 'wdth' 95;
}
.ar-brand-dot {
  color: var(--bl-accent);
  padding: 0 4px;
  font-weight: 800;
  transform: translateY(-1px);
}
.ar-nav-left {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 38px);
}
.ar-nav-links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 24px);
  font-family: var(--bl-font-eyebrow);
}
.ar-nav-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--bl-ink);
  text-decoration: none;
  padding: 4px 0;
  position: relative;
  transition: color 200ms ease;
}
.ar-nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--bl-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms var(--ar-ease);
}
.ar-nav-link:hover { color: var(--bl-accent); }
.ar-nav-link:hover::after { transform: scaleX(1); }
.ar-nav-link.is-active { color: var(--bl-accent); }
.ar-nav-link.is-active::after { transform: scaleX(1); }
.ar-nav-cta {
  appearance: none;
  border: 0;
  background: var(--bl-ink);
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
.ar-nav-cta:hover,
.ar-nav-cta:focus-visible {
  background: var(--bl-accent);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(14, 14, 12, 0.16);
  outline: none;
}
@media (max-width: 760px) {
  .ar-nav-links { display: none; }
}

/* Hover dropdown for nav groups (Readers, Creators) */
.ar-nav-group {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.ar-nav-group::before {
  content: '';
  position: absolute;
  left: -12px;
  right: -12px;
  top: 100%;
  height: 18px;
  pointer-events: none;
}
.ar-nav-group:hover::before,
.ar-nav-group:focus-within::before {
  pointer-events: auto;
}
.ar-nav-dropdown {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  min-width: 232px;
  background: var(--bl-surface);
  border: 1px solid rgba(14, 14, 12, 0.08);
  border-radius: 14px;
  padding: 8px;
  box-shadow:
    0 18px 40px -16px rgba(14, 14, 12, 0.22),
    0 8px 16px -10px rgba(14, 14, 12, 0.14);
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translate(-50%, -6px);
  transition:
    opacity 200ms var(--ar-ease),
    transform 220ms var(--ar-ease),
    visibility 200ms linear;
  z-index: 10;
}
.ar-nav-group:hover .ar-nav-dropdown,
.ar-nav-group:focus-within .ar-nav-dropdown {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  transform: translate(-50%, 0);
}
.ar-nav-sub {
  display: block;
  padding: 9px 14px;
  font-family: var(--bl-font-body);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--bl-ink);
  text-decoration: none;
  text-transform: none;
  border-radius: 8px;
  white-space: nowrap;
  transition: background 160ms ease, color 160ms ease, transform 160ms var(--ar-ease);
}
.ar-nav-sub:hover,
.ar-nav-sub:focus-visible {
  background: var(--bl-accent-soft);
  color: var(--bl-accent-strong);
  transform: translateX(2px);
  outline: none;
}
@media (max-width: 760px) {
  .ar-nav-dropdown { display: none; }
}

/* === hero === */
.ar-hero {
  position: relative;
  text-align: center;
  padding: clamp(56px, 9vh, 104px) clamp(20px, 4vw, 40px) clamp(36px, 5vh, 56px);
  max-width: 780px;
  margin: 0 auto;
  isolation: isolate;
}
.ar-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(60% 50% at 50% 0%, var(--bl-accent-soft) 0%, transparent 70%);
  pointer-events: none;
}
.ar-announce {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-accent);
  background: var(--bl-accent-soft);
  border: 0.5px solid rgba(31, 122, 62, 0.28);
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 22px;
  animation: ar-rise 600ms var(--ar-ease) both;
}
.ar-announce-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--bl-accent);
  box-shadow: 0 0 0 4px rgba(31, 122, 62, 0.12);
}
.ar-hero-title {
  margin: 0 0 22px;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 90, 'opsz' 96;
  font-size: clamp(40px, 6.2vw, 76px);
  line-height: 1.0;
  letter-spacing: -0.04em;
  color: var(--bl-ink);
  text-wrap: balance;
  animation: ar-rise 700ms var(--ar-ease) 60ms both;
}
.ar-hero-title em {
  display: block;
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60, 'wght' 420;
  color: var(--bl-accent);
  letter-spacing: -0.02em;
  margin-top: 4px;
}
.ar-hero-sub {
  margin: 0 auto 32px;
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(16px, 1.45vw, 19px);
  line-height: 1.65;
  color: rgba(14, 14, 12, 0.62);
  max-width: 56ch;
  text-wrap: pretty;
  animation: ar-rise 700ms var(--ar-ease) 130ms both;
}
.ar-hero-ctas {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  animation: ar-rise 700ms var(--ar-ease) 220ms both;
}
.ar-cta {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 14px 26px;
  border-radius: 12px;
  cursor: pointer;
  text-decoration: none;
  appearance: none;
  border: 0;
  transition: transform 200ms var(--ar-ease), background 200ms var(--ar-ease),
              color 200ms var(--ar-ease), box-shadow 220ms var(--ar-ease);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.ar-cta-primary {
  background: var(--bl-ink);
  color: #f6f1e3;
  box-shadow: 0 8px 22px rgba(14, 14, 12, 0.16);
}
.ar-cta-primary:hover,
.ar-cta-primary:focus-visible {
  background: var(--bl-accent);
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(31, 122, 62, 0.28);
  outline: none;
}
.ar-cta-ghost {
  background: transparent;
  color: var(--bl-ink);
  border: 1px solid var(--ar-rule-strong);
}
.ar-cta-ghost:hover,
.ar-cta-ghost:focus-visible {
  background: var(--bl-ink);
  color: #f6f1e3;
  border-color: var(--bl-ink);
  transform: translateY(-2px);
  outline: none;
}
.ar-hero-note {
  margin-top: 18px;
  font-family: var(--bl-font-body);
  font-size: 12px;
  color: rgba(14, 14, 12, 0.46);
  letter-spacing: 0.02em;
  animation: ar-rise 700ms var(--ar-ease) 320ms both;
}
.ar-hero-note span { color: var(--bl-accent); }

/* === two paths === */
.ar-paths {
  max-width: 980px;
  margin: 0 auto clamp(16px, 2vh, 24px);
  padding: 0 clamp(20px, 4vw, 40px);
}
.ar-paths-card {
  background: var(--bl-surface);
  border: 1px solid var(--ar-rule);
  border-radius: 22px;
  padding: clamp(26px, 3vw, 36px);
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 0;
  box-shadow:
    0 1px 0 rgba(14, 14, 12, 0.02),
    0 18px 40px -28px rgba(14, 14, 12, 0.18);
}
.ar-path {
  padding: 6px clamp(18px, 3vw, 36px);
}
.ar-path:first-of-type { padding-left: 0; }
.ar-path:last-of-type { padding-right: 0; }
.ar-path-divider {
  background: linear-gradient(180deg, transparent, var(--ar-rule-strong) 25%, var(--ar-rule-strong) 75%, transparent);
}
.ar-path-glyph {
  font-family: var(--bl-font-serif);
  font-variation-settings: 'opsz' 144, 'SOFT' 30;
  font-style: italic;
  font-size: 38px;
  line-height: 1;
  color: var(--bl-accent);
  margin-bottom: 14px;
  letter-spacing: -0.02em;
}
.ar-path-glyph.is-diy { color: var(--bl-ink); }
.ar-path-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(14, 14, 12, 0.5);
  margin-bottom: 8px;
}
.ar-path-title {
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-variation-settings: 'wdth' 92, 'opsz' 36;
  font-size: 19px;
  letter-spacing: -0.01em;
  color: var(--bl-ink);
  margin-bottom: 8px;
}
.ar-path-desc {
  font-family: var(--bl-font-body);
  font-size: 14px;
  line-height: 1.65;
  color: rgba(14, 14, 12, 0.66);
  text-wrap: pretty;
}
.ar-paths-coda {
  text-align: center;
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: 14px;
  color: rgba(14, 14, 12, 0.5);
  margin-top: 18px;
}
@media (max-width: 720px) {
  .ar-paths-card { grid-template-columns: 1fr; }
  .ar-path { padding: 18px 0; }
  .ar-path:first-of-type { padding-top: 0; }
  .ar-path:last-of-type { padding-bottom: 0; }
  .ar-path-divider { height: 1px; background: var(--ar-rule-strong); }
}

/* === free guide === */
.ar-guide {
  max-width: 980px;
  margin: clamp(32px, 5vh, 56px) auto 0;
  padding: 0 clamp(20px, 4vw, 40px);
}
.ar-guide-card {
  background: var(--bl-accent-soft);
  border: 1px solid rgba(31, 122, 62, 0.22);
  border-radius: 22px;
  padding: clamp(28px, 3.5vw, 40px) clamp(28px, 3.5vw, 44px);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: clamp(20px, 4vw, 40px);
  align-items: center;
  position: relative;
  overflow: hidden;
}
.ar-guide-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-accent-strong);
  margin-bottom: 10px;
}
.ar-guide-title {
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-variation-settings: 'wdth' 92, 'opsz' 48;
  font-size: clamp(22px, 2.3vw, 28px);
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--bl-ink);
  margin-bottom: 10px;
}
.ar-guide-desc {
  font-family: var(--bl-font-body);
  font-size: 14px;
  line-height: 1.7;
  color: rgba(14, 14, 12, 0.66);
  max-width: 56ch;
  margin-bottom: 14px;
}
.ar-guide-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ar-guide-tag {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  border: 0.5px solid rgba(31, 122, 62, 0.22);
  color: var(--bl-accent-strong);
}
.ar-guide-right {
  text-align: center;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.ar-guide-mark {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  font-size: 56px;
  line-height: 1;
  color: var(--bl-accent);
  letter-spacing: -0.04em;
}
.ar-guide-dl {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: var(--bl-ink);
  color: #f6f1e3;
  padding: 11px 22px;
  border-radius: 10px;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  white-space: nowrap;
  transition: background 200ms var(--ar-ease), transform 200ms var(--ar-ease);
}
.ar-guide-dl:hover {
  background: var(--bl-accent-strong);
  transform: translateY(-1px);
}
.ar-guide-share-row {
  display: flex;
  gap: 6px;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(14, 14, 12, 0.55);
}
.ar-guide-share {
  background: rgba(255, 255, 255, 0.7);
  border: 0.5px solid rgba(14, 14, 12, 0.1);
  border-radius: 8px;
  padding: 4px 10px;
  text-decoration: none;
  color: inherit;
  transition: background 160ms ease;
}
.ar-guide-share:hover { background: #fff; color: var(--bl-accent); }
@media (max-width: 720px) {
  .ar-guide-card { grid-template-columns: 1fr; text-align: left; }
  .ar-guide-right { align-items: flex-start; text-align: left; }
}

/* === features === */
.ar-features {
  max-width: 980px;
  margin: clamp(48px, 7vh, 80px) auto 0;
  padding: 0 clamp(20px, 4vw, 40px);
}
.ar-section-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(14, 14, 12, 0.5);
  text-align: center;
  margin-bottom: 28px;
}
.ar-section-eyebrow strong { color: var(--bl-accent); }
.ar-features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
@media (max-width: 720px) {
  .ar-features-grid { grid-template-columns: 1fr; }
}
.ar-feature {
  background: var(--bl-surface);
  border: 1px solid var(--ar-rule);
  border-radius: 16px;
  padding: clamp(22px, 2.6vw, 28px) clamp(22px, 2.6vw, 30px);
  display: flex;
  gap: 22px;
  align-items: flex-start;
  transition: transform 240ms var(--ar-ease), box-shadow 240ms var(--ar-ease),
              border-color 240ms var(--ar-ease);
}
.ar-feature:hover {
  transform: translateY(-2px);
  border-color: rgba(31, 122, 62, 0.32);
  box-shadow: 0 14px 32px -16px rgba(14, 14, 12, 0.18);
}
.ar-feature-num {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-variation-settings: 'opsz' 144, 'SOFT' 80;
  font-size: 44px;
  line-height: 0.9;
  color: var(--bl-accent);
  flex-shrink: 0;
  width: 36px;
  letter-spacing: -0.04em;
  opacity: 0.85;
}
.ar-feature-title {
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-variation-settings: 'wdth' 92, 'opsz' 36;
  font-size: 16px;
  letter-spacing: -0.01em;
  color: var(--bl-ink);
  margin-bottom: 6px;
}
.ar-feature-desc {
  font-family: var(--bl-font-body);
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(14, 14, 12, 0.64);
  margin-bottom: 12px;
  text-wrap: pretty;
}
.ar-feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.ar-tag {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 3px 9px;
  border-radius: 10px;
}
.ar-tag-ai { background: var(--bl-accent-soft); color: var(--bl-accent-strong); }
.ar-tag-diy {
  background: rgba(14, 14, 12, 0.06);
  color: rgba(14, 14, 12, 0.7);
}
.ar-tag-free {
  background: transparent;
  color: rgba(14, 14, 12, 0.5);
  border: 0.5px solid var(--ar-rule-strong);
}

/* === compare === */
.ar-compare {
  max-width: 980px;
  margin: clamp(48px, 7vh, 80px) auto 0;
  padding: 0 clamp(20px, 4vw, 40px);
}
.ar-compare-card {
  background: var(--bl-surface);
  border: 1px solid var(--ar-rule);
  border-radius: 22px;
  overflow: hidden;
  box-shadow:
    0 1px 0 rgba(14, 14, 12, 0.02),
    0 20px 50px -32px rgba(14, 14, 12, 0.22);
}
.ar-compare-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
}
.ar-compare-head {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 18px clamp(16px, 2vw, 24px);
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid var(--ar-rule);
}
.ar-compare-head.is-feature { color: rgba(14, 14, 12, 0.5); }
.ar-compare-head.is-free {
  background: var(--bl-accent-soft);
  color: var(--bl-accent-strong);
}
.ar-compare-head.is-pro {
  background: var(--bl-ink);
  color: var(--bl-footer-bg);
  border-bottom-color: var(--bl-ink);
  position: relative;
}
.ar-compare-head.is-pro::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  mix-blend-mode: overlay;
  opacity: 0.06;
  pointer-events: none;
}
.ar-compare-cell {
  padding: 14px clamp(16px, 2vw, 24px);
  font-family: var(--bl-font-body);
  font-size: 13px;
  color: rgba(14, 14, 12, 0.6);
  border-bottom: 1px solid var(--ar-rule);
  display: flex;
  align-items: center;
}
.ar-compare-cell.is-feature-name {
  color: var(--bl-ink);
  font-weight: 500;
}
.ar-compare-cell.is-free { background: rgba(31, 122, 62, 0.025); }
.ar-compare-cell.is-pro {
  background: var(--ar-paper);
  color: rgba(14, 14, 12, 0.72);
}
.ar-compare-grid > :nth-last-child(-n+3) { border-bottom: none; }
.ar-mark-yes {
  color: var(--bl-accent);
  font-weight: 700;
  font-size: 15px;
}
.ar-mark-no {
  color: rgba(14, 14, 12, 0.22);
  font-size: 15px;
}
.ar-mark-gold {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--bl-accent-strong);
}
@media (max-width: 720px) {
  .ar-compare-grid { grid-template-columns: 1.4fr 0.8fr 0.8fr; font-size: 12px; }
  .ar-compare-cell { padding: 12px 12px; }
  .ar-compare-head { padding: 14px 12px; }
}

/* === price card === */
.ar-price {
  max-width: 980px;
  margin: clamp(48px, 7vh, 80px) auto 0;
  padding: 0 clamp(20px, 4vw, 40px);
}
.ar-price-card {
  background: var(--bl-footer-bg);
  border-radius: 24px;
  padding: clamp(32px, 4vw, 48px);
  display: grid;
  grid-template-columns: 1.5fr auto;
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 1px 0 rgba(14, 14, 12, 0.04),
    0 24px 60px -28px rgba(14, 14, 12, 0.32);
}
.ar-price-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  mix-blend-mode: overlay;
  opacity: 0.08;
}
.ar-price-card > * { position: relative; }
.ar-price-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(14, 14, 12, 0.68);
  margin-bottom: 10px;
}
.ar-price-title {
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-variation-settings: 'wdth' 88, 'opsz' 96;
  font-size: clamp(30px, 3.6vw, 44px);
  letter-spacing: -0.035em;
  line-height: 1.0;
  color: var(--bl-ink);
  margin-bottom: 16px;
  text-wrap: balance;
}
.ar-price-title em {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  letter-spacing: -0.02em;
}
.ar-price-desc {
  font-family: var(--bl-font-body);
  font-size: 14px;
  line-height: 1.7;
  color: rgba(14, 14, 12, 0.74);
  max-width: 50ch;
  margin-bottom: 14px;
}
.ar-price-member {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--bl-ink);
  background: rgba(14, 14, 12, 0.08);
  border: 0.5px solid rgba(14, 14, 12, 0.18);
  border-radius: 999px;
  padding: 6px 12px;
}
.ar-price-right {
  text-align: right;
  min-width: 220px;
}
.ar-price-tier-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(14, 14, 12, 0.55);
  margin-bottom: 4px;
}
.ar-price-free {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  font-size: 30px;
  color: var(--bl-ink);
  line-height: 1;
}
.ar-price-foot {
  font-family: var(--bl-font-body);
  font-size: 11px;
  color: rgba(14, 14, 12, 0.6);
  margin-top: 4px;
  margin-bottom: 14px;
}
.ar-price-divider {
  border: none;
  height: 1px;
  background: rgba(14, 14, 12, 0.18);
  margin: 14px 0;
}
.ar-price-pro {
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 88, 'opsz' 96;
  font-size: 52px;
  line-height: 1;
  color: var(--bl-ink);
  letter-spacing: -0.045em;
}
.ar-price-pro .ar-price-period {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(14, 14, 12, 0.6);
  display: block;
  margin-top: 4px;
  margin-bottom: 14px;
  text-transform: none;
}
.ar-price-cta {
  display: block;
  width: 100%;
  appearance: none;
  border: 0;
  padding: 13px 22px;
  border-radius: 12px;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background 200ms var(--ar-ease), transform 200ms var(--ar-ease);
}
.ar-price-cta.is-ghost {
  background: rgba(14, 14, 12, 0.06);
  color: var(--bl-ink);
  margin-bottom: 8px;
}
.ar-price-cta.is-ghost:hover { background: rgba(14, 14, 12, 0.12); }
.ar-price-cta.is-primary {
  background: var(--bl-ink);
  color: var(--bl-footer-bg);
}
.ar-price-cta.is-primary:hover {
  transform: translateY(-2px);
  background: var(--bl-accent-strong);
  color: var(--bl-footer-bg);
}
@media (max-width: 720px) {
  .ar-price-card { grid-template-columns: 1fr; }
  .ar-price-right { text-align: left; min-width: 0; }
}

/* === early access form === */
.ar-form-wrap {
  max-width: 620px;
  margin: clamp(40px, 6vh, 64px) auto clamp(40px, 6vh, 64px);
  padding: 0 clamp(20px, 4vw, 40px);
  scroll-margin-top: 92px;
}
.ar-form-card {
  background: var(--bl-surface);
  border: 1px solid var(--ar-rule);
  border-radius: 22px;
  padding: clamp(32px, 4vw, 44px);
  text-align: center;
  box-shadow:
    0 1px 0 rgba(14, 14, 12, 0.02),
    0 20px 50px -28px rgba(14, 14, 12, 0.18);
}
.ar-form-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin-bottom: 12px;
}
.ar-form-title {
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-variation-settings: 'wdth' 92, 'opsz' 48;
  font-size: clamp(24px, 2.6vw, 32px);
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: var(--bl-ink);
  margin-bottom: 10px;
  text-wrap: balance;
}
.ar-form-title em {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  color: var(--bl-accent);
}
.ar-form-sub {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(14, 14, 12, 0.58);
  max-width: 44ch;
  margin: 0 auto 24px;
}
.ar-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}
.ar-input,
.ar-select {
  width: 100%;
  font-family: var(--bl-font-body);
  font-size: 14px;
  font-weight: 500;
  padding: 12px 14px;
  border: 1px solid var(--ar-rule-strong);
  border-radius: 10px;
  background: var(--ar-paper);
  color: var(--bl-ink);
  outline: none;
  transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
}
.ar-input::placeholder { color: rgba(14, 14, 12, 0.42); }
.ar-select {
  appearance: none;
  cursor: pointer;
  color: rgba(14, 14, 12, 0.72);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%230e0e0c' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}
.ar-input:focus,
.ar-select:focus {
  border-color: var(--bl-accent);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(31, 122, 62, 0.12);
}
.ar-form-honey {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.ar-submit {
  margin-top: 6px;
  width: 100%;
  padding: 14px;
  border: 0;
  border-radius: 12px;
  background: var(--bl-ink);
  color: #f6f1e3;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms var(--ar-ease), transform 200ms var(--ar-ease),
              box-shadow 200ms var(--ar-ease);
}
.ar-submit:hover:not(:disabled),
.ar-submit:focus-visible {
  background: var(--bl-accent);
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(31, 122, 62, 0.28);
  outline: none;
}
.ar-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.ar-form-success {
  margin-top: 16px;
  font-family: var(--bl-font-body);
  font-size: 13.5px;
  color: var(--bl-accent-strong);
  background: var(--bl-accent-soft);
  border: 0.5px solid rgba(31, 122, 62, 0.22);
  padding: 12px 16px;
  border-radius: 10px;
  text-align: center;
  animation: ar-rise 320ms var(--ar-ease) both;
}
.ar-form-error {
  margin-top: 14px;
  font-family: var(--bl-font-body);
  font-size: 13px;
  color: #b53a2a;
  background: rgba(181, 58, 42, 0.06);
  border: 0.5px solid rgba(181, 58, 42, 0.22);
  padding: 10px 14px;
  border-radius: 10px;
  text-align: center;
}
.ar-form-fineprint {
  margin-top: 14px;
  font-family: var(--bl-font-body);
  font-size: 11px;
  color: rgba(14, 14, 12, 0.42);
  letter-spacing: 0.02em;
}

/* === pull quote === */
.ar-pull {
  max-width: 720px;
  margin: clamp(24px, 4vh, 40px) auto clamp(56px, 8vh, 88px);
  padding: 0 clamp(20px, 4vw, 40px);
  text-align: center;
}
.ar-pull p {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  font-size: clamp(16px, 1.6vw, 19px);
  line-height: 1.7;
  color: rgba(14, 14, 12, 0.5);
}
.ar-pull strong {
  color: var(--bl-ink);
  font-style: normal;
  font-family: var(--bl-font-display);
  font-weight: 600;
  font-variation-settings: 'wdth' 92, 'opsz' 36;
}

/* === reveal === */
@keyframes ar-rise {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.ar-root :where(button, a, input, select):focus-visible {
  outline: 2px solid var(--bl-accent);
  outline-offset: 3px;
}
`;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const GENRES = [
  'Literary Fiction',
  'Commercial Fiction',
  'Historical Fiction',
  'Mystery / Thriller',
  'Sci-fi / Fantasy',
  'Romance',
  'Young Adult',
  "Children's Fiction",
  'Non-fiction',
  'Memoir',
  'Poetry',
  'Other',
] as const;

const STAGES = [
  'Drafting my manuscript',
  'Editing my manuscript',
  'Ready to query now',
  'Currently querying',
  'Previously queried — trying again',
] as const;

const FEATURES = [
  {
    n: 1,
    title: 'Build your agent list',
    desc: "See if an agent is open to submissions, what's on their wishlist right now, and their recent deals. Research matched to your genre and chapter samples so you build the right list — not just any list.",
    tags: [
      { label: 'AI-assisted', cls: 'ar-tag-ai' },
      { label: 'DIY', cls: 'ar-tag-diy' },
    ],
  },
  {
    n: 2,
    title: 'A query letter in your voice',
    desc: "Generate a query letter that sounds like you — not a template. Built from your manuscript, your bio, and the best practices. Personalised opening paragraph tailored to each agent's wishlist. Choose how much of the writing is yours.",
    tags: [
      { label: 'AI-assisted', cls: 'ar-tag-ai' },
      { label: 'DIY template', cls: 'ar-tag-diy' },
    ],
  },
  {
    n: 3,
    title: 'Synopsis — in no time',
    desc: 'Upload your manuscript and generate a clean, accurate 1-page or 2-page synopsis that agents actually want to read. Edit as much or as little as you like.',
    tags: [{ label: 'AI-assisted', cls: 'ar-tag-ai' }],
  },
  {
    n: 4,
    title: 'Discover your comp titles',
    desc: "Comps are the hardest part of querying. AgentReadyPro finds recent, relevant comparable books matched to your manuscript's tone, themes, and market position. No more guessing. No more outdated comps.",
    tags: [
      { label: 'AI-assisted', cls: 'ar-tag-ai' },
      { label: 'DIY', cls: 'ar-tag-diy' },
    ],
  },
  {
    n: 5,
    title: 'A/B test your query',
    desc: 'Test two versions of your query letter against each other. Track which version gets requests, which gets passes. Refine based on real response data — not guesswork.',
    tags: [{ label: 'AI-assisted', cls: 'ar-tag-ai' }],
  },
  {
    n: 6,
    title: 'Learn the industry',
    desc: 'Best practices for querying. Novel lengths by genre. Query timelines. Submission guidelines. Monetisation paths. And the terms every writer needs to know — from slush pile to MSWL.',
    tags: [
      { label: 'Free — AgentReady', cls: 'ar-tag-free' },
      { label: 'Extended — Pro', cls: 'ar-tag-ai' },
    ],
  },
];

const COMPARE: { feature: string; free: 'yes' | 'no'; pro: 'yes' | 'gold'; goldText?: string }[] = [
  { feature: 'Build and manage agent lists', free: 'yes', pro: 'yes' },
  { feature: 'Track queries — who, when, status', free: 'yes', pro: 'yes' },
  { feature: 'Upload and store documents', free: 'yes', pro: 'yes' },
  { feature: 'Free industry guides', free: 'yes', pro: 'yes' },
  { feature: 'Agent open or closed status', free: 'no', pro: 'yes' },
  { feature: 'Agent wishlist matching', free: 'no', pro: 'yes' },
  { feature: 'AI query letter — your voice', free: 'no', pro: 'yes' },
  { feature: 'DIY query template', free: 'no', pro: 'yes' },
  { feature: 'Synopsis — 1-page and 2-page', free: 'no', pro: 'yes' },
  { feature: 'Comparable title discovery', free: 'no', pro: 'yes' },
  { feature: 'A/B query testing', free: 'no', pro: 'yes' },
  { feature: 'Response analysis', free: 'no', pro: 'yes' },
  { feature: 'Response time indicators', free: 'no', pro: 'yes' },
  { feature: 'Full submission package — 5 documents', free: 'no', pro: 'yes' },
  { feature: 'BetweenReads Member discount', free: 'no', pro: 'gold', goldText: '10% off with membership' },
];

function CheckMark() {
  return <span className="ar-mark-yes" aria-label="Included">✓</span>;
}
function DashMark() {
  return <span className="ar-mark-no" aria-label="Not included">—</span>;
}

export default function AgentReadinessPage() {
  const [waitlist, setWaitlist] = useState<{ open: boolean; eyebrow?: string }>({ open: false });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [genre, setGenre] = useState('');
  const [stage, setStage] = useState('');
  const [honey, setHoney] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const openWaitlist = (eyebrow?: string) => setWaitlist({ open: true, eyebrow });
  const closeWaitlist = () => setWaitlist({ open: false });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          consent: true,
          website: honey,
        }),
      });
      const ok = res.ok;
      track('agentready_signup', {
        ok,
        hasName: name.trim().length > 0,
        hasGenre: genre.length > 0,
        hasStage: stage.length > 0,
      });
      if (genre || stage) {
        track('agentready_signup_context', { genre: genre || 'unspecified', stage: stage || 'unspecified' });
      }
      if (!ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 429) {
          setStatus('error');
          setErrorMsg("Slow down — you've tried a few times. Try again in a minute.");
          return;
        }
        setStatus('error');
        setErrorMsg(body?.error === 'invalid_input' ? 'That email looked off — try again?' : "Something went wrong. We're on it.");
        return;
      }
      setStatus('success');
      setName('');
      setEmail('');
      setGenre('');
      setStage('');
    } catch {
      track('agentready_signup', { ok: false, error: 'network' });
      setStatus('error');
      setErrorMsg("We couldn't reach the server. Check your connection and try again.");
    }
  }

  return (
    <main className="ar-root">
      <style dangerouslySetInnerHTML={{ __html: AGENTREADY_CSS }} />

      {/* === nav === */}
      <nav className="ar-nav">
        <div className="ar-nav-left">
          <Link className="ar-brand" href="/" aria-label="BetweenReads, home">
            <span>between</span>
            <span className="ar-brand-dot">.</span>
            <span>reads</span>
          </Link>
          <div className="ar-nav-links">
            <Link className="ar-nav-link" href="/betweenlines">BetweenLines</Link>
            <div className="ar-nav-group">
              <Link className="ar-nav-link" href="/readers">Readers</Link>
              <div className="ar-nav-dropdown" role="menu" aria-label="Readers sub-pages">
                <Link className="ar-nav-sub" href="/readers/read" role="menuitem">Read</Link>
                <Link className="ar-nav-sub" href="/readers/listen" role="menuitem">Listen</Link>
                <Link className="ar-nav-sub" href="/readers/kids" role="menuitem">Kids</Link>
              </div>
            </div>
            <div className="ar-nav-group">
              <Link className="ar-nav-link is-active" href="/creators" aria-current="page">Creators</Link>
              <div className="ar-nav-dropdown" role="menu" aria-label="Creators sub-pages">
                <Link className="ar-nav-sub" href="/creators/write-on-betweenreads" role="menuitem">Write on BetweenReads</Link>
                <Link className="ar-nav-sub" href="/creators/upload-illustrations" role="menuitem">Upload Illustrations</Link>
                <Link className="ar-nav-sub" href="/creators/securebetareads" role="menuitem">Secure BetaReads</Link>
                <Link className="ar-nav-sub" href="/creators/agent-readiness" role="menuitem">Agent Readiness</Link>
              </div>
            </div>
            <Link className="ar-nav-link" href="/pricing">Pricing</Link>
            <Link className="ar-nav-link" href="/faq">FAQ</Link>
          </div>
        </div>
        <button type="button" className="ar-nav-cta" onClick={() => openWaitlist('AgentReady')}>
          Join free
        </button>
      </nav>

      {/* === hero === */}
      <section className="ar-hero">
        <span className="ar-announce">
          <span className="ar-announce-dot" aria-hidden />
          Now launching
        </span>
        <h1 className="ar-hero-title">
          Query smarter.
          <em>Get to yes faster.</em>
        </h1>
        <p className="ar-hero-sub">
          AgentReadyPro helps writers research agents, build a personal query, and submit smarter — all
          from one place. Research, build, match, query. Your manuscript&apos;s journey, in one tool.
        </p>
        <div className="ar-hero-ctas">
          <a className="ar-cta ar-cta-primary" href="#early-access">
            Sign up for early access
          </a>
          <button type="button" className="ar-cta ar-cta-ghost" onClick={() => openWaitlist('AgentReady')}>
            Start building free
          </button>
        </div>
        <div className="ar-hero-note">
          AgentReady is free forever <span>·</span> AgentReadyPro — sign up for early access below
        </div>
      </section>

      {/* === two paths === */}
      <section className="ar-paths">
        <div className="ar-paths-card">
          <div className="ar-path">
            <div className="ar-path-glyph">α</div>
            <div className="ar-path-label">AI-assisted path</div>
            <div className="ar-path-title">Let us do the heavy lifting</div>
            <p className="ar-path-desc">
              Use our native AI — tailored to your voice and your manuscript — to research agents and
              generate your query, synopsis, and submission package. Choose how much help you take.
            </p>
          </div>
          <div className="ar-path-divider" aria-hidden />
          <div className="ar-path">
            <div className="ar-path-glyph is-diy">ω</div>
            <div className="ar-path-label">DIY path</div>
            <div className="ar-path-title">Your query, your way</div>
            <p className="ar-path-desc">
              Not keen on AI? Use our templatised plan to be guided step-by-step to a complete DIY
              submission package. Industry best practices built in — you write every word.
            </p>
          </div>
        </div>
        <div className="ar-paths-coda">
          Whichever path you choose — we&apos;re here for you, as much or as little as you need.
        </div>
      </section>

      {/* === free guide === */}
      <section className="ar-guide">
        <div className="ar-guide-card">
          <div>
            <div className="ar-guide-eyebrow">✦ Free resource</div>
            <h2 className="ar-guide-title">The BetweenReads Agent Guide</h2>
            <p className="ar-guide-desc">
              Everything a writer needs to understand the querying world — in one free guide.
              Query best practices, novel lengths by genre, submission guidelines, comps, timelines,
              monetisation paths, and every industry term from slush pile to MSWL. Free to download,
              free to share.
            </p>
            <div className="ar-guide-tags">
              <span className="ar-guide-tag">Query best practices</span>
              <span className="ar-guide-tag">Novel lengths by genre</span>
              <span className="ar-guide-tag">Submission guidelines</span>
              <span className="ar-guide-tag">Comps explained</span>
              <span className="ar-guide-tag">Query timelines</span>
              <span className="ar-guide-tag">Industry terms</span>
              <span className="ar-guide-tag">Monetisation paths</span>
            </div>
          </div>
          <div className="ar-guide-right">
            <div className="ar-guide-mark" aria-hidden>¶</div>
            <button type="button" className="ar-guide-dl" onClick={() => openWaitlist('Agent Guide')}>
              Download free
            </button>
            <div className="ar-guide-share-row">
              <a className="ar-guide-share" href="#" aria-label="Share on X">𝕏 Share</a>
              <a className="ar-guide-share" href="#" aria-label="Share on LinkedIn">in Share</a>
              <a className="ar-guide-share" href="#" aria-label="Share by email">✉ Email</a>
            </div>
          </div>
        </div>
      </section>

      {/* === features === */}
      <section className="ar-features">
        <div className="ar-section-eyebrow">
          What <strong>AgentReadyPro</strong> does
        </div>
        <div className="ar-features-grid">
          {FEATURES.map((f) => (
            <article key={f.n} className="ar-feature">
              <div className="ar-feature-num">{f.n}</div>
              <div>
                <h3 className="ar-feature-title">{f.title}</h3>
                <p className="ar-feature-desc">{f.desc}</p>
                <div className="ar-feature-tags">
                  {f.tags.map((t) => (
                    <span key={t.label} className={`ar-tag ${t.cls}`}>
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* === compare === */}
      <section className="ar-compare">
        <div className="ar-section-eyebrow">
          Free vs <strong>Pro</strong>
        </div>
        <div className="ar-compare-card">
          <div className="ar-compare-grid">
            <div className="ar-compare-head is-feature">Feature</div>
            <div className="ar-compare-head is-free">AgentReady — Free</div>
            <div className="ar-compare-head is-pro">AgentReadyPro — $39.99/mo</div>
            {COMPARE.map((row) => (
              <div key={row.feature} style={{ display: 'contents' }}>
                <div className="ar-compare-cell is-feature-name">{row.feature}</div>
                <div className="ar-compare-cell is-free">
                  {row.free === 'yes' ? <CheckMark /> : <DashMark />}
                </div>
                <div className="ar-compare-cell is-pro">
                  {row.pro === 'gold' ? (
                    <span className="ar-mark-gold">{row.goldText}</span>
                  ) : (
                    <CheckMark />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === price card === */}
      <section className="ar-price">
        <div className="ar-price-card">
          <div>
            <div className="ar-price-eyebrow">AgentReadyPro</div>
            <h2 className="ar-price-title">
              Ready to <em>query?</em>
            </h2>
            <p className="ar-price-desc">
              Research agents. Build your package. Track every submission. Analyse every response.
              All from one place — built for writers by people who understand what it takes to get to yes.
            </p>
            <div className="ar-price-member">
              ✦ BetweenReads Members pay $35.99/mo — saving $48/year
            </div>
          </div>
          <div className="ar-price-right">
            <div className="ar-price-tier-label">AgentReady</div>
            <div className="ar-price-free">Free</div>
            <div className="ar-price-foot">Forever · start building today</div>
            <button type="button" className="ar-price-cta is-ghost" onClick={() => openWaitlist('AgentReady')}>
              Start free
            </button>
            <hr className="ar-price-divider" />
            <div className="ar-price-tier-label">AgentReadyPro</div>
            <div className="ar-price-pro">
              $39.99
              <span className="ar-price-period">per month · cancel anytime</span>
            </div>
            <a className="ar-price-cta is-primary" href="#early-access">
              Sign up for early access
            </a>
          </div>
        </div>
      </section>

      {/* === early access form === */}
      <section id="early-access" className="ar-form-wrap">
        <div className="ar-form-card">
          <div className="ar-form-eyebrow">✦ Early access</div>
          <h2 className="ar-form-title">
            Be the first to <em>query smarter.</em>
          </h2>
          <p className="ar-form-sub">
            Sign up for early access and we&apos;ll notify you the moment AgentReadyPro opens. Early
            access members get a 30-day free trial — double the standard.
          </p>
          <form className="ar-form" onSubmit={handleSubmit} noValidate>
            <input
              className="ar-input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              aria-label="Your display name"
            />
            <input
              className="ar-input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Your email address"
            />
            <select
              className="ar-select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              aria-label="My primary genre"
            >
              <option value="">My primary genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select
              className="ar-select"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              aria-label="Where I am in my writing journey"
            >
              <option value="">Where I am in my writing journey</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              className="ar-form-honey"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
              aria-hidden="true"
            />
            <button type="submit" className="ar-submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Signing you up…' : 'Sign up for early access'}
            </button>
            {status === 'success' && (
              <div className="ar-form-success" role="status">
                You&apos;re on the list. We&apos;ll be in touch — and your 30-day trial is waiting.
              </div>
            )}
            {status === 'error' && (
              <div className="ar-form-error" role="alert">
                {errorMsg}
              </div>
            )}
            <div className="ar-form-fineprint">
              No card required · cancel anytime · early access members get 30 days free
            </div>
          </form>
        </div>
      </section>

      {/* === pull quote === */}
      <div className="ar-pull">
        <p>
          &ldquo;Whichever path you choose, remember — <strong>we&apos;re here for you as a writer</strong>,
          supporting you as much or as little as you need.&rdquo;
        </p>
      </div>

      <Footer />

      <WaitlistOverlay
        open={waitlist.open}
        onClose={closeWaitlist}
        eyebrow={waitlist.eyebrow}
      />
    </main>
  );
}
