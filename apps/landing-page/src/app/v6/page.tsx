'use client';

import { useEffect, useState } from 'react';
import { InlineQuestions, type InlineAnswers } from './InlineQuestions';
import { SignUpOverlay, type SignUpVariant } from './SignUp';
import EditorialSplit from './sections/EditorialSplit';
import type { StartTarget } from './sections/EditorialSplit';
import Footer from './sections/Footer';

const V6_CSS = `
.v6-root {
  --v6-accent: #e94b36;
  --v6-accent-soft: rgba(233, 75, 54, 0.06);
  --v6-text: #0e0e0c;
  --v6-text-strong: #0e0e0c;
  --v6-text-muted: #14140f;
  --v6-surface: #ffffff;
  --v6-divider: rgba(14,14,12,0.18);
  --v6-stroke: rgba(255,255,255,0.85);
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
.v6-root.is-palette-forest {
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
.v6-root.is-palette-pop {
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
.v6-root.is-palette-pop .v6-tweaks { background: rgba(255, 255, 255, 0.95); }
.v6-root.is-palette-pop .v6-bg-scrim {
  background: linear-gradient(180deg, rgba(255,230,0,0.42) 0%, rgba(255,230,0,0.28) 50%, rgba(255,230,0,0.46) 100%);
}
.v6-root.is-palette-stranger {
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
.v6-root.is-palette-stranger .v6-tweaks { background: rgba(255,255,255,0.7); }
.v6-bg {
  position: absolute;
  inset: -40px;
  background: url('/v6-hero.jpg') center/cover no-repeat;
  filter: blur(6px) saturate(1.1);
  transform: scale(1.03);
  z-index: 0;
}
.v6-bg-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.36) 100%);
  z-index: 1;
  pointer-events: none;
}
.v6-root.is-palette-forest .v6-bg-scrim {
  background: linear-gradient(180deg, rgba(245,237,224,0.42) 0%, rgba(245,237,224,0.28) 50%, rgba(245,237,224,0.46) 100%);
}
.v6-bg-grain {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.v6-nav {
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
.v6-brand {
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
.v6-brand-dot {
  color: var(--v6-accent);
  padding: 0 4px;
  font-weight: 800;
  transform: translateY(-1px);
}
.v6-nav-meta {
  display: flex;
  align-items: center;
  gap: 22px;
  font-family: 'Bricolage Grotesque', sans-serif;
}
.v6-nav-issue {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--v6-accent);
}
.v6-nav-sep {
  width: 1px;
  height: 14px;
  background: var(--v6-divider);
}
.v6-nav-link {
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
.v6-nav-link:hover { color: var(--v6-accent); }

.v6-tweaks {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,0.78);
  border: 1px solid var(--v6-divider);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(14,14,12,0.08);
  font-family: 'Bricolage Grotesque', sans-serif;
}
.v6-root.is-palette-forest .v6-tweaks { background: rgba(245,237,224,0.82); }
.v6-tweak {
  appearance: none;
  border: 0;
  background: transparent;
  padding: 6px 12px;
  border-radius: 999px;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--v6-text-strong);
  cursor: pointer;
  transition: background 180ms ease, color 180ms ease;
  white-space: nowrap;
}
.v6-tweak:hover { background: var(--v6-accent-soft); }
.v6-tweak.is-on { background: var(--v6-accent); color: #fff; }
.v6-root.is-palette-forest .v6-tweak.is-on { color: #F5EDE0; }
.v6-tweak-label {
  opacity: 0.55;
  margin-right: 4px;
  font-weight: 500;
}

.v6-hero {
  position: relative;
  height: calc(100vh - 76px);
  overflow: hidden;
  background: var(--v6-surface);
}
.v6-stage {
  position: absolute;
  inset: 0;
  z-index: 3;
  overflow: hidden;
}
.v6-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
.v6-region {
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.v6-region-fill {
  fill: rgba(233, 75, 54, 0);
  transition: fill 500ms ease;
}
.v6-region.is-hovered .v6-region-fill,
.v6-region:focus-visible .v6-region-fill {
  fill: var(--v6-accent-soft);
}
.v6-region-label {
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
  transition: fill 300ms ease;
}
.v6-region-sub {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 22px;
  fill: var(--v6-text-muted);
  paint-order: stroke fill;
  stroke: var(--v6-stroke);
  stroke-width: 4;
  stroke-linejoin: round;
  opacity: 0;
  transition: fill 300ms ease, opacity 260ms ease;
}
.v6-region-cta {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.18em;
  fill: var(--v6-accent);
  paint-order: stroke fill;
  stroke: var(--v6-stroke);
  stroke-width: 4;
  stroke-linejoin: round;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 240ms ease 60ms;
}
.v6-region.is-hovered .v6-region-label,
.v6-region:focus-visible .v6-region-label { fill: var(--v6-accent); }
.v6-region.is-hovered .v6-region-sub,
.v6-region:focus-visible .v6-region-sub { fill: var(--v6-text-strong); opacity: 1; }
.v6-region.is-hovered .v6-region-cta,
.v6-region:focus-visible .v6-region-cta { opacity: 1; }
.v6-divider {
  stroke: var(--v6-text-strong);
  stroke-width: 2.2;
  stroke-linecap: round;
  fill: none;
}

.v6-columns {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.v6-col {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 40px 28px;
  background: transparent;
  border: 0;
  outline: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  font: inherit;
  color: inherit;
  text-align: center;
  transition: background 400ms ease;
}
.v6-col.is-hovered,
.v6-col:focus-visible {
  background: var(--v6-accent-soft);
}
.v6-col-label {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-weight: 800;
  font-size: clamp(40px, 5.4vw, 76px);
  letter-spacing: -0.035em;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  color: var(--v6-text-strong);
  line-height: 1.02;
  max-width: 12ch;
  transition: color 300ms ease;
}
.v6-col-reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-height: 76px;
}
.v6-col-sub {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 17px;
  color: var(--v6-text-muted);
  max-width: 22ch;
  line-height: 1.35;
  opacity: 0;
  transition: opacity 240ms ease;
}
.v6-col-cta {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--v6-accent);
  opacity: 0;
  transform: translateY(2px);
  transition: opacity 240ms ease 60ms, transform 240ms ease 60ms;
}
.v6-col.is-hovered .v6-col-label,
.v6-col:focus-visible .v6-col-label { color: var(--v6-accent); }
.v6-col.is-hovered .v6-col-sub,
.v6-col:focus-visible .v6-col-sub { opacity: 1; }
.v6-col.is-hovered .v6-col-cta,
.v6-col:focus-visible .v6-col-cta { opacity: 1; transform: none; }

.v6-stage-inner {
  position: absolute;
  inset: 0;
  transition: opacity 320ms ease, transform 360ms cubic-bezier(.22,1,.36,1);
  will-change: opacity, transform;
}
.v6-stage-inner.is-leaving,
.v6-stage-inner.is-hidden {
  opacity: 0;
  transform: translateY(-12px) scale(.985);
  pointer-events: none;
}

.v6-stack {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 40px;
}
.v6-stack-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 18px;
}
.v6-stack-card {
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
  transition: background 300ms ease;
}
.v6-stack-card.is-hovered,
.v6-stack-card:focus-visible { background: var(--v6-accent-soft); }
.v6-stack-label {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-weight: 800;
  font-size: clamp(36px, 4.4vw, 64px);
  letter-spacing: -0.035em;
  line-height: 1.02;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  color: var(--v6-text-strong);
  transition: color 240ms ease;
}
.v6-stack-card.is-hovered .v6-stack-label,
.v6-stack-card:focus-visible .v6-stack-label { color: var(--v6-accent); }
.v6-stack-both .v6-stack-label { font-size: clamp(28px, 3.4vw, 48px); }
.v6-stack-reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  min-height: 56px;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 240ms ease, transform 240ms ease;
}
.v6-stack-card.is-hovered .v6-stack-reveal,
.v6-stack-card:focus-visible .v6-stack-reveal { opacity: 1; transform: none; }
.v6-stack-sub {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: var(--v6-text-muted);
  max-width: 28ch;
  line-height: 1.35;
}
.v6-stack-cta {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--v6-accent);
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

/* === Highlight mode: persistently apply hover styles to all regions === */
.v6-root.is-highlight .v6-region { transition: opacity 280ms ease; }
.v6-root.is-highlight .v6-region-fill { fill: var(--v6-accent-soft); }
.v6-root.is-highlight .v6-region-label { fill: var(--v6-accent); }
.v6-root.is-highlight .v6-region-sub {
  fill: var(--v6-text-strong);
  opacity: 1;
}
.v6-root.is-highlight .v6-region-cta { opacity: 1; }
.v6-root.is-highlight .v6-region:hover .v6-region-fill,
.v6-root.is-highlight .v6-region:focus-visible .v6-region-fill {
  fill: color-mix(in srgb, var(--v6-accent) 22%, transparent);
}
.v6-root.is-highlight:has(.v6-region:hover) .v6-region:not(:hover) {
  opacity: 0.4;
}

.v6-root.is-highlight .v6-col {
  background: var(--v6-accent-soft);
  transition: background 280ms ease, opacity 280ms ease;
}
.v6-root.is-highlight .v6-col-label { color: var(--v6-accent); }
.v6-root.is-highlight .v6-col-reveal { opacity: 1; transform: none; }
.v6-root.is-highlight .v6-col:hover,
.v6-root.is-highlight .v6-col:focus-visible {
  background: color-mix(in srgb, var(--v6-accent) 22%, transparent);
}
.v6-root.is-highlight:has(.v6-col:hover) .v6-col:not(:hover) {
  opacity: 0.4;
}

.v6-root.is-highlight .v6-stack-card {
  background: var(--v6-accent-soft);
  transition: background 280ms ease, opacity 280ms ease;
}
.v6-root.is-highlight .v6-stack-label { color: var(--v6-accent); }
.v6-root.is-highlight .v6-stack-reveal { opacity: 1; transform: none; }
.v6-root.is-highlight .v6-stack-card:hover,
.v6-root.is-highlight .v6-stack-card:focus-visible {
  background: color-mix(in srgb, var(--v6-accent) 22%, transparent);
}
.v6-root.is-highlight:has(.v6-stack-card:hover) .v6-stack-card:not(:hover) {
  opacity: 0.4;
}

/* Hawkins: highlight-mode base is transparent (no persistent accent fill),
   but hovering still fills the background with accent-soft via color-mix. */
.v6-root.is-palette-stranger.is-highlight .v6-region-fill { fill: transparent; }
.v6-root.is-palette-stranger.is-highlight .v6-col { background: transparent; }
.v6-root.is-palette-stranger.is-highlight .v6-stack-card { background: transparent; }

.v6-root.is-palette-stranger.is-highlight .v6-region:hover .v6-region-fill,
.v6-root.is-palette-stranger.is-highlight .v6-region:focus-visible .v6-region-fill {
  fill: color-mix(in srgb, var(--v6-accent) 22%, transparent);
}
.v6-root.is-palette-stranger.is-highlight .v6-col:hover,
.v6-root.is-palette-stranger.is-highlight .v6-col:focus-visible {
  background: color-mix(in srgb, var(--v6-accent) 22%, transparent);
}
.v6-root.is-palette-stranger.is-highlight .v6-stack-card:hover,
.v6-root.is-palette-stranger.is-highlight .v6-stack-card:focus-visible {
  background: color-mix(in srgb, var(--v6-accent) 22%, transparent);
}
`;

