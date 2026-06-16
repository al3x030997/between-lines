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
  font-size: clamp(36px, 5.5vw, 62px);
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
  font-size: clamp(17px, 1.6vw, 20px);
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
  font-size: clamp(16px, 1.2vw, 18px);
  color: var(--theme-text-muted);
  line-height: 1.75;
  max-width: 620px;
  margin: 0 0 48px;
  text-wrap: pretty;
}

/* === Tiers === */
.bl-support-tiers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  font-size: 13px;
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

/* === Note === */
.bl-support-note {
  font-family: var(--bl-font-body);
  font-size: clamp(15px, 1.2vw, 17px);
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
  font-size: clamp(15px, 1.2vw, 17px);
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
  font-size: 14px;
  color: var(--theme-text-muted);
  line-height: 1.7;
}

/* === Yellow CTA band === */
.bl-support-band {
  background: var(--theme-yellow);
  padding: clamp(32px, 5vw, 40px) clamp(20px, 5vw, 40px);
  text-align: center;
}
.bl-support-band h3 {
  font-family: var(--bl-font-serif);
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 800;
  color: var(--theme-on-yellow);
  margin: 0 0 8px;
}
.bl-support-band p {
  font-family: var(--bl-font-body);
  font-size: 15px;
  color: var(--theme-on-yellow);
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
  color: var(--theme-on-yellow);
  border-bottom: 2px solid var(--theme-on-yellow);
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
.bl-support-modal-tier-tag {
  font-size: 13px;
  color: var(--theme-text-faint);
  margin-bottom: 10px;
}
.bl-support-modal-tier-desc {
  font-size: 14px;
  color: var(--theme-text-muted);
  line-height: 1.75;
  margin: 0;
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

@media (max-width: 860px) { .bl-support-tiers { grid-template-columns: repeat(2, 1fr); } }
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
      '1 year membership · Believer badge · founding recognition · early platform updates · annual founder letter',
    cta: 'Become a Believer',
  },
  {
    name: 'Early Reader',
    price: '$250 one-time',
    avail: 'Open',
    benefits:
      'Everything in Believer · 1 year unlimited reading · Early Reader badge · Founding Reader Circle · inaugural issue recognition',
    cta: 'Become an Early Reader',
  },
  {
    name: 'Early Writer',
    price: '$250 one-time',
    avail: 'Open',
    benefits:
      'Everything in Believer · 1 year Writer Pro · Early Writer badge · priority onboarding · launch bonuses',
    cta: 'Become an Early Writer',
  },
];

const TIERS_TWO: (Tier & { featured?: boolean })[] = [
  {
    name: 'Founding Member',
    price: '$500 one-time',
    avail: 'Limited to 100',
    benefits:
      'Everything above · Founding Member badge · inaugural journal recognition · annual founder gathering · quarterly updates',
    cta: 'Become a Founding Member',
    featured: true,
  },
  {
    name: 'Literary Patron',
    price: '$2,500 one-time',
    avail: 'Limited to 25',
    benefits:
      'Everything above · Patron recognition · editorial roundtable invitations · direct founder updates',
    cta: 'Become a Literary Patron',
  },
];

const COMPARE_ROWS: { label: string; cells: boolean[] }[] = [
  { label: '1 year membership', cells: [true, true, true, true, true] },
  { label: 'Founding badge', cells: [true, true, true, true, true] },
  { label: 'Founding recognition', cells: [true, true, true, true, true] },
  { label: 'Early platform updates', cells: [true, true, true, true, true] },
  { label: 'Annual founder letter', cells: [true, true, true, true, true] },
  { label: '1 year unlimited reading', cells: [false, true, false, true, true] },
  { label: '1 year Writer Pro', cells: [false, false, true, true, true] },
  { label: 'Priority onboarding', cells: [false, false, true, true, true] },
  { label: 'Inaugural journal recognition', cells: [false, false, false, true, true] },
  { label: 'Annual founder gathering', cells: [false, false, false, true, true] },
  { label: 'Quarterly updates', cells: [false, false, false, true, true] },
  { label: 'Editorial roundtable invitations', cells: [false, false, false, false, true] },
  { label: 'Direct founder updates', cells: [false, false, false, false, true] },
];

