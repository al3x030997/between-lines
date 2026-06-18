'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import Footer from '../v8/sections/Footer';

const CSS = `
.bl-support-root {
  min-height: 100vh;
  background: var(--theme-page);
  color: var(--theme-text);
  font-family: var(--bl-font-body);
  --v6-ease: var(--bl-ease);
  --bl-footer-accent: var(--bl-accent);
}

/* === Hero (yellow band) === */
.bl-support-hero {
  background: var(--theme-yellow);
  padding: clamp(56px, 8vw, 100px) clamp(20px, 5vw, 40px) clamp(48px, 6vw, 72px);
}
.bl-support-hero-i { max-width: 760px; margin: 0 auto; }
.bl-support-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--theme-on-yellow);
  opacity: 0.55;
  margin: 0 0 22px;
}
.bl-support-hero-title {
  font-family: var(--bl-font-serif);
  font-size: var(--bl-hero-title-size);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--theme-on-yellow);
  margin: 0 0 24px;
  text-wrap: balance;
}
.bl-support-hero-title em { font-style: italic; }
.bl-support-hero-sub {
  font-family: var(--bl-font-body);
  font-size: clamp(18px, 1.6vw, 20px);
  color: var(--theme-on-yellow);
  opacity: 0.78;
  line-height: 1.65;
  max-width: 540px;
  margin: 0 0 28px;
  text-wrap: pretty;
}
.bl-support-about-ref {
  font-family: var(--bl-font-eyebrow);
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-on-yellow);
  border-bottom: 1.5px solid var(--theme-on-yellow);
  padding-bottom: 2px;
  text-decoration: none;
  transition: opacity 180ms ease;
}
.bl-support-about-ref:hover { opacity: 0.7; }

/* === Body === */
.bl-support-body {
  max-width: 860px;
  margin: 0 auto;
  padding: clamp(48px, 6vw, 72px) clamp(20px, 5vw, 40px);
}
.bl-support-intro {
  font-family: var(--bl-font-body);
  font-size: clamp(18px, 1.2vw, 20px);
  color: var(--theme-text-muted);
  line-height: 1.75;
  max-width: 620px;
  margin: 0 0 20px;
  text-wrap: pretty;
}
.bl-support-disclaimer {
  font-family: var(--bl-font-body);
  font-size: 13px;
  color: var(--theme-text-faint);
  line-height: 1.7;
  max-width: 620px;
  margin: 0 0 40px;
  text-wrap: pretty;
}
.bl-support-disclaimer a {
  color: var(--theme-text);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* === Tiers === */
.bl-support-tiers {
  display: grid;
  grid-template-columns: calc((100% - 32px) / 3);
  gap: 16px;
  margin-bottom: 40px;
}
.bl-support-tier {
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-subtle);
  border-radius: 12px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  transition: border-color 220ms var(--bl-ease), box-shadow 220ms var(--bl-ease), transform 220ms var(--bl-ease);
}
.bl-support-tier:hover {
  border-color: var(--theme-border);
  box-shadow: 0 14px 32px rgb(var(--theme-shadow-rgb) / 0.12);
  transform: translateY(-2px);
}
.bl-support-tier.featured {
  border: 2px solid var(--theme-yellow);
  box-shadow: 0 2px 12px rgba(255, 230, 0, 0.2);
}
.bl-support-tier-name {
  font-family: var(--bl-font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--theme-text);
  margin-bottom: 4px;
}
.bl-support-tier-price {
  font-size: 13px;
  color: var(--theme-text-faint);
  margin-bottom: 4px;
}
.bl-support-tier-avail {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--theme-text-faint);
  margin-bottom: 14px;
}
.bl-support-tier-benefits {
  font-size: 18px;
  color: var(--theme-text-muted);
  line-height: 1.7;
  flex: 1;
}
.bl-support-tier-btn {
  display: block;
  margin-top: 18px;
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 700;
  color: var(--theme-on-yellow);
  background: var(--theme-yellow);
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  text-decoration: none;
  transition: background 180ms ease, transform 220ms var(--bl-ease);
}
.bl-support-tier-btn:hover,
.bl-support-tier-btn:focus-visible {
  background: var(--theme-yellow-strong);
  transform: translateY(-1px);
  outline: none;
}

/* Compare card */
.bl-support-tier.is-compare {
  border: none;
  background: transparent;
  justify-content: center;
  box-shadow: none;
}
.bl-support-tier.is-compare:hover { transform: none; box-shadow: none; }
.bl-support-tier-btn.is-dark {
  background: var(--theme-strong-cta-bg);
  color: var(--theme-strong-cta-fg);
  margin-top: auto;
}
.bl-support-tier-btn.is-dark:hover { background: var(--theme-strong-cta-hover-bg); }
.bl-support-learn-more {
  display: block;
  margin: 14px auto 0;
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 600;
  color: var(--theme-text);
  background: none;
  border: none;
  border-bottom: 1.5px solid var(--theme-text);
  padding: 0 0 2px;
  cursor: pointer;
  width: fit-content;
  transition: color 180ms ease, border-color 180ms ease;
}
.bl-support-learn-more:hover { color: var(--bl-accent-strong); border-color: var(--bl-accent-strong); }

/* Literary Patron — full-width featured row */
.bl-support-tier.is-patron {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: 2px solid var(--theme-strong-cta-bg);
  margin-bottom: 40px;
}
.bl-support-tier.is-patron:hover { transform: none; box-shadow: none; }
.bl-support-patron-info { flex: 1; }
.bl-support-tier.is-patron .bl-support-tier-price span {
  font-size: 11px;
  color: var(--theme-text-faint);
}
.bl-support-tier.is-patron .bl-support-tier-benefits { margin-top: 12px; max-width: 640px; }
.bl-support-tier-btn.is-patron-btn {
  width: auto;
  margin-top: 0;
  align-self: center;
  white-space: nowrap;
  padding: 11px 28px;
}
@media (max-width: 600px) {
  .bl-support-tier.is-patron { flex-direction: column; align-items: flex-start; }
  .bl-support-tier-btn.is-patron-btn { width: 100%; }
}

/* === Note === */
.bl-support-note {
  font-family: var(--bl-font-body);
  font-size: clamp(18px, 1.2vw, 20px);
  color: var(--theme-text-muted);
  line-height: 1.75;
  border-top: 1px solid var(--theme-border-subtle);
  padding-top: 32px;
}
.bl-support-note a {
  color: var(--theme-text);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* === Other ways === */
.bl-support-other {
  border-top: 1px solid var(--theme-border-subtle);
  padding-top: 40px;
  margin-top: 32px;
}
.bl-support-other-h {
  font-family: var(--bl-font-serif);
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--theme-text);
  margin: 0 0 12px;
}
.bl-support-other-p {
  font-family: var(--bl-font-body);
  font-size: clamp(18px, 1.2vw, 20px);
  color: var(--theme-text-muted);
  line-height: 1.7;
  max-width: 560px;
  margin: 0 0 32px;
  text-wrap: pretty;
}
.bl-support-ways {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}
.bl-support-way {
  border: 1px solid var(--theme-border-subtle);
  border-radius: 12px;
  padding: 24px 20px;
  transition: border-color 220ms var(--bl-ease), transform 220ms var(--bl-ease);
}
.bl-support-way:hover { border-color: var(--theme-border); transform: translateY(-2px); }
.bl-support-way-name {
  font-family: var(--bl-font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--theme-text);
  margin-bottom: 8px;
}
.bl-support-way-desc {
  font-size: 18px;
  color: var(--theme-text-muted);
  line-height: 1.7;
}
.bl-support-way-cta {
  display: inline-block;
  margin-top: 16px;
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 600;
  color: var(--theme-text);
  border-bottom: 1.5px solid var(--theme-text);
  text-decoration: none;
  padding-bottom: 2px;
  transition: color 180ms ease, border-color 180ms ease;
}
.bl-support-way-cta:hover { color: var(--bl-accent-strong); border-color: var(--bl-accent-strong); }
.bl-support-share { position: relative; display: inline-block; margin-top: 16px; }
.bl-support-share-btn {
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 700;
  color: var(--theme-on-yellow);
  background: var(--theme-yellow);
  border: none;
  border-radius: 999px;
  padding: 9px 20px;
  cursor: pointer;
  transition: background 180ms ease, transform 220ms var(--bl-ease);
}
.bl-support-share-btn:hover { background: var(--theme-yellow-strong); transform: translateY(-1px); }
.bl-support-share-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-subtle);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgb(var(--theme-shadow-rgb) / 0.12);
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
}
.bl-support-share-menu a {
  display: block;
  padding: 11px 16px;
  font-size: 13px;
  color: var(--theme-text);
  text-decoration: none;
  border-bottom: 1px solid var(--theme-border-subtle);
  transition: background 150ms ease;
}
.bl-support-share-menu a:last-child { border-bottom: none; }
.bl-support-share-menu a:hover { background: var(--theme-surface-muted); }

/* === Yellow CTA band === */
.bl-support-band {
  position: relative;
  overflow: hidden;
  background: #0b0b0c;
  padding: clamp(48px, 7vw, 72px) clamp(20px, 5vw, 40px);
  text-align: center;
}
.bl-support-band::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 140% at 50% -10%, rgba(250, 218, 70, 0.32) 0%, rgba(250, 218, 70, 0.08) 38%, transparent 64%),
    linear-gradient(180deg, rgba(250, 218, 70, 0.10) 0%, transparent 46%);
  pointer-events: none;
}
.bl-support-band > * {
  position: relative;
  z-index: 1;
}
.bl-support-band h3 {
  font-family: var(--bl-font-serif);
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 800;
  background: linear-gradient(180deg, #fff8e1 0%, #fada46 120%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0 0 8px;
}
.bl-support-band p {
  font-family: var(--bl-font-body);
  font-size: 15px;
  color: #fff8e1;
  opacity: 0.72;
  line-height: 1.55;
  margin: 0 auto 18px;
  max-width: 520px;
  text-wrap: pretty;
}
.bl-support-band a {
  font-family: var(--bl-font-eyebrow);
  font-size: 14px;
  font-weight: 700;
  color: #fada46;
  border-bottom: 2px solid #fada46;
  text-decoration: none;
  padding-bottom: 2px;
  transition: opacity 180ms ease;
}
.bl-support-band a:hover { opacity: 0.7; }

/* === Modals === */
.bl-support-overlay {
  position: fixed;
  inset: 0;
  background: var(--theme-overlay);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.bl-support-modal {
  background: var(--theme-surface);
  border-radius: 16px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px 36px 36px;
  position: relative;
}
.bl-support-modal.is-learn { max-width: 640px; }
.bl-support-modal.is-compare { max-width: 860px; }
.bl-support-modal-close {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  color: var(--theme-text-faint);
  transition: color 150ms ease;
}
.bl-support-modal-close:hover { color: var(--theme-text); }
.bl-support-modal-h {
  font-family: var(--bl-font-serif);
  font-size: 22px;
  font-weight: 700;
  color: var(--theme-text);
  margin: 0 0 6px;
}
.bl-support-modal-sub {
  font-size: 14px;
  color: var(--theme-text-faint);
  margin: 0 0 32px;
  line-height: 1.55;
}
.bl-support-modal-tier {
  border-bottom: 1px solid var(--theme-border-subtle);
  padding-bottom: 24px;
  margin-bottom: 24px;
}
.bl-support-modal-tier:last-child { border-bottom: none; padding-bottom: 8px; margin-bottom: 0; }
.bl-support-modal-tier.is-featured {
  background: var(--theme-accent-soft);
  border-radius: 10px;
  border-bottom: none;
  padding: 20px;
}
.bl-support-modal-tier-name {
  font-family: var(--bl-font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--theme-text);
  margin-bottom: 4px;
}
.bl-support-modal-tier-name span { font-size: 12px; font-weight: 500; color: var(--theme-text-faint); }
.bl-support-modal-tier-desc {
  font-size: 14px;
  color: var(--theme-text-muted);
  line-height: 1.75;
  margin: 0;
}
.bl-support-modal-note {
  font-size: 12px;
  color: var(--theme-text-faint);
  line-height: 1.7;
  margin: 24px 0 0;
}
.bl-support-modal-note a {
  color: var(--theme-text);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Compare table */
.bl-support-table-wrap { overflow-x: auto; }
.bl-support-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.bl-support-table thead tr { border-bottom: 2px solid var(--theme-border-subtle); }
.bl-support-table th {
  padding: 10px 8px;
  font-weight: 700;
  color: var(--theme-text);
  text-align: center;
}
.bl-support-table th.lead { text-align: left; padding: 10px 12px; font-weight: 600; color: var(--theme-text-muted); width: 36%; }
.bl-support-table th span { font-weight: 400; color: var(--theme-text-faint); }
.bl-support-table th.col-featured { background: var(--theme-accent-soft); border-radius: 8px 8px 0 0; }
.bl-support-table tbody tr { border-bottom: 1px solid var(--theme-border-subtle); }
.bl-support-table tbody tr.alt { background: var(--theme-surface-subtle); }
.bl-support-table td { padding: 11px 12px; color: var(--theme-text-soft); }
.bl-support-table td.cell { text-align: center; padding: 11px 8px; }
.bl-support-table td.cell-featured { background: var(--theme-accent-soft); }
.bl-support-table td.no { color: var(--theme-border); }

@media (max-width: 600px) {
  .bl-support-tiers { grid-template-columns: 1fr; }
  .bl-support-ways { grid-template-columns: 1fr; }
  .bl-support-modal { padding: 36px 22px 28px; }
}
`;

