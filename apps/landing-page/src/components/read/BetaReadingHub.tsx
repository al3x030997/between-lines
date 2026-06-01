'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useMockSession } from '@/lib/useMockSession';

type Billing = 'monthly' | 'annual';

/** Swap Credits to unlock a month of premium beta access (mirrors AgentReady Pro pricing). */
const SWAP_COST = 100;

const STATS: { num: string; label: string }[] = [
  { num: 'Free', label: 'To take part' },
  { num: '3 ch', label: 'Minimum read' },
  { num: '25–50', label: 'Credits per read' },
  { num: '∞', label: 'Credits never expire' },
];

const STEPS: { num: string; title: string; body: string }[] = [
  {
    num: '01',
    title: 'Opt in by genre',
    body: 'Pick the genres, formats, and feedback style you like. We match you with manuscripts that fit your taste. No qualifications needed — just read carefully and respond honestly.',
  },
  {
    num: '02',
    title: 'Read the minimum',
    body: 'Every beta read is at least 3 chapters or 5,000 words, whichever comes first. Prefer the whole book? Opt in to full manuscripts. You choose what you commit to.',
  },
  {
    num: '03',
    title: 'Give feedback, earn credits',
    body: 'React, leave a quick comment, or write deep thoughts. Each response earns Swap Credits — 25 for a partial read, 50 for a full manuscript.',
  },
  {
    num: '04',
    title: 'Become an Early Discoverer',
    body: 'If a writer you beta read gets agented, shortlisted, or published, you are credited forever on their author page. It cannot be bought. Only earned.',
  },
];

const WAYS: { title: string; credit: string; body: string }[] = [
  {
    title: 'React',
    credit: '+2 credits',
    body: 'An emoji reaction plus 1–5 stars on plot, characters, pacing, writing, and emotional resonance — and whether you’d keep reading.',
  },
  {
    title: 'Quick Comment',
    credit: '+5 credits',
    body: 'One to three sentences on what worked, what didn’t, and what stood out.',
  },
  {
    title: 'Deep Thoughts',
    credit: '+10 credits',
    body: 'Open text or a voice note. Write or record as much as you like — the feedback writers remember.',
  },
];

const POWER_FEATURES = [
  'Priority beta reader matching',
  'Reader Pods — a writer’s inner circle of six',
  'Unlimited premium chapters',
  'BetweenLines Journal — every issue',
  'Early access to new content',
];

const MEMBER_FEATURES = [
  'Priority beta reader matching',
  '2× Reading Credits on all activity',
  '100 Reading Credits welcome bonus',
  'Vote in weekly Member Picks',
  'Member badge on your profile',
];

