'use client';

import { useEffect, useState } from 'react';
import type { InlineAnswers, Region } from '../v6/InlineQuestions';
import { SignUpOverlay, type SignUpVariant } from '../v6/SignUp';
import Footer from '../v6/sections/Footer';
import { CountdownClock } from './components/CountdownClock';
import HeroIssue from './sections/HeroIssue';
import SamplePassage from './sections/SamplePassage';
import TheDrop from './sections/TheDrop';
import EditorialSplit from './sections/EditorialSplit';
import ByTheNumbers from './sections/ByTheNumbers';
import Marginalia from './sections/Marginalia';
import FinalCTA from './sections/FinalCTA';

const DROP_CLOSES_AT = '2026-06-14T00:00:00Z';

const V7_CSS = `
.v7-root {
  --bl-paper: #F0E9D9;
  --bl-paper-warm: #E5DCC4;
  --bl-ink: #1A1612;
  --bl-wash: #6B6457;
  --bl-wash-soft: #9C9587;
  --bl-accent: #8B2438;
  --bl-accent-soft: rgba(139, 36, 56, 0.10);
  --bl-kraft: #C5A26B;
  --bl-kraft-deep: #6B4A2E;
  --bl-divider: rgba(26, 22, 18, 0.16);
  --bl-redaction: #0F0D0A;
  --bl-margin-ink: #3D4F5C;
  --bl-dark-bg: #131720;
  --bl-dark-fg: #F0E9D9;
  --bl-dark-accent: #D89060;

  /* footer (reuses v6 vars) */
  --bl-footer-bg: var(--bl-paper);
  --bl-footer-fg: var(--bl-ink);
  --bl-footer-muted: var(--bl-wash);
  --bl-footer-divider: var(--bl-divider);
  --bl-footer-accent: var(--bl-accent);

  /* SignUp modal reuses v6 vars */
  --v6-accent: var(--bl-accent);
  --v6-accent-soft: var(--bl-accent-soft);
  --v6-text-strong: var(--bl-ink);
  --v6-text: var(--bl-ink);
  --v6-text-muted: var(--bl-wash);
  --v6-divider: var(--bl-divider);

  min-height: 100vh;
  background: var(--bl-paper);
  color: var(--bl-ink);
  font-family: 'Outfit', 'Bricolage Grotesque', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* === Nav / Masthead === */
.v7-nav {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  padding: 18px clamp(20px, 3.5vw, 56px);
  background: rgba(240, 233, 217, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--bl-divider);
  color: var(--bl-ink);
}
.v7-nav-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.v7-brand {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-weight: 500;
  font-size: 22px;
  letter-spacing: -0.02em;
  color: var(--bl-ink);
  text-decoration: none;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}
.v7-brand-dot {
  color: var(--bl-accent);
  font-style: italic;
  transform: translateY(-2px);
}
.v7-brand em {
  font-style: italic;
}
.v7-brand-sub {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bl-wash);
}
.v7-nav-center {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bl-wash);
  text-align: center;
}
.v7-nav-center strong {
  color: var(--bl-accent);
  font-weight: 700;
}
.v7-nav-right {
  display: flex;
  align-items: center;
  gap: 18px;
  justify-content: flex-end;
}
.v7-nav-clock {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bl-wash);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.v7-nav-clock .v7-clock-num {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0;
  color: var(--bl-ink);
  margin: 0 1px;
}
.v7-nav-clock .v7-clock-sec { display: none; }
@media (max-width: 760px) {
  .v7-nav { grid-template-columns: 1fr auto; }
  .v7-nav-center { display: none; }
  .v7-nav-clock { display: none; }
}
.v7-nav-signin {
  appearance: none;
  background: none;
  border: 1px solid var(--bl-divider);
  padding: 8px 16px;
  border-radius: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink);
  cursor: pointer;
  transition: border-color 240ms ease, color 240ms ease, background 240ms ease;
}
.v7-nav-signin:hover {
  background: var(--bl-ink);
  color: var(--bl-paper);
  border-color: var(--bl-ink);
}

/* === Decorative intermission rules === */
.v7-rule {
  position: relative;
  background: var(--bl-paper);
  padding: clamp(40px, 6vh, 72px) clamp(24px, 5vw, 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.v7-rule-mark {
  display: inline-flex;
  align-items: center;
  gap: clamp(14px, 2vw, 28px);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bl-wash);
}
.v7-rule-line {
  display: inline-block;
  width: clamp(60px, 10vw, 140px);
  height: 1px;
  background: var(--bl-divider);
}
.v7-rule-glyph {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 22px;
  letter-spacing: 0;
  text-transform: none;
  color: var(--bl-accent);
  transform: translateY(-1px);
}

/* === Optional tweaks bar (only when ?tweaks=1) === */
.v7-tweaks {
  position: fixed;
  bottom: 18px;
  right: 18px;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.94);
  border: 1px solid var(--bl-divider);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-wash);
  box-shadow: 0 8px 24px rgba(26,22,18,0.12);
}
.v7-tweaks button {
  appearance: none;
  background: transparent;
  border: 0;
  padding: 4px 6px;
  font: inherit;
  color: var(--bl-wash);
  cursor: pointer;
  text-decoration: none;
}
.v7-tweaks button:hover { color: var(--bl-accent); }
.v7-tweaks button.is-active { color: var(--bl-ink); text-decoration: underline; }

/* === Footer overrides for v7 paper aesthetic === */
.v7-root .bl-footer {
  background: var(--bl-dark-bg);
  color: var(--bl-dark-fg);
  border-top: 1px solid var(--bl-divider);
}
.v7-root .bl-footer-mark { color: var(--bl-dark-fg); font-style: italic; }
.v7-root .bl-footer-tag { color: rgba(240, 233, 217, 0.62); }
.v7-root .bl-footer-col-title { color: rgba(240, 233, 217, 0.62); }
.v7-root .bl-footer-col a { color: var(--bl-dark-fg); }
.v7-root .bl-footer-col a:hover { color: var(--bl-dark-accent); }
.v7-root .bl-footer-cols { border-top-color: rgba(240, 233, 217, 0.16); }
.v7-root .bl-footer-bottom { border-top-color: rgba(240, 233, 217, 0.16); color: rgba(240, 233, 217, 0.62); }
.v7-root .bl-footer-bottom a { color: rgba(240, 233, 217, 0.62); }
.v7-root .bl-footer-bottom a:hover { color: var(--bl-dark-accent); }
.v7-root .bl-footer-accent { background: var(--bl-dark-accent); }

/* === InlineQuestions color overrides for v7 paper === */
.v7-root .v6-inline-prompt {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-weight: 400;
  font-style: italic;
  font-size: clamp(32px, 5vw, 58px);
  letter-spacing: -0.02em;
  color: var(--bl-ink);
}
.v7-root .v6-inline-step {
  color: var(--bl-accent);
}
.v7-root .v6-inline-progress { background: var(--bl-divider); }
.v7-root .v6-inline-progress-fill { background: var(--bl-accent); }
.v7-root .v6-inline-chip {
  border-color: var(--bl-divider);
  color: var(--bl-ink);
  font-family: 'Bricolage Grotesque', sans-serif;
}
.v7-root .v6-inline-chip:hover,
.v7-root .v6-inline-chip:focus-visible {
  background: var(--bl-accent-soft);
  border-color: var(--bl-accent);
}
.v7-root .v6-inline-chip.is-selected {
  background: var(--bl-accent);
  border-color: var(--bl-accent);
  color: var(--bl-paper);
}
.v7-root .v6-inline-back { color: var(--bl-wash); }
.v7-root .v6-inline-back:hover { color: var(--bl-accent); }
`;