const COMPARE_COLS = [
  { name: 'Believer', price: '$100' },
  { name: 'Early Reader', price: '$250' },
  { name: 'Early Writer', price: '$250' },
  { name: 'Founding Member', price: '$500', featured: true },
  { name: 'Literary Patron', price: '$2,500' },
];

const LEARN_TIERS = [
  {
    name: 'Believer',
    price: '$100',
    tag: 'Open',
    desc: 'The best way to say you believe in what we’re building. Believers receive a one-year membership, a Believer badge, founding recognition on the platform, early platform updates, and an annual letter from the founders.',
  },
  {
    name: 'Early Reader',
    price: '$250',
    tag: 'Open',
    desc: 'For readers who want to be part of the founding story. Includes everything in Believer, plus one year of unlimited reading, an Early Reader badge, a place in the Founding Reader Circle, and recognition in our inaugural issue.',
  },
  {
    name: 'Early Writer',
    price: '$250',
    tag: 'Open',
    desc: 'For writers, poets, and illustrators who want to be among the first to build on BetweenReads. Includes everything in Believer, plus one year of Writer Pro, an Early Writer badge, priority onboarding, and launch bonuses.',
  },
  {
    name: 'Founding Member',
    price: '$500',
    limit: 'Limited to 100',
    tag: 'Our most complete founding tier',
    desc: 'Includes everything above, plus a Founding Member badge, recognition in the inaugural journal, an invitation to our annual founder gathering, and quarterly updates direct from the team.',
    featured: true,
  },
  {
    name: 'Literary Patron',
    price: '$2,500',
    limit: 'Limited to 25',
    tag: 'For those who want to shape the platform',
    desc: 'Includes everything above, plus Patron recognition, invitations to editorial roundtable discussions, and direct updates from the founders. A rare opportunity to be part of shaping BetweenReads from the inside.',
  },
];

export default function SupportPage() {
  const [compareOpen, setCompareOpen] = useState(false);
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
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

        <div className="bl-support-note">
          Interested in supporting BetweenReads at a deeper level? We would love to hear from you
          &mdash; <a href="mailto:supportus@betweenreads.com">supportus@betweenreads.com</a>
          <br />
          <br />
          All support goes directly toward building the platform, funding BetweenLines, and keeping
          BetweenReads ad-free. We are grateful for every Believer who helps make this possible.
        </div>

        <div className="bl-support-other">
          <h2 className="bl-support-other-h">Other ways to support</h2>
          <p className="bl-support-other-p">
            Not ready to contribute financially? There are other meaningful ways to help shape
            BetweenReads from the ground up.
          </p>
          <div className="bl-support-ways">
            <div className="bl-support-way">
              <div className="bl-support-way-name">Beta Reader</div>
              <div className="bl-support-way-desc">
                Sign up as a beta reader, help writers refine their work before it reaches a wider
                audience, and earn reader credits on the platform.
              </div>
            </div>
            <div className="bl-support-way">
              <div className="bl-support-way-name">Host a Reader Club</div>
              <div className="bl-support-way-desc">
                Host a reader club on BetweenReads, bring readers together around great books and
                stories, and earn reader credits along the way.
              </div>
            </div>
            <div className="bl-support-way">
              <div className="bl-support-way-name">Spread the Word</div>
              <div className="bl-support-way-desc">
                Invite your favourite writers to the platform. Share BetweenReads with fellow
                readers. Every introduction helps the community grow.
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
              All contributions are one-time. Every tier includes founding recognition and helps
              keep BetweenReads independent and ad-free.
            </p>
            {LEARN_TIERS.map((t) => (
              <div
                key={t.name}
                className={`bl-support-modal-tier${t.featured ? ' is-featured' : ''}`}
              >
                <div className="bl-support-modal-tier-name">
                  {t.name} &mdash; {t.price}
                  {t.limit ? <span> {t.limit}</span> : null}
                </div>
                <div className="bl-support-modal-tier-tag">{t.tag}</div>
                <p className="bl-support-modal-tier-desc">{t.desc}</p>
              </div>
            ))}
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
          </div>
        </div>
      )}
    </div>
  );
}
