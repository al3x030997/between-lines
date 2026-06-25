'use client';

import { useEffect, useState } from 'react';
import BetweenCharacters from '../v8/sections/BetweenCharacters';
import TwoWorlds from './sections/TwoWorlds';
import CreatorCta from './sections/CreatorCta';
import Footer from '../v8/sections/Footer';
import { SiteNav } from '@/components/SiteNav';
import IntakeDialog from '@/components/IntakeDialog';

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
.v12-root .br-header,
.v12-root .bl-banner {
  transition:
    transform 320ms cubic-bezier(.22, 1, .36, 1),
    opacity 220ms ease;
  will-change: transform, opacity;
}
.v12-root.is-world-slide-open .br-header,
.v12-root.is-world-slide-open .bl-banner {
  transform: translateY(-110%);
  opacity: 0;
  pointer-events: none;
}
.v12-section-shell {
  position: relative;
  scroll-margin-top: 76px;
  --v12-cue-color: #1a1714;
}
.v12-section-shell--hero {
  --v12-cue-color: var(--theme-hero-text);
}
.v12-section-shell--creators {
  --v12-cue-color: #f6f1e3;
}
.v12-root.is-world-slide-open .v12-scroll-cue {
  opacity: 0;
  pointer-events: none;
}

/* === Hero (yellow, full screen) === */
.v12-hero {
  background: var(--theme-hero);
  padding: clamp(24px, 4vh, 52px) clamp(20px, 4vw, 40px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(84vh - 76px);
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
  max-width: 1040px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.v12-hero-label {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 3.2px;
  text-transform: uppercase;
  color: var(--v12-ink);
  opacity: 0.65;
  margin-bottom: 8px;
}
.v12-hero-sub {
  font-size: 19px;
  color: var(--v12-ink);
  opacity: 0.45;
  letter-spacing: 0.4px;
  margin-bottom: clamp(22px, 4vh, 40px);
}
.v12-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(46px, 7.6vw, 94px);
  font-weight: 900;
  line-height: 0.95;
  color: var(--theme-hero-text);
  letter-spacing: -2.5px;
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
  gap: clamp(24px, 4vh, 36px);
  margin-top: clamp(32px, 5.5vh, 56px);
  width: 100%;
}

/* Primary CTA — built on the design-system strong-CTA tokens (theme-aware),
   label set to paper cream per chosen "solid black, paper text" style. */
.v12-read-now {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(18px, 1.9vw, 20px);
  font-weight: 800;
  letter-spacing: 0.2px;
  color: var(--theme-paper-bg);
  background: var(--theme-strong-cta-bg);
  border: none;
  border-radius: 999px;
  padding: clamp(13px, 1.7vh, 17px) clamp(32px, 4vw, 44px);
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

.v12-hero-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(14px, 2vw, 20px);
}

/* Secondary CTA — warm red, reuses the banner's accent red for consistency. */
.v12-start-writing {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(18px, 1.9vw, 20px);
  font-weight: 800;
  letter-spacing: 0.2px;
  color: #fff;
  background: rgb(216, 64, 46);
  border: none;
  border-radius: 999px;
  padding: clamp(13px, 1.7vh, 17px) clamp(32px, 4vw, 44px);
  cursor: pointer;
  box-shadow: 0 14px 34px -14px rgba(216, 64, 46, 0.55);
  transition: transform 220ms var(--v6-ease),
              box-shadow 220ms var(--v6-ease),
              background 220ms var(--v6-ease);
}
.v12-start-writing:hover,
.v12-start-writing:focus-visible {
  background: rgb(196, 52, 36);
  transform: translateY(-2px);
  box-shadow: 0 20px 42px -14px rgba(216, 64, 46, 0.65);
  outline: none;
}
.v12-start-writing:active { transform: translateY(0); }

/* Trust commitments — three bullets */
.v12-proof-strip {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(14px, 2vw, 28px);
  margin-top: clamp(36px, 6vh, 68px);
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

/* Scroll affordance — gentle bouncing chevron at the hero base, clickable */
.v12-scroll-cue {
  position: absolute;
  bottom: clamp(36px, 6vh, 72px);
  left: 50%;
  display: inline-flex;
  background: none;
  border: none;
  padding: 12px;
  margin: 0;
  color: var(--v12-cue-color);
  opacity: 0.5;
  cursor: pointer;
  z-index: 3;
  animation: v12-scroll-bounce 8.5s cubic-bezier(.45, 0, .2, 1) infinite;
  transition: opacity 200ms ease;
}
.v12-scroll-cue:hover,
.v12-scroll-cue:focus-visible {
  opacity: 0.9;
  outline: none;
}
.v12-scroll-cue svg { display: block; }
.v12-scroll-cue-icon {
  display: block;
  width: clamp(48px, 4.2vw, 58px);
  height: clamp(48px, 4.2vw, 58px);
}
.v12-scroll-cue-icon.is-pulsing {
  animation: v12-scroll-click 1000ms cubic-bezier(.22, 1, .36, 1);
}
@keyframes v12-scroll-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  45%, 55% { transform: translateX(-50%) translateY(9px); }
}
@keyframes v12-scroll-click {
  0%   { transform: scale(1) translateY(0); }
  42%  { transform: scale(1.28) translateY(11px); }
  100% { transform: scale(1) translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .v12-scroll-cue { animation: none !important; transform: translateX(-50%); }
  .v12-scroll-cue-icon { animation: none !important; }
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
    min-height: calc(86svh - 76px);
    padding-bottom: clamp(92px, 13vh, 120px);
  }
  .v12-hero h1 {
    font-size: clamp(48px, 14vw, 80px);
  }
  .v12-hero-actions {
    margin-top: 34px;
  }
  .v12-proof-strip {
    flex-direction: column;
    gap: 10px;
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

type ScrollCueProps = {
  targetId: string;
  label: string;
};

function ScrollCue({ targetId, label }: ScrollCueProps) {
  const [pulse, setPulse] = useState(0);

  const scrollToTarget = () => {
    setPulse((n) => n + 1);
    const target = document.getElementById(targetId);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <button
      type="button"
      className="v12-scroll-cue"
      onClick={scrollToTarget}
      aria-label={label}
    >
      <svg
        key={pulse}
        className={`v12-scroll-cue-icon${pulse > 0 ? ' is-pulsing' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
}

export default function V12Page() {
  // Every CTA ("Read Now", "Join Free", section CTAs) opens the intake as a
  // pop-up over a blurred landing page in reader vs writer mode. The gallery is
  // reached separately via the nav "Read" link, not these conversion CTAs.
  // (/start remains a direct-link fallback rendering the same flow.)
  const [intake, setIntake] = useState<{ mode: 'reader' | 'writer' } | null>(null);
  const [worldSlideOpen, setWorldSlideOpen] = useState(false);
  const open = (region: Region) => {
    setIntake({ mode: region === 'author' ? 'writer' : 'reader' });
  };

  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('u');
    setBannerMessage(code ? (BANNER_MESSAGES[code] ?? null) : null);

    // Legacy deep-links from other pages' CTAs (?join=… / ?intake=…) open the
    // intake pop-up in place.
    const region = params.get('join') ?? params.get('intake');
    if (region === 'reader' || region === 'author' || region === 'writer') {
      setIntake({ mode: region === 'reader' ? 'reader' : 'writer' });
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

  return (
    <main className={`v12-root${worldSlideOpen ? ' is-world-slide-open' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: V12_CSS }} />

      <SiteNav activeHref="/gallery" onJoin={() => open('reader')} />

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
        id="v12-hero"
        className="v12-hero v12-section-shell v12-section-shell--hero"
        aria-label="Choose your role"
      >
        <div className="v12-hero-inner">
            <p className="v12-hero-label">for the hidden creative</p>
            <p className="v12-hero-sub">
              wandering readers &nbsp;·&nbsp; writers &nbsp;·&nbsp; illustrators &nbsp;·&nbsp; poets
            </p>
            <h1>
              <span className="v12-hero-line">Discover <em>new voices.</em></span>
              <span className="v12-hero-line">Curated <em>stories.</em></span>
            </h1>

            <div className="v12-hero-actions">
              <div className="v12-hero-buttons">
                <button
                  type="button"
                  className="v12-start-writing"
                  onClick={() => open('author')}
                >
                  <span>Start Writing</span>
                </button>
                <button
                  type="button"
                  className="v12-read-now"
                  onClick={() => open('reader')}
                >
                  <span>Read Now</span>
                  <span className="v12-read-now-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </div>
            <div className="v12-proof-strip" aria-label="Platform commitments">
              <span className="v12-proof-note">Always ad-free</span>
            </div>
        </div>
        <ScrollCue targetId="v12-after-hero" label="Scroll to the next section" />
      </section>

      <div
        id="v12-after-hero"
        className="v12-section-shell v12-section-shell--between"
      >
        <BetweenCharacters />
        <ScrollCue targetId="v12-two-worlds" label="Scroll to two sides section" />
      </div>

      <div
        id="v12-two-worlds"
        className="v12-section-shell v12-section-shell--two-worlds"
      >
        <TwoWorlds onSlideOpenChange={setWorldSlideOpen} />
        <ScrollCue targetId="v12-creator-cta" label="Scroll to creators section" />
      </div>

      <div
        id="v12-creator-cta"
        className="v12-section-shell v12-section-shell--creators"
      >
        <CreatorCta onWriter={() => open('author')} />
        <ScrollCue targetId="v12-footer" label="Scroll to footer" />
      </div>
      <div id="v12-footer">
        <Footer />
      </div>

      {intake && (
        <IntakeDialog mode={intake.mode} onClose={() => setIntake(null)} />
      )}
    </main>
  );
}
