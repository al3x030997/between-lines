import Link from 'next/link';
import type {
  BookEntry,
  CreditStat,
  LinkRef,
  NowCard,
  ProfileBadge,
  ProfileHeroData,
  SignatureQuote,
  Tag,
} from '@/lib/profile-shared';

/* ============================================================
   SmartLink — renders a LinkRef to its natural destination
   ============================================================ */
export function SmartLink({
  link,
  children,
  className,
}: {
  link: LinkRef;
  children?: React.ReactNode;
  className?: string;
}) {
  const label = children ?? link.title;
  if (link.kind === 'book' && link.slug) {
    return (
      <Link href={`/read/${link.slug}`} className={className}>
        {label}
      </Link>
    );
  }
  if (link.kind === 'writer') {
    return (
      <Link href={`/writer/${link.handle}`} className={className}>
        {label}
      </Link>
    );
  }
  if (link.kind === 'reader') {
    return (
      <Link href={`/reader/${link.handle}`} className={className}>
        {label}
      </Link>
    );
  }
  if (link.kind === 'external') {
    return (
      <a href={link.href} className={className} target="_blank" rel="noreferrer">
        {label}
      </a>
    );
  }
  // 'plain' or book-with-no-slug — render a non-link span
  return <span className={className}>{label}</span>;
}

/* ============================================================
   ProfileHero
   ============================================================ */