type Tier = {
  name: string;
  price: string;
  avail: string;
  benefits: string;
  cta: string;
};

const TIERS: Tier[] = [
  {
    name: 'Believer',
    price: '$100 one-time',
    avail: 'Open',
    benefits:
      'Named on the Believer Wall with badge and linked profile · 1 year Power Reader · early platform updates · annual founder letter',
    cta: 'Become a Believer',
  },
  {
    name: 'First Reader',
    price: '$250 one-time',
    avail: 'Open',
    benefits:
      'Everything in Believer · named in BetweenLines Journal · First Reader badge',
    cta: 'Become a First Reader',
  },
  {
    name: 'First Voice',
    price: '$250 one-time',
    avail: 'Open',
    benefits:
      'Everything in Believer · 1 year PowerWriter · 1 year Power Reader · named in BetweenLines Journal · priority access to ReaderScouts, Reader Pods, and Writer Pods · First Voice badge',
    cta: 'Become a First Voice',
  },
];

const TIERS_TWO: (Tier & { featured?: boolean })[] = [
  {
    name: 'Friends of BetweenReads',
    price: '$500 one-time',
    avail: 'Limited to 100',
    benefits:
      'Everything above · named in BetweenLines Journal year one issues · access to the Insider Page · annual founder Zoom invite · Friends badge',
    cta: 'Become a Friend',
    featured: true,
  },
  {
    name: 'Founding Member',
    price: '$1,000 one-time',
    avail: 'Limited to 50',
    benefits:
      'Everything above · quarterly founder letter · one vote on proposed platform features · private Founding Member community · named in every BetweenLines issue year one · eligible to guest edit one issue of BetweenLines Journal · Founding Member badge',
    cta: 'Become a Founding Member',
  },
];

