'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ReadingCreditsPicker } from '@/components/ReadingCreditsPicker';
import { StoreHero } from '@/components/StoreHero';
import { StoreTabs } from '@/components/StoreTabs';
import { CartBar } from '@/components/CartBar';
import { useCart } from '@/lib/cart';
import {
  audiobooks,
  ebooks,
  illustrations,
  journal,
  merch,
  storeTabs,
  volumeTiers,
  type StoreProduct,
  type TabId,
} from '@/lib/mock-products';

function renderProduct(p: StoreProduct) {
  return (
    <ProductCard
      key={p.id}
      kind="product"
      id={p.id}
      title={p.title}
      byline={p.byline}
      blurb={p.blurb}
      cover={p.cover}
      coverIsDark={p.coverIsDark}
      emoji={p.emoji}
      emojiByline={p.emojiByline}
      badge={p.badge ? { kind: p.badge.kind, label: p.badge.label } : undefined}
      price={p.price}
      rc={p.rc}
      memberPrice={p.memberPrice}
    />
  );
}

function EbooksPane() {
  return (
    <>
      <div className="br-sec-head">
        <h2 className="br-sec-title">New &amp; Featured</h2>
        <a className="br-sec-link">Browse all</a>
      </div>
      <div className="br-grid">{ebooks.map(renderProduct)}</div>
    </>
  );
}

function IllustrationsPane() {
  return (
    <>
      <div className="br-store-panel" style={{ background: 'var(--br-panel-bg)', border: '0.5px solid var(--v11-divider)' }}>
        <div>
          <div className="br-store-panel-eyebrow" style={{ color: 'var(--v11-ink-trace)' }}>🎨 Illustrations</div>
          <div className="br-store-panel-title" style={{ color: 'var(--v11-ink)' }}>
            Original art from BetweenReads illustrators
          </div>
          <div className="br-store-panel-sub" style={{ color: 'var(--v11-ink-mute)' }}>
            Digital prints, illustrated editions and visual storytelling. Illustrators are welcome —{' '}
            <a className="br-sec-link" style={{ display: 'inline' }}>join as a creator</a>.
          </div>
        </div>
        <div></div>
      </div>
      <div className="br-grid">{illustrations.map(renderProduct)}</div>
      <div className="br-illu-cta">
        <div className="br-illu-cta-title">Are you an illustrator?</div>
        <div className="br-illu-cta-body">
          BetweenReads is onboarding illustrators. Sell your digital prints and collaborate with writers.
        </div>
        <button type="button" className="br-btn br-btn-primary">Join as an illustrator</button>
      </div>
    </>
  );
}

function BetweenLinesPane() {
  const cart = useCart();
  return (
    <>
      <div className="br-store-panel is-yellow">
        <div>
          <div className="br-store-panel-eyebrow">📰 BetweenLines — The Literary Journal</div>
          <h2 className="br-store-panel-title">The Inaugural Issue is here</h2>
          <p className="br-store-panel-sub">
            Original fiction, essays, poetry and conversation from writers on BetweenReads. Published monthly.
          </p>
          <div className="br-store-panel-chips">
            <span className="br-chip">Free with PowerReader</span>
            <span className="br-chip">Free with PowerCreator</span>
          </div>
          <button
            type="button"
            className="br-btn br-btn-yellow br-btn-lg"
            onClick={() => cart.add({ id: 'bl-inaugural', title: 'BetweenLines Inaugural', price: '$10.00' })}
          >
            Get Inaugural Issue — $10.00
          </button>
        </div>
        <div className="br-store-panel-aside">
          <div className="br-store-panel-price">$10</div>
          <div className="br-store-panel-pricesub">per issue · published monthly</div>
          <div className="br-store-panel-pricesub" style={{ marginTop: 6, opacity: 0.7 }}>or 200 Reading Credits</div>
        </div>
      </div>
      <div className="br-sec-head">
        <h2 className="br-sec-title">Back Issues</h2>
      </div>
      <div className="br-grid">{journal.map(renderProduct)}</div>
    </>
  );
}

