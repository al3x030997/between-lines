'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import IntakeHero, { type IntakeSubmit } from '../v8/IntakeHero';
import { WaitlistOverlay } from '../v8/WaitlistForm';
import type { IntakePayload } from '@/lib/schemas';
import { serializeWriter } from '../v8/intake/writer/writerTypes';
import OpenCall from '../v8/sections/opencall';
import SignupOffers from '../v8/sections/SignupOffers';
import FaqTeaser from '../v8/sections/FaqTeaser';
import Footer from '../v8/sections/Footer';

const BANNER_MESSAGES: Record<string, string> = {
  gate: 'Your insider access has expired. Re-enter your email to receive a new link.',
  invalid: 'That insider link is invalid. Re-enter your email to receive a new one.',
  pending: 'We can’t find an active subscription for that link. Check your inbox for our confirmation email.',
  ratelimited: 'Too many attempts. Please try again in a few minutes.',
};

const V10_CSS = `
.v8-root {
  --v6-accent: var(--bl-accent);
  --v6-accent-soft: var(--bl-accent-soft);
  --v6-text: var(--bl-ink);
  --v6-text-strong: var(--bl-ink);
  --v6-text-muted: #14140f;
  --v6-surface: var(--bl-surface);
  --v6-divider: var(--bl-divider);
  --v6-stroke: rgba(255,255,255,0.85);
  --v6-ease: var(--bl-ease);
  --v6-dur-fast: 180ms;
  --v6-dur-base: 240ms;
  --v6-dur-slow: 360ms;
  --bl-section-accent: var(--bl-accent);
  --bl-card-shadow: rgba(0,0,0,0.5);
  --bl-footer-accent: var(--bl-accent);
  min-height: 100vh;
  background: var(--v6-surface);
  font-family: var(--bl-font-display);
  font-optical-sizing: auto;
  color: var(--v6-text);
}
.v8-root.is-palette-stranger {
  --bl-accent: #1F7A3E;
  --bl-accent-strong: #155F2F;
  --bl-accent-soft: rgba(31, 122, 62, 0.14);
  --v6-text: #0a0a0a;
  --v6-text-strong: #0a0a0a;
  --v6-text-muted: #1a1a1a;
  --v6-surface: #FFC700;
  --v6-divider: rgba(11,23,51,0.22);
  --v6-stroke: rgba(255,199,0,0.95);
  --bl-section-accent: #1F7A3E;
  --bl-footer-accent: #1F7A3E;
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
  background: var(--bl-surface);
  color: var(--bl-ink);
}
.v8-brand {
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
.v8-brand-dot {
  color: var(--v6-accent);
  padding: 0 4px;
  font-weight: 800;
  transform: translateY(-1px);
}
.v8-nav-left {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 38px);
}
.v8-nav-links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 24px);
  font-family: var(--bl-font-eyebrow);
}
.v8-nav-meta {
  display: flex;
  align-items: center;
  font-family: var(--bl-font-eyebrow);
}
.v8-nav-link {
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--v6-text-strong);
  text-decoration: none;
  background: transparent;
  border: 0;
  padding: 4px 0;
  cursor: pointer;
  position: relative;
  transition: color 200ms ease;
}
.v8-nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--v6-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.v8-nav-link:hover { color: var(--v6-accent); }
.v8-nav-link:hover::after { transform: scaleX(1); }

.v8-nav-cta {
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
.v8-nav-cta:hover,
.v8-nav-cta:focus-visible {
  background: var(--v6-accent);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(14, 14, 12, 0.16);
  outline: none;
}

@media (max-width: 760px) {
  .v8-nav-links { display: none; }
}

/* Hover dropdown for nav groups (Readers, Creators) */
.v8-nav-group {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.v8-nav-group::before {
  content: '';
  position: absolute;
  left: -12px;
  right: -12px;
  top: 100%;
  height: 18px;
  pointer-events: none;
}
.v8-nav-group:hover::before,
.v8-nav-group:focus-within::before {
  pointer-events: auto;
}
.v8-nav-dropdown {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  min-width: 232px;
  background: var(--v6-surface);
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
    opacity 200ms cubic-bezier(.22, 1, .36, 1),
    transform 220ms cubic-bezier(.22, 1, .36, 1),
    visibility 200ms linear;
  z-index: 10;
}
.v8-nav-group:hover .v8-nav-dropdown,
.v8-nav-group:focus-within .v8-nav-dropdown {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  transform: translate(-50%, 0);
}
.v8-nav-sub {
  display: block;
  padding: 9px 14px;
  font-family: var(--bl-font-body);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--v6-text-strong);
  text-decoration: none;
  text-transform: none;
  border-radius: 8px;
  white-space: nowrap;
  transition: background 160ms ease, color 160ms ease, transform 160ms cubic-bezier(.22, 1, .36, 1);
}
.v8-nav-sub:hover,
.v8-nav-sub:focus-visible {
  background: var(--bl-accent-soft);
  color: var(--bl-accent-strong);
  transform: translateX(2px);
  outline: none;
}
@media (max-width: 760px) {
  .v8-nav-dropdown { display: none; }
}

/* === v10 masthead band (between nav and hero) === */
.v10-masthead {
  position: relative;
  z-index: 4;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: clamp(16px, 3vw, 36px);
  height: 34px;
  padding: 0 clamp(20px, 3.5vw, 56px);
  background: var(--v6-surface);
  border-bottom: 1px solid rgba(14,14,12,0.18);
  font-family: var(--bl-font-eyebrow);
  color: rgba(14,14,12,0.78);
  opacity: 0;
  transform: translateY(-4px);
  animation: v10-fade-down 520ms cubic-bezier(.22, 1, .36, 1) 40ms forwards;
}
.v10-masthead::before,
.v10-masthead::after {
  content: '';
  position: absolute;
  left: clamp(20px, 3.5vw, 56px);
  right: clamp(20px, 3.5vw, 56px);
  height: 1px;
  background: var(--v6-accent);
  opacity: 0.55;
  pointer-events: none;
}
.v10-masthead::before { top: -1px; }
.v10-masthead::after  { bottom: -1px; }
.v10-masthead-cell {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.v10-masthead-cell:first-child { justify-self: start; }
.v10-masthead-cell:last-child  { justify-self: end; }
.v10-masthead-center {
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: 12.5px;
  letter-spacing: 0.06em;
  text-transform: none;
  color: rgba(14,14,12,0.92);
}
.v10-masthead-center .v10-mast-dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--v6-accent);
  transform: translateY(-1px);
}
@media (max-width: 760px) {
  .v10-masthead { grid-template-columns: 1fr auto; height: 30px; }
  .v10-masthead-cell:last-child { display: none; }
  .v10-masthead-cell:first-child { font-size: 9.5px; letter-spacing: 0.2em; }
  .v10-masthead-center { font-size: 11.5px; }
}
.v8-root.is-phase-questions .v10-masthead {
  opacity: 0;
  pointer-events: none;
  transition: opacity 320ms cubic-bezier(.22, 1, .36, 1);
}

/* === v9/v10 shared hero shell === */
.v9-hero {
  position: relative;
  min-height: calc(100vh - 76px - 34px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(40px, 7vh, 96px) clamp(24px, 5vw, 80px) clamp(48px, 8vh, 120px);
  background:
    radial-gradient(ellipse 140% 55% at 50% 0%, rgba(255, 240, 150, 0.35) 0%, rgba(255, 240, 150, 0) 70%),
    linear-gradient(180deg, #FFD23A 0%, var(--v6-surface) 60%, #F5C20E 100%);
  overflow: hidden;
  transition: opacity 360ms cubic-bezier(.22, 1, .36, 1),
              transform 360ms cubic-bezier(.22, 1, .36, 1),
              background 320ms cubic-bezier(.22, 1, .36, 1);
  will-change: opacity, transform;
}
.v9-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(
      to bottom,
      rgba(14,14,12,0) 0px,
      rgba(14,14,12,0) 23px,
      rgba(14,14,12,0.045) 23px,
      rgba(14,14,12,0.045) 24px
    ),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-blend-mode: normal, multiply;
  mix-blend-mode: multiply;
  opacity: 0.7;
  z-index: 0;
}
.v9-hero.is-leaving {
  opacity: 0;
  transform: translateY(-12px) scale(.985);
  pointer-events: none;
}
.v9-root.is-phase-questions .v9-hero {
  min-height: auto;
  align-items: stretch;
  padding-top: 0;
  padding-bottom: 0;
  background: var(--v6-surface);
}
.v9-root.is-phase-questions .v9-hero::before { opacity: 0; }
.v9-root.is-phase-questions .v10-rail,
.v9-root.is-phase-questions .v10-crop,
.v9-root.is-phase-questions .v10-seal {
  opacity: 0;
  pointer-events: none;
  transition: opacity 320ms cubic-bezier(.22, 1, .36, 1);
}

/* === v10 side rails (vertical edge text) === */
.v10-rail {
  position: absolute;
  top: 50%;
  font-family: var(--bl-font-eyebrow);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(14,14,12,0.55);
  white-space: nowrap;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  animation: v10-rail-in 640ms cubic-bezier(.22, 1, .36, 1) 380ms forwards;
}
.v10-rail-left {
  left: clamp(14px, 2vw, 30px);
  transform: translateY(-50%) rotate(180deg);
  writing-mode: vertical-rl;
}
.v10-rail-right {
  right: clamp(14px, 2vw, 30px);
  transform: translateY(-50%);
  writing-mode: vertical-rl;
}
.v10-rail .v10-rail-accent { color: var(--v6-accent); }
@media (max-width: 920px) {
  .v10-rail { display: none; }
}

/* === v10 crop marks === */
.v10-crop {
  position: absolute;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 14px;
  line-height: 1;
  color: rgba(14,14,12,0.4);
  z-index: 1;
  pointer-events: none;
  user-select: none;
}
.v10-crop-tl { top: 14px;    left: 14px; }
.v10-crop-tr { top: 14px;    right: 14px; }
.v10-crop-bl { bottom: 14px; left: 14px; }
.v10-crop-br { bottom: 14px; right: 14px; }

/* === v10 hero inner === */
.v9-hero-inner,
.v10-hero-inner {
  position: relative;
  z-index: 1;
  max-width: 980px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(20px, 3vh, 36px);
}

/* === v10 eyebrow === */
.v10-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--v6-accent);
  opacity: 0;
  transform: translateY(6px);
  animation: v10-fade-up 520ms cubic-bezier(.22, 1, .36, 1) 100ms forwards;
}
.v10-eyebrow-rule {
  display: inline-block;
  width: clamp(36px, 6vw, 64px);
  height: 1px;
  background: var(--v6-accent);
  opacity: 0.7;
}
.v10-eyebrow-ornament {
  font-size: 9px;
  letter-spacing: 0;
  transform: translateY(-1px);
}

/* === v10 headline === */
.v9-hero-title,
.v10-hero-title {
  margin: 0;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(40px, 6.4vw, 96px);
  line-height: 0.98;
  letter-spacing: -0.035em;
  color: var(--v6-text-strong);
  max-width: 18ch;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt";
  opacity: 0;
  transform: translateY(10px);
  animation: v10-fade-up 620ms cubic-bezier(.22, 1, .36, 1) 180ms forwards;
}
.v10-italic {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-variation-settings: 'opsz' 96, 'SOFT' 40, 'wdth' 100;
  letter-spacing: -0.01em;
  /* slight optical lift so italic sits in line with the bricolage sans */
  margin: 0 0.02em;
}
.v10-amp {
  display: inline-block;
  font-family: 'Cormorant Garamond', 'EB Garamond', Garamond, serif;
  font-style: italic;
  font-weight: 500;
  font-size: 1.05em;
  letter-spacing: 0;
  color: var(--v6-accent);
  transform: translateY(0.04em);
  padding: 0 0.04em;
}

/* === v10 standfirst (drop-cap subhead + marginalia) === */
.v10-standfirst {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: clamp(20px, 4vw, 56px);
  width: 100%;
  max-width: 760px;
  margin-top: clamp(4px, 1.4vh, 16px);
  text-align: left;
  opacity: 0;
  transform: translateY(8px);
  animation: v10-fade-up 600ms cubic-bezier(.22, 1, .36, 1) 280ms forwards;
}
.v10-standfirst-col {
  position: relative;
  max-width: 38ch;
}
.v10-standfirst-rule {
  display: block;
  width: 56px;
  height: 2px;
  background: var(--v6-accent);
  margin-bottom: 14px;
}
.v9-hero-sub,
.v10-hero-sub {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(16px, 1.6vw, 20px);
  line-height: 1.55;
  color: var(--v6-text-muted);
  text-wrap: pretty;
}
.v10-dropcap {
  float: left;
  font-family: 'Cormorant Garamond', 'EB Garamond', Garamond, serif;
  font-style: italic;
  font-weight: 500;
  font-size: clamp(54px, 6vw, 78px);
  line-height: 0.82;
  margin: 6px 10px 0 0;
  color: var(--v6-text-strong);
  /* a hairline forest-green underline gives the drop-cap a printed feel */
  padding-bottom: 2px;
  border-bottom: 2px solid var(--v6-accent);
}
.v10-marginalia {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 22ch;
  padding-left: 14px;
  border-left: 1px dashed rgba(14,14,12,0.25);
}
.v10-margin-handwritten {
  font-family: 'Caveat', 'Bradley Hand', cursive;
  font-size: 19px;
  line-height: 1.15;
  color: var(--v6-accent);
  transform: rotate(-1.5deg);
  transform-origin: left center;
}
.v10-margin-footnote {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 12.5px;
  line-height: 1.45;
  color: rgba(14,14,12,0.7);
}
@media (max-width: 760px) {
  .v10-standfirst {
    grid-template-columns: 1fr;
    gap: 14px;
    max-width: 100%;
  }
  .v10-standfirst-col { max-width: 100%; }
  .v10-marginalia {
    padding-left: 0;
    padding-top: 12px;
    border-left: 0;
    border-top: 1px dashed rgba(14,14,12,0.25);
  }
}

/* === CTA row + cells === */
.v9-cta-row,
.v10-cta-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: clamp(14px, 2vw, 28px);
  width: 100%;
  margin-top: clamp(6px, 1.4vh, 16px);
}
.v10-cta-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  flex: 1 1 0;
  max-width: 360px;
  opacity: 0;
  transform: translateY(10px);
  animation: v10-fade-up 620ms cubic-bezier(.22, 1, .36, 1) 420ms forwards;
}
.v10-cta-cell:nth-child(2) { animation-delay: 500ms; }
.v10-cta-overline {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(14,14,12,0.55);
}
.v10-cta-overline::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(14,14,12,0.25);
}
.v9-cta-card {
  appearance: none;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  width: 100%;
  min-height: clamp(190px, 26vh, 226px);
  padding: clamp(24px, 3.2vw, 36px) clamp(24px, 3.2vw, 36px) clamp(56px, 7vw, 72px);
  background: #FFC700;
  border: 2px solid #0a0a0a;
  border-radius: 6px;
  color: #0a0a0a;
  font: inherit;
  text-align: left;
  cursor: pointer;
  box-shadow:
    0 2px 4px rgba(14, 14, 12, 0.04),
    0 10px 24px rgba(14, 14, 12, 0.12),
    0 22px 48px rgba(14, 14, 12, 0.08);
  transform: translate(0, 0);
  transition: transform 320ms cubic-bezier(.22, 1, .36, 1),
              box-shadow 320ms cubic-bezier(.22, 1, .36, 1);
  outline: none;
  -webkit-tap-highlight-color: transparent;
  isolation: isolate;
  overflow: hidden;
}
.v9-cta-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.10);
  transition: background 280ms cubic-bezier(.22, 1, .36, 1);
  z-index: 0;
}
.v9-cta-card::after { content: none; }
.v9-cta-card:hover::before,
.v9-cta-card:focus-visible::before {
  background: rgba(0, 0, 0, 0);
}
.v9-cta-card > * { position: relative; z-index: 1; }
.v9-cta-card:hover,
.v9-cta-card:focus-visible {
  transform: translateY(-6px);
  box-shadow:
    0 4px 8px rgba(14, 14, 12, 0.06),
    0 18px 38px rgba(14, 14, 12, 0.18),
    0 36px 72px rgba(14, 14, 12, 0.14);
}
.v9-cta-card:hover .v9-cta-card-title,
.v9-cta-card:focus-visible .v9-cta-card-title {
  color: #1F7A3E;
}
.v9-cta-card:hover .v9-cta-card-num,
.v9-cta-card:focus-visible .v9-cta-card-num {
  color: #1F7A3E;
  transform: translateY(-2px);
}
.v9-cta-card:hover .v10-card-ornament,
.v9-cta-card:focus-visible .v10-card-ornament {
  transform: rotate(45deg);
}
.v9-cta-card:active {
  transform: translateY(-1px) scale(0.99);
  box-shadow:
    0 2px 6px rgba(14, 14, 12, 0.10),
    0 6px 14px rgba(14, 14, 12, 0.08);
  transition-duration: 100ms;
}
.v9-cta-card-num {
  position: absolute;
  top: clamp(18px, 2.4vw, 24px);
  right: clamp(20px, 2.6vw, 26px);
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(14, 14, 12, 0.55);
  font-variant-numeric: tabular-nums;
  z-index: 2;
  transition: color 240ms cubic-bezier(.22, 1, .36, 1), transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.v9-cta-card-title {
  margin: 0;
  margin-top: 8px;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(24px, 2.6vw, 32px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: #0a0a0a;
  text-wrap: balance;
  font-feature-settings: "kern", "liga", "calt";
  transition: color 240ms cubic-bezier(.22, 1, .36, 1);
}
.v10-card-rule-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.v10-card-ornament {
  display: inline-block;
  font-size: 13px;
  line-height: 1;
  color: var(--v6-accent);
  transform: rotate(0deg);
  transition: transform 380ms cubic-bezier(.22, 1, .36, 1);
}
.v9-cta-card-rule {
  display: block;
  width: 40px;
  height: 3px;
  background: #1F7A3E;
  margin: 4px 0 4px;
  transition: width 360ms cubic-bezier(.22, 1, .36, 1);
}
.v9-cta-card:hover .v9-cta-card-rule,
.v9-cta-card:focus-visible .v9-cta-card-rule {
  width: 88px;
}
.v9-cta-card-sub {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.55;
  color: rgba(14, 14, 12, 0.7);
  max-width: 26ch;
  text-wrap: pretty;
}
.v9-cta-card-arrow {
  position: absolute;
  right: clamp(20px, 3vw, 28px);
  bottom: clamp(20px, 3vw, 28px);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #1F7A3E;
  z-index: 2;
}
.v9-cta-card-arrow span {
  display: inline-block;
  font-size: 14px;
  transition: transform 320ms cubic-bezier(.22, 1, .36, 1);
}
.v9-cta-card:hover .v9-cta-card-arrow span,
.v9-cta-card:focus-visible .v9-cta-card-arrow span {
  transform: translateX(7px);
}

@media (max-width: 640px) {
  .v9-cta-row,
  .v10-cta-row { flex-direction: column; align-items: stretch; gap: 18px; }
  .v10-cta-cell { max-width: none; }
  .v9-cta-card { max-width: none; min-height: 160px; }
  .v9-cta-card-arrow { opacity: 0.85; }
  .v9-cta-card-num { font-size: 10px; }
}

/* === v10 editorial seal === */
.v10-seal {
  position: absolute;
  right: clamp(48px, 6vw, 96px);
  bottom: clamp(28px, 4vh, 52px);
  width: 96px;
  height: 96px;
  z-index: 1;
  color: var(--v6-accent);
  transform: rotate(-7deg);
  opacity: 0;
  animation: v10-seal-in 760ms cubic-bezier(.22, 1, .36, 1) 640ms forwards;
  pointer-events: none;
  user-select: none;
}
.v10-seal-ring {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  opacity: 0.85;
}
.v10-seal-ring-inner {
  fill: none;
  stroke: currentColor;
  stroke-width: 0.6;
  opacity: 0.45;
}
.v10-seal text {
  fill: currentColor;
  font-family: var(--bl-font-eyebrow);
  font-size: 6.4px;
  font-weight: 700;
  letter-spacing: 1.6px;
  text-transform: uppercase;
}
.v10-seal-mono {
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-size: 18px !important;
  letter-spacing: 0 !important;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
}
.v10-seal-est {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: 6.2px !important;
  letter-spacing: 0.6px !important;
  text-transform: none !important;
}
@media (max-width: 760px) {
  .v10-seal { display: none; }
}

/* === keyframes === */
@keyframes v10-fade-up {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes v10-fade-down {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes v10-rail-in {
  to { opacity: 0.7; }
}
@keyframes v10-seal-in {
  to { opacity: 1; }
}

.v8-root :where(button, a, [role="button"], input, select, textarea):focus-visible {
  outline: 2px solid var(--v6-accent);
  outline-offset: 3px;
}
.v8-root .v9-cta-card:focus-visible {
  outline: none;
}

html:has(.v8-root) { scroll-behavior: smooth; }
.v8-root .v9-hero,
.v8-root .bl-books,
.v8-root .bl-editorial,
.v8-root .bl-footer {
  scroll-margin-top: 96px;
}

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
  .v10-masthead,
  .v10-eyebrow,
  .v10-hero-title,
  .v10-standfirst,
  .v10-cta-cell,
  .v10-rail,
  .v10-seal { opacity: 1 !important; transform: none !important; }
  .v10-rail { opacity: 0.7 !important; }
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
  color: var(--bl-ink);
  font-family: var(--bl-font-body);
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
type Phase = 'choose' | 'leaving' | 'questions';

const CARD_TITLES: Record<'reader' | 'author', string> = {
  reader: 'Start reading',
  author: 'Start writing',
};

const CARD_SUBS: Record<'reader' | 'author', string> = {
  reader: 'Read fiction before it hits the shelf.',
  author: 'Publish your manuscript. Find your readers.',
};

const CARD_OVERLINES: Record<'reader' | 'author', string> = {
  reader: 'For the curious reader',
  author: 'For the working author',
};

export default function V10Page() {
  const [phase, setPhase] = useState<Phase>('choose');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [waitlist, setWaitlist] = useState<{ open: boolean; eyebrow?: string }>({ open: false });
  const [intake, setIntake] = useState<IntakePayload | null>(null);

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
    const sanitized: IntakePayload =
      payload.region === 'writer'
        ? { region: 'writer', answers: serializeWriter(payload.answers) }
        : payload;

    setIntake(sanitized);
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.setTimeout(() => setPhase('questions'), 360);
  };

  const rootClass = [
    'v8-root',
    'v9-root',
    'v10-root',
    'is-palette-stranger',
    phase === 'questions' ? 'is-phase-questions' : '',
  ].filter(Boolean).join(' ');

  return (
    <main className={rootClass}>
      <style dangerouslySetInnerHTML={{ __html: V10_CSS }} />

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
        <div className="v8-nav-left">
          <Link className="v8-brand" href="/" aria-label="BetweenReads, home">
            <span>between</span>
            <span className="v8-brand-dot">.</span>
            <span>reads</span>
          </Link>
          <div className="v8-nav-links">
            <Link className="v8-nav-link" href="/betweenlines">BetweenLines</Link>
            <div className="v8-nav-group">
              <Link className="v8-nav-link" href="/readers">Readers</Link>
              <div className="v8-nav-dropdown" role="menu" aria-label="Readers sub-pages">
                <Link className="v8-nav-sub" href="/readers/read" role="menuitem">Read</Link>
                <Link className="v8-nav-sub" href="/readers/listen" role="menuitem">Listen</Link>
                <Link className="v8-nav-sub" href="/readers/kids" role="menuitem">Kids</Link>
              </div>
            </div>
            <div className="v8-nav-group">
              <Link className="v8-nav-link" href="/creators">Creators</Link>
              <div className="v8-nav-dropdown" role="menu" aria-label="Creators sub-pages">
                <Link className="v8-nav-sub" href="/creators/write-on-betweenreads" role="menuitem">Write on BetweenReads</Link>
                <Link className="v8-nav-sub" href="/creators/upload-illustrations" role="menuitem">Upload Illustrations</Link>
                <Link className="v8-nav-sub" href="/creators/securebetareads" role="menuitem">Secure BetaReads</Link>
                <Link className="v8-nav-sub" href="/creators/agent-readiness" role="menuitem">Agent Readiness</Link>
              </div>
            </div>
            <Link className="v8-nav-link" href="/pricing">Pricing</Link>
            <Link className="v8-nav-link" href="/faq">FAQ</Link>
          </div>
        </div>
        <div className="v8-nav-meta">
          <button
            type="button"
            className="v8-nav-cta"
            onClick={() => openWaitlist()}
          >
            Join free
          </button>
        </div>
      </nav>

      <div className="v10-masthead" aria-hidden="true">
        <span className="v10-masthead-cell">between.reads</span>
        <span className="v10-masthead-center">
          Curated by humans
          <span className="v10-mast-dot" aria-hidden="true" />
          Read between the lines
        </span>
        <span className="v10-masthead-cell">est.&nbsp;MMXXVI</span>
      </div>

      <section
        className={`v9-hero v10-hero${phase === 'leaving' ? ' is-leaving' : ''}`}
        aria-label="Choose your role"
      >
        {phase !== 'questions' && (
          <>
            <span className="v10-rail v10-rail-left" aria-hidden="true">
              New writing &nbsp;·&nbsp; New readers &nbsp;·&nbsp; No algorithm
            </span>
            <span className="v10-rail v10-rail-right" aria-hidden="true">
              between.reads &nbsp;/&nbsp; for readers &amp; writers &nbsp;/&nbsp; est.&nbsp;MMXXVI
            </span>
            <span className="v10-crop v10-crop-tl" aria-hidden="true">┌</span>
            <span className="v10-crop v10-crop-tr" aria-hidden="true">┐</span>
            <span className="v10-crop v10-crop-bl" aria-hidden="true">└</span>
            <span className="v10-crop v10-crop-br" aria-hidden="true">┘</span>

            <div className="v9-hero-inner v10-hero-inner">
              <div className="v10-eyebrow" aria-hidden="true">
                <span className="v10-eyebrow-rule" />
                <span>From the editors</span>
                <span className="v10-eyebrow-rule" />
              </div>

              <h1 className="v9-hero-title v10-hero-title">
                Discover <em className="v10-italic">emerging</em> authors{' '}
                <span className="v10-amp">&amp;</span>{' '}
                <em className="v10-italic">new voices.</em>
              </h1>

              <div className="v10-standfirst">
                <div className="v10-standfirst-col">
                  <span className="v10-standfirst-rule" aria-hidden="true" />
                  <p className="v9-hero-sub v10-hero-sub">
                    <span className="v10-dropcap">C</span>urated by humans. No algorithm. Three free reads a month — yours.
                  </p>
                </div>
                <aside className="v10-marginalia" aria-hidden="true">
                  <span className="v10-margin-handwritten">* yes, really &mdash; humans.</span>
                  <span className="v10-margin-footnote">† three reads&nbsp;/&nbsp;month, every month, on the house.</span>
                </aside>
              </div>

              <div className="v9-cta-row v10-cta-row">
                {(['reader', 'author'] as const).map((r, i) => (
                  <div key={r} className="v10-cta-cell">
                    <span className="v10-cta-overline" aria-hidden="true">
                      {CARD_OVERLINES[r]}
                    </span>
                    <button
                      type="button"
                      className={`v9-cta-card v10-cta-card v9-cta-card-${r}`}
                      onClick={() => open(r)}
                      aria-label={`${CARD_TITLES[r]}. ${CARD_SUBS[r]}`}
                    >
                      <span className="v9-cta-card-num" aria-hidden="true">
                        Nº&nbsp;{String(i + 1).padStart(2, '0')}
                      </span>
                      <h2 className="v9-cta-card-title">{CARD_TITLES[r]}</h2>
                      <span className="v10-card-rule-row" aria-hidden="true">
                        <span className="v10-card-ornament">❖</span>
                        <span className="v9-cta-card-rule" />
                      </span>
                      <p className="v9-cta-card-sub">{CARD_SUBS[r]}</p>
                      <span className="v9-cta-card-arrow" aria-hidden="true">
                        Open <span>→</span>
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <svg
              className="v10-seal"
              viewBox="0 0 100 100"
              aria-hidden="true"
              role="presentation"
            >
              <defs>
                <path
                  id="v10-seal-circle"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <circle cx="50" cy="50" r="46" className="v10-seal-ring" />
              <circle cx="50" cy="50" r="40" className="v10-seal-ring-inner" />
              <text>
                <textPath href="#v10-seal-circle" startOffset="0">
                  between.reads · curated by humans · est. MMXXVI ·&nbsp;
                </textPath>
              </text>
              <text x="50" y="48" textAnchor="middle" className="v10-seal-mono">B.R</text>
              <text x="50" y="64" textAnchor="middle" className="v10-seal-est">est. MMXXVI</text>
            </svg>
          </>
        )}

        {phase === 'questions' && (
          <IntakeHero
            initialMode={selectedRegion === 'author' ? 'writer' : 'reader'}
            onBack={backToChoose}
            onSubmit={handleIntakeSubmit}
          />
        )}
      </section>

      <OpenCall onReader={() => open('reader')} onWriter={() => open('author')} />

      <SignupOffers onReader={() => open('reader')} onWriter={() => open('author')} />

      <FaqTeaser onReader={() => open('reader')} onWriter={() => open('author')} />
      <Footer />

      <WaitlistOverlay
        open={waitlist.open}
        eyebrow={waitlist.eyebrow}
        intake={intake}
        onClose={closeWaitlist}
      />
    </main>
  );
}
