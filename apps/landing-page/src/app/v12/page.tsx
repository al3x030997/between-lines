'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  padding: clamp(24px, 4vh, 52px) clamp(20px, 4vw, 40px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(88vh - 76px);
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
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--v12-ink);
  opacity: 0.65;
  margin-bottom: 6px;
}
.v12-hero-sub {
  font-size: 16px;
  color: var(--v12-ink);
  opacity: 0.45;
  letter-spacing: 0.4px;
  margin-bottom: clamp(22px, 4vh, 40px);
}
.v12-hero h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(48px, 8.2vw, 104px);
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
  gap: 14px;
  background: rgba(233, 75, 54, 0.08);
  border: 1.5px solid rgba(233, 75, 54, 0.42);
  border-radius: 999px;
  padding: 11px 22px;
  cursor: pointer;
  color: #c43a26;
  font-family: 'Outfit', system-ui, sans-serif;
  transition: color 200ms var(--v6-ease),
              background 200ms var(--v6-ease),
              border-color 200ms var(--v6-ease);
}
.v12-open-call-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #c43a26;
}
.v12-open-call-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #e94b36;
  box-shadow: 0 0 0 0 color-mix(in srgb, #e94b36 70%, transparent);
  animation: v12-opencall-pulse 2.4s ease-out infinite;
}
@keyframes v12-opencall-pulse {
  0%   { box-shadow: 0 0 0 0 color-mix(in srgb, #e94b36 60%, transparent); }
  70%  { box-shadow: 0 0 0 9px color-mix(in srgb, #e94b36 0%, transparent); }
  100% { box-shadow: 0 0 0 0 color-mix(in srgb, #e94b36 0%, transparent); }
}
@media (prefers-reduced-motion: reduce) {
  .v12-open-call-dot { animation: none; }
}
.v12-open-call-text {
  font-size: clamp(19px, 2.5vw, 26px);
  font-weight: 700;
  text-decoration: none;
}
.v12-open-call-arrow {
  font-size: 1em;
  transition: transform 200ms var(--v6-ease);
}
.v12-open-call:hover {
  background: rgba(233, 75, 54, 0.14);
  border-color: rgba(233, 75, 54, 0.6);
}
.v12-open-call:hover .v12-open-call-arrow { transform: translateX(3px); }
.v12-open-call:focus-visible { outline: none; }

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
    min-height: calc(90svh - 76px);
  }
  .v12-hero h1 {
    font-size: clamp(52px, 15vw, 88px);
  }
  .v12-hero-actions {
    margin-top: 34px;
  }
  .v12-proof-strip {
    flex-direction: column;
    gap: 10px;
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

export default function V12Page() {
  const router = useRouter();

  // Every CTA ("Read Now", "Join Free", section CTAs) routes to the dedicated
  // /start intake page in reader vs writer mode. The gallery is reached
  // separately via the nav "Read" link, not these conversion CTAs.
  const open = (region: Region) => {
    router.push(`/start?mode=${region === 'author' ? 'writer' : 'reader'}`);
  };

  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('u');
    setBannerMessage(code ? (BANNER_MESSAGES[code] ?? null) : null);

    // Legacy deep-links from other pages' CTAs (?join=… / ?intake=…) now bounce
    // to the dedicated /start intake page instead of opening inline.
    const region = params.get('join') ?? params.get('intake');
    if (region === 'reader' || region === 'author' || region === 'writer') {
      router.replace(`/start?mode=${region === 'reader' ? 'reader' : 'writer'}`);
    }
  }, [router]);

  const dismissBanner = () => {
    setBannerMessage(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('u');
      window.history.replaceState(null, '', url.toString());
    }
  };

  return (
    <main className="v12-root">
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

      <section className="v12-hero" aria-label="Choose your role">
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
              <span className="v12-proof-note">No AI-generated content</span>
            </div>
        </div>
      </section>

      <BetweenReviews onReader={() => open('reader')} />

      <SignupOffers onReader={() => open('reader')} onWriter={() => open('author')} />

      <FaqTeaser onReader={() => open('reader')} onWriter={() => open('author')} />
      <Footer />
    </main>
  );
}