const PATRON: Tier = {
  name: 'Literary Patron',
  price: '$2,500 one-time',
  avail: 'Limited to 25',
  benefits:
    'Everything above · named in every BetweenLines issue in year one · eligible to guest edit two issues of BetweenLines Journal · personal founder call · Literary Patron badge',
  cta: 'Become a Literary Patron',
};

const COMPARE_ROWS: { label: string; cells: boolean[] }[] = [
  { label: 'Named on Believer Wall with linked profile', cells: [true, true, true, true, true, true] },
  { label: 'Tier badge on profile', cells: [true, true, true, true, true, true] },
  { label: '1 year Power Reader', cells: [true, true, true, true, true, true] },
  { label: 'Early platform updates', cells: [true, true, true, true, true, true] },
  { label: 'Annual founder letter', cells: [true, true, true, true, true, true] },
  { label: 'Recognition in BetweenLines Journal', cells: [false, true, true, true, true, true] },
  { label: '1 year PowerWriter', cells: [false, false, true, true, true, true] },
  {
    label: 'Priority access to ReaderScouts, Reader Pods & Writer Pods',
    cells: [false, false, true, true, true, true],
  },
  { label: 'Access to Insider Page', cells: [false, false, false, true, true, true] },
  { label: 'Annual founder Zoom invite', cells: [false, false, false, true, true, true] },
  { label: 'Quarterly founder letter', cells: [false, false, false, false, true, true] },
  { label: 'Vote on proposed platform features', cells: [false, false, false, false, true, true] },
  { label: 'Private Founding Member community', cells: [false, false, false, false, true, true] },
  { label: 'Named in every BetweenLines issue year one', cells: [false, false, false, false, true, true] },
  {
    label: 'Eligible to guest edit one issue of BetweenLines Journal',
    cells: [false, false, false, false, true, true],
  },
  {
    label: 'Eligible to guest edit two issues of BetweenLines Journal',
    cells: [false, false, false, false, false, true],
  },
  { label: 'Personal founder call', cells: [false, false, false, false, false, true] },
];