type ProfileHeroProps = {
  hero: ProfileHeroData;
  editable?: boolean;
};
export function ProfileHero({ hero, editable = false }: ProfileHeroProps) {
  return (
    <header className="br-pf-hero">
      <div className="br-pf-hero-top">
        <div className="br-pf-avatar-wrap">
          <div className="br-pf-avatar" aria-hidden="true">{hero.avatarEmoji}</div>
          {editable ? <div className="br-pf-avatar-edit" title="Change avatar">✎</div> : null}
        </div>
        <div className="br-pf-identity">
          <h1 className="br-pf-display-name">{hero.displayName}</h1>
          <div className="br-pf-badge-row">
            {hero.badges.map((b: ProfileBadge, i: number) => (
              <span key={i} className={`br-pf-badge is-${b.tone}`}>{b.label}</span>
            ))}
          </div>
          <p className="br-pf-bio">{hero.bio}</p>
        </div>
      </div>
      {hero.quote.text ? (
        <div className="br-pf-quote">
          <div className="br-pf-quote-label">{hero.quote.label}</div>
          <div className="br-pf-quote-text">&ldquo;{hero.quote.text}&rdquo;</div>
          {hero.quote.attribution ? (
            <div className="br-pf-quote-attr">{hero.quote.attribution}</div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

/* ============================================================
   NowGrid — 2x2 (or any shape) of NowCards
   ============================================================ */
function NowCardItem({ card }: { card: NowCard }) {
  return (
    <div className={`br-pf-now-card is-${card.variant}`}>
      <div className="br-pf-now-inner">
        <div className="br-pf-now-dot" aria-hidden="true" />
        <div>
          <div className="br-pf-now-label">{card.label}</div>
          {card.link ? (
            <div className="br-pf-now-val">
              <SmartLink link={card.link} />
              {card.link.subtitle ? (
                <div className="br-pf-now-sub">{card.link.subtitle}</div>
              ) : null}
            </div>
          ) : null}
          {card.values && card.values.length > 0 ? (
            <div className="br-pf-now-val" style={{ fontSize: 13 }}>
              {card.values.map((v: LinkRef, i: number) => (
                <span key={i}>
                  <SmartLink link={v} />
                  {i < card.values!.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </div>
          ) : null}
          {card.subtitle && !card.link ? <div className="br-pf-now-sub">{card.subtitle}</div> : null}
          {card.subtitle && card.link ? null /* link rendered subtitle */ : null}
          {card.subtitle && card.values ? <div className="br-pf-now-sub">{card.subtitle}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function NowGrid({ cards }: { cards: NowCard[] }) {
  // Split into 2 columns (left col gets first 2, right col gets last 2)
  // Handles both 4-card (writer profile) and 2-card (reader profile) shapes.
  if (cards.length === 2) {
    return (
      <div className="br-pf-now-grid">
        {cards.map((c, i) => <NowCardItem card={c} key={i} />)}
      </div>
    );
  }
  const left = cards.slice(0, Math.ceil(cards.length / 2));
  const right = cards.slice(Math.ceil(cards.length / 2));
  return (
    <div className="br-pf-now-grid">
      <div className="br-pf-now-col">{left.map((c, i) => <NowCardItem card={c} key={`l${i}`} />)}</div>
      <div className="br-pf-now-col">{right.map((c, i) => <NowCardItem card={c} key={`r${i}`} />)}</div>
    </div>
  );
}

/* ============================================================
   CreditsStrip
   ============================================================ */
export function CreditsStrip({ items }: { items: CreditStat[] }) {
  return (
    <div className="br-pf-credits">
      {items.map((c, i) => (
        <div className="br-pf-credit" key={i}>
          <div className="br-pf-credit-icon" aria-hidden="true">{c.icon}</div>
          <div className="br-pf-credit-num">{c.num}</div>
          <div className="br-pf-credit-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   ProfileSection wrapper
   ============================================================ */
export function ProfileSection({
  title,
  editable,
  children,
}: {
  title: string;
  editable?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="br-pf-section">
      <div className="br-pf-section-head">
        <span>{title}</span>
        {editable ? <button type="button" className="br-pf-edit-btn">Edit</button> : null}
      </div>
      {children}
    </section>
  );
}

/* ============================================================
   Tag list helper
   ============================================================ */
export function TagList({ tags }: { tags: Tag[] }) {
  return (
    <div>
      {tags.map((t, i) => (
        <span className="br-pf-tag" key={i}>
          {t.href ? (
            <Link href={t.href} style={{ textDecoration: 'none', color: 'inherit' }}>{t.label}</Link>
          ) : (
            t.label
          )}
        </span>
      ))}
    </div>
  );
}

/* ============================================================
   Numbered book list
   ============================================================ */
export function NumberedBookList({ items }: { items: BookEntry[] }) {
  return (
    <ul className="br-pf-booklist">
      {items.map((b, i) => (
        <li key={i}>
          <span className="br-pf-book-num">{i + 1}</span>
          <span>
            <span className="br-pf-book-title"><SmartLink link={b} /></span>
            {b.author ? <span className="br-pf-book-author">{b.author}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   MyLine pull quote (gold border)
   ============================================================ */
export function MyLine({ label, text, attribution }: { label: string; text: string; attribution: string }) {
  return (
    <div className="br-pf-myline">
      <div className="br-pf-myline-lbl">{label}</div>
      <p>&ldquo;{text}&rdquo;</p>
      <div className="br-pf-myline-attr">{attribution}</div>
    </div>
  );
}

/* ============================================================
   SeekingBetaAndRead (writer profile only)
   ============================================================ */
export function SeekingBetaAndRead({
  seeking,
  readMe,
}: {
  seeking?: { title: string; meta: string };
  readMe?: { link: LinkRef; meta: string };
}) {
  if (!seeking && !readMe) return null;
  return (
    <div className="br-pf-seekread">
      {seeking ? (
        <div className="br-pf-seekread-card is-beta">
          <div className="br-pf-now-inner">
            <div className="br-pf-now-dot" style={{ background: 'var(--br-beta-ink)' }} aria-hidden="true" />
            <div>
              <div className="br-pf-now-label" style={{ color: 'var(--br-beta-ink)' }}>🔒 Seeking beta readers</div>
              <div className="br-pf-now-val">{seeking.title}</div>
              <div className="br-pf-now-sub">{seeking.meta}</div>
            </div>
          </div>
        </div>
      ) : null}
      {readMe ? (
        <div className="br-pf-seekread-card is-writer">
          <div className="br-pf-now-inner">
            <div className="br-pf-now-dot" style={{ background: 'var(--br-writer)' }} aria-hidden="true" />
            <div>
              <div className="br-pf-now-label" style={{ color: 'var(--br-writer-strong)' }}>📖 Read me now</div>
              <div className="br-pf-now-val"><SmartLink link={readMe.link} /></div>
              <div className="br-pf-now-sub">{readMe.meta}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
