import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import Footer from '../v8/sections/Footer';

export const metadata: Metadata = {
  title: 'Create — BetweenReads',
  description:
    'Publish your work and build an audience, find beta readers, turn your manuscript into audio, submit to the between·lines journal, and earn — all on a platform built around what writers actually need.',
};

type Feature = {
  index: string;
  title: string;
  blurb: string;
  highlights: string[];
};

const FEATURES: Feature[] = [
  {
    index: '01',
    title: 'Publish your work & build an audience',
    blurb:
      'Writing is free. Upload work in any genre or format — from microstories to novels — and reach readers who turn the page.',
    highlights: [
      'Visible to readers once you upload 5,000 words',
      'A generated, customisable author page for your whole catalogue',
      'Build agent-ready bios and highlight your best work for agents',
    ],
  },
  {
    index: '02',
    title: 'Find beta readers',
    blurb:
      'SecureBetaReads matches you with real human beta readers — your first true audience — and protects your manuscript while they read.',
    highlights: [
      'Matched by genre and format preferences',
      'Structured feedback, from emoji reactions to deep thoughts',
      'First three chapters read free; no copy-paste, no AI training',
    ],
  },
  {
    index: '03',
    title: 'Your path to audio',
    blurb:
      'Volume turns your manuscript into an audiobook. Narrate it in your own voice, or choose a human narrator.',
    highlights: [
      'Author services to produce your audio',
      'Voiced by writers — or a narrator you pick',
      'Early access now forming',
    ],
  },
  {
    index: '04',
    title: 'Submit to the between·lines journal',
    blurb:
      'Each month the between·lines journal curates the finest writing on the platform — a wholesome literary magazine for a quiet hour and a good cup of coffee.',
    highlights: [
      'Submit your work for a small $2 entry fee',
      'Chosen on quality and editorial fit, not platform metrics',
      'Readers can recommend your work for free',
    ],
  },
  {
    index: '05',
    title: 'Monetization paths',
    blurb:
      'Optional ways to earn from your writing — you retain full copyright, always.',
    highlights: [
      'Storefront — list your book and keep 80% of every sale',
      'Journal — featured writers share new-subscription revenue',
      'Tips from readers, plus a 10% referral fee',
    ],
  },
];

