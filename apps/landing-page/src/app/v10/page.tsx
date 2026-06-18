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

/* === v9/v10 shared hero shell === */
.v9-hero {
  position: relative;
  min-height: calc(100vh - 76px);
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
.v9-root.is-phase-questions .v10-crop {
  opacity: 0;
  pointer-events: none;
  transition: opacity 320ms cubic-bezier(.22, 1, .36, 1);
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

/* === v10 headline (Bodoni Moda — high-contrast didone, magazine-cover energy) === */
.v9-hero-title,
.v10-hero-title {
  margin: 0;
  font-family: 'Bodoni Moda', 'Bodoni 72', 'Didot', Georgia, serif;
  font-weight: 900;
  font-size: clamp(44px, 7vw, 104px);
  line-height: 0.96;
  letter-spacing: -0.025em;
  color: var(--v6-text-strong);
  max-width: 20ch;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt";
  /* screen-print misregister — faint forest-green offset behind the type for
     a pop-poster echo. */
  text-shadow: 5px 5px 0 rgba(31, 122, 62, 0.14);
  opacity: 0;
  transform: translateY(10px);
  animation: v10-fade-up 620ms cubic-bezier(.22, 1, .36, 1) 180ms forwards;
}
.v10-italic {
  font-family: 'Bodoni Moda', 'Bodoni 72', 'Didot', Georgia, serif;
  font-style: italic;
  font-weight: 700;
  letter-spacing: -0.005em;
  margin: 0 0.01em;
}
.v10-amp {
  display: inline-block;
  font-family: 'Bodoni Moda', 'Bodoni 72', 'Didot', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-size: 0.96em;
  letter-spacing: -0.01em;
  color: inherit;
  padding: 0 0.04em;
}

/* === v10 hero subhead — Fraunces, bigger, single line on desktop === */
.v9-hero-sub,
.v10-hero-sub {
  margin: clamp(4px, 1.4vh, 16px) 0 0;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 500;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(20px, 2.4vw, 30px);
  line-height: 1.3;
  letter-spacing: -0.005em;
  color: var(--v6-text-strong);
  text-align: center;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(8px);
  animation: v10-fade-up 600ms cubic-bezier(.22, 1, .36, 1) 280ms forwards;
}
@media (max-width: 760px) {
  .v9-hero-sub,
  .v10-hero-sub {
    white-space: normal;
    font-size: clamp(17px, 4.2vw, 22px);
    text-wrap: pretty;
    max-width: 32ch;
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
.v9-cta-card {
  appearance: none;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  width: 100%;
  flex: 1;
  min-height: clamp(200px, 28vh, 240px);
  padding: clamp(24px, 3.2vw, 36px) clamp(24px, 3.2vw, 36px) clamp(56px, 7vw, 72px);
  /* No card fill — the yellow page shows through; strong black edge + hard
     offset shadow do all the visual work. Pop-poster / screen-print feel. */
  background: transparent;
  border: 3px solid #0a0a0a;
  border-radius: 0;
  color: #0a0a0a;
  font: inherit;
  text-align: left;
  cursor: pointer;
  box-shadow: 7px 7px 0 #0a0a0a;
  transform: translate(0, 0);
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1),
              box-shadow 220ms cubic-bezier(.22, 1, .36, 1);
  outline: none;
  -webkit-tap-highlight-color: transparent;
  isolation: isolate;
  overflow: hidden;
}
.v9-cta-card::before { display: none; }
.v9-cta-card::after {
  /* Lichtenstein-style halftone field sitting in the top-right corner.
     Dot grid masked by a radial fade so the dots are dense at the corner
     and dissolve into the page yellow as they move inward. Pure pop-art. */
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(80px, 14vw, 130px);
  height: clamp(80px, 14vw, 130px);
  background-image: radial-gradient(circle, #0a0a0a 1.6px, transparent 1.8px);
  background-size: 9px 9px;
  background-position: 4px 4px;
  -webkit-mask: radial-gradient(circle at top right, #000 0%, transparent 78%);
          mask: radial-gradient(circle at top right, #000 0%, transparent 78%);
  pointer-events: none;
  opacity: 0.55;
  z-index: 0;
  transition: opacity 220ms cubic-bezier(.22, 1, .36, 1);
}
.v9-cta-card > * { position: relative; z-index: 1; }
.v9-cta-card:hover,
.v9-cta-card:focus-visible {
  /* slide into the offset shadow */
  transform: translate(3px, 3px);
  box-shadow: 4px 4px 0 #0a0a0a;
}
.v9-cta-card:hover::after,
.v9-cta-card:focus-visible::after {
  opacity: 0.85;
}
.v9-cta-card:hover .v9-cta-card-title,
.v9-cta-card:focus-visible .v9-cta-card-title {
  color: #1F7A3E;
}
.v9-cta-card:hover .v10-card-ornament,
.v9-cta-card:focus-visible .v10-card-ornament {
  transform: rotate(45deg);
}
.v9-cta-card:active {
  /* pressed all the way into the shadow */
  transform: translate(7px, 7px);
  box-shadow: 0 0 0 #0a0a0a;
  transition-duration: 80ms;
}
.v9-cta-card-title {
  margin: 0;
  margin-top: 8px;
  font-family: 'Bodoni Moda', 'Bodoni 72', 'Didot', Georgia, serif;
  font-weight: 800;
  font-size: clamp(26px, 2.8vw, 36px);
  line-height: 1.02;
  letter-spacing: -0.015em;
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
  font-family: 'Outfit', system-ui, sans-serif;
  font-weight: 500;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.5;
  letter-spacing: 0;
  color: rgba(14, 14, 12, 0.78);
  max-width: 28ch;
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
}

/* === keyframes === */
@keyframes v10-fade-up {
  to { opacity: 1; transform: translateY(0); }
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
  .v10-eyebrow,
  .v10-hero-title,
  .v10-hero-sub,
  .v10-cta-cell { opacity: 1 !important; transform: none !important; }
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

      <section
        className={`v9-hero v10-hero${phase === 'leaving' ? ' is-leaving' : ''}`}
        aria-label="Choose your role"
      >
        {phase !== 'questions' && (
          <>
            <span className="v10-crop v10-crop-tl" aria-hidden="true">┌</span>
            <span className="v10-crop v10-crop-tr" aria-hidden="true">┐</span>
            <span className="v10-crop v10-crop-bl" aria-hidden="true">└</span>
            <span className="v10-crop v10-crop-br" aria-hidden="true">┘</span>

            <div className="v9-hero-inner v10-hero-inner">
              <div className="v10-eyebrow" aria-hidden="true">
                <span className="v10-eyebrow-rule" />
              </div>

              <h1 className="v9-hero-title v10-hero-title">
                Discover <em className="v10-italic">emerging</em> authors.
              </h1>

              <p className="v9-hero-sub v10-hero-sub">
                Curated by humans. No algorithm. Three free reads a month.
              </p>

              <div className="v9-cta-row v10-cta-row">
                {(['reader', 'author'] as const).map((r) => (
                  <div key={r} className="v10-cta-cell">
                    <button
                      type="button"
                      className={`v9-cta-card v10-cta-card v9-cta-card-${r}`}
                      onClick={() => open(r)}
                      aria-label={`${CARD_TITLES[r]}. ${CARD_SUBS[r]}`}
                    >
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

      <SignupOffers />

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