export function BetaReadingHub() {
  const [billing, setBilling] = useState<Billing>('annual');
  const { session } = useMockSession();
  const swap = session?.sc ?? 0;
  const canRedeem = swap >= SWAP_COST;

  const isAnnual = billing === 'annual';
  const powerPrice = isAnnual ? '$100' : '$10';
  const powerPeriod = isAnnual ? 'per year' : 'per month';
  const powerAlt = isAnnual ? 'save $20 vs monthly' : 'or $100/yr — save $20';

  return (
    <div className="br-beta-hub">
      {/* hero — what beta reading is */}
      <section className="br-beta-hero">
        <p className="br-beta-hero-eyebrow">SecureBetaReads · Beta reading</p>
        <h1 className="br-beta-hero-title">Read it before the world does.</h1>
        <p className="br-beta-hero-lede">
          A beta reader is a writer’s first real audience. Read unpublished manuscripts from emerging
          authors, give honest, structured feedback, and help shape a book while it’s still forming —
          earning Swap Credits and Early Discoverer status as you go.
        </p>
        <div className="br-beta-stats">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="br-beta-stat-num">{s.num}</div>
              <div className="br-beta-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="br-beta-block">
        <div className="br-beta-sec-head">
          <p className="br-beta-sec-eyebrow">How it works</p>
          <h2 className="br-beta-sec-title">From reader to first audience in four steps</h2>
          <p className="br-beta-sec-sub">
            Beta reading is free — and it’s the activity that earns the most Swap Credits on the
            platform. Here’s the whole loop.
          </p>
        </div>
        <div className="br-beta-how-grid">
          {STEPS.map((s) => (
            <div className="br-beta-step" key={s.num}>
              <div className="br-beta-step-num">{s.num}</div>
              <h3 className="br-beta-step-title">{s.title}</h3>
              <p className="br-beta-step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* three ways to respond */}
      <section className="br-beta-block">
        <div className="br-beta-sec-head">
          <p className="br-beta-sec-eyebrow">Your feedback</p>
          <h2 className="br-beta-sec-title">Three ways to respond</h2>
          <p className="br-beta-sec-sub">
            Choose the depth that suits you and the work. Every level earns Swap Credits and goes
            straight to the writer.
          </p>
        </div>
        <div className="br-beta-ways">
          {WAYS.map((w) => (
            <div className="br-beta-way" key={w.title}>
              <div className="br-beta-way-top">
                <h3 className="br-beta-way-title">{w.title}</h3>
                <span className="br-beta-way-credit">{w.credit}</span>
              </div>
              <p className="br-beta-way-body">{w.body}</p>
            </div>
          ))}
        </div>
        <p className="br-beta-note">
          <span className="br-beta-note-mark" aria-hidden="true">🔒</span>
          <span>
            <strong>Every manuscript is protected.</strong> Beta readers agree to confidentiality on
            opt-in — copy is disabled, and we never train AI on the work.
          </span>
        </p>
      </section>

      {/* upgrade screen */}
      <section className="br-beta-block">
        <div className="br-beta-sec-head">
          <p className="br-beta-sec-eyebrow">Upgrade</p>
          <h2 className="br-beta-sec-title">Unlock unlimited beta reading</h2>
          <p className="br-beta-sec-sub">
            Three free pieces a month come standard. Go further with a plan, the co-op membership, or
            the Swap Credits you’ve already earned.
          </p>
        </div>

        <div className="br-beta-bill" role="group" aria-label="Billing period">
          <span className={`br-beta-bill-label${!isAnnual ? ' is-active' : ''}`}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            aria-label="Toggle annual billing"
            className={`br-beta-bill-toggle${isAnnual ? ' is-annual' : ''}`}
            onClick={() => setBilling(isAnnual ? 'monthly' : 'annual')}
          />
          <span className={`br-beta-bill-label${isAnnual ? ' is-active' : ''}`}>Annual</span>
          <span className="br-beta-bill-save">Save 17%</span>
        </div>

        <div className="br-beta-plans">
          {/* PowerReader */}
          <article className="br-beta-plan is-featured">
            <span className="br-beta-plan-flag">Most popular</span>
            <h3 className="br-beta-plan-name">PowerReader</h3>
            <p className="br-beta-plan-tag">First in line for the writers you most want to read.</p>
            <div className="br-beta-plan-price">
              <span className="br-beta-plan-amount">{powerPrice}</span>
              <span className="br-beta-plan-period">{powerPeriod}</span>
            </div>
            <span className="br-beta-plan-alt">{powerAlt}</span>
            <ul className="br-beta-plan-feats">
              {POWER_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link href="/pricing" className="br-beta-plan-cta is-solid">
              Upgrade to PowerReader
            </Link>
            <p className="br-beta-plan-fine">✦ Members pay $90/yr · 14-day free trial</p>
          </article>

          {/* Co-op Membership */}
          <article className="br-beta-plan">
            <h3 className="br-beta-plan-name">Co-op Membership</h3>
            <p className="br-beta-plan-tag">Own a piece of the platform — and skip the queue.</p>
            <div className="br-beta-plan-price">
              <span className="br-beta-plan-amount">$50</span>
              <span className="br-beta-plan-period">per year</span>
            </div>
            <span className="br-beta-plan-alt">one membership covers everything</span>
            <ul className="br-beta-plan-feats">
              {MEMBER_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link href="/pricing" className="br-beta-plan-cta is-outline">
              Become a member
            </Link>
            <p className="br-beta-plan-fine">✦ 10% off every paid plan</p>
          </article>

          {/* Swap Credits */}
          <article className="br-beta-plan is-credits">
            <h3 className="br-beta-plan-name">Use Swap Credits</h3>
            <p className="br-beta-plan-tag">No card. Spend what you earn by beta reading.</p>
            <div className="br-beta-plan-price">
              <span className="br-beta-plan-amount">{SWAP_COST}</span>
              <span className="br-beta-plan-period">Swap Credits / month</span>
            </div>
            <span className="br-beta-plan-alt">unlock a month of premium beta access</span>
            <ul className="br-beta-plan-feats">
              <li>Unlock full-manuscript beta reads</li>
              <li>Priority matching for one month</li>
              <li>Credits never expire</li>
            </ul>
            <div className="br-beta-credit-bal">
              <span className="br-beta-credit-have">You have {swap} Swap Credits</span>
              <span className="br-beta-credit-note">
                {canRedeem
                  ? 'Enough to unlock right now.'
                  : `Earn ${SWAP_COST - swap} more by beta reading.`}
              </span>
            </div>
            <button type="button" className="br-beta-plan-cta is-credits-cta" disabled={!canRedeem}>
              {canRedeem ? `Unlock for ${SWAP_COST} credits` : 'Keep beta reading to earn'}
            </button>
            <p className="br-beta-plan-fine">Beta reading earns 25–50 credits each</p>
          </article>
        </div>
      </section>
    </div>
  );
}