function VolumePane() {
  return (
    <>
      <div className="br-store-panel is-dark">
        <div>
          <div className="br-store-panel-eyebrow">🎧 Volume — Audiobooks</div>
          <h2 className="br-store-panel-title">Listen to BetweenReads writers</h2>
          <p className="br-store-panel-sub">
            AI-narrated and author-recorded audio. Buy individual titles or subscribe to ListenerPro. Members save 20%.
          </p>
          <div className="br-store-panel-chips">
            <span className="br-chip">🤖 AI narrated</span>
            <span className="br-chip">🎙️ Author narrated</span>
            <span className="br-chip">✦ Members save 20%</span>
          </div>
        </div>
        <div className="br-store-panel-aside">
          <div className="br-store-panel-pricesub">ListenerPro from</div>
          <div className="br-store-panel-price">$9.99</div>
          <div className="br-store-panel-pricesub" style={{ marginBottom: 12 }}>per month</div>
          <button type="button" className="br-btn" style={{ background: '#c8a96a', color: 'var(--v11-ink)' }}>
            Explore ListenerPro
          </button>
        </div>
      </div>
      <div className="br-sec-head">
        <h2 className="br-sec-title">Available now</h2>
        <a className="br-sec-link">Browse all audio</a>
      </div>
      <div className="br-grid">{audiobooks.map(renderProduct)}</div>
      <div className="br-volume-tiers">
        {volumeTiers.map((t) => (
          <div
            key={t.id}
            className={`br-volume-tier ${t.variant === 'mid' ? 'is-mid' : ''} ${t.variant === 'plus' ? 'is-plus' : ''}`}
          >
            <div className="br-volume-tier-eyebrow">{t.label}</div>
            <div className="br-volume-tier-price">{t.price}</div>
            <div className="br-volume-tier-sub">per month</div>
            <div className="br-volume-tier-body">{t.body}</div>
            <button
              type="button"
              className="br-btn"
              style={{
                width: '100%',
                background:
                  t.variant === 'plus'
                    ? '#c8a96a'
                    : t.variant === 'mid'
                    ? 'var(--br-premium)'
                    : 'var(--v11-ink)',
                color: t.variant === 'plus' ? 'var(--v11-ink)' : '#fff',
              }}
            >
              Get started
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function MerchPane() {
  return (
    <>
      <div style={{
        background: 'var(--v11-ink)',
        borderRadius: 'var(--br-radius-md)',
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--br-font-serif)',
          fontSize: 15,
          color: '#aaa',
          fontStyle: 'italic',
        }}>
          <strong style={{ color: '#fff', fontStyle: 'normal' }}>BetweenReads merch</strong>{' '}
          — for wandering readers and writers. Clean, literary, nothing borrowed.
        </p>
      </div>
      <div className="br-grid">{merch.map(renderProduct)}</div>
    </>
  );
}

function GiftsPane() {
  const cart = useCart();
  return (
    <>
      <div className="br-gift-intro">
        <div className="br-gift-icon">🎁</div>
        <h2 className="br-gift-title">Give someone a read</h2>
        <p className="br-gift-sub">Gift an ebook, a BetweenLines issue, a Reading Credits bundle, or a full plan.</p>
        <div className="br-gift-opts">
          <div className="br-gift-opt">
            <div className="br-gift-opt-icon">📖</div>
            <div className="br-gift-opt-title">Gift an Ebook</div>
            <div className="br-gift-opt-sub">Any book in the store</div>
          </div>
          <div className="br-gift-opt">
            <div className="br-gift-opt-icon">📰</div>
            <div className="br-gift-opt-title">Gift BetweenLines</div>
            <div className="br-gift-opt-sub">Current or back issue</div>
          </div>
          <div className="br-gift-opt">
            <div className="br-gift-opt-icon">⭐</div>
            <div className="br-gift-opt-title">Gift Reading Credits</div>
            <div className="br-gift-opt-sub">100, 300 or 600 Reading Credits</div>
          </div>
        </div>
      </div>
      <div className="br-sec-title" style={{ marginBottom: '1.25rem' }}>Gift a Plan</div>
      <div className="br-gift-plans">
        <div className="br-gift-plan">
          <div className="br-gift-plan-eyebrow">🔖 Gift PowerReader</div>
          <div className="br-gift-plan-title">For the reader in your life</div>
          <div className="br-gift-plan-body">
            Unlimited premium chapters, BetweenLines journal, Reader Pods and early access.
          </div>
          <div className="br-gift-plan-grid">
            <div className="br-gift-plan-card">
              <div className="br-gift-plan-card-tag">3 months</div>
              <div className="br-gift-plan-card-price">$29.99</div>
              <div className="br-gift-plan-card-sub">$9.99/mo</div>
              <button
                type="button"
                className="br-btn br-btn-premium"
                style={{ width: '100%' }}
                onClick={() => cart.add({ id: 'gift-pr-3', title: 'PowerReader Gift · 3 months', price: '$29.99' })}
              >
                Gift
              </button>
            </div>
            <div className="br-gift-plan-card is-strong">
              <div className="br-gift-plan-card-tag">Annual</div>
              <div className="br-gift-plan-card-price">$100</div>
              <div className="br-gift-plan-card-sub is-save">Save $20</div>
              <button
                type="button"
                className="br-btn br-btn-premium"
                style={{ width: '100%' }}
                onClick={() => cart.add({ id: 'gift-pr-y', title: 'PowerReader Gift · Annual', price: '$100' })}
              >
                Gift
              </button>
            </div>
          </div>
        </div>
        <div className="br-gift-plan">
          <div className="br-gift-plan-eyebrow">🖊️ Gift PowerCreator</div>
          <div className="br-gift-plan-title">For the writer in your life</div>
          <div className="br-gift-plan-body">
            Unlimited published works, SecureBetaReads, Reader Pods, Writer Pods and priority placement.
          </div>
          <div className="br-gift-plan-grid">
            <div className="br-gift-plan-card">
              <div className="br-gift-plan-card-tag">3 months</div>
              <div className="br-gift-plan-card-price">$29.99</div>
              <div className="br-gift-plan-card-sub">$9.99/mo</div>
              <button
                type="button"
                className="br-btn br-btn-premium"
                style={{ width: '100%' }}
                onClick={() => cart.add({ id: 'gift-pc-3', title: 'PowerCreator Gift · 3 months', price: '$29.99' })}
              >
                Gift
              </button>
            </div>
            <div className="br-gift-plan-card is-strong">
              <div className="br-gift-plan-card-tag">Annual</div>
              <div className="br-gift-plan-card-price">$100</div>
              <div className="br-gift-plan-card-sub is-save">Save $20</div>
              <button
                type="button"
                className="br-btn br-btn-premium"
                style={{ width: '100%' }}
                onClick={() => cart.add({ id: 'gift-pc-y', title: 'PowerCreator Gift · Annual', price: '$100' })}
              >
                Gift
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="br-gift-membership">
        <div className="br-gift-membership-text">
          <div className="br-gift-membership-eyebrow">✦ Gift a Membership</div>
          <div className="br-gift-membership-title">BetweenReads Co-op Membership</div>
          <div className="br-gift-membership-body">
            20% off the store · 100 Reading Credits welcome bonus · Member badge · Vote for Member Picks.
          </div>
        </div>
        <div className="br-gift-membership-aside">
          <div className="br-gift-membership-price">$50</div>
          <div className="br-gift-membership-sub">one year</div>
          <button
            type="button"
            className="br-btn br-btn-yellow br-btn-lg"
            onClick={() => cart.add({ id: 'gift-mem', title: 'Membership Gift', price: '$50' })}
          >
            Gift membership
          </button>
        </div>
      </div>
    </>
  );
}

export default function StorePage() {
  const [active, setActive] = useState<TabId>('ebooks');

  return (
    <>
      <StoreHero />
      <StoreTabs<TabId> tabs={storeTabs} active={active} onChange={setActive} ariaLabel="Store sections" />
      <div className="br-stage">
        {active === 'ebooks' && <EbooksPane />}
        {active === 'illustrations' && <IllustrationsPane />}
        {active === 'betweenlines' && <BetweenLinesPane />}
        {active === 'volume' && <VolumePane />}
        {active === 'credits' && <ReadingCreditsPicker />}
        {active === 'merch' && <MerchPane />}
        {active === 'gifts' && <GiftsPane />}
      </div>
      <CartBar />
    </>
  );
}
