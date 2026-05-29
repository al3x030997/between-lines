'use client';

import { useCart } from '@/lib/cart';

export type CoverBadge = {
  label: string;
  /** Token class fragment, e.g. 'free', 'rp', 'bp', 'mp', 'new', 'inaugural', 'bundle', 'ai', 'author', 'merch' */
  kind: string;
};

type Book = {
  kind: 'book';
  href: string;
  title: string;
  author: string;
  blurb: string;
  cover: string;
  coverIsDark?: boolean;
  badge?: CoverBadge;
  format: string;
  access: { type: 'free' | 'rc'; label: string };
};

type Product = {
  kind: 'product';
  id: string;
  title: string;
  byline: string;
  blurb: string;
  cover: string;
  coverIsDark?: boolean;
  badge?: CoverBadge;
  /** Image emoji used for non-book products */
  emoji?: string;
  emojiByline?: string;
  price: string;
  rc?: number;
  memberPrice?: string;
};

export type CardVariant = 'default' | 'featured' | 'compact';

export type ProductCardProps = (Book | Product) & { variant?: CardVariant };

export function ProductCard(props: ProductCardProps) {
  const cart = useCart();

  const handleClick = () => {
    if (props.kind === 'book') {
      window.location.href = props.href;
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.kind === 'product') {
      cart.add({ id: props.id, title: props.title, price: props.price });
    }
  };

  const isDark = props.coverIsDark === true;
  const coverStyle: React.CSSProperties = {};
  if (props.cover.startsWith('linear-gradient')) {
    coverStyle.background = props.cover;
  } else {
    coverStyle.background = props.cover;
  }

  const variant: CardVariant = props.variant ?? 'default';
  const variantClass = variant === 'featured' ? ' is-featured' : variant === 'compact' ? ' is-compact' : '';
  const isFeatured = variant === 'featured';

  return (
    <article
      className={`br-card${variantClass}`}
      onClick={handleClick}
      role={props.kind === 'book' ? 'link' : 'group'}
      style={props.kind === 'product' ? { cursor: 'default' } : undefined}
    >
      <div className="br-cover" style={coverStyle}>
        {props.badge ? (
          <span className={`br-cover-badge br-badge-${props.badge.kind}`}>{props.badge.label}</span>
        ) : null}

        {props.kind === 'product' && props.emoji ? (
          <div className="br-cover-inner">
            <div className="br-cover-emoji">{props.emoji}</div>
            {props.emojiByline ? (
              <div className={`br-cover-author ${isDark ? 'is-dark' : ''}`}>{props.emojiByline}</div>
            ) : null}
          </div>
        ) : (
          <div className="br-cover-inner">
            <div className={`br-cover-title ${isDark ? 'is-dark' : ''}`}>{props.title}</div>
            <div className={`br-cover-rule ${isDark ? 'is-dark' : ''}`} />
            <div className={`br-cover-author ${isDark ? 'is-dark' : ''}`}>
              {props.kind === 'book' ? props.author : props.byline}
            </div>
          </div>
        )}

        {isFeatured && props.kind === 'book' ? (
          <div className="br-card-overlay">
            <p className="br-card-overlay-blurb">{props.blurb}</p>
            <div className="br-card-overlay-foot">
              <span className="br-card-overlay-format">{props.format}</span>
              <span className={`br-card-overlay-access ${props.access.type === 'free' ? 'is-free' : 'is-rc'}`}>
                {props.access.label}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="br-card-info">
        <h3 className="br-card-title">{props.title}</h3>
        <div className="br-card-author">
          {props.kind === 'book' ? props.author : props.byline}
        </div>
        <p className="br-card-blurb">{props.blurb}</p>

        <div className="br-card-footer">
          {props.kind === 'book' ? (
            <>
              <span className="br-card-format">{props.format}</span>
              <span className={`br-card-access ${props.access.type === 'free' ? 'is-free' : 'is-rc'}`}>
                {props.access.label}
              </span>
            </>
          ) : (
            <>
              <div className="br-card-prices">
                <div className="br-card-price">{props.price}</div>
                {props.rc ? <div className="br-card-rc">or {props.rc} Reading Credits</div> : null}
                {props.memberPrice ? <div className="br-card-member">✦ Members {props.memberPrice}</div> : null}
              </div>
              <button type="button" className="br-btn-add" onClick={handleAdd}>
                Add
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
