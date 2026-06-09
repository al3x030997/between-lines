'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import IntakeFlow from './intake/IntakeFlow';
import BetweenReviews from '../v8/sections/BetweenReviews';
import SignupOffers from '../v8/sections/SignupOffers';
import FaqTeaser from '../v8/sections/FaqTeaser';
import Footer from '../v8/sections/Footer';
import { SiteNav } from '@/components/SiteNav';

const BANNER_MESSAGES: Record<string, string> = {
  gate: 'Your insider access has expired. Re-enter your email to receive a new link.',
  invalid: 'That insider link is invalid. Re-enter your email to receive a new one.',
  pending: 'We can’t find an active subscription for that link. Check your inbox for our confirmation email.',
  ratelimited: 'Too many attempts. Please try again in a few minutes.',
};

const V12_CSS = `
.v12-root {
  --v12-yellow: var(--theme-yellow);
  --v12-yellow-strong: var(--theme-yellow-strong);
  --v12-ink: var(--theme-text);
  --v12-ink-soft: var(--theme-text-soft);
  --v12-divider: var(--theme-border);
  --v12-accent: var(--theme-accent);
  --v12-accent-strong: var(--theme-accent-strong);
  --v12-accent-soft: var(--theme-accent-soft);
  --v6-accent: var(--v12-accent);
  --v6-accent-soft: var(--v12-accent-soft);
  --v6-text: var(--v12-ink);
  --v6-text-strong: var(--v12-ink);
  --v6-text-muted: var(--theme-text-muted);
  --v6-surface: var(--theme-hero);
  --v6-divider: var(--v12-divider);
  --v6-ease: cubic-bezier(.22, 1, .36, 1);
  --bl-section-accent: var(--v12-accent);
  --bl-footer-accent: var(--v12-accent);
  --bl-footer-bg: var(--theme-footer-bg);
  min-height: 100vh;
  background: var(--theme-page);
  font-family: 'Outfit', system-ui, sans-serif;
  color: var(--v12-ink);
  transition: background-color 220ms var(--v6-ease), color 220ms var(--v6-ease);
}

/* === Hero (yellow, full screen) === */
.v12-hero {
  background: var(--theme-hero);
  padding: clamp(40px, 6vh, 72px) clamp(20px, 4vw, 40px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  position: relative;
  transition: opacity 360ms cubic-bezier(.22, 1, .36, 1),
              transform 360ms cubic-bezier(.22, 1, .36, 1);
}
.v12-hero.is-leaving {
  opacity: 0;
  transform: translateY(-12px) scale(.985);
  pointer-events: none;
}
.v12-root.is-phase-questions .v12-hero {
  min-height: auto;
  align-items: stretch;
  padding-top: 0;
  padding-bottom: 0;
  background: var(--theme-page);
}
.v12-hero-inner {
  max-width: 980px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.v12-hero-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--v12-ink);
  opacity: 0.55;
  margin-bottom: 6px;
}
.v12-hero-sub {
  font-size: 13px;
  color: var(--v12-ink);
  opacity: 0.45;
  letter-spacing: 0.4px;
  margin-bottom: clamp(28px, 5vh, 44px);
}
.v12-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(44px, 7.5vw, 82px);
  font-weight: 900;
  line-height: 1.0;
  color: var(--theme-hero-text);
  letter-spacing: -2px;
  max-width: 960px;
  text-wrap: balance;
}
.v12-hero-line {
  display: block;
}
.v12-hero h1 em {
  font-style: italic;
  font-weight: 700;
}

/* === Hero actions === */
.v12-hero-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(20px, 3.4vh, 30px);
  margin-top: clamp(48px, 9vh, 88px);
  width: 100%;
}

/* Primary CTA — built on the design-system strong-CTA tokens (theme-aware),
   label set to paper cream per chosen "solid black, paper text" style. */
.v12-read-now {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(18px, 2.1vw, 22px);
  font-weight: 800;
  letter-spacing: 0.2px;
  color: var(--theme-paper-bg);
  background: var(--theme-strong-cta-bg);
  border: none;
  border-radius: 999px;
  padding: clamp(15px, 1.9vh, 19px) clamp(36px, 4.4vw, 48px);
  cursor: pointer;
  box-shadow: 0 14px 34px -14px color-mix(in srgb, var(--v12-ink) 70%, transparent);
  transition: transform 220ms var(--v6-ease),
              box-shadow 220ms var(--v6-ease),
              background 220ms var(--v6-ease);
}
.v12-read-now:hover,
.v12-read-now:focus-visible {
  background: var(--theme-strong-cta-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 20px 42px -14px color-mix(in srgb, var(--v12-ink) 72%, transparent);
  outline: none;
}
.v12-read-now:active { transform: translateY(0); }
.v12-read-now-arrow {
  font-size: 0.92em;
  transition: transform 220ms var(--v6-ease);
}
.v12-read-now:hover .v12-read-now-arrow { transform: translateX(4px); }

/* Secondary CTA — open-call badge + link */
.v12-open-call {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: transparent;
  border: 0;
  padding: 6px 0;
  cursor: pointer;
  color: var(--theme-hero-text);
  font-family: 'Outfit', system-ui, sans-serif;
  transition: color 200ms var(--v6-ease);
}
.v12-open-call-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--theme-hero-text) 72%, transparent);
}
.v12-open-call-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--theme-yellow-deep);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--theme-yellow-deep) 70%, transparent);
  animation: v12-opencall-pulse 2.4s ease-out infinite;
}
@keyframes v12-opencall-pulse {
  0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--theme-yellow-deep) 60%, transparent); }
  70%  { box-shadow: 0 0 0 9px color-mix(in srgb, var(--theme-yellow-deep) 0%, transparent); }
  100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--theme-yellow-deep) 0%, transparent); }
}
@media (prefers-reduced-motion: reduce) {
  .v12-open-call-dot { animation: none; }
}
.v12-open-call-text {
  font-size: clamp(18px, 2.3vw, 23px);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 0.07em;
  text-underline-offset: 0.18em;
  text-decoration-color: color-mix(in srgb, var(--theme-hero-text) 42%, transparent);
}
.v12-open-call-arrow {
  font-size: 1em;
  transition: transform 200ms var(--v6-ease);
}
.v12-open-call:hover { color: var(--theme-text); }
.v12-open-call:hover .v12-open-call-text { text-decoration-color: currentColor; }
.v12-open-call:hover .v12-open-call-arrow { transform: translateX(3px); }
.v12-open-call:focus-visible { outline: none; }
.v12-open-call:focus-visible .v12-open-call-text { text-decoration-color: currentColor; }

/* Trust commitments — three bullets */
.v12-proof-strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(10px, 1.6vh, 16px);
  margin-top: clamp(72px, 12vh, 140px);
}
.v12-proof-note {
  display: inline-flex;
  align-items: center;
  font-size: clamp(12px, 1.3vw, 14px);
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--theme-hero-text) 62%, transparent);
}
.v12-proof-note::before {
  content: "✓";
  margin-right: 9px;
  font-size: 1.1em;
  font-weight: 900;
  color: color-mix(in srgb, var(--theme-hero-text) 80%, transparent);
}

/* Banner reused */
.bl-banner {
  position: relative;
  z-index: 30;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 12px auto 0;
  max-width: min(720px, calc(100% - 32px));
  padding: 12px 14px;
  background: rgba(233, 75, 54, 0.08);
  border: 1px solid rgba(233, 75, 54, 0.35);
  border-radius: 10px;
  color: var(--v12-ink);
  font-family: var(--bl-font-body);
  font-size: 14px;
  line-height: 1.45;
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

.v12-root :where(button, a, [role="button"], input, select, textarea):focus-visible {
  outline: 2px solid var(--v12-accent);
  outline-offset: 3px;
}

@media (max-width: 760px) {
  .v12-hero {
    min-height: calc(100svh - 64px);
  }
  .v12-hero h1 {
    font-size: clamp(52px, 15vw, 78px);
  }
  .v12-hero-actions {
    margin-top: 34px;
  }
  .v12-open-call {
    flex-wrap: wrap;
    justify-content: center;
    row-gap: 4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .v12-root,
  .v12-root *,
  .v12-root *::before,
  .v12-root *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

type Region = 'author' | 'reader' | 'both';
type Phase = 'choose' | 'leaving' | 'questions';

export default function V12Page() {
  const [phase, setPhase] = useState<Phase>('choose');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('u');
    setBannerMessage(code ? (BANNER_MESSAGES[code] ?? null) : null);

    // Deep-link from a subpage "Join Free" CTA: ?join=reader|author auto-opens
    // the intake flow, then the param is stripped from the URL.
    const join = params.get('join');
    if (join === 'reader' || join === 'author') {
      setSelectedRegion(join as Region);
      setPhase('questions');
      const url = new URL(window.location.href);
      url.searchParams.delete('join');
      window.history.replaceState(null, '', url.toString());
    }
  }, []);
  const dismissBanner = () => {
    setBannerMessage(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('u');
      window.history.replaceState(null, '', url.toString());
    }
  };

  const backToChoose = () => {
    setPhase('choose');
    setSelectedRegion(null);
  };

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
    'v12-root',
    phase === 'questions' ? 'is-phase-questions' : '',
  ].filter(Boolean).join(' ');

  return (
    <main className={rootClass}>
      <style dangerouslySetInnerHTML={{ __html: V12_CSS }} />

      <SiteNav activeHref="/readers" onJoin={() => open('reader')} />

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

      <section
        className={`v12-hero${phase === 'leaving' ? ' is-leaving' : ''}`}
        aria-label="Choose your role"
      >
        {phase !== 'questions' && (
          <div className="v12-hero-inner">
            <p className="v12-hero-label">for the hidden creative</p>
            <p className="v12-hero-sub">
              wandering readers &nbsp;·&nbsp; writers &nbsp;·&nbsp; illustrators
            </p>
            <h1>
              <span className="v12-hero-line">Discover <em>new voices.</em></span>
              <span className="v12-hero-line">Curated <em>stories.</em></span>
            </h1>

            <div className="v12-hero-actions">
              <button
                type="button"
                className="v12-read-now"
                onClick={() => open('reader')}
              >
                <span>Read Now</span>
                <span className="v12-read-now-arrow" aria-hidden="true">→</span>
              </button>

              <button
                type="button"
                className="v12-open-call"
                onClick={() => open('author')}
              >
                <span className="v12-open-call-tag">
                  <span className="v12-open-call-dot" aria-hidden="true" />
                  Open Call
                </span>
                <span className="v12-open-call-text">Become a founding creator</span>
                <span className="v12-open-call-arrow" aria-hidden="true">→</span>
              </button>
            </div>
            <div className="v12-proof-strip" aria-label="Platform commitments">
              <span className="v12-proof-note">Always ad-free</span>
              <span className="v12-proof-note">Always AI-free</span>
              <span className="v12-proof-note">Always community first</span>
            </div>
          </div>
        )}

        {phase === 'questions' && (
          <IntakeFlow
            initialMode={selectedRegion === 'author' ? 'writer' : 'reader'}
            onBack={backToChoose}
          />
        )}
      </section>

      <BetweenReviews onReader={() => open('reader')} />

      <SignupOffers onReader={() => open('reader')} onWriter={() => open('author')} />

      <FaqTeaser onReader={() => open('reader')} onWriter={() => open('author')} />
      <Footer />
    </main>
  );
}