type Region = 'author' | 'reader' | 'both';
type Layout = 'curved' | 'columns' | 'stacked';
type PaletteV6 = 'crimson' | 'forest' | 'pop' | 'stranger';
type Phase = 'choose' | 'leaving' | 'questions';

const PALETTE_CYCLE: PaletteV6[] = ['forest', 'crimson', 'pop', 'stranger'];
const cyclePalette = (p: PaletteV6) =>
  PALETTE_CYCLE[(PALETTE_CYCLE.indexOf(p) + 1) % PALETTE_CYCLE.length];
const PALETTE_LABELS: Record<PaletteV6, string> = {
  forest: 'Forest',
  crimson: 'Crimson',
  pop: 'Pop',
  stranger: 'Hawkins',
};

const LAYOUT_CYCLE: Layout[] = ['curved', 'columns', 'stacked'];
const cycleLayout = (l: Layout) =>
  LAYOUT_CYCLE[(LAYOUT_CYCLE.indexOf(l) + 1) % LAYOUT_CYCLE.length];
const LAYOUT_LABELS: Record<Layout, string> = {
  curved: 'Curved',
  columns: 'Columns',
  stacked: 'Stacked',
};

const CTA_LABELS: Record<Region, string> = {
  author: 'Start →',
  reader: 'Start →',
  both: 'Start →',
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

const REGIONS: Region[] = ['author', 'reader', 'both'];

export default function V6Page() {
  const [hovered, setHovered] = useState<Region | null>(null);
  const [phase, setPhase] = useState<Phase>('choose');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [layout, setLayout] = useState<Layout>('curved');
  const [palette, setPalette] = useState<PaletteV6>('stranger');
  const [bgOn, setBgOn] = useState(false);
  const [highlightOn, setHighlightOn] = useState(true);
  const [signUp, setSignUp] = useState<{ open: boolean; variant: SignUpVariant; eyebrow?: string }>(
    { open: false, variant: 'signup' }
  );

  const openSignIn = () => setSignUp({ open: true, variant: 'signin' });

  const completeInline = (_answers: InlineAnswers, finalRegion: Region) => {
    const eyebrow =
      finalRegion === 'reader'
        ? 'Reader profile saved'
        : finalRegion === 'author'
          ? 'Writer profile saved'
          : 'Both profiles saved';
    setPhase('choose');
    setSelectedRegion(null);
    setSignUp({ open: true, variant: 'signup', eyebrow });
  };

  const backToChoose = () => {
    setPhase('choose');
    setSelectedRegion(null);
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
    setSelectedRegion(target);
    setPhase('questions');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    'v6-root',
    palette === 'forest' ? 'is-palette-forest' : '',
    palette === 'pop' ? 'is-palette-pop' : '',
    palette === 'stranger' ? 'is-palette-stranger' : '',
    highlightOn ? 'is-highlight' : '',
  ].filter(Boolean).join(' ');

  return (
    <main className={rootClass}>
      <style dangerouslySetInnerHTML={{ __html: V6_CSS }} />

      <nav className="v6-nav">
        <a className="v6-brand" href="#" aria-label="Between Lines, home">
          <span>between</span>
          <span className="v6-brand-dot">·</span>
          <span>lines</span>
        </a>
        <div className="v6-tweaks" role="group" aria-label="Page tweaks">
          <button
            type="button"
            className={`v6-tweak${layout !== 'curved' ? ' is-on' : ''}`}
            onClick={() => setLayout(cycleLayout)}
            aria-pressed={layout !== 'curved'}
          >
            <span className="v6-tweak-label">Layout</span>
            {LAYOUT_LABELS[layout]}
          </button>
          <button
            type="button"
            className={`v6-tweak${palette !== 'forest' ? ' is-on' : ''}`}
            onClick={() => setPalette(cyclePalette)}
            aria-pressed={palette !== 'forest'}
          >
            <span className="v6-tweak-label">Palette</span>
            {PALETTE_LABELS[palette]}
          </button>
          <button
            type="button"
            className={`v6-tweak${bgOn ? ' is-on' : ''}`}
            onClick={() => setBgOn((v) => !v)}
            aria-pressed={bgOn}
          >
            <span className="v6-tweak-label">Background</span>
            {bgOn ? 'On' : 'Off'}
          </button>
          <button
            type="button"
            className={`v6-tweak${highlightOn ? ' is-on' : ''}`}
            onClick={() => setHighlightOn((v) => !v)}
            aria-pressed={highlightOn}
          >
            <span className="v6-tweak-label">Highlight</span>
            {highlightOn ? 'On' : 'Off'}
          </button>
        </div>
        <div className="v6-nav-meta">
          <span className="v6-nav-issue">Issue №01</span>
          <span className="v6-nav-sep" aria-hidden="true" />
          <button
            type="button"
            className="v6-nav-link v6-nav-signin"
            onClick={openSignIn}
          >
            Sign in
          </button>
        </div>
      </nav>

      <section className="v6-hero" aria-label="Choose your role">
      {bgOn && (
        <>
          <div className="v6-bg" aria-hidden="true" />
          <div className="v6-bg-scrim" aria-hidden="true" />
          <div className="v6-bg-grain" aria-hidden="true" />
        </>
      )}
      <div className="v6-stage">
        <div
          className={`v6-stage-inner${
            phase === 'leaving' ? ' is-leaving' : phase === 'questions' ? ' is-hidden' : ''
          }`}
          aria-hidden={phase !== 'choose'}
        >
        {layout === 'curved' ? (
          <svg
            className="v6-canvas"
            viewBox="0 0 1600 1000"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Between Lines</title>
            <desc>Choose your role: author, reader, or both.</desc>

            <defs>
              <filter id="v6-rough" x="-4%" y="-4%" width="108%" height="108%">
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
              className={`v6-region v6-region-author${hovered === 'author' ? ' is-hovered' : ''}`}
              {...regionProps('author')}
            >
              <path
                className="v6-region-fill"
                d="M -10 -10 L 700 -10 C 695 150 670 320 660 460 C 530 620 350 800 180 1010 L -10 1010 Z"
                pointerEvents="all"
              />
              <text className="v6-region-label" textAnchor="middle" x={332} y={302}>
                {LABELS.author}
              </text>
              <text className="v6-region-sub" textAnchor="middle" x={332} y={358}>
                {SUBTITLES.author}
              </text>
              <text className="v6-region-cta" textAnchor="middle" x={332} y={410}>
                {CTA_LABELS.author}
              </text>
            </g>

            <g
              className={`v6-region v6-region-reader${hovered === 'reader' ? ' is-hovered' : ''}`}
              {...regionProps('reader')}
            >
              <path
                className="v6-region-fill"
                d="M 700 -10 L 1610 -10 L 1610 1010 L 1440 1010 C 1160 810 870 620 660 460 C 670 320 695 150 700 -10 Z"
                pointerEvents="all"
              />
              <text className="v6-region-label" textAnchor="middle" x={1135} y={302}>
                {LABELS.reader}
              </text>
              <text className="v6-region-sub" textAnchor="middle" x={1135} y={358}>
                {SUBTITLES.reader}
              </text>
              <text className="v6-region-cta" textAnchor="middle" x={1135} y={410}>
                {CTA_LABELS.reader}
              </text>
            </g>

            <g
              className={`v6-region v6-region-both${hovered === 'both' ? ' is-hovered' : ''}`}
              {...regionProps('both')}
            >
              <path
                className="v6-region-fill"
                d="M 660 460 C 870 620 1160 810 1440 1010 L 180 1010 C 350 800 530 620 660 460 Z"
                pointerEvents="all"
              />
              <text className="v6-region-label" textAnchor="middle" x={748} y={758}>
                {LABELS.both}
              </text>
              <text className="v6-region-sub" textAnchor="middle" x={748} y={812}>
                {SUBTITLES.both}
              </text>
              <text className="v6-region-cta" textAnchor="middle" x={748} y={862}>
                {CTA_LABELS.both}
              </text>
            </g>

            <g className="v6-dividers" filter="url(#v6-rough)" pointerEvents="none">
              <path
                className="v6-divider v6-divider-up"
                d="M 700 -10 C 695 150 670 320 660 460"
              />
              <path
                className="v6-divider v6-divider-left"
                d="M 660 460 C 530 620 350 800 180 1010"
              />
              <path
                className="v6-divider v6-divider-right"
                d="M 660 460 C 870 620 1160 810 1440 1010"
              />
            </g>
          </svg>
        ) : layout === 'columns' ? (
          <div className="v6-columns">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                className={`v6-col v6-col-${r}${hovered === r ? ' is-hovered' : ''}`}
                {...regionProps(r)}
              >
                <div className="v6-col-label">{LABELS[r]}</div>
                <div className="v6-col-reveal">
                  <div className="v6-col-sub">{SUBTITLES[r]}</div>
                  <span className="v6-col-cta">{CTA_LABELS[r]}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="v6-stack">
            <div className="v6-stack-row">
              {(['author', 'reader'] as Region[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`v6-stack-card v6-stack-${r}${hovered === r ? ' is-hovered' : ''}`}
                  {...regionProps(r)}
                >
                  <div className="v6-stack-label">{LABELS[r]}</div>
                  <div className="v6-stack-reveal">
                    <div className="v6-stack-sub">{SUBTITLES[r]}</div>
                    <span className="v6-stack-cta">{CTA_LABELS[r]}</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              className={`v6-stack-card v6-stack-both${hovered === 'both' ? ' is-hovered' : ''}`}
              {...regionProps('both')}
            >
              <div className="v6-stack-label">{LABELS.both}</div>
              <div className="v6-stack-reveal">
                <div className="v6-stack-sub">{SUBTITLES.both}</div>
                <span className="v6-stack-cta">{CTA_LABELS.both}</span>
              </div>
            </button>
          </div>
        )}
        </div>
        <InlineQuestions
          region={selectedRegion ?? 'author'}
          visible={phase === 'questions'}
          onComplete={completeInline}
          onBack={backToChoose}
        />
      </div>
      </section>

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

      <SignUpOverlay
        open={signUp.open}
        variant={signUp.variant}
        eyebrow={signUp.eyebrow}
        onClose={() => setSignUp((s) => ({ ...s, open: false }))}
      />
    </main>
  );
}
