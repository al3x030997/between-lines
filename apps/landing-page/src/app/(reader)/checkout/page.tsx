'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useMockSession } from '@/lib/useMockSession';

type Billing = 'annual' | 'monthly';

const planBenefits = [
  'BetweenLines journal - all issues',
  'Unlimited premium chapters',
  'Reader Pods and writer inner circles',
  'Early access to new content',
  'Priority beta reader matching',
  'Mood-based discovery - full access',
];

const annualSummary = {
  label: 'Annual',
  price: '$100',
  period: 'per year',
  detail: 'Save $20 vs monthly',
  renewal: '$100/year after trial',
};

const monthlySummary = {
  label: 'Monthly',
  price: '$10',
  period: 'per month',
  detail: 'Lowest upfront cost',
  renewal: '$10/month after trial',
};

function readBilling(value: string | null): Billing {
  return value === 'monthly' ? 'monthly' : 'annual';
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useMockSession();
  const { clear } = useCart();
  const [billing, setBilling] = useState<Billing>(() => readBilling(searchParams.get('billing')));
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setBilling(readBilling(searchParams.get('billing')));
  }, [searchParams]);

  const source = searchParams.get('source') ?? 'reader';
  const summary = billing === 'annual' ? annualSummary : monthlySummary;
  const other = billing === 'annual' ? monthlySummary : annualSummary;
  const email = session?.handle ? `${session.handle}@example.com` : 'reader@example.com';

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams({
      plan: 'powerreader',
      billing: billing === 'annual' ? 'monthly' : 'annual',
      source,
    });
    return `/checkout?${params.toString()}`;
  }, [billing, source]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clear();
    setComplete(true);
  };

  if (complete) {
    return (
      <main className="br-checkout br-checkout-done">
        <section className="br-checkout-confirm" aria-labelledby="checkout-confirm-title">
          <div className="br-checkout-confirm-mark" aria-hidden="true">PR</div>
          <p className="br-checkout-eyebrow">PowerReader trial started</p>
          <h1 id="checkout-confirm-title">BetweenLines is unlocked.</h1>
          <p>
            Your mock checkout is complete. The next stop returns you to the curated journal shelf.
          </p>
          <Link className="br-btn br-btn-premium br-btn-lg" href="/read?tab=betweenlines">
            Read BetweenLines
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="br-checkout">
      <section className="br-checkout-hero" aria-labelledby="checkout-title">
        <p className="br-checkout-eyebrow">Checkout</p>
        <h1 id="checkout-title">Start PowerReader.</h1>
        <p>
          Unlock curated BetweenLines picks, premium chapters, Reader Pods and early access.
          Your 14-day trial starts today.
        </p>
      </section>

      <div className="br-checkout-grid">
        <form className="br-checkout-form" onSubmit={submit}>
          <section className="br-checkout-panel" aria-labelledby="checkout-billing-title">
            <div className="br-checkout-panel-head">
              <div>
                <p className="br-checkout-step">01</p>
                <h2 id="checkout-billing-title">Choose billing</h2>
              </div>
              <span className="br-checkout-trial">14-day free trial</span>
            </div>

            <div className="br-checkout-billing" role="radiogroup" aria-label="PowerReader billing">
              <button
                type="button"
                role="radio"
                aria-checked={billing === 'annual'}
                className={`br-checkout-billing-card${billing === 'annual' ? ' is-on' : ''}`}
                onClick={() => router.replace('/checkout?plan=powerreader&billing=annual&source=' + source, { scroll: false })}
              >
                <span>Annual</span>
                <strong>$100</strong>
                <em>Save $20</em>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={billing === 'monthly'}
                className={`br-checkout-billing-card${billing === 'monthly' ? ' is-on' : ''}`}
                onClick={() => router.replace('/checkout?plan=powerreader&billing=monthly&source=' + source, { scroll: false })}
              >
                <span>Monthly</span>
                <strong>$10</strong>
                <em>per month</em>
              </button>
            </div>
          </section>

          <section className="br-checkout-panel" aria-labelledby="checkout-payment-title">
            <div className="br-checkout-panel-head">
              <div>
                <p className="br-checkout-step">02</p>
                <h2 id="checkout-payment-title">Payment details</h2>
              </div>
              <span className="br-checkout-demo">Mock checkout</span>
            </div>

            <div className="br-checkout-fields">
              <label>
                Email
                <input type="email" defaultValue={email} />
              </label>
              <label>
                Name on card
                <input type="text" defaultValue={session?.user ?? 'Sarah M.'} />
              </label>
              <label className="br-checkout-field-wide">
                Card number
                <input type="text" inputMode="numeric" defaultValue="4242 4242 4242 4242" />
              </label>
              <label>
                Expiry
                <input type="text" inputMode="numeric" defaultValue="04 / 29" />
              </label>
              <label>
                CVC
                <input type="text" inputMode="numeric" defaultValue="123" />
              </label>
            </div>
          </section>

          <section className="br-checkout-panel" aria-labelledby="checkout-review-title">
            <div className="br-checkout-panel-head">
              <div>
                <p className="br-checkout-step">03</p>
                <h2 id="checkout-review-title">Review</h2>
              </div>
            </div>
            <p className="br-checkout-review-copy">
              You will not be charged during the trial. After 14 days, PowerReader renews at
              {' '}{summary.renewal} unless cancelled.
            </p>
            <button type="submit" className="br-checkout-submit">
              Start 14-day trial
            </button>
            <p className="br-checkout-fine">
              Demo only. No payment is processed and no subscription is created.
            </p>
          </section>
        </form>

        <aside className="br-checkout-summary" aria-label="Order summary">
          <div className="br-checkout-summary-cover" aria-hidden="true">
            <span>BetweenLines</span>
            <strong>PowerReader</strong>
          </div>
          <div className="br-checkout-summary-body">
            <p className="br-checkout-eyebrow">Order summary</p>
            <h2>PowerReader</h2>
            <div className="br-checkout-price">
              <strong>{summary.price}</strong>
              <span>{summary.period}</span>
            </div>
            <p className="br-checkout-saving">{summary.detail}</p>
            <Link className="br-checkout-switch" href={checkoutHref}>
              Switch to {other.label.toLowerCase()} billing
            </Link>
            <ul className="br-checkout-benefits">
              {planBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <div className="br-checkout-total">
              <span>Due today</span>
              <strong>$0</strong>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
