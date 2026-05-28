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
import { SignInButton } from '@/components/SignInButton';

const BANNER_MESSAGES: Record<string, string> = {
  gate: 'Your insider access has expired. Re-enter your email to receive a new link.',
  invalid: 'That insider link is invalid. Re-enter your email to receive a new one.',
  pending: 'We can’t find an active subscription for that link. Check your inbox for our confirmation email.',
  ratelimited: 'Too many attempts. Please try again in a few minutes.',
};

const V11_CSS = `
.v11-root {
  --v11-yellow: #FFE600;
  --v11-yellow-strong: #f0d800;
  --v11-ink: #1a1a1a;
  --v11-ink-soft: #444;
  --v11-divider: #e8e4dc;
  --v11-accent: #0F6E56;
  --v11-accent-strong: #1D9E75;
  --v11-accent-soft: #E1F5EE;
  --v6-accent: var(--v11-accent);
  --v6-accent-soft: var(--v11-accent-soft);
  --v6-text: var(--v11-ink);
  --v6-text-strong: var(--v11-ink);
  --v6-text-muted: #14140f;
  --v6-surface: var(--v11-yellow);
  --v6-divider: var(--v11-divider);
  --v6-ease: cubic-bezier(.22, 1, .36, 1);
  --bl-section-accent: var(--v11-accent);
  --bl-footer-accent: var(--v11-accent);
  --bl-footer-bg: var(--v11-yellow);
  min-height: 100vh;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--v11-ink);
}

/* === Navbar (white) === */
.v11-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  width: 100%;
}
.v11-nav-inner {
  display: flex;
  align-items: center;
  padding: 0 clamp(20px, 3vw, 40px);
  height: 64px;
  max-width: 1440px;
  margin: 0 auto;
  gap: 0;
}
.v11-brand {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: var(--v11-ink);
  text-decoration: none;
  flex-shrink: 0;
  margin-right: clamp(28px, 6vw, 80px);
  letter-spacing: -0.2px;
  display: inline-flex;
  align-items: center;
}
.v11-brand-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--v11-ink);
  margin: 0 5px;
  vertical-align: middle;
  transform: translateY(2px);
}
.v11-nav-links {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  gap: 2px;
}
.v11-nav-link {
  font-size: 13.5px;
  color: var(--v11-ink-soft);
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
.v11-nav-link:hover {
  background: #f5f0e8;
  color: var(--v11-ink);
}
.v11-nav-link.active {
  color: var(--v11-ink);
  font-weight: 500;
}
.v11-nav-link.member {
  color: var(--v11-accent);
  font-weight: 500;
}
.v11-nav-link.support {
  border: 1.5px solid var(--v11-accent-strong);
  border-radius: 6px;
  color: var(--v11-accent);
  font-weight: 500;
}
.v11-nav-link.support:hover {
  background: var(--v11-accent-soft);
}
.v11-nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 24px;
}
.v11-btn-join {
  font-size: 13px;
  font-weight: 800;
  color: var(--v11-ink);
  background: var(--v11-yellow);
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: background 0.15s;
  white-space: nowrap;
  font-family: inherit;
}
.v11-btn-join:hover { background: var(--v11-yellow-strong); }
.v11-btn-signin {
  font-size: 13px;
  font-weight: 500;
  color: var(--v11-ink);
  background: transparent;
  padding: 7px 13px;
  border-radius: 6px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  font-family: inherit;
  text-decoration: none;
}
.v11-btn-signin:hover { background: #f5f3ef; }
.v11-nav-divider {
  width: 1px;
  height: 20px;
  background: #e0ddd5;
  margin: 0 2px;
}

@media (max-width: 1100px) {
  .v11-nav-links { gap: 0; }
  .v11-nav-link { padding: 6px 8px; font-size: 13px; }
}
@media (max-width: 900px) {
  .v11-nav-links { display: none; }
}

/* === Hero (yellow, full screen) === */
.v11-hero {
  background: var(--v11-yellow);
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
.v11-hero.is-leaving {
  opacity: 0;
  transform: translateY(-12px) scale(.985);
  pointer-events: none;
}
.v11-root.is-phase-questions .v11-hero {
  min-height: auto;
  align-items: stretch;
  padding-top: 0;
  padding-bottom: 0;
  background: #fff;
}
.v11-hero-inner {
  max-width: 980px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.v11-hero-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--v11-ink);
  opacity: 0.55;
  margin-bottom: 6px;
}
.v11-hero-sub {
  font-size: 13px;
  color: var(--v11-ink);
  opacity: 0.45;
  letter-spacing: 0.4px;
  margin-bottom: clamp(28px, 5vh, 44px);
}
.v11-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(44px, 7.5vw, 82px);
  font-weight: 900;
  line-height: 1.0;
  color: var(--v11-ink);
  letter-spacing: -2px;
  max-width: 960px;
  text-wrap: balance;
}
.v11-hero-line {
  display: block;
}
.v11-hero h1 em {
  font-style: italic;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.08em;
  text-decoration-color: rgba(15, 110, 86, 0.75);
}

.v11-proof-strip {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: clamp(20px, 3.2vh, 34px);
}
.v11-proof-pill {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 6px 12px;
  border: 1.5px solid rgba(26, 26, 26, 0.48);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.32);
  color: rgba(26, 26, 26, 0.72);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* === CTAs === */
.v11-cta-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(230px, 1fr));
  gap: clamp(12px, 2vw, 18px);
  margin-top: clamp(28px, 5vh, 52px);
  width: min(760px, 100%);
}
.v11-cta {
  position: relative;
  min-height: 112px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  color: var(--v11-ink);
  background: rgba(255, 255, 255, 0.78);
  border: 2px solid var(--v11-ink);
  border-radius: 0;
  padding: 18px 20px 16px;
  cursor: pointer;
  text-decoration: none;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 7px 7px 0 var(--v11-ink);
  transition:
    background 220ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 220ms cubic-bezier(.22, 1, .36, 1),
    transform 220ms cubic-bezier(.22, 1, .36, 1),
    color 220ms cubic-bezier(.22, 1, .36, 1);
}
.v11-cta::after {
  content: '→';
  position: absolute;
  right: 18px;
  bottom: 15px;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 30px;
  line-height: 1;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.v11-cta-kicker {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(26, 26, 26, 0.62);
}
.v11-cta-main {
  max-width: 9ch;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.035em;
}
.v11-cta:hover,
.v11-cta:focus-visible {
  background: #fff;
  color: var(--v11-accent);
  box-shadow: 11px 11px 0 var(--v11-ink);
  transform: translate(-2px, -2px);
  outline: none;
}
.v11-cta:hover::after,
.v11-cta:focus-visible::after {
  transform: translateX(5px);
}
.v11-cta:active {
  transform: translateY(0);
  transition-duration: 80ms;
}
.v11-cta.reader {
  background: var(--v11-ink);
  color: var(--v11-yellow);
}
.v11-cta.reader .v11-cta-kicker {
  color: rgba(255, 230, 0, 0.72);
}
.v11-cta.reader:hover,
.v11-cta.reader:focus-visible {
  background: #000;
  color: #fff27a;
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
  color: var(--v11-ink);
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

.v11-root :where(button, a, [role="button"], input, select, textarea):focus-visible {
  outline: 2px solid var(--v11-accent);
  outline-offset: 3px;
}

@media (max-width: 760px) {
  .v11-hero {
    min-height: calc(100svh - 64px);
  }
  .v11-hero h1 {
    font-size: clamp(52px, 15vw, 78px);
  }
  .v11-cta-row {
    grid-template-columns: 1fr;
    width: min(420px, 100%);
    margin-top: 30px;
  }
  .v11-cta {
    min-height: 94px;
  }
  .v11-proof-strip {
    gap: 6px;
  }
  .v11-proof-pill {
    min-height: 28px;
    font-size: 10px;
    padding-inline: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .v11-root,
  .v11-root *,
  .v11-root *::before,
  .v11-root *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

type Region = 'author' | 'reader' | 'both';
type Phase = 'choose' | 'leaving' | 'questions';

export default function V11Page() {
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
    'v11-root',
    phase === 'questions' ? 'is-phase-questions' : '',
  ].filter(Boolean).join(' ');

  return (
    <main className={rootClass}>
      <style dangerouslySetInnerHTML={{ __html: V11_CSS }} />

      <nav className="v11-nav" aria-label="Primary">
        <div className="v11-nav-inner">
          <Link className="v11-brand" href="/" aria-label="BetweenReads, home">
            <span>between</span>
            <span className="v11-brand-dot" aria-hidden="true" />
            <span>reads</span>
          </Link>
          <div className="v11-nav-links">
            <Link className="v11-nav-link active" href="/readers">Read</Link>
            <Link className="v11-nav-link" href="/creators">Create</Link>
            <Link className="v11-nav-link" href="/creators/agent-readiness">AgentReady</Link>
            <Link className="v11-nav-link" href="/creators/upload-illustrations">Submit</Link>
            <Link className="v11-nav-link" href="/pricing">Pricing</Link>
            <Link className="v11-nav-link" href="/faq">FAQ</Link>
            <Link className="v11-nav-link member" href="/insider">Become a Member</Link>
            <Link className="v11-nav-link support" href="/about">Support Us</Link>
          </div>
          <div className="v11-nav-right">
            <button
              type="button"
              className="v11-btn-join"
              onClick={() => openWaitlist()}
            >
              Join Free
            </button>
            <div className="v11-nav-divider" aria-hidden="true" />
            <SignInButton className="v11-btn-signin">Sign In</SignInButton>
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
        className={`v11-hero${phase === 'leaving' ? ' is-leaving' : ''}`}
        aria-label="Choose your role"
      >
        {phase !== 'questions' && (
          <div className="v11-hero-inner">
            <p className="v11-hero-label">for the hidden creative</p>
            <p className="v11-hero-sub">
              wandering readers &nbsp;·&nbsp; writers &nbsp;·&nbsp; illustrators
            </p>
            <h1>
              <span className="v11-hero-line">Discover <em>new voices.</em></span>
              <span className="v11-hero-line">Curated <em>stories.</em></span>
            </h1>

            <div className="v11-cta-row" role="group" aria-label="Start">
              <button
                type="button"
                className="v11-cta"
                onClick={() => open('author')}
              >
                <span className="v11-cta-kicker">Writers</span>
                <span className="v11-cta-main">Start Creating</span>
              </button>
              <button
                type="button"
                className="v11-cta reader"
                onClick={() => open('reader')}
              >
                <span className="v11-cta-kicker">Readers</span>
                <span className="v11-cta-main">Start Reading</span>
              </button>
            </div>
            <div className="v11-proof-strip" aria-label="Platform commitments">
              <span className="v11-proof-pill">Free to start</span>
              <span className="v11-proof-pill">Protected drafts</span>
              <span className="v11-proof-pill">No ads</span>
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
