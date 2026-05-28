'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';

export function CartBar() {
  const { items, isOpen, lastAdded } = useCart();

  const title = lastAdded ? `${lastAdded.title} added` : 'Cart updated';
  const count = items.length;

  return (
    <div className={`br-cart ${isOpen ? 'is-on' : ''}`} aria-live="polite" aria-hidden={!isOpen}>
      <div className="br-cart-info">
        <div className="br-cart-title">{title}</div>
        <div className="br-cart-count">
          {count} item{count === 1 ? '' : 's'} in cart
        </div>
      </div>
      <Link className="br-cart-go" href="/checkout?source=cart">
        Checkout
      </Link>
    </div>
  );
}