const COMPARE_COLS = [
  { name: 'Believer', price: '$100' },
  { name: 'First Reader', price: '$250' },
  { name: 'First Voice', price: '$250' },
  { name: 'Friends', price: '$500', featured: true },
  { name: 'Founding Member', price: '$1,000' },
  { name: 'Literary Patron', price: '$2,500' },
];

const LEARN_TIERS = [
  {
    name: 'Believer',
    price: '$100',
    avail: 'Open',
    desc: 'The best way to say you believe in what we’re building. Believers receive one year of Power Reader, a Believer badge, a named linked profile on the Believer Wall, early platform updates, and an annual letter from the founders.',
  },
  {
    name: 'First Reader',
    price: '$250',
    avail: 'Open',
    desc: 'For readers who want to be part of the founding story. Includes everything in Believer, plus a First Reader badge and recognition in BetweenLines Journal.',
  },
  {
    name: 'First Voice',
    price: '$250',
    avail: 'Open',
    desc: 'For writers, poets, and illustrators who want to be among the first to build on BetweenReads. Includes everything in Believer, plus one year of PowerWriter and Power Reader, priority access to ReaderScouts, Reader Pods and Writer Pods, recognition in BetweenLines Journal, and a First Voice badge.',
  },
  {
    name: 'Friends of BetweenReads',
    price: '$500',
    avail: 'Limited to 100',
    desc: 'Includes everything above, plus recognition in BetweenLines Journal year one issues, access to the Insider Page — where we share platform updates, ideas and product evolution — an annual founder Zoom invite, and a Friends badge.',
    featured: true,
  },
  {
    name: 'Founding Member',
    price: '$1,000',
    avail: 'Limited to 50',
    desc: 'Includes everything above, plus a quarterly founder letter, one vote on proposed platform features — one member, one vote — a private Founding Member community space, named in every BetweenLines issue in year one, eligibility to guest edit one issue of BetweenLines Journal, and a Founding Member badge.',
  },
  {
    name: 'Literary Patron',
    price: '$2,500',
    avail: 'Limited to 25',
    desc: 'Our most exclusive tier. Includes everything above, plus recognition in every BetweenLines issue in year one, eligibility to guest edit two issues of BetweenLines Journal, a personal founder call, and a Literary Patron badge.',
  },
];

