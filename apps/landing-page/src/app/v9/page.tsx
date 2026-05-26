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
  --bl-accent: #C5283D;
  --bl-accent-strong: #921a2b;
  --bl-accent-soft: rgba(197, 40, 61, 0.14);
  --v6-text: #0a0a0a;
  --v6-text-strong: #0a0a0a;
  --v6-text-muted: #1a1a1a;
  --v6-surface: #FFC700;
  --v6-divider: rgba(11,23,51,0.22);
  --v6-stroke: rgba(255,199,0,0.95);
  --bl-section-accent: #C5283D;
  --bl-footer-accent: #C5283D;
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
.v8-nav-meta {
  display: flex;
  align-items: center;
  gap: 22px;
  font-family: var(--bl-font-eyebrow);
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

/* === v9 centered hero === */
.v9-hero {
  position: relative;
  min-height: calc(100vh - 76px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(48px, 8vh, 120px) clamp(24px, 5vw, 80px);
  background: var(--v6-surface);
  overflow: hidden;
  transition: opacity 360ms cubic-bezier(.22, 1, .36, 1), transform 360ms cubic-bezier(.22, 1, .36, 1);
  will-change: opacity, transform;
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
}
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
.v9-hero-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: clamp(10px, 1vw, 12px);
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--v6-accent);
  line-height: 1;
  display: inline-flex;
  align-items: center;
  gap: 14px;
}
.v9-hero-eyebrow::before,
.v9-hero-eyebrow::after {
  content: '';
  display: inline-block;
  width: clamp(20px, 3vw, 40px);
  height: 1px;
  background: var(--v6-accent);
  opacity: 0.5;
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
.v9-hero-title em {
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  color: var(--v6-accent);
  letter-spacing: -0.01em;
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
  gap: 8px;
  flex: 1 1 0;
  max-width: 340px;
  min-height: clamp(180px, 26vh, 240px);
  padding: clamp(22px, 3vw, 34px);
  background: var(--bl-paper-bg, var(--bl-surface));
  border: 0.5px solid rgba(14,14,12,0.16);
  border-radius: 14px;
  color: var(--v6-text-strong);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1),
              border-color 240ms cubic-bezier(.22, 1, .36, 1),
              box-shadow 240ms cubic-bezier(.22, 1, .36, 1),
              background 240ms cubic-bezier(.22, 1, .36, 1);
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.v9-cta-card:hover,
.v9-cta-card:focus-visible {
  transform: translateY(-2px);
  border-color: var(--v6-accent);
  box-shadow: 0 14px 32px rgba(14,14,12,0.07);
  background: var(--v6-surface);
}
.v9-cta-card-title {
  margin: 0;
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-size: clamp(20px, 2.2vw, 28px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--v6-text-strong);
  text-wrap: balance;
}
.v9-cta-card-rule {
  display: block;
  width: 36px;
  height: 1px;
  background: var(--v6-accent);
  opacity: 0.5;
  margin: 4px 0 6px;
  transition: width 240ms cubic-bezier(.22, 1, .36, 1), opacity 240ms ease;
}
.v9-cta-card:hover .v9-cta-card-rule,
.v9-cta-card:focus-visible .v9-cta-card-rule {
  width: 56px;
  opacity: 1;
}
.v9-cta-card-sub {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.5;
  color: var(--v6-text-muted);
  max-width: 26ch;
  text-wrap: pretty;
}
.v9-cta-card-arrow {
  position: absolute;
  right: clamp(20px, 3vw, 34px);
  bottom: clamp(20px, 3vw, 34px);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--v6-accent);
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 240ms cubic-bezier(.22, 1, .36, 1),
              transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.v9-cta-card:hover .v9-cta-card-arrow,
.v9-cta-card:focus-visible .v9-cta-card-arrow {
  opacity: 1;
  transform: none;
}

.v9-hero-both {
  appearance: none;
  border: 0;
  background: transparent;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--v6-text-muted);
  cursor: pointer;
  padding: 6px 4px;
  position: relative;
  transition: color 200ms ease;
}
.v9-hero-both::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 22px;
  bottom: 2px;
  height: 1px;
  background: currentColor;
  opacity: 0;
  transition: opacity 200ms ease;
}
.v9-hero-both:hover,
.v9-hero-both:focus-visible {
  color: var(--v6-accent);
  outline: none;
}
.v9-hero-both:hover::after,
.v9-hero-both:focus-visible::after {
  opacity: 0.55;
}
.v9-hero-both span { display: inline-block; transition: transform 240ms cubic-bezier(.22, 1, .36, 1); }
.v9-hero-both:hover span,
.v9-hero-both:focus-visible span { transform: translateX(4px); }

@media (max-width: 640px) {
  .v9-cta-row { flex-direction: column; align-items: stretch; gap: 12px; }
  .v9-cta-card { max-width: none; min-height: 160px; }
  .v9-cta-card-arrow { opacity: 0.6; transform: none; }
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
        <a className="v8-brand" href="#" aria-label="BetweenReads, home">
          <span>between</span>
          <span className="v8-brand-dot">.</span>
          <span>reads</span>
        </a>
        <div className="v8-nav-meta">
          <Link className="v8-nav-link" href="/about">About</Link>
          <span className="v8-nav-sep" aria-hidden="true" />
          <Link className="v8-nav-link" href="/faq">FAQ</Link>
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

      <section
        className={`v9-hero${phase === 'leaving' ? ' is-leaving' : ''}`}
        aria-label="Choose your role"
      >
        {phase !== 'questions' && (
          <div className="v9-hero-inner">
            <span className="v9-hero-eyebrow">BetweenReads · Issue №01</span>
            <h1 className="v9-hero-title">
              Discover emerging authors <em>&amp; new voices.</em>
            </h1>
            <p className="v9-hero-sub">
              Curated by humans. No algorithm. Three free reads a month — yours.
            </p>

            <div className="v9-cta-row">
              {(['reader', 'author'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`v9-cta-card v9-cta-card-${r}`}
                  onClick={() => open(r)}
                  aria-label={`${CARD_TITLES[r]}. ${CARD_SUBS[r]}`}
                >
                  <h2 className="v9-cta-card-title">{CARD_TITLES[r]}</h2>
                  <span className="v9-cta-card-rule" aria-hidden="true" />
                  <p className="v9-cta-card-sub">{CARD_SUBS[r]}</p>
                  <span className="v9-cta-card-arrow" aria-hidden="true">
                    Open <span>→</span>
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="v9-hero-both"
              onClick={() => open('both')}
            >
              I’m both <span aria-hidden="true">→</span>
            </button>
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
