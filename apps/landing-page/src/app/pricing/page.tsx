'use client';

// Tabbed reader/creator pricing design — implemented 2026-06-09 from the
// pricing-tabs mockup. The previous green-accent layout is preserved in
// src/app/pricing/_archive/page.tsx (not routed) and can be restored.

import { useState } from 'react';
import Link from 'next/link';
import { WaitlistOverlay } from '../v8/WaitlistForm';
import Footer from '../v8/sections/Footer';

const PRICING_CSS = `
.pricing-root {
  --pr-paper: var(--bl-surface);
  --pr-ink: #1a1a1a;
  --pr-yellow: #FFE800;
  --pr-divider: rgba(14,14,12,0.1);
  min-height: 100vh;
  background: var(--pr-paper);
  font-family: var(--bl-font-body);
  color: var(--pr-ink);
}

/* === nav (mirrors the rest of the site) === */
.pricing-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 3.5vw, 56px);
  border-bottom: 1px solid var(--pr-divider);
  background: var(--pr-paper);
}
.pricing-nav-left {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 38px);
}
.pricing-brand {
  display: inline-flex;
  align-items: baseline;
  color: var(--pr-ink);
  text-decoration: none;
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 19px;
  letter-spacing: -0.02em;
  font-variation-settings: 'wdth' 95;
}
.pricing-brand-dot {
  color: var(--bl-accent);
  padding: 0 4px;
  font-weight: 800;
  transform: translateY(-1px);
}
.pricing-nav-links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2vw, 24px);
  font-family: var(--bl-font-eyebrow);
}
.pricing-nav-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--pr-ink);
  text-decoration: none;
  padding: 4px 0;
  position: relative;
  transition: color 200ms ease;
}
.pricing-nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--bl-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 240ms var(--bl-ease);
}
.pricing-nav-link:hover { color: var(--bl-accent); }
.pricing-nav-link:hover::after { transform: scaleX(1); }
.pricing-nav-link.is-active { color: var(--bl-accent); }
.pricing-nav-link.is-active::after { transform: scaleX(1); }
.pricing-nav-cta {
  appearance: none;
  border: 0;
  background: var(--pr-yellow);
  color: var(--pr-ink);
  padding: 9px 18px;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.pricing-nav-cta:hover,
.pricing-nav-cta:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(14, 14, 12, 0.16);
  outline: none;
}

/* hover dropdowns for nav groups */
.pricing-nav-group { position: relative; display: inline-flex; align-items: center; }
.pricing-nav-group::before {
  content: '';
  position: absolute;
  left: -12px; right: -12px; top: 100%;
  height: 18px;
  pointer-events: none;
}
.pricing-nav-group:hover::before,
.pricing-nav-group:focus-within::before { pointer-events: auto; }
.pricing-nav-dropdown {
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  min-width: 232px;
  background: var(--pr-paper);
  border: 1px solid rgba(14,14,12,0.08);
  border-radius: 14px;
  padding: 8px;
  box-shadow:
    0 18px 40px -16px rgba(14, 14, 12, 0.22),
    0 8px 16px -10px rgba(14, 14, 12, 0.14);
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translate(-50%, -6px);
  transition: opacity 200ms var(--bl-ease), transform 220ms var(--bl-ease), visibility 200ms linear;
  z-index: 10;
}
.pricing-nav-group:hover .pricing-nav-dropdown,
.pricing-nav-group:focus-within .pricing-nav-dropdown {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  transform: translate(-50%, 0);
}
.pricing-nav-sub {
  display: block;
  padding: 9px 14px;
  font-family: var(--bl-font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--pr-ink);
  text-decoration: none;
  border-radius: 8px;
  white-space: nowrap;
  transition: background 160ms ease, color 160ms ease, transform 160ms var(--bl-ease);
}
.pricing-nav-sub:hover,
.pricing-nav-sub:focus-visible {
  background: var(--bl-accent-soft);
  color: var(--bl-accent-strong);
  transform: translateX(2px);
  outline: none;
}
@media (max-width: 760px) {
  .pricing-nav-links { display: none; }
  .pricing-nav-dropdown { display: none; }
}

/* === hero === */
.pricing-hero {
  text-align: center;
  padding: clamp(40px, 6vh, 64px) 2rem 1.5rem;
  max-width: 660px;
  margin: 0 auto;
}
.pricing-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(14,14,12,0.4);
  margin-bottom: 14px;
  display: inline-block;
}
.pricing-hero-title {
  margin: 0 0 14px;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(34px, 4.6vw, 50px);
  line-height: 1.08;
  letter-spacing: -0.035em;
  color: var(--pr-ink);
  text-wrap: balance;
}
.pricing-hero-title em {
  font-style: italic;
  font-family: var(--bl-font-serif);
  font-variation-settings: 'opsz' 96, 'SOFT' 60;
}
.pricing-hero-sub {
  margin: 0;
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 1.6;
  color: rgba(14,14,12,0.55);
}

/* === controls === */
.pricing-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin: 2.25rem auto 0;
}
.pricing-aud-tabs {
  display: flex;
  border: 0.5px solid rgba(14,14,12,0.2);
  border-radius: 8px;
  overflow: hidden;
}
.pricing-aud-tab {
  appearance: none;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 9px 28px;
  border: none;
  background: #fff;
  cursor: pointer;
  color: rgba(14,14,12,0.55);
  transition: background 150ms ease, color 150ms ease;
}
.pricing-aud-tab.is-active { background: var(--pr-ink); color: #fff; }

.pricing-billing {
  display: flex;
  align-items: center;
  gap: 11px;
}
.pricing-billing-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  color: rgba(14,14,12,0.45);
  font-weight: 500;
}
.pricing-billing-label.is-active { color: var(--pr-ink); font-weight: 700; }
.pricing-billing-toggle {
  appearance: none;
  width: 42px;
  height: 23px;
  background: var(--pr-ink);
  border: 0;
  border-radius: 20px;
  padding: 0;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}
.pricing-billing-toggle::after {
  content: '';
  position: absolute;
  width: 17px;
  height: 17px;
  background: #fff;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: transform 200ms var(--bl-ease);
}
.pricing-billing-toggle.is-annual::after { transform: translateX(19px); }
.pricing-billing-save {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: var(--bl-accent-soft);
  color: var(--bl-accent-strong);
  padding: 3px 8px;
  border-radius: 10px;
}
.pricing-billing-note {
  font-family: var(--bl-font-eyebrow);
  font-size: 11.5px;
  color: rgba(14,14,12,0.45);
}

/* === plans === */
.pricing-plans-section {
  max-width: 840px;
  margin: 2.5rem auto 0;
  padding: 0 2rem;
}
.pricing-plans-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 680px) { .pricing-plans-grid { grid-template-columns: 1fr; } }

.pricing-plan {
  position: relative;
  background: #fff;
  border-radius: 18px;
  border: 0.5px solid var(--pr-divider);
  padding: 2rem;
  display: flex;
  flex-direction: column;
}
.pricing-plan.is-featured {
  background: var(--pr-yellow);
  border: none;
}
.pricing-plan-flag {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--pr-ink);
  color: var(--pr-yellow);
  padding: 4px 10px;
  border-radius: 20px;
}
.pricing-plan-icon { width: 30px; height: 30px; margin-bottom: 1.1rem; }
.pricing-plan-icon svg { width: 100%; height: 100%; display: block; }
.pricing-plan-name {
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pr-ink);
  margin: 0 0 6px;
}
.pricing-plan-tagline {
  font-family: var(--bl-font-serif);
  font-style: italic;
  font-size: 13px;
  color: rgba(14,14,12,0.55);
  margin: 0 0 1.5rem;
  line-height: 1.55;
  min-height: 38px;
}
.pricing-plan.is-featured .pricing-plan-tagline { color: #6a5c00; }
.pricing-plan-amount {
  font-family: var(--bl-font-serif);
  font-variation-settings: 'opsz' 96, 'SOFT' 40;
  font-size: 46px;
  font-weight: 500;
  color: var(--pr-ink);
  line-height: 1;
}
.pricing-plan-amount.is-free { font-size: 40px; }
.pricing-plan-period {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  color: rgba(14,14,12,0.45);
  margin-top: 5px;
}
.pricing-plan.is-featured .pricing-plan-period { color: #7a6a10; }
.pricing-plan-member {
  font-family: var(--bl-font-body);
  font-size: 11px;
  color: #9a7a1a;
  background: #fff8ee;
  border: 0.5px solid #f5dca8;
  border-radius: 8px;
  padding: 7px 11px;
  margin-top: 1.1rem;
  line-height: 1.45;
}
.pricing-plan-member strong { color: #7a5b06; }
.pricing-plan.is-featured .pricing-plan-member {
  background: rgba(0,0,0,0.06);
  border-color: rgba(0,0,0,0.1);
  color: #5a4d00;
}
.pricing-plan.is-featured .pricing-plan-member strong { color: var(--pr-ink); }
.pricing-plan-divider {
  border: none;
  border-top: 0.5px solid rgba(14,14,12,0.1);
  margin: 1.5rem 0;
}
.pricing-plan.is-featured .pricing-plan-divider { border-top-color: rgba(0,0,0,0.12); }
.pricing-plan-features {
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
  flex: 1;
}
.pricing-plan-features li {
  font-family: var(--bl-font-body);
  font-size: 12.5px;
  color: rgba(14,14,12,0.66);
  padding: 6px 0;
  display: flex;
  gap: 9px;
  align-items: flex-start;
  line-height: 1.5;
}
.pricing-plan-features li::before {
  content: '✓';
  color: var(--bl-accent);
  font-weight: 700;
  flex-shrink: 0;
  font-size: 12px;
  margin-top: 1px;
}
.pricing-plan.is-featured .pricing-plan-features li { color: #3a3000; }
.pricing-plan.is-featured .pricing-plan-features li::before { color: #7a6a10; }
.pricing-plan-cta {
  appearance: none;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  transition: transform 200ms var(--bl-ease), box-shadow 200ms var(--bl-ease);
}
.pricing-plan-cta.is-outline {
  background: #fff;
  color: var(--pr-ink);
  border: 0.5px solid rgba(14,14,12,0.2);
}
.pricing-plan-cta.is-outline:hover { border-color: var(--pr-ink); }
.pricing-plan-cta.is-yellow {
  background: var(--pr-ink);
  color: var(--pr-yellow);
}
.pricing-plan-cta.is-yellow:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(14,14,12,0.24);
}

/* === membership strip === */
.pricing-mem-strip {
  max-width: 840px;
  margin: 2rem auto 0;
  padding: 0 2rem;
}
.pricing-mem-inner {
  background: linear-gradient(135deg, #1a1a1a, #2d2a24);
  border-radius: 18px;
  padding: 1.6rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.pricing-mem-badge {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c8a96a;
  margin-bottom: 5px;
}
.pricing-mem-h {
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.01em;
  color: #fff;
  margin: 0 0 4px;
}
.pricing-mem-p {
  font-family: var(--bl-font-body);
  font-size: 12px;
  color: rgba(246,241,227,0.7);
  margin: 0;
}
.pricing-mem-link {
  appearance: none;
  background: #c8a96a;
  color: #1a1a1a;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 11px 22px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 200ms var(--bl-ease), box-shadow 200ms var(--bl-ease);
}
.pricing-mem-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(200,169,106,0.3);
}

/* === kids line === */
.pricing-kids-line {
  max-width: 840px;
  margin: 1.5rem auto 0;
  padding: 0 2rem;
  text-align: center;
}
.pricing-kids-line a {
  font-family: var(--bl-font-body);
  font-size: 13px;
  color: rgba(14,14,12,0.55);
  text-decoration: none;
  border-bottom: 0.5px solid rgba(14,14,12,0.2);
  padding-bottom: 2px;
  transition: color 180ms ease, border-color 180ms ease;
}
.pricing-kids-line a:hover { color: var(--pr-ink); border-color: var(--pr-ink); }

/* === FAQ === */
.pricing-faq-section {
  max-width: 840px;
  margin: 3.5rem auto;
  padding: 0 2rem;
}
.pricing-faq-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  border-bottom: 0.5px solid var(--pr-divider);
  padding-bottom: 0.9rem;
}
.pricing-faq-title {
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-size: clamp(22px, 2.4vw, 26px);
  letter-spacing: -0.02em;
  margin: 0;
}
.pricing-faq-all {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pr-ink);
  text-decoration: none;
}
.pricing-faq-all:hover { color: var(--bl-accent); }
.pricing-faq-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
}
@media (max-width: 680px) { .pricing-faq-cards { grid-template-columns: 1fr; } }
.pricing-faq-card {
  padding: 1.5rem 1.75rem 1.5rem 0;
  border-bottom: 0.5px solid var(--pr-divider);
}
.pricing-faq-card:nth-child(odd) { border-right: 0.5px solid var(--pr-divider); padding-right: 1.75rem; }
.pricing-faq-card:nth-child(even) { padding-left: 1.75rem; }
@media (max-width: 680px) {
  .pricing-faq-card:nth-child(odd) { border-right: none; padding-right: 0; }
  .pricing-faq-card:nth-child(even) { padding-left: 0; }
}
.pricing-faq-k {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(14,14,12,0.4);
  margin-bottom: 9px;
}
.pricing-faq-cq {
  font-family: var(--bl-font-display);
  font-weight: 500;
  font-size: 17px;
  color: var(--pr-ink);
  margin: 0 0 8px;
  line-height: 1.3;
}
.pricing-faq-ca {
  font-family: var(--bl-font-serif);
  font-size: 13px;
  color: rgba(14,14,12,0.6);
  line-height: 1.65;
  margin: 0;
}

.pricing-root :where(button, a, [role="button"], input):focus-visible {
  outline: 2px solid var(--bl-accent);
  outline-offset: 3px;
}
`;

