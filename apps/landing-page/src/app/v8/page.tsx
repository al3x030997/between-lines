'use client';

import { useEffect, useState } from 'react';
import IntakeHero, { type IntakeSubmit } from './IntakeHero';
import { WaitlistOverlay } from './WaitlistForm';
import EditorialSplit from './sections/EditorialSplit';
import type { StartTarget } from './sections/EditorialSplit';
import BookCarousel from './sections/BookCarousel';
import Footer from './sections/Footer';

const BANNER_MESSAGES: Record<string, string> = {
  gate: 'Your insider access has expired. Re-enter your email to receive a new link.',
  invalid: 'That insider link is invalid. Re-enter your email to receive a new one.',
  pending: 'We can’t find an active subscription for that link. Check your inbox for our confirmation email.',
  ratelimited: 'Too many attempts. Please try again in a few minutes.',
};

const EYEBROW_BY_TARGET: Record<StartTarget, string> = {
  reader: 'Ready to read',
  author: 'Ready to write',
  both: 'Discover and be discovered',
};

const V6_CSS = `
.v8-root {
  --v6-accent: #e94b36;
  --v6-accent-soft: rgba(233, 75, 54, 0.06);
  --v6-text: #0e0e0c;
  --v6-text-strong: #0e0e0c;
  --v6-text-muted: #14140f;
  --v6-surface: #ffffff;
  --v6-divider: rgba(14,14,12,0.18);
  --v6-stroke: rgba(255,255,255,0.85);
  --v6-ease: cubic-bezier(.22, 1, .36, 1);
  --v6-dur-fast: 180ms;
  --v6-dur-base: 240ms;
  --v6-dur-slow: 360ms;
  --bl-section-bg: #0B1733;
  --bl-section-fg: #F2EFE8;
  --bl-section-muted: #8A95B5;
  --bl-section-accent: #e94b36;
  --bl-section-divider: rgba(242,239,232,0.16);
  --bl-card-shadow: rgba(0,0,0,0.5);
  --bl-footer-bg: #ffffff;
  --bl-footer-fg: #0e0e0c;
  --bl-footer-muted: #6b6b66;
  --bl-footer-divider: rgba(14,14,12,0.1);
  --bl-footer-accent: #e94b36;
  min-height: 100vh;
  background: var(--v6-surface);
  font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
  font-optical-sizing: auto;
  color: var(--v6-text);
}
.v8-root.is-palette-forest {
  --v6-accent: #0A3A23;
  --v6-accent-soft: rgba(10, 58, 35, 0.08);
  --v6-text: #1a2a1f;
  --v6-text-strong: #0A3A23;
  --v6-text-muted: #2a3a2f;
  --v6-surface: #F5EDE0;
  --v6-divider: rgba(10,58,35,0.22);
  --v6-stroke: rgba(245,237,224,0.9);
  --bl-section-accent: #E5B100;
  --bl-footer-accent: #E5B100;
}
.v8-root.is-palette-pop {
  --v6-accent: #E63946;
  --v6-accent-soft: rgba(230, 57, 70, 0.12);
  --v6-text: #0a0a0a;
  --v6-text-strong: #0a0a0a;
  --v6-text-muted: #1a1a1a;
  --v6-surface: #FFE600;
  --v6-divider: rgba(10,10,10,0.32);
  --v6-stroke: rgba(255,230,0,0.95);
  --bl-section-accent: #E63946;
  --bl-footer-accent: #E63946;
}
.v8-root.is-palette-pop .v8-bg-scrim {
  background: linear-gradient(180deg, rgba(255,230,0,0.42) 0%, rgba(255,230,0,0.28) 50%, rgba(255,230,0,0.46) 100%);
}
.v8-root.is-palette-stranger {
  --v6-accent: #C5283D;
  --v6-accent-soft: rgba(197, 40, 61, 0.14);
  --v6-text: #0a0a0a;
  --v6-text-strong: #0a0a0a;
  --v6-text-muted: #1a1a1a;
  --v6-surface: #FFC700;
  --v6-divider: rgba(11,23,51,0.22);
  --v6-stroke: rgba(255,199,0,0.95);
  --bl-section-accent: #C5283D;
  --bl-footer-accent: #C5283D;
}
.v8-bg {
  position: absolute;
  inset: -40px;
  background: url('/v6-hero.jpg') center/cover no-repeat;
  filter: blur(6px) saturate(1.1);
  transform: scale(1.03);
  z-index: 0;
}
.v8-bg-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.36) 100%);
  z-index: 1;
  pointer-events: none;
}
.v8-root.is-palette-forest .v8-bg-scrim {
  background: linear-gradient(180deg, rgba(245,237,224,0.42) 0%, rgba(245,237,224,0.28) 50%, rgba(245,237,224,0.46) 100%);
}
.v8-bg-grain {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.v8-nav {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 3.5vw, 56px);
  border-bottom: 1px solid rgba(14,14,12,0.1);
  background: #ffffff;
  color: #0e0e0c;
}
.v8-brand {
  display: inline-flex;
  align-items: baseline;
  color: var(--v6-text-strong);
  text-decoration: none;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.02em;
  font-variation-settings: 'wdth' 95;
}
.v8-brand-dot {
  color: var(--v6-accent);
  padding: 0 4px;
  font-weight: 800;
  transform: translateY(-1px);
}
.v8-nav-meta {
  display: flex;
  align-items: center;
  gap: 22px;
  font-family: 'Bricolage Grotesque', sans-serif;
}
.v8-nav-issue {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--v6-accent);
}
.v8-nav-sep {
  width: 1px;
  height: 14px;
  background: var(--v6-divider);
}
.v8-nav-link {
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--v6-text-strong);
  text-decoration: none;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  transition: color 200ms ease;
}
.v8-nav-link:hover { color: var(--v6-accent); }

.v8-tweaks {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px;
  border-radius: 999px;
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(14,14,12,0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(14,14,12,0.08);
  font-family: 'Bricolage Grotesque', sans-serif;
}
.v8-tweaks-menu {
  position: relative;
}
.v8-tweaks-trigger {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 0;
  background: transparent;
  color: #0e0e0c;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 180ms ease, color 180ms ease;
  white-space: nowrap;
}
.v8-tweaks-trigger:hover,
.v8-tweaks-trigger:focus-visible {
  background: rgba(14,14,12,0.06);
  outline: none;
}
.v8-tweaks-trigger.is-open {
  background: #0e0e0c;
  color: #ffffff;
}
.v8-tweaks-trigger-label {
  opacity: 0.55;
  font-weight: 500;
}
.v8-tweaks-trigger.is-open .v8-tweaks-trigger-label { opacity: 0.7; }
.v8-tweaks-chevron {
  display: inline-block;
  font-size: 10px;
  transform: translateY(1px);
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
  opacity: 0.7;
}
.v8-tweaks-trigger.is-open .v8-tweaks-chevron { transform: translateY(1px) rotate(180deg); }
.v8-tweaks-panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(-6px);
  min-width: 180px;
  background: #ffffff;
  border: 1px solid rgba(14,14,12,0.1);
  border-radius: 14px;
  box-shadow: 0 18px 48px rgba(14,14,12,0.14);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease, transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.v8-tweaks-panel.is-open {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}
.v8-tweaks-option {
  appearance: none;
  border: 0;
  background: transparent;
  padding: 10px 14px;
  border-radius: 8px;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #0e0e0c;
  cursor: pointer;
  text-align: left;
  transition: background 160ms ease, color 160ms ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.v8-tweaks-option:hover { background: rgba(14,14,12,0.04); }
.v8-tweaks-option.is-active {
  color: #0e0e0c;
  font-weight: 600;
}
.v8-tweaks-option-check {
  opacity: 0;
  color: #0e0e0c;
  font-size: 12px;
  transition: opacity 160ms ease;
}
.v8-tweaks-option.is-active .v8-tweaks-option-check { opacity: 1; }

.v8-hero {
  position: relative;
  height: calc(100vh - 76px);
  overflow: hidden;
  background: var(--v6-surface);
}
.v8-stage {
  position: absolute;
  inset: 0;
  z-index: 3;
  overflow: hidden;
}
.v8-root.is-phase-questions .v8-hero {
  height: auto;
  min-height: calc(100vh - 76px);
  overflow: visible;
}
.v8-root.is-phase-questions .v8-stage {
  position: relative;
  inset: auto;
  overflow: visible;
}
.v8-root.is-phase-questions .v8-stage-inner {
  display: none;
}
.v8-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
.v8-region {
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.v8-region-fill {
  fill: rgba(233, 75, 54, 0);
  pointer-events: all;
}
.v8-region-box {
  fill: rgba(233, 75, 54, 0);
  stroke: transparent;
  stroke-width: 2.5;
  pointer-events: none;
  transition: stroke var(--v6-dur-base) var(--v6-ease), fill var(--v6-dur-base) var(--v6-ease);
}
.v8-region.is-hovered .v8-region-box {
  stroke: var(--v6-accent);
  fill: var(--v6-accent-soft);
}
.v8-region-label {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 104px;
  letter-spacing: -0.035em;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  fill: var(--v6-text-strong);
  paint-order: stroke fill;
  stroke: var(--v6-stroke);
  stroke-width: 6;
  stroke-linejoin: round;
  transition: fill var(--v6-dur-base) var(--v6-ease);
}
.v8-region-sub {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 22px;
  fill: var(--v6-text-muted);
  paint-order: stroke fill;
  stroke: var(--v6-stroke);
  stroke-width: 4;
  stroke-linejoin: round;
  opacity: 0;
  transition: fill var(--v6-dur-base) var(--v6-ease), opacity var(--v6-dur-base) var(--v6-ease);
}
.v8-region.is-hovered .v8-region-label,
.v8-region:focus-visible .v8-region-label { fill: var(--v6-accent); }
.v8-region.is-hovered .v8-region-sub,
.v8-region:focus-visible .v8-region-sub { fill: var(--v6-text-strong); opacity: 1; }
.v8-divider {
  stroke: var(--v6-text-strong);
  stroke-width: 2.2;
  stroke-linecap: round;
  fill: none;
}

.v8-columns {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0 clamp(60px, 14vw, 240px);
}
.v8-col {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  padding: clamp(210px, 36vh, 360px) 12px 24px;
  background: transparent;
  border: 0;
  outline: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  font: inherit;
  color: inherit;
  text-align: center;
  transition: opacity var(--v6-dur-slow) var(--v6-ease);
}
.v8-col-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 20px 28px;
  width: 100%;
  position: relative;
  border-radius: 12px;
  background: transparent;
  transition: background var(--v6-dur-base) var(--v6-ease);
}
.v8-col.is-hovered .v8-col-box,
.v8-col:focus-visible .v8-col-box {
  background: var(--v6-accent-soft);
}
.v8-col-box::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 3px;
  background: linear-gradient(to bottom,
    transparent 0%,
    var(--v6-accent) 22%,
    var(--v6-accent) 78%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--v6-dur-base) var(--v6-ease);
}
.v8-col.is-hovered .v8-col-box::before,
.v8-col:focus-visible .v8-col-box::before {
  opacity: 1;
}
.v8-col-label {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-weight: 800;
  font-size: clamp(40px, 5.4vw, 76px);
  letter-spacing: -0.035em;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  color: var(--v6-text-strong);
  line-height: 1.02;
  max-width: 12ch;
  transition: color var(--v6-dur-base) var(--v6-ease);
}
.v8-col-reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: 108px;
}
.v8-col-sub {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 17px;
  color: var(--v6-text-muted);
  max-width: 22ch;
  line-height: 1.35;
  opacity: 0;
  transition: opacity var(--v6-dur-base) var(--v6-ease);
}
.v8-col.is-hovered .v8-col-label,
.v8-col:focus-visible .v8-col-label { color: var(--v6-accent); }
.v8-col.is-hovered .v8-col-sub,
.v8-col:focus-visible .v8-col-sub { opacity: 1; }

.v8-stage-inner {
  position: absolute;
  inset: 0;
  transition: opacity 320ms ease, transform 360ms cubic-bezier(.22,1,.36,1);
  will-change: opacity, transform;
}
.v8-stage-inner.is-leaving,
.v8-stage-inner.is-hidden {
  opacity: 0;
  transform: translateY(-12px) scale(.985);
  pointer-events: none;
}

.v8-stack {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 40px;
}
.v8-stack-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 18px;
}
.v8-stack-card {
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 22px 32px;
  min-width: 280px;
  text-align: center;
  color: inherit;
  font: inherit;
  border-radius: 18px;
  transition: opacity var(--v6-dur-slow) var(--v6-ease);
}
.v8-stack-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 28px;
  width: 100%;
  position: relative;
  border-radius: 12px;
  background: transparent;
  transition: background var(--v6-dur-base) var(--v6-ease);
}
.v8-stack-card.is-hovered .v8-stack-box,
.v8-stack-card:focus-visible .v8-stack-box {
  background: var(--v6-accent-soft);
}
.v8-stack-box::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 3px;
  background: linear-gradient(to bottom,
    transparent 0%,
    var(--v6-accent) 22%,
    var(--v6-accent) 78%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--v6-dur-base) var(--v6-ease);
}
.v8-stack-card.is-hovered .v8-stack-box::before,
.v8-stack-card:focus-visible .v8-stack-box::before {
  opacity: 1;
}
.v8-stack-label {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-weight: 800;
  font-size: clamp(36px, 4.4vw, 64px);
  letter-spacing: -0.035em;
  line-height: 1.02;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  color: var(--v6-text-strong);
  transition: color var(--v6-dur-base) var(--v6-ease);
}
.v8-stack-card.is-hovered .v8-stack-label,
.v8-stack-card:focus-visible .v8-stack-label { color: var(--v6-accent); }
.v8-stack-both .v8-stack-label { font-size: clamp(28px, 3.4vw, 48px); }
.v8-stack-reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  min-height: 56px;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity var(--v6-dur-base) var(--v6-ease), transform var(--v6-dur-base) var(--v6-ease);
}
.v8-stack-card.is-hovered .v8-stack-reveal,
.v8-stack-card:focus-visible .v8-stack-reveal { opacity: 1; transform: none; }
.v8-stack-sub {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: var(--v6-text-muted);
  max-width: 28ch;
  line-height: 1.35;
}
.bl-intermission {
  position: relative;
  background: var(--bl-section-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(56px, 8vh, 96px) clamp(24px, 5vw, 80px);
  transition: background-color 320ms ease;
}
.bl-intermission + .bl-editorial { padding-top: clamp(40px, 5vh, 64px); }
.bl-intermission-mark {
  display: inline-flex;
  align-items: center;
  gap: clamp(14px, 2vw, 28px);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bl-section-fg);
}
.bl-intermission-mark > span:not(.bl-intermission-line) {
  opacity: 0.72;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.bl-intermission-section {
  color: var(--bl-section-accent);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0;
  transform: translateY(-1px);
  transition: color 320ms ease;
}
.bl-intermission-arrow {
  color: var(--bl-section-accent);
  font-size: 11px;
  transition: color 320ms ease;
}
.bl-intermission-line {
  display: inline-block;
  width: clamp(48px, 8vw, 120px);
  height: 1px;
  background: var(--bl-section-accent);
  opacity: 0.85;
  transition: background-color 320ms ease;
}

/* === Doors layout (v7-inspired, v8 palette) === */
.v8-doors {
  position: absolute;
  top: clamp(460px, 58vh, 600px);
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--v6-divider);
}
.v8-doors::before {
  content: '';
  position: absolute;
  top: 14%;
  bottom: 18%;
  left: 50%;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--v6-divider) 8%,
    var(--v6-divider) 92%,
    transparent 100%
  );
  pointer-events: none;
}
@media (max-width: 800px) {
  .v8-doors { grid-template-columns: 1fr; top: clamp(520px, 64vh, 680px); }
  .v8-doors::before { display: none; }
}
.v8-door {
  appearance: none;
  background: transparent;
  border: 0;
  padding: clamp(48px, 7vh, 96px) clamp(28px, 5vw, 80px) clamp(64px, 10vh, 140px);
  text-align: left;
  color: inherit;
  font: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  transition: background var(--v6-dur-base) var(--v6-ease);
}
.v8-root.is-layout-doors .v8-door-reader {
  align-items: flex-end;
  text-align: right;
}
.v8-root.is-layout-doors .v8-door-author {
  align-items: flex-start;
  text-align: left;
}
@media (max-width: 800px) {
  .v8-root.is-layout-doors .v8-door-reader,
  .v8-root.is-layout-doors .v8-door-author {
    align-items: flex-start;
    text-align: left;
  }
}
.v8-door:hover,
.v8-door:focus-visible,
.v8-door.is-hovered {
  background: var(--v6-accent-soft);
  outline: none;
}
.v8-door::after {
  content: '';
  position: absolute;
  left: clamp(28px, 5vw, 80px);
  right: clamp(28px, 5vw, 80px);
  bottom: clamp(32px, 5vh, 64px);
  height: 1px;
  background: var(--v6-accent);
  transform: scaleX(0);
  transition: transform 480ms var(--v6-ease);
}
.v8-door-reader::after { transform-origin: right; }
.v8-door-author::after { transform-origin: left; }
.v8-door:hover::after,
.v8-door:focus-visible::after,
.v8-door.is-hovered::after { transform: scaleX(1); }
.v8-door-title {
  margin: 0;
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-weight: 400;
  font-style: italic;
  font-size: clamp(36px, 5vw, 72px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--v6-text-strong);
  max-width: 16ch;
  text-wrap: balance;
  font-variation-settings: 'opsz' 144, 'SOFT' 50;
}
.v8-door-cta {
  margin-top: 18px;
  display: inline-flex;
  align-items: baseline;
  gap: 12px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--v6-text-strong);
}
.v8-door-arrow {
  font-size: 18px;
  letter-spacing: 0;
  transition: transform 280ms var(--v6-ease);
}
.v8-door:hover .v8-door-arrow,
.v8-door:focus-visible .v8-door-arrow,
.v8-door.is-hovered .v8-door-arrow { transform: translateX(6px); }

.v8-door-cta-text { display: inline-block; }

/* Typographic asterism stamped where the top rule meets the gutter — a chapter mark */
.v8-doors-ornament {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(20px, 1.8vw, 26px);
  line-height: 1;
  color: var(--v6-accent);
  letter-spacing: 0;
  background: var(--v6-surface);
  padding: 4px 14px;
  pointer-events: none;
  user-select: none;
  z-index: 2;
  opacity: 0.95;
}

.v8-root.is-layout-doors .v8-headline-guard { display: none; }

/* Doors layout: editorial broadside masthead — twin rules + caps eyebrow + serif headline + meta strip */
.v8-root.is-layout-doors .v8-hero-head {
  top: clamp(40px, 5vh, 72px);
  left: 50%;
  right: auto;
  transform: translateX(-50%);
  width: min(960px, calc(100% - clamp(48px, 10vw, 160px)));
  max-width: none;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  pointer-events: none;
}
.v8-root.is-layout-doors .v8-masthead-rule {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--v6-text-strong);
  opacity: 0.62;
}
.v8-root.is-layout-doors .v8-hero-sub {
  order: 0;
  margin: 0;
  padding: 12px 0 12px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: clamp(11px, 1.05vw, 13px);
  letter-spacing: 0.46em;
  text-transform: uppercase;
  color: var(--v6-accent);
  line-height: 1;
  text-indent: 0.46em;
}
.v8-root.is-layout-doors .v8-hero-title {
  order: 0;
  margin: clamp(28px, 4vh, 44px) auto clamp(20px, 2.4vh, 28px);
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-style: normal;
  font-weight: 500;
  font-size: clamp(38px, 5.4vw, 88px);
  letter-spacing: -0.025em;
  text-transform: none;
  color: var(--v6-text-strong);
  line-height: 1.02;
  white-space: normal;
  text-wrap: balance;
  font-variation-settings: 'opsz' 144, 'SOFT' 50;
  max-width: 18ch;
}
.v8-root.is-layout-doors .v8-hero-title em {
  font-style: italic;
  font-weight: 400;
  color: var(--v6-text-strong);
}
.v8-hero-meta {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: clamp(10px, 1.4vw, 18px);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: clamp(10px, 0.85vw, 11px);
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--v6-text-muted);
  opacity: 0.72;
  line-height: 1;
}
.v8-hero-meta-dot {
  font-family: 'Fraunces', serif;
  font-size: 1.4em;
  letter-spacing: 0;
  color: var(--v6-accent);
  opacity: 0.85;
  transform: translateY(-0.05em);
}

/* Doors stay equally weighted — no dimming, no persistent underline */
.v8-root.is-highlight .v8-door::after { transform: scaleX(0); }
.v8-root.is-highlight .v8-door:hover::after,
.v8-root.is-highlight .v8-door:focus-visible::after,
.v8-root.is-highlight .v8-door.is-hovered::after { transform: scaleX(1); }
.v8-root.is-highlight:has(.v8-door:hover) .v8-door:not(:hover) { opacity: 1; }

/* Staggered page-load reveal: header → left door → ornament → right door → colophon */
@keyframes v8-doors-rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
@keyframes v8-doors-fade {
  to { opacity: 1; }
}
@keyframes v8-doors-ornament-in {
  from { opacity: 0; transform: translate(-50%, -40%); }
  to   { opacity: 0.9; transform: translate(-50%, -50%); }
}
.v8-root.is-layout-doors .v8-hero-head {
  opacity: 0;
  animation: v8-doors-fade 800ms var(--v6-ease) 100ms forwards;
}
.v8-root.is-layout-doors .v8-door {
  opacity: 0;
  transform: translateY(14px);
  animation: v8-doors-rise 900ms cubic-bezier(.22,1,.36,1) forwards;
}
.v8-root.is-layout-doors .v8-door-reader { animation-delay: 220ms; }
.v8-root.is-layout-doors .v8-door-author { animation-delay: 360ms; }
.v8-root.is-layout-doors .v8-doors-ornament {
  opacity: 0;
  animation: v8-doors-ornament-in 1000ms var(--v6-ease) 520ms forwards;
}

/* Door internal spacing: stamp / title / cta with refined hierarchy */
.v8-root.is-layout-doors .v8-door { gap: 28px; }
.v8-root.is-layout-doors .v8-door-title { margin-bottom: 8px; }

/* === Highlight mode: persistently apply hover styles to all regions === */
.v8-root.is-highlight .v8-region { transition: opacity var(--v6-dur-slow) var(--v6-ease); }
.v8-root.is-highlight .v8-region-label { fill: var(--v6-accent); }
.v8-root.is-highlight .v8-region-sub {
  fill: var(--v6-text-strong);
  opacity: 1;
}
.v8-root.is-highlight:has(.v8-region:hover) .v8-region:not(:hover) {
  opacity: 0.5;
}

.v8-root.is-highlight .v8-col-label { color: var(--v6-accent); }
.v8-root.is-highlight .v8-col-reveal { opacity: 1; transform: none; }
.v8-root.is-highlight .v8-col-sub { opacity: 1; }
.v8-root.is-highlight:has(.v8-col:hover) .v8-col:not(:hover) {
  opacity: 0.5;
}

.v8-root.is-highlight .v8-stack-label { color: var(--v6-accent); }
.v8-root.is-highlight .v8-stack-reveal { opacity: 1; transform: none; }
.v8-root.is-highlight:has(.v8-stack-card:hover) .v8-stack-card:not(:hover) {
  opacity: 0.5;
}

/* Hawkins: no persistent accent fill */
.v8-root.is-palette-stranger.is-highlight .v8-region-fill { fill: transparent; }

/* === Headline hover guard — blocks column hover in the headline zone === */
.v8-headline-guard {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: clamp(160px, 26vh, 240px);
  z-index: 2;
  pointer-events: all;
}

/* === Hero headline === */
.v8-stage-layout {
  position: absolute;
  inset: 0;
}
.v8-hero-head {
  position: absolute;
  top: clamp(80px, 12vh, 130px);
  left: 50%;
  transform: translateX(-50%);
  width: min(1100px, 90vw);
  z-index: 1;
  pointer-events: none;
  text-align: center;
}
.v8-hero-title {
  margin: 0 0 18px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(28px, 6.5vw, 108px);
  letter-spacing: -0.04em;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  line-height: 0.97;
  color: var(--v6-text-strong);
}
.v8-hero-sub {
  margin: 0;
  font-family: 'Outfit', sans-serif;
  font-size: clamp(15px, 1.6vw, 21px);
  font-weight: 500;
  color: var(--v6-text-muted);
  line-height: 1.4;
}
.v8-curved-wrap {
  position: absolute;
  inset: 0;
}

/* === Start buttons === */
.v8-start-btn {
  display: inline-flex;
  align-items: center;
  padding: 7px 18px;
  border-radius: 999px;
  border: 1.5px solid var(--v6-text-strong);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--v6-text-strong);
  pointer-events: none;
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity var(--v6-dur-base) var(--v6-ease),
    transform var(--v6-dur-base) var(--v6-ease),
    background var(--v6-dur-fast) var(--v6-ease),
    border-color var(--v6-dur-fast) var(--v6-ease),
    color var(--v6-dur-fast) var(--v6-ease);
}
.v8-col.is-hovered .v8-start-btn,
.v8-col:focus-visible .v8-start-btn,
.v8-stack-card.is-hovered .v8-start-btn,
.v8-stack-card:focus-visible .v8-start-btn {
  opacity: 1;
  transform: none;
  background: var(--v6-accent);
  border-color: var(--v6-accent);
  color: #fff;
}
.v8-root.is-highlight .v8-start-btn {
  opacity: 1;
  transform: none;
}
.v8-region-start {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 18px;
  fill: var(--v6-text-muted);
  paint-order: stroke fill;
  stroke: var(--v6-stroke);
  stroke-width: 3;
  stroke-linejoin: round;
  opacity: 0;
  transition: fill var(--v6-dur-base) var(--v6-ease), opacity var(--v6-dur-base) var(--v6-ease);
}
.v8-region.is-hovered .v8-region-start,
.v8-region:focus-visible .v8-region-start { fill: var(--v6-accent); opacity: 1; }
.v8-root.is-highlight .v8-region-start { fill: var(--v6-text-strong); opacity: 1; }

/* === Headline accent === */
.v8-hero-accent {
  font-style: italic;
  color: var(--v6-accent);
}

/* === v6.b craft refinements === */

/* Display typography: balance + kerning + ligatures */
.v8-hero-title,
.v8-col-label,
.v8-stack-label,
.v8-region-label {
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt";
}

/* Body copy: soft wrap to suppress orphans */
.v8-hero-sub,
.v8-col-sub,
.v8-stack-sub {
  text-wrap: pretty;
}

/* Tabular numerals on counters */
.v8-nav-issue,
.v8-tweaks-trigger,
.v8-tweaks-option {
  font-variant-numeric: tabular-nums;
}

/* Visible focus rings (using existing accent var; outline inherits each element's border-radius) */
.v8-root :where(button, a, [role="button"], input, select, textarea):focus-visible {
  outline: 2px solid var(--v6-accent);
  outline-offset: 3px;
}
.v8-root .v8-region:focus-visible {
  outline: none;
}
.v8-root .v8-region:focus-visible .v8-region-box {
  stroke: var(--v6-accent);
  stroke-opacity: 1;
  stroke-width: 2.5;
}
.v8-root .v8-col:focus-visible,
.v8-root .v8-stack-card:focus-visible {
  outline: none;
}
.v8-root .v8-col:focus-visible .v8-col-box,
.v8-root .v8-stack-card:focus-visible .v8-stack-box {
  outline: 2px solid var(--v6-accent);
  outline-offset: 6px;
}

/* Scroll polish: smooth nav, anchor offset under sticky 76px nav */
html:has(.v8-root) { scroll-behavior: smooth; }
.v8-root .v8-hero,
.v8-root .bl-books,
.v8-root .bl-intermission,
.v8-root .bl-editorial,
.v8-root .bl-footer {
  scroll-margin-top: 96px;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  html:has(.v8-root) { scroll-behavior: auto; }
  .v8-root,
  .v8-root *,
  .v8-root *::before,
  .v8-root *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.bl-banner {
  position: relative;
  z-index: 30;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 0 auto;
  max-width: min(720px, calc(100% - 32px));
  padding: 12px 14px;
  background: rgba(233, 75, 54, 0.08);
  border: 1px solid rgba(233, 75, 54, 0.35);
  border-radius: 10px;
  color: #0e0e0c;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  line-height: 1.45;
  margin-top: 12px;
}
.bl-banner-text { flex: 1 1 auto; }
.bl-banner-close {
  flex: 0 0 auto;
  background: transparent;
  border: 0;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  padding: 0 4px;
  opacity: 0.7;
}
.bl-banner-close:hover { opacity: 1; }
`;