const CSS = `
.br-create-root {
  min-height: 100vh;
  background: var(--theme-page);
  color: var(--theme-text);
  font-family: var(--bl-font-display);
  --br-create-ease: var(--bl-ease, cubic-bezier(.22, 1, .36, 1));
}

/* === Hero === */
.br-create-hero {
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(56px, 8vw, 104px) clamp(20px, 5vw, 48px) clamp(40px, 6vw, 72px);
}
.br-create-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--theme-text-muted);
  margin: 0 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 14px;
}
.br-create-eyebrow::before {
  content: '';
  width: 32px;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
}
.br-create-title {
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(40px, 5.6vw, 76px);
  line-height: 1.03;
  letter-spacing: -0.025em;
  color: var(--theme-text);
  margin: 0 0 24px;
  max-width: 18ch;
  text-wrap: balance;
}
.br-create-title em {
  font-style: normal;
}
.br-create-lede {
  font-family: var(--bl-font-body);
  font-size: clamp(17px, 1.4vw, 21px);
  line-height: 1.6;
  color: var(--theme-text-muted);
  margin: 0;
  max-width: 60ch;
  text-wrap: pretty;
}
.br-create-actions {
  margin-top: clamp(28px, 4vw, 40px);
  display: inline-flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
}
.br-create-cta {
  font-family: var(--bl-font-display);
  font-size: clamp(15px, 1.3vw, 17px);
  font-weight: 800;
  letter-spacing: 0.2px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--theme-paper-bg, #f6f1e3);
  background: var(--theme-strong-cta-bg, var(--theme-text));
  padding: 15px 30px;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 14px 34px -14px color-mix(in srgb, var(--theme-text) 70%, transparent);
  transition: transform 220ms var(--br-create-ease), background 220ms var(--br-create-ease),
    box-shadow 220ms var(--br-create-ease);
}
.br-create-cta:hover,
.br-create-cta:focus-visible {
  background: var(--theme-strong-cta-hover-bg, var(--theme-accent-strong, var(--theme-text)));
  transform: translateY(-2px);
  box-shadow: 0 20px 42px -14px color-mix(in srgb, var(--theme-text) 72%, transparent);
  outline: none;
}
.br-create-cta-arrow {
  font-size: 0.92em;
  transition: transform 220ms var(--br-create-ease);
}
.br-create-cta:hover .br-create-cta-arrow,
.br-create-cta:focus-visible .br-create-cta-arrow {
  transform: translateX(4px);
}
.br-create-ghost {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--theme-text);
  text-decoration: none;
  padding: 6px 2px;
  border-bottom: 1px solid currentColor;
  transition: color 180ms ease;
}
.br-create-ghost:hover { color: var(--theme-accent-strong, var(--theme-accent)); }
.br-create-proof {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(14px, 2vw, 28px);
  margin-top: clamp(28px, 4vw, 40px);
}
.br-create-proof-note {
  display: inline-flex;
  align-items: center;
  font-size: clamp(12px, 1.2vw, 13px);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--theme-text-muted);
}
.br-create-proof-note::before {
  content: "✓";
  margin-right: 9px;
  font-weight: 900;
  color: var(--theme-accent-strong, var(--theme-accent));
}

/* === Features === */
.br-create-features {
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(24px, 4vw, 48px) clamp(20px, 5vw, 48px) clamp(64px, 9vw, 112px);
}
.br-create-features-head {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 640px;
  margin-bottom: clamp(32px, 4vw, 52px);
}
.br-create-features-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--theme-text-muted);
  margin: 0;
}
.br-create-features-title {
  font-family: var(--bl-font-display);
  font-weight: 600;
  font-size: clamp(30px, 3.8vw, 48px);
  line-height: 1.06;
  letter-spacing: -0.02em;
  color: var(--theme-text);
  margin: 0;
  text-wrap: balance;
}
.br-create-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(16px, 1.8vw, 22px);
}
.br-create-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: clamp(24px, 2.4vw, 32px);
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-subtle, var(--theme-border));
  border-radius: 16px;
  position: relative;
  transition: border-color 220ms var(--br-create-ease), box-shadow 220ms var(--br-create-ease),
    transform 220ms var(--br-create-ease);
}
.br-create-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border-top: 2px solid var(--theme-accent);
  opacity: 0;
  transition: opacity 220ms var(--br-create-ease);
  pointer-events: none;
}
.br-create-card:hover {
  border-color: var(--theme-border);
  box-shadow: 0 14px 32px rgb(var(--theme-shadow-rgb, 14 14 12) / 0.16);
  transform: translateY(-2px);
}
.br-create-card:hover::before { opacity: 1; }
.br-create-card-index {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.24em;
  color: var(--theme-accent);
  font-variant-numeric: tabular-nums;
  text-transform: uppercase;
}
.br-create-card-title {
  font-family: var(--bl-font-display);
  font-weight: 600;
  font-size: clamp(21px, 1.8vw, 26px);
  line-height: 1.12;
  letter-spacing: -0.015em;
  color: var(--theme-text);
  margin: 0;
}
.br-create-card-blurb {
  font-family: var(--bl-font-body);
  font-size: 15px;
  line-height: 1.55;
  color: var(--theme-text-muted);
  margin: 0;
  text-wrap: pretty;
}
.br-create-card-list {
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.br-create-card-list li {
  position: relative;
  padding-left: 22px;
  font-family: var(--bl-font-body);
  font-size: 14px;
  line-height: 1.5;
  color: var(--theme-text-soft, var(--theme-text-muted));
  text-wrap: pretty;
}
.br-create-card-list li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--theme-accent);
}

/* === Closing CTA band === */
.br-create-band {
  background: var(--theme-hero, var(--theme-yellow));
  color: var(--theme-hero-text, var(--theme-on-yellow, var(--theme-text)));
  padding: clamp(56px, 8vw, 96px) clamp(20px, 5vw, 48px);
}
.br-create-band-inner {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.br-create-band-title {
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(30px, 4vw, 52px);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0;
  text-wrap: balance;
}
.br-create-band-sub {
  font-family: var(--bl-font-body);
  font-size: clamp(16px, 1.4vw, 19px);
  line-height: 1.55;
  margin: 0;
  max-width: 48ch;
  color: color-mix(in srgb, var(--theme-hero-text, var(--theme-text)) 78%, transparent);
  text-wrap: pretty;
}

@media (max-width: 600px) {
  .br-create-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .br-create-root *,
  .br-create-root *::before {
    transition-duration: 0.01ms !important;
  }
}
`;

export default function CreatePage() {
  return (
    <div className="br-create-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <SiteNav activeHref="/create" />

      <section className="br-create-hero" aria-label="Create on BetweenReads">
        <p className="br-create-eyebrow">For creators</p>
        <h1 className="br-create-title">
          Everything you need to <em>write, share, and grow.</em>
        </h1>
        <p className="br-create-lede">
          BetweenReads is built around what writers actually need: real readers, real feedback, and a
          clear path toward publication. Publish for free, find beta readers, turn your manuscript
          into audio, reach the journal — and earn, while keeping your copyright.
        </p>
        <div className="br-create-actions">
          <Link href="/start?mode=writer" className="br-create-cta">
            Become a founding creator
            <span className="br-create-cta-arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/faq" className="br-create-ghost">
            Read the FAQ
          </Link>
        </div>
        <div className="br-create-proof" aria-label="Platform commitments">
          <span className="br-create-proof-note">Always ad-free</span>
          <span className="br-create-proof-note">No AI-generated content</span>
          <span className="br-create-proof-note">You keep your copyright</span>
        </div>
      </section>

      <section className="br-create-features" aria-label="Creator features">
        <div className="br-create-features-head">
          <p className="br-create-features-eyebrow">Five ways to build your career</p>
          <h2 className="br-create-features-title">What you can do here.</h2>
        </div>
        <div className="br-create-grid">
          {FEATURES.map((feature) => (
            <article key={feature.index} className="br-create-card">
              <span className="br-create-card-index">{feature.index}</span>
              <h3 className="br-create-card-title">{feature.title}</h3>
              <p className="br-create-card-blurb">{feature.blurb}</p>
              <ul className="br-create-card-list">
                {feature.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="br-create-band" aria-label="Start creating">
        <div className="br-create-band-inner">
          <h2 className="br-create-band-title">Your readers are waiting.</h2>
          <p className="br-create-band-sub">
            Join as a founding creator and start building your audience today — it&rsquo;s free to
            write, and your work is yours.
          </p>
          <Link href="/start?mode=writer" className="br-create-cta">
            Become a founding creator
            <span className="br-create-cta-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
