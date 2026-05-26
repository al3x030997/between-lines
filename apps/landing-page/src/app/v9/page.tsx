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

const V9_CSS = `
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

/* === v9 centered hero === */
.v9-hero {
  position: relative;
  min-height: calc(100vh - 76px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(48px, 8vh, 120px) clamp(24px, 5vw, 80px);
  /* Soft ambient warmth from above — much subtler than the v1 left-side hotspot,
     so the intake form (which lives in this same hero box) gets a calm ground. */
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
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  mix-blend-mode: multiply;
  opacity: 0.06;
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
  /* Drop the gradient entirely while the intake form is shown — flat surface
     keeps the form grounded and removes the warm hotspot that competed with
     the chip / label rhythm. */
  background: var(--v6-surface);
}
.v9-root.is-phase-questions .v9-hero::before { opacity: 0; }
.v9-hero-inner {
  position: relative;
  z-index: 1;
  max-width: 880px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(20px, 3vh, 36px);
}
.v9-hero-title {
  margin: 0;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(38px, 6vw, 88px);
  line-height: 1.0;
  letter-spacing: -0.035em;
  color: var(--v6-text-strong);
  max-width: 18ch;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt";
}
.v9-hero-sub {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(16px, 1.6vw, 20px);
  line-height: 1.5;
  color: var(--v6-text-muted);
  max-width: 48ch;
  text-wrap: pretty;
}

.v9-cta-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: clamp(14px, 2vw, 24px);
  width: 100%;
  margin-top: clamp(6px, 1vh, 12px);
}
.v9-cta-card {
  appearance: none;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  flex: 1 1 0;
  max-width: 340px;
  min-height: clamp(180px, 26vh, 220px);
  padding: clamp(24px, 3.2vw, 36px) clamp(24px, 3.2vw, 36px) clamp(56px, 7vw, 72px);
  /* Page-yellow body. A subtle inset black "tint" (via the ::before overlay)
     darkens the card slightly so it separates from the page bg without
     introducing a new color. On hover the overlay fades — card brightens
     into the page yellow as it lifts. */
  background: #FFC700;
  border: 2px solid #0a0a0a;
  border-radius: 6px;
  color: #0a0a0a;
  font: inherit;
  text-align: left;
  cursor: pointer;
  /* Soft layered ambient shadow — the card "floats" off the yellow surface
     without the hard offset block underneath. */
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
  /* Darkening overlay — black at 10% opacity. Page is pure yellow #FFC700,
     so this drops the card to roughly #E6B300 (10% darker yellow), giving
     visual separation without introducing a new color. Fades on hover. */
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
  /* Clean upward lift — no offset stamp to pull away from. */
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
  .v9-cta-row { flex-direction: column; align-items: stretch; gap: 14px; }
  .v9-cta-card { max-width: none; min-height: 160px; }
  .v9-cta-card-arrow { opacity: 0.7; }
  .v9-cta-card-num { font-size: 10px; }
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

export default function V9Page() {
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
    'is-palette-stranger',
    phase === 'questions' ? 'is-phase-questions' : '',
  ].filter(Boolean).join(' ');

  return (
    <main className={rootClass}>
      <style dangerouslySetInnerHTML={{ __html: V9_CSS }} />

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
            <Link className="v8-nav-link" href="/readers">Readers</Link>
            <Link className="v8-nav-link" href="/creators">Creators</Link>
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
        className={`v9-hero${phase === 'leaving' ? ' is-leaving' : ''}`}
        aria-label="Choose your role"
      >
        {phase !== 'questions' && (
          <div className="v9-hero-inner">
            <h1 className="v9-hero-title">
              Discover emerging authors &amp; new voices.
            </h1>
            <p className="v9-hero-sub">
              Curated by humans. No algorithm. Three free reads a month — yours.
            </p>

            <div className="v9-cta-row">
              {(['reader', 'author'] as const).map((r, i) => (
                <button
                  key={r}
                  type="button"
                  className={`v9-cta-card v9-cta-card-${r}`}
                  onClick={() => open(r)}
                  aria-label={`${CARD_TITLES[r]}. ${CARD_SUBS[r]}`}
                >
                  <span className="v9-cta-card-num" aria-hidden="true">
                    Nº&nbsp;{String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="v9-cta-card-title">{CARD_TITLES[r]}</h2>
                  <span className="v9-cta-card-rule" aria-hidden="true" />
                  <p className="v9-cta-card-sub">{CARD_SUBS[r]}</p>
                  <span className="v9-cta-card-arrow" aria-hidden="true">
                    Open <span>→</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
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