type Region = 'author' | 'reader' | 'both';
type Layout = 'doors' | 'curved' | 'columns' | 'stacked';
type PaletteV6 = 'crimson' | 'forest' | 'pop' | 'stranger';
type Phase = 'choose' | 'leaving' | 'questions';

const PALETTE_CYCLE: PaletteV6[] = ['forest', 'crimson', 'pop', 'stranger'];
const PALETTE_LABELS: Record<PaletteV6, string> = {
  forest: 'Forest',
  crimson: 'Crimson',
  pop: 'Pop',
  stranger: 'Hawkins',
};

const LAYOUT_CYCLE: Layout[] = ['doors', 'curved', 'columns', 'stacked'];
const LAYOUT_LABELS: Record<Layout, string> = {
  doors: 'Doors',
  curved: 'Curved',
  columns: 'Columns',
  stacked: 'Stacked',
};

const DOOR_TITLES: Record<'reader' | 'author', string> = {
  reader: 'I’m a reader',
  author: 'I’m a writer',
};

const DOOR_CTAS: Record<'reader' | 'author', string> = {
  reader: 'open as a reader',
  author: 'open as a writer',
};

const LABELS: Record<Region, string> = {
  author: 'I’m an author',
  reader: 'I’m a reader',
  both: 'I’m both',
};