type Billing = 'monthly' | 'annual';
type Audience = 'reader' | 'creator';

const ICON = {
  emergingReader: (
    <svg viewBox="0 0 32 32" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M16 9 C12 6 6 6 4 8 L4 25 C6 23 12 23 16 26 C20 23 26 23 28 25 L28 8 C26 6 20 6 16 9 Z" />
      <path d="M16 9 L16 26" />
    </svg>
  ),
  powerReader: (
    <svg viewBox="0 0 32 32" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M9 5 L23 5 L23 27 L16 21 L9 27 Z" />
    </svg>
  ),
  emergingCreator: (
    <svg viewBox="0 0 32 32" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M22 5 L27 10 L13 24 L7 25 L8 19 Z" />
      <path d="M20 7 L25 12" />
    </svg>
  ),
  powerCreator: (
    <svg viewBox="0 0 32 32" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M23 4 L28 9 L12 25 L6 26 L7 20 Z" />
      <path d="M20 7 L25 12" />
    </svg>
  ),
};

const FAQS: { k: string; q: string; a: React.ReactNode }[] = [
  {
    k: 'Plans',
    q: 'Can I be both a Reader and a Creator?',
    a: "Yes — and you don't need two plans. PowerCreator includes all the PowerReader reading benefits alongside the creator tools, at the same price. One plan, both sides of the writing life.",
  },
  {
    k: 'Billing',
    q: 'Does annual billing save money?',
    a: "Yes — paying annually saves you 17%, $100/year instead of $120. There's no free trial; you start on the free plan for as long as you like, then upgrade when you're ready.",
  },
  {
    k: 'Credits',
    q: 'How do I earn ReadCredits?',
    a: 'ReadCredits are earned by reviewing a BetweenReads author. They unlock premium content and platform features, and never expire.',
  },
  {
    k: 'Membership',
    q: 'What does the $50 membership add?',
    a: 'On top of any plan: 10% off every plan, 2× ReadCredits, free journal issues, a member badge, weighted Reader Picks, and priority beta matching. No share of revenue or profit.',
  },
  {
    k: 'Free tier',
    q: 'What can I do without paying?',
    a: 'A great deal. Both free tiers include your profile, BetweenReviews, the BetweenCharacters Wall, reading clubs, and ReadCredits — free forever, no card.',
  },
  {
    k: 'Coming soon',
    q: 'What about audiobooks and agent tools?',
    a: "ListenerPro (audio) and AgentReadyPro (agent submission) arrive after launch. Join free and we'll let you know the moment they're ready.",
  },
];