type SignUpState = {
  open: boolean;
  variant: SignUpVariant;
  eyebrow?: string;
};

const EYEBROWS = {
  reader: 'Reader profile saved',
  author: 'Writer profile saved',
  both: 'Both profiles saved',
  passage: 'Get the rest of chapter one',
  drop: 'Request access — drops 14.06',
  outcomes: 'Issue №00 outcomes',
  tail: 'Learn more',
  signin: undefined,
} as const;

export default function V7Page() {
  const [signUp, setSignUp] = useState<SignUpState>({ open: false, variant: 'signup' });
  const [tweaksVisible, setTweaksVisible] = useState(false);

  // Body background + tweaks query param
  useEffect(() => {
    const prevBg = document.body.style.background;
    document.body.style.background = '#F0E9D9';
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setTweaksVisible(params.get('tweaks') === '1');
    }
    return () => {
      document.body.style.background = prevBg;
    };
  }, []);

  const openSignIn = () => setSignUp({ open: true, variant: 'signin' });

  const completeFromHero = (_a: InlineAnswers, finalRegion: Region) => {
    const eyebrow =
      finalRegion === 'reader'
        ? EYEBROWS.reader
        : finalRegion === 'author'
          ? EYEBROWS.author
          : EYEBROWS.both;
    setSignUp({ open: true, variant: 'signup', eyebrow });
  };

  const openGate = (kind: keyof typeof EYEBROWS) => {
    setSignUp({ open: true, variant: 'signup', eyebrow: EYEBROWS[kind] ?? undefined });
  };

  const openRegion = (r: Region) => {
    const eyebrow =
      r === 'reader' ? EYEBROWS.reader : r === 'author' ? EYEBROWS.author : EYEBROWS.both;
    setSignUp({ open: true, variant: 'signup', eyebrow });
  };

  return (
    <main className="v7-root">
      <style dangerouslySetInnerHTML={{ __html: V7_CSS }} />

      <nav className="v7-nav" aria-label="BetweenLines masthead">
        <div className="v7-nav-left">
          <a className="v7-brand" href="#" aria-label="BetweenLines, home">
            <span>between</span>
            <span className="v7-brand-dot">·</span>
            <em>lines</em>
          </a>
          <span className="v7-brand-sub">Issue №01 · Closes 14.06.2026</span>
        </div>
        <div className="v7-nav-center">
          A monthly drop of <strong>unpublished fiction</strong>
        </div>
        <div className="v7-nav-right">
          <span className="v7-nav-clock" aria-label="Issue closes in">
            <span>closes in</span>
            <CountdownClock target={DROP_CLOSES_AT} />
          </span>
          <button type="button" className="v7-nav-signin" onClick={openSignIn}>
            Sign in
          </button>
        </div>
      </nav>

      <HeroIssue onComplete={completeFromHero} dropClosesAt={DROP_CLOSES_AT} />

      <aside className="v7-rule" aria-hidden="true">
        <span className="v7-rule-mark">
          <span className="v7-rule-line" />
          <span className="v7-rule-glyph">§</span>
          <span>Inside Issue №01</span>
          <span className="v7-rule-glyph">↓</span>
          <span className="v7-rule-line" />
        </span>
      </aside>

      <SamplePassage onReveal={() => openGate('passage')} />

      <TheDrop onRevealBook={() => openGate('drop')} />

      <EditorialSplit onStart={openRegion} onTail={() => openGate('tail')} />

      <ByTheNumbers onRequestOutcomes={() => openGate('outcomes')} />

      <Marginalia />

      <FinalCTA onOpenRegion={openRegion} />

      <Footer />

      <SignUpOverlay
        open={signUp.open}
        variant={signUp.variant}
        eyebrow={signUp.eyebrow}
        onClose={() => setSignUp((s) => ({ ...s, open: false }))}
      />

      {tweaksVisible && (
        <div className="v7-tweaks" aria-label="Dev tweaks">
          <span>v7</span>
          <button
            type="button"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('tweaks');
              window.location.href = url.toString();
            }}
          >
            hide
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            top
          </button>
          <a
            href="/v6"
            style={{ color: 'inherit', textDecoration: 'none', padding: '4px 6px' }}
          >
            v6 →
          </a>
        </div>
      )}
    </main>
  );
}