const SHARE_TEXT =
  'I just joined BetweenReads — an ad-free home for readers, writers, poets and illustrators. If you love books and great writing, come find me there. https://betweenreads.com';
const SHARE_URL = 'https://betweenreads.com';

const SHARE_LINKS = [
  { label: 'Bluesky', href: `https://bsky.app/intent/compose?text=${encodeURIComponent(SHARE_TEXT)}` },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
  {
    label: 'LinkedIn',
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
  },
  { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}` },
  {
    label: 'Email',
    href: `mailto:?subject=${encodeURIComponent('You should know about BetweenReads')}&body=${encodeURIComponent(SHARE_TEXT)}`,
  },
];

export default function SupportPage() {
  const [compareOpen, setCompareOpen] = useState(false);
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const anyOpen = compareOpen || learnMoreOpen;

  useEffect(() => {
    if (!anyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCompareOpen(false);
        setLearnMoreOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [anyOpen]);

  return (
    <div className="bl-support-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <SiteNav activeHref="/support" />

      <section className="bl-support-hero" aria-label="Support BetweenReads">
        <div className="bl-support-hero-i">
          <p className="bl-support-eyebrow">Support Us</p>
          <h1 className="bl-support-hero-title">
            Help us build
            <br />
            something <em>different.</em>
          </h1>
          <p className="bl-support-hero-sub">
            BetweenReads is independent, ad-free, and built around readers and writers &mdash; not
            advertisers. If you believe in what we&rsquo;re building, your support helps make it
            real.
          </p>
          <Link href="/about" className="bl-support-about-ref">
            Read our full story &rarr;
          </Link>
        </div>
      </section>

      <main className="bl-support-body">
        <p className="bl-support-intro">
          Whether you join as a reader, writer, or simply a believer in better reading culture
          &mdash; we would be honoured to have your support.
        </p>
        <p className="bl-support-disclaimer">
          All contributions are one-time and non-refundable. Supporting BetweenReads does not
          influence editorial decisions, curation, or discovery &mdash; all editorial choices remain
          independent. By contributing you agree to our{' '}
          <a href="/terms">Terms &amp; Conditions</a>.
        </p>

        <div className="bl-support-tiers">
          {[...TIERS, ...TIERS_TWO].map((tier) => (
            <div
              key={tier.name}
              className={`bl-support-tier${'featured' in tier && tier.featured ? ' featured' : ''}`}
            >
              <div className="bl-support-tier-name">{tier.name}</div>
              <div className="bl-support-tier-price">{tier.price}</div>
              <div className="bl-support-tier-avail">{tier.avail}</div>
              <div className="bl-support-tier-benefits">{tier.benefits}</div>
              <button type="button" className="bl-support-tier-btn">
                {tier.cta}
              </button>
            </div>
          ))}

          <div className="bl-support-tier is-compare">
            <div className="bl-support-tier-name">Not sure which tier?</div>
            <div className="bl-support-tier-benefits" style={{ marginTop: 8 }}>
              See exactly what&rsquo;s included in each tier, side by side.
            </div>
            <button
              type="button"
              className="bl-support-tier-btn is-dark"
              onClick={() => setCompareOpen(true)}
            >
              Compare Tiers
            </button>
            <button
              type="button"
              className="bl-support-learn-more"
              onClick={() => setLearnMoreOpen(true)}
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="bl-support-tier is-patron">
          <div className="bl-support-patron-info">
            <div className="bl-support-tier-name">{PATRON.name}</div>
            <div className="bl-support-tier-price">
              {PATRON.price} &nbsp;&middot;&nbsp; <span>{PATRON.avail}</span>
            </div>
            <div className="bl-support-tier-benefits">{PATRON.benefits}</div>
          </div>
          <button type="button" className="bl-support-tier-btn is-patron-btn">
            {PATRON.cta}
          </button>
        </div>

        <div className="bl-support-note">
          Interested in supporting BetweenReads at a deeper level? We would love to hear from you
          &mdash; <a href="mailto:supportus@betweenreads.com">supportus@betweenreads.com</a>
          <br />
          <br />
          All support goes directly toward building the platform, funding BetweenLines, and keeping
          BetweenReads ad-free. We are grateful for every Believer who helps make this possible.
          <br />
          <br />
          <strong>
            Supporting BetweenReads never influences editorial decisions or discovery.
          </strong>{' '}
          All curation, featuring, and editorial selection remains merit-based and
          community-driven.
        </div>

        <div className="bl-support-other">
          <h2 className="bl-support-other-h">Other ways to support</h2>
          <p className="bl-support-other-p">
            Not ready to contribute financially? There are other meaningful ways to help shape
            BetweenReads from the ground up.
          </p>
          <div className="bl-support-ways">
            <div className="bl-support-way">
              <div className="bl-support-way-name">ReaderScout</div>
              <div className="bl-support-way-desc">
                Be the first to discover extraordinary voices. Sign up as a ReaderScout, receive
                access to unpublished work, help writers refine it before it reaches a wider
                audience, and earn more reader credits than regular members &mdash; plus an
                exclusive ReaderScout badge on your profile.
              </div>
              <a className="bl-support-way-cta" href="mailto:readerscout@betweenreads.com">
                Sign Up &rarr;
              </a>
            </div>
            <div className="bl-support-way">
              <div className="bl-support-way-name">Host a Reader Club</div>
              <div className="bl-support-way-desc">
                Love reading? Host a Reader Club on BetweenReads, bring readers together around great
                books and stories, earn more reader credits than regular members &mdash; and wear a
                Reader Club Host badge on your profile.
              </div>
              <a className="bl-support-way-cta" href="mailto:hostreaderclub@betweenreads.com">
                I&rsquo;m Interested &rarr;
              </a>
            </div>
            <div className="bl-support-way">
              <div className="bl-support-way-name">Spread the Word</div>
              <div className="bl-support-way-desc">
                Do you believe the best things in life are shared? Invite your favourite writers and
                readers to BetweenReads and help the community find its people.
              </div>
              <div className="bl-support-share">
                <button
                  type="button"
                  className="bl-support-share-btn"
                  aria-expanded={shareOpen}
                  onClick={() => setShareOpen((v) => !v)}
                >
                  Share
                </button>
                {shareOpen && (
                  <div className="bl-support-share-menu">
                    {SHARE_LINKS.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setShareOpen(false)}
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bl-support-band">
        <h3>Welcome to the journey.</h3>
        <p>
          Whether you join as a reader, writer, poet, illustrator, supporter, or simply a curious
          visitor &mdash; we hope BetweenReads becomes a place where curiosity is rewarded, great
          work is discovered, and reading remains a source of wonder.
        </p>
        <Link href="/start?mode=reader">Join Free &rarr;</Link>
      </section>

      <Footer />

      {learnMoreOpen && (
        <div
          className="bl-support-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLearnMoreOpen(false);
          }}
        >
          <div className="bl-support-modal is-learn" role="dialog" aria-modal="true" aria-label="Our support tiers">
            <button
              type="button"
              className="bl-support-modal-close"
              aria-label="Close"
              onClick={() => setLearnMoreOpen(false)}
            >
              &times;
            </button>
            <h2 className="bl-support-modal-h">Our support tiers</h2>
            <p className="bl-support-modal-sub">
              All contributions are one-time. Every tier includes a named, linked profile on the
              Believer Wall with your tier badge.
            </p>
            {LEARN_TIERS.map((t) => (
              <div
                key={t.name}
                className={`bl-support-modal-tier${t.featured ? ' is-featured' : ''}`}
              >
                <div className="bl-support-modal-tier-name">
                  {t.name} &mdash; {t.price} &middot; {t.avail}
                </div>
                <p className="bl-support-modal-tier-desc">{t.desc}</p>
              </div>
            ))}
            <p className="bl-support-modal-note">
              All contributions are one-time and non-refundable. Supporting BetweenReads does not
              influence editorial decisions or discovery.{' '}
              <a href="mailto:questions@betweenreads.com">Still have questions? Email us</a> &mdash;
              we&rsquo;d love to hear from you.
            </p>
          </div>
        </div>
      )}

      {compareOpen && (
        <div
          className="bl-support-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCompareOpen(false);
          }}
        >
          <div className="bl-support-modal is-compare" role="dialog" aria-modal="true" aria-label="Compare tiers">
            <button
              type="button"
              className="bl-support-modal-close"
              aria-label="Close"
              onClick={() => setCompareOpen(false)}
            >
              &times;
            </button>
            <h2 className="bl-support-modal-h">Compare tiers</h2>
            <p className="bl-support-modal-sub">All tiers are one-time contributions.</p>
            <div className="bl-support-table-wrap">
              <table className="bl-support-table">
                <thead>
                  <tr>
                    <th className="lead">What&rsquo;s included</th>
                    {COMPARE_COLS.map((c) => (
                      <th key={c.name} className={c.featured ? 'col-featured' : undefined}>
                        {c.name}
                        <br />
                        <span>{c.price}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, ri) => (
                    <tr key={row.label} className={ri % 2 === 1 ? 'alt' : undefined}>
                      <td>{row.label}</td>
                      {row.cells.map((on, ci) => (
                        <td
                          key={ci}
                          className={[
                            'cell',
                            COMPARE_COLS[ci].featured ? 'cell-featured' : '',
                            on ? '' : 'no',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {on ? '✓' : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="bl-support-modal-note">
              All contributions are one-time and non-refundable. Supporting BetweenReads does not
              influence editorial decisions or discovery.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