type Plan = {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  featured?: boolean;
  features: React.ReactNode[];
  cta: string;
};

const READER_PLANS: { free: Plan; power: Plan } = {
  free: {
    icon: ICON.emergingReader,
    name: 'EmergingReader',
    tagline: 'Discover writers, build your reading identity, join the community.',
    features: [
      'BetweenPages reader profile',
      'BetweenReviews — review, recommend & Find a Book',
      'BetweenCharacters Wall',
      'Free chapters & public content',
      'Reading streak & ReadCredits',
      "Join Reader's Clubs",
    ],
    cta: 'Start reading free',
  },
  power: {
    icon: ICON.powerReader,
    name: 'PowerReader',
    tagline: 'More content, deeper community, early access to everything.',
    featured: true,
    features: [
      'Everything in EmergingReader',
      'Unlimited premium chapters from participating titles',
      'BetweenLines journal — all issues',
      'Reader Pods — join writer inner circles',
      'Early access to new content',
      'Priority beta reader matching',
    ],
    cta: 'Start PowerReader',
  },
};

const CREATOR_PLANS: { free: Plan; power: Plan } = {
  free: {
    icon: ICON.emergingCreator,
    name: 'EmergingCreator',
    tagline: 'Publish your writing, find your readers, build your presence.',
    features: [
      'Writer profile — full BetweenPages identity',
      'BetweenReviews — review, recommend & Find a Book',
      'Publish up to 3 works publicly',
      'BetweenCharacters Wall',
      'Writing streak & credits',
      'Reader & Writer Clubs · basic matching',
    ],
    cta: 'Start writing free',
  },
  power: {
    icon: ICON.powerCreator,
    name: 'PowerCreator',
    tagline: 'Protect your work, grow your readership — and read everything too.',
    featured: true,
    features: [
      'Everything in EmergingCreator',
      <strong key="pr" style={{ fontWeight: 700 }}>All PowerReader benefits included</strong>,
      'Unlimited published works',
      'SecureBetaReads — watermarked manuscripts',
      'Reader Pods & Writer Pods',
      'BetweenLines journal — submit to editorial',
    ],
    cta: 'Start PowerCreator',
  },
};