const SUBTITLES: Record<Region, string> = {
  author: 'Be discovered. Build an audience. Get published.',
  reader: 'Read fiction before it hits the shelf.',
  both: 'Discover and be discovered.',
};

const START_LABELS: Record<Region, string> = {
  author: 'Start writing →',
  reader: 'Start reading →',
  both: 'I’m both →',
};

const MARQUEE_WORDS = [
  'chapter', 'draft', 'story', 'novel', 'prose', 'verse',
  'ink', 'pages', 'words', 'fiction', 'tales', 'plot',
  'arc', 'voice', 'muse', 'edit', 'read', 'write',
];

const REGIONS: Region[] = ['author', 'both', 'reader'];

export default function V6Page() {
  const [hovered, setHovered] = useState<Region | null>(null);
  const [phase, setPhase] = useState<Phase>('choose');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [layout, setLayout] = useState<Layout>('doors');
  const [palette, setPalette] = useState<PaletteV6>('stranger');
  const [bgOn, setBgOn] = useState(false);
  const [highlightOn, setHighlightOn] = useState(true);
  const [waitlist, setWaitlist] = useState<{ open: boolean; eyebrow?: string }>({ open: false });

  // Banner state is derived from ?u=… on the URL. We read it via window.location
  // in a useEffect (rather than useSearchParams) so the page stays statically
  // renderable. The banner appears post-hydration; that's fine — its purpose is
  // a soft notice, not a blocking error.
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('u');
    setBannerMessage(code ? (BANNER_MESSAGES[code] ?? null) : null);
  }, []);
  const dismissBanner = () => {
    setBannerMessage(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('u');
      window.history.replaceState(null, '', url.toString());
    }
  };

  const openWaitlist = (eyebrow?: string) => setWaitlist({ open: true, eyebrow });
  const closeWaitlist = () => setWaitlist({ open: false });

  const backToChoose = () => {
    setPhase('choose');
    setSelectedRegion(null);
  };

  const handleIntakeSubmit = (payload: IntakeSubmit) => {
    const eyebrow =
      payload.region === 'writer'
        ? 'Submission received'
        : payload.intent === 'later'
          ? 'Saved for later'
          : 'Ready to read';
    setPhase('choose');
    setSelectedRegion(null);
    openWaitlist(eyebrow);
  };

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = '#ffffff';
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  const open = (region: Region) => {
    if (phase !== 'choose') return;
    setSelectedRegion(region);
    setPhase('leaving');
    window.setTimeout(() => setPhase('questions'), 360);
  };

  const openFromSection = (target: StartTarget) => {
    openWaitlist(EYEBROW_BY_TARGET[target]);
  };

  const regionProps = (region: Region) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `${LABELS[region]}. ${SUBTITLES[region]}`,
    onMouseEnter: () => setHovered(region),
    onMouseLeave: () => setHovered((r) => (r === region ? null : r)),
    onFocus: () => setHovered(region),
    onBlur: () => setHovered((r) => (r === region ? null : r)),
    onClick: () => open(region),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(region);
      }
    },
  });

  const rootClass = [
    'v8-root',
    palette === 'forest' ? 'is-palette-forest' : '',
    palette === 'pop' ? 'is-palette-pop' : '',
    palette === 'stranger' ? 'is-palette-stranger' : '',
    highlightOn ? 'is-highlight' : '',
    layout === 'doors' ? 'is-layout-doors' : '',
    phase === 'questions' ? 'is-phase-questions' : '',
  ].filter(Boolean).join(' ');

  return (
    <main className={rootClass}>
      <style dangerouslySetInnerHTML={{ __html: V6_CSS }} />

      {bannerMessage && (
        <div className="bl-banner" role="status" aria-live="polite">
          <span className="bl-banner-text">{bannerMessage}</span>
          <button
            type="button"
            className="bl-banner-close"
            onClick={dismissBanner}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <nav className="v8-nav">
        <a className="v8-brand" href="#" aria-label="Between Lines, home">
          <span>between</span>
          <span className="v8-brand-dot">·</span>
          <span>lines</span>
        </a>
        <div className="v8-nav-meta">
          <span className="v8-nav-issue">Issue №01</span>
          <span className="v8-nav-sep" aria-hidden="true" />
          <button
            type="button"
            className="v8-nav-link v8-nav-signin"
            onClick={() => openWaitlist()}
          >
            Join waitlist
          </button>
        </div>
      </nav>

      <section className="v8-hero" aria-label="Choose your role">
      {bgOn && (
        <>
          <div className="v8-bg" aria-hidden="true" />
          <div className="v8-bg-scrim" aria-hidden="true" />
          <div className="v8-bg-grain" aria-hidden="true" />
        </>
      )}
      <div className="v8-stage">
        <div
          className={`v8-stage-inner${
            phase === 'leaving' ? ' is-leaving' : phase === 'questions' ? ' is-hidden' : ''
          }`}
          aria-hidden={phase !== 'choose'}
        >
        <div className="v8-stage-layout">
          <div className="v8-hero-head">
            {layout === 'doors' ? (
              <>
                <span className="v8-masthead-rule" aria-hidden="true" />
                <p className="v8-hero-sub">Invitation only</p>
                <span className="v8-masthead-rule" aria-hidden="true" />
                <h1 className="v8-hero-title">
                  Discover Debut Authors<br />and New Voices — <em>Fiction&nbsp;Only.</em>
                </h1>
                <p className="v8-hero-meta">
                  <span className="v8-hero-meta-dot" aria-hidden="true">·</span>
                  Issue №01
                  <span className="v8-hero-meta-dot" aria-hidden="true">·</span>
                  Spring 2026
                  <span className="v8-hero-meta-dot" aria-hidden="true">·</span>
                </p>
              </>
            ) : (
              <>
                <h1 className="v8-hero-title">Curated drops, every month.</h1>
                <p className="v8-hero-sub">Who are you here as?</p>
              </>
            )}
          </div>
          <div className="v8-headline-guard" aria-hidden="true" />
          {layout === 'doors' ? (
            <div className="v8-doors">
              {(['reader', 'author'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`v8-door v8-door-${r}${hovered === r ? ' is-hovered' : ''}`}
                  {...regionProps(r)}
                >
                  <h2 className="v8-door-title">{DOOR_TITLES[r]}</h2>
                  <span className="v8-door-cta">
                    <span className="v8-door-cta-text">{DOOR_CTAS[r]}</span>
                    <span className="v8-door-arrow" aria-hidden="true">→</span>
                  </span>
                </button>
              ))}
              <span className="v8-doors-ornament" aria-hidden="true">⁂</span>
            </div>
          ) : layout === 'curved' ? (
            <div className="v8-curved-wrap">
              <svg
                className="v8-canvas"
                viewBox="0 0 1600 1000"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Between Lines</title>
                <desc>Choose your role: author, reader, or both.</desc>

                <defs>
                  <filter id="v8-rough" x="-4%" y="-4%" width="108%" height="108%">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.022"
                      numOctaves={2}
                      seed={9}
                    />
                    <feDisplacementMap in="SourceGraphic" scale={3.2} />
                  </filter>
                </defs>

                <g
                  className={`v8-region v8-region-author${hovered === 'author' ? ' is-hovered' : ''}`}
                  {...regionProps('author')}
                >
                  <path
                    className="v8-region-fill"
                    d="M -10 -10 L 700 -10 C 695 150 670 320 660 460 C 530 620 350 800 180 1010 L -10 1010 Z"
                    pointerEvents="all"
                  />
                  <rect className="v8-region-box" x={42} y={210} width={580} height={230} rx={14} />
                  <text className="v8-region-label" textAnchor="middle" x={332} y={302}>
                    {LABELS.author}
                  </text>
                  <text className="v8-region-sub" textAnchor="middle" x={332} y={358}>
                    {SUBTITLES.author}
                  </text>
                  <text className="v8-region-start" textAnchor="middle" x={332} y={412}>
                    {START_LABELS.author}
                  </text>
                </g>

                <g
                  className={`v8-region v8-region-reader${hovered === 'reader' ? ' is-hovered' : ''}`}
                  {...regionProps('reader')}
                >
                  <path
                    className="v8-region-fill"
                    d="M 700 -10 L 1610 -10 L 1610 1010 L 1440 1010 C 1160 810 870 620 660 460 C 670 320 695 150 700 -10 Z"
                    pointerEvents="all"
                  />
                  <rect className="v8-region-box" x={845} y={210} width={580} height={230} rx={14} />
                  <text className="v8-region-label" textAnchor="middle" x={1135} y={302}>
                    {LABELS.reader}
                  </text>
                  <text className="v8-region-sub" textAnchor="middle" x={1135} y={358}>
                    {SUBTITLES.reader}
                  </text>
                  <text className="v8-region-start" textAnchor="middle" x={1135} y={412}>
                    {START_LABELS.reader}
                  </text>
                </g>

                <g
                  className={`v8-region v8-region-both${hovered === 'both' ? ' is-hovered' : ''}`}
                  {...regionProps('both')}
                >
                  <path
                    className="v8-region-fill"
                    d="M 660 460 C 870 620 1160 810 1440 1010 L 180 1010 C 350 800 530 620 660 460 Z"
                    pointerEvents="all"
                  />
                  <rect className="v8-region-box" x={548} y={700} width={400} height={190} rx={14} />
                  <text className="v8-region-label" textAnchor="middle" x={748} y={758}>
                    {LABELS.both}
                  </text>
                  <text className="v8-region-sub" textAnchor="middle" x={748} y={812}>
                    {SUBTITLES.both}
                  </text>
                  <text className="v8-region-start" textAnchor="middle" x={748} y={862}>
                    {START_LABELS.both}
                  </text>
                </g>

                <g className="v8-dividers" filter="url(#v8-rough)" pointerEvents="none">
                  <path
                    className="v8-divider v8-divider-up"
                    d="M 700 -10 C 695 150 670 320 660 460"
                  />
                  <path
                    className="v8-divider v8-divider-left"
                    d="M 660 460 C 530 620 350 800 180 1010"
                  />
                  <path
                    className="v8-divider v8-divider-right"
                    d="M 660 460 C 870 620 1160 810 1440 1010"
                  />
                </g>
              </svg>
            </div>
          ) : layout === 'columns' ? (
            <div className="v8-columns">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`v8-col v8-col-${r}${hovered === r ? ' is-hovered' : ''}`}
                  {...regionProps(r)}
                >
                  <div className="v8-col-box">
                    <div className="v8-col-label">{LABELS[r]}</div>
                    <div className="v8-col-reveal">
                      <div className="v8-col-sub">{SUBTITLES[r]}</div>
                      <span className="v8-start-btn">{START_LABELS[r]}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="v8-stack">
              <div className="v8-stack-row">
                {(['author', 'reader'] as Region[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`v8-stack-card v8-stack-${r}${hovered === r ? ' is-hovered' : ''}`}
                    {...regionProps(r)}
                  >
                    <div className="v8-stack-box">
                      <div className="v8-stack-label">{LABELS[r]}</div>
                      <div className="v8-stack-reveal">
                        <div className="v8-stack-sub">{SUBTITLES[r]}</div>
                        <span className="v8-start-btn">{START_LABELS[r]}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={`v8-stack-card v8-stack-both${hovered === 'both' ? ' is-hovered' : ''}`}
                {...regionProps('both')}
              >
                <div className="v8-stack-box">
                  <div className="v8-stack-label">{LABELS.both}</div>
                  <div className="v8-stack-reveal">
                    <div className="v8-stack-sub">{SUBTITLES.both}</div>
                    <span className="v8-start-btn">{START_LABELS.both}</span>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
        </div>
        {phase === 'questions' && (
          <IntakeHero
            initialMode={selectedRegion === 'author' ? 'writer' : 'reader'}
            onBack={backToChoose}
            onSubmit={handleIntakeSubmit}
          />
        )}
      </div>
      </section>

      <BookCarousel />

      <aside className="bl-intermission" aria-hidden="true">
        <span className="bl-intermission-mark">
          <span className="bl-intermission-line" />
          <span>
            <span className="bl-intermission-section">§</span>
            Inside the issue
            <span className="bl-intermission-arrow">↓</span>
          </span>
          <span className="bl-intermission-line" />
        </span>
      </aside>

      <EditorialSplit onStart={openFromSection} />
      <Footer />

      <WaitlistOverlay
        open={waitlist.open}
        eyebrow={waitlist.eyebrow}
        onClose={closeWaitlist}
      />
    </main>
  );
}
