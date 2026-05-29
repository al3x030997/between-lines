'use client';

import { useState } from 'react';
import { rcBundles } from '@/lib/mock-products';
import { useCart } from '@/lib/cart';

export function ReadingCreditsPicker() {
  const cart = useCart();
  const [active, setActive] = useState<string>('rc-reader');

  const handleBuy = () => {
    const bundle = rcBundles.find((b) => b.id === active);
    if (!bundle) return;
    cart.add({
      id: bundle.id,
      title: `${bundle.amount} Reading Credits`,
      price: bundle.price,
    });
  };

  return (
    <section className="br-rc-section" aria-labelledby="br-rc-title">
      <div className="br-sec-head">
        <h2 id="br-rc-title" className="br-sec-title">
          ⭐ Top up your Reading Credits
        </h2>
      </div>
      <div className="br-rc-grid">
        {rcBundles.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`br-rc-card ${active === b.id ? 'is-on' : ''}`}
            onClick={() => setActive(b.id)}
            aria-pressed={active === b.id}
          >
            <div className="br-rc-card-lbl">{b.label}</div>
            <div className="br-rc-amount">{b.amount}</div>
            <div className="br-rc-unit">Reading Credits</div>
            <div className="br-rc-price">{b.price}</div>
            <div className="br-rc-save">{b.save ?? ' '}</div>
          </button>
        ))}
      </div>
      <p className="br-rc-note">
        <strong>Reading Credits never expire.</strong> Earn them, buy them, spend them whenever you're ready.
      </p>
      <button type="button" className="br-rc-buy" onClick={handleBuy}>
        Buy Reading Credits
      </button>
      <div className="br-upsell">
        <span className="br-upsell-text">
          ✦ <strong>BetweenReads Members</strong> get 100 Reading Credits welcome bonus + 20% off all store purchases. At $50/year the membership pays for itself.
        </span>
        <button type="button" className="br-upsell-cta">Join for $50/yr</button>
      </div>
    </section>
  );
}