export default function PricingPage() {
  const [audience, setAudience] = useState<Audience>('reader');
  const [billing, setBilling] = useState<Billing>('monthly');
  const [waitlist, setWaitlist] = useState<{ open: boolean; eyebrow?: string }>({ open: false });

  const openWaitlist = (eyebrow?: string) => setWaitlist({ open: true, eyebrow });
  const closeWaitlist = () => setWaitlist({ open: false });

  const isAnnual = billing === 'annual';
  const powerPrice = isAnnual ? '$100' : '$10';
  const powerPeriod = isAnnual ? 'per year' : 'per month';
  const billingNote = isAnnual
    ? 'Billed annually · save 17% · cancel anytime'
    : 'Billed monthly · cancel anytime';

  const plans = audience === 'reader' ? READER_PLANS : CREATOR_PLANS;

  const renderPlan = (plan: Plan, free: boolean) => (
    <article className={`pricing-plan${plan.featured ? ' is-featured' : ''}`}>
      {plan.featured && <span className="pricing-plan-flag">Most popular</span>}
      <div className="pricing-plan-icon" aria-hidden="true">{plan.icon}</div>
      <h3 className="pricing-plan-name">{plan.name}</h3>
      <p className="pricing-plan-tagline">{plan.tagline}</p>
      {free ? (
        <>
          <div className="pricing-plan-amount is-free">Free</div>
          <div className="pricing-plan-period">Forever · no card required</div>
        </>
      ) : (
        <>
          <div className="pricing-plan-amount">{powerPrice}</div>
          <div className="pricing-plan-period">{powerPeriod}</div>
          <div className="pricing-plan-member">
            Members pay <strong>$90/yr</strong> — 10% off
          </div>
        </>
      )}
      <hr className="pricing-plan-divider" />
      <ul className="pricing-plan-features">
        {plan.features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <button
        type="button"
        className={`pricing-plan-cta ${free ? 'is-outline' : 'is-yellow'}`}
        onClick={() => openWaitlist(plan.name)}
      >
        {plan.cta}
      </button>
    </article>
  );

  return (
    <main className="pricing-root">
      <style dangerouslySetInnerHTML={{ __html: PRICING_CSS }} />

      {/* === nav === */}
      <nav className="pricing-nav">
        <div className="pricing-nav-left">
          <Link className="pricing-brand" href="/" aria-label="BetweenReads, home">
            <span>between</span>
            <span className="pricing-brand-dot">.</span>
            <span>reads</span>
          </Link>
          <div className="pricing-nav-links">
            <Link className="pricing-nav-link" href="/betweenlines">BetweenLines</Link>
            <div className="pricing-nav-group">
              <Link className="pricing-nav-link" href="/readers">Readers</Link>
              <div className="pricing-nav-dropdown" role="menu" aria-label="Readers sub-pages">
                <Link className="pricing-nav-sub" href="/readers/read" role="menuitem">Read</Link>
                <Link className="pricing-nav-sub" href="/readers/listen" role="menuitem">Listen</Link>
                <Link className="pricing-nav-sub" href="/readers/kids" role="menuitem">Kids</Link>
              </div>
            </div>
            <div className="pricing-nav-group">
              <Link className="pricing-nav-link" href="/creators">Creators</Link>
              <div className="pricing-nav-dropdown" role="menu" aria-label="Creators sub-pages">
                <Link className="pricing-nav-sub" href="/creators/write-on-betweenreads" role="menuitem">Write on BetweenReads</Link>
                <Link className="pricing-nav-sub" href="/creators/upload-illustrations" role="menuitem">Upload Illustrations</Link>
                <Link className="pricing-nav-sub" href="/creators/securebetareads" role="menuitem">Secure BetaReads</Link>
                <Link className="pricing-nav-sub" href="/creators/agent-readiness" role="menuitem">Agent Readiness</Link>
              </div>
            </div>
            <Link className="pricing-nav-link is-active" href="/pricing" aria-current="page">Pricing</Link>
            <Link className="pricing-nav-link" href="/faq">FAQ</Link>
          </div>
        </div>
        <button type="button" className="pricing-nav-cta" onClick={() => openWaitlist()}>
          Join free
        </button>
      </nav>

      {/* === hero === */}
      <section className="pricing-hero">
        <span className="pricing-eyebrow">Pricing</span>
        <h1 className="pricing-hero-title">
          Start free. <em>Grow with us.</em>
        </h1>
        <p className="pricing-hero-sub">
          Built around the reading and writing life — not the algorithm.
        </p>
      </section>

      {/* === controls === */}
      <div className="pricing-controls">
        <div className="pricing-aud-tabs" role="tablist" aria-label="Audience">
          <button
            type="button"
            role="tab"
            aria-selected={audience === 'creator'}
            className={`pricing-aud-tab${audience === 'creator' ? ' is-active' : ''}`}
            onClick={() => setAudience('creator')}
          >
            For Creators
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={audience === 'reader'}
            className={`pricing-aud-tab${audience === 'reader' ? ' is-active' : ''}`}
            onClick={() => setAudience('reader')}
          >
            For Readers
          </button>
        </div>
        <div className="pricing-billing">
          <span className={`pricing-billing-label${!isAnnual ? ' is-active' : ''}`}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            aria-label="Toggle annual billing"
            className={`pricing-billing-toggle${isAnnual ? ' is-annual' : ''}`}
            onClick={() => setBilling(isAnnual ? 'monthly' : 'annual')}
          />
          <span className={`pricing-billing-label${isAnnual ? ' is-active' : ''}`}>Annual</span>
          <span className="pricing-billing-save">Save 17%</span>
        </div>
        <div className="pricing-billing-note">{billingNote}</div>
      </div>

      {/* === plans === */}
      <section className="pricing-plans-section" aria-label={`${audience === 'reader' ? 'Reader' : 'Creator'} plans`}>
        <div className="pricing-plans-grid">
          {renderPlan(plans.free, true)}
          {renderPlan(plans.power, false)}
        </div>
      </section>

      {/* === membership strip === */}
      <div className="pricing-mem-strip">
        <div className="pricing-mem-inner">
          <div>
            <div className="pricing-mem-badge">✦ BetweenReads Membership</div>
            <h2 className="pricing-mem-h">The membership that pays for itself</h2>
            <p className="pricing-mem-p">$50/year · 10% off every plan · 2× ReadCredits · free journal issues</p>
          </div>
          <button
            type="button"
            className="pricing-mem-link"
            onClick={() => openWaitlist('BetweenReads Membership')}
          >
            See Membership
          </button>
        </div>
      </div>

      {/* === kids line === */}
      <div className="pricing-kids-line">
        <Link href="/readers/kids">Looking for young readers and writers? See BetweenReads for ages 6–17 →</Link>
      </div>

      {/* === FAQ === */}
      <section className="pricing-faq-section">
        <div className="pricing-faq-head">
          <h2 className="pricing-faq-title">Questions</h2>
          <Link className="pricing-faq-all" href="/faq">Read all FAQs →</Link>
        </div>
        <div className="pricing-faq-cards">
          {FAQS.map((item, i) => (
            <div className="pricing-faq-card" key={i}>
              <div className="pricing-faq-k">{item.k}</div>
              <h3 className="pricing-faq-cq">{item.q}</h3>
              <p className="pricing-faq-ca">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <WaitlistOverlay open={waitlist.open} eyebrow={waitlist.eyebrow} onClose={closeWaitlist} />
    </main>
  );
}
