'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import IntakeFlow from './intake/IntakeFlow';
import BetweenReviews from '../v8/sections/BetweenReviews';
import SignupOffers from '../v8/sections/SignupOffers';
import FaqTeaser from '../v8/sections/FaqTeaser';
import Footer from '../v8/sections/Footer';
import { SignInButton } from '@/components/SignInButton';

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

/* === Navbar (white) === */
.v12-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, var(--theme-surface) 94%, transparent);
  border-bottom: 1px solid var(--theme-border-subtle);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  width: 100%;
}
.v12-nav-inner {
  display: flex;
  align-items: center;
  padding: 0 clamp(20px, 3vw, 40px);
  height: 64px;
  max-width: 1440px;
  margin: 0 auto;
  gap: 0;
}
.v12-brand {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--v12-ink);
  text-decoration: none;
  flex-shrink: 0;
  margin-right: clamp(28px, 6vw, 80px);
  letter-spacing: -0.2px;
  display: inline-flex;
  align-items: center;
}
.v12-brand-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--v12-ink);
  margin: 0 5px;
  vertical-align: middle;
  transform: translateY(2px);
}
.v12-nav-links {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  gap: 2px;
}
.v12-nav-link {
  font-size: 13.5px;
  color: var(--v12-ink-soft);
  text-decoration: none;
  padding: 6px 11px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  background: transparent;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  font-weight: 400;
}
.v12-nav-link:hover {
  background: var(--theme-surface-muted);
  color: var(--v12-ink);
}
.v12-nav-link.active {
  color: var(--v12-ink);
  font-weight: 500;
}
.v12-nav-link.member {
  color: var(--v12-ink);
  font-weight: 500;
}
.v12-nav-link.support {
  border: 1.5px solid var(--v12-accent-strong);
  border-radius: 6px;
  color: var(--v12-ink);
  font-weight: 500;
}
.v12-nav-link.support:hover {
  background: var(--v12-accent-soft);
}
.v12-nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 24px;
}
.v12-btn-join {
  font-size: 13px;
  font-weight: 800;
  color: var(--theme-on-yellow);
  background: var(--v12-yellow);
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: background 0.15s;
  white-space: nowrap;
  font-family: inherit;
}
.v12-btn-join:hover { background: var(--v12-yellow-strong); }
.v12-btn-signin {
  font-size: 13px;
  font-weight: 500;
  color: var(--v12-ink);
  background: transparent;
  padding: 7px 13px;
  border-radius: 6px;
  border: 1px solid var(--theme-border);
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  font-family: inherit;
  text-decoration: none;
}
.v12-btn-signin:hover { background: var(--theme-surface-muted); }
.v12-nav-divider {
  width: 1px;
  height: 20px;
  background: var(--theme-border);
  margin: 0 2px;
}

@media (max-width: 1100px) {
  .v12-nav-links { gap: 0; }
  .v12-nav-link { padding: 6px 8px; font-size: 13px; }
}
@media (max-width: 900px) {
  .v12-nav-links { display: none; }
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

.v12-proof-strip {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: clamp(20px, 3.2vh, 34px);
}
.v12-proof-pill {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 6px 12px;
  border: 1.5px solid color-mix(in srgb, var(--theme-hero-text) 48%, transparent);
  border-radius: 999px;
  background: var(--theme-hero-subtle);
  color: color-mix(in srgb, var(--theme-hero-text) 72%, transparent);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.v12-proof-pill-lg {
  min-height: 44px;
  padding: 10px 24px;
  font-size: 16px;
  letter-spacing: 0.14em;
}

/* === CTAs === */
.v12-cta-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(28px, 7vw, 84px);
  margin-top: clamp(56px, 11vh, 112px);
  width: 100%;
}
.v12-cta {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  color: var(--v12-ink);
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 6px 0;
  cursor: pointer;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 220ms cubic-bezier(.22, 1, .36, 1);
}
.v12-cta-kicker {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--v12-ink) 62%, transparent);
}
.v12-cta-main {
  display: block;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(24px, 3.4vw, 36px);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.02em;
  text-decoration: underline;
  text-decoration-thickness: 0.06em;
  text-underline-offset: 0.1em;
}
.v12-cta:hover,
.v12-cta:focus-visible {
  color: var(--v12-accent);
  outline: none;
}
.v12-cta.reader .v12-cta-kicker {
  color: color-mix(in srgb, var(--v12-ink) 62%, transparent);
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
  .v12-cta-row {
    grid-template-columns: 1fr;
    width: min(420px, 100%);
    margin-top: 30px;
  }
  .v12-cta {
    min-height: 94px;
  }
  .v12-proof-strip {
    gap: 6px;
  }
  .v12-proof-pill {
    min-height: 28px;
    font-size: 10px;
    padding-inline: 10px;
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

      <nav className="v12-nav" aria-label="Primary">
        <div className="v12-nav-inner">
          <Link className="v12-brand" href="/" aria-label="BetweenReads, home">
            <span>between</span>
            <span className="v12-brand-dot" aria-hidden="true" />
            <span>reads</span>
          </Link>
          <div className="v12-nav-links">
            <Link className="v12-nav-link active" href="/readers">Read</Link>
            <Link className="v12-nav-link" href="/creators">Create</Link>
            <Link className="v12-nav-link" href="/betweenlines">BetweenLines</Link>
            <Link className="v12-nav-link" href="/creators/agent-readiness">AgentReady</Link>
            <Link className="v12-nav-link" href="/creators/upload-illustrations">Submit</Link>
            <Link className="v12-nav-link" href="/pricing">Pricing</Link>
            <Link className="v12-nav-link" href="/faq">FAQ</Link>
            <Link className="v12-nav-link member" href="/insider">Become a Member</Link>
            <Link className="v12-nav-link support" href="/about">Support Us</Link>
          </div>
          <div className="v12-nav-right">
            <button
              type="button"
              className="v12-btn-join"
              onClick={() => open('reader')}
            >
              Join Free
            </button>
            <div className="v12-nav-divider" aria-hidden="true" />
            <SignInButton className="v12-btn-signin">Sign In</SignInButton>
          </div>
        </div>
      </nav>

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

            <div className="v12-cta-row" role="group" aria-label="Start">
              <button
                type="button"
                className="v12-cta"
                onClick={() => open('author')}
              >
                <span className="v12-cta-main">Start Creating</span>
              </button>
              <button
                type="button"
                className="v12-cta reader"
                onClick={() => open('reader')}
              >
                <span className="v12-cta-main">Start Reading</span>
              </button>
            </div>
            <div className="v12-proof-strip" aria-label="Platform commitments">
              <span className="v12-proof-pill v12-proof-pill-lg">Ad-free</span>
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
