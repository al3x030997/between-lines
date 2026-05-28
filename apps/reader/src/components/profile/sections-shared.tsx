import Link from 'next/link';
import type {
  ClubEntry,
  ExternalLink,
  MemorableCard,
  PodEntry,
  Toggle,
  WishCard,
} from '@/lib/profile-shared';
import { SmartLink } from './primitives';

/* ============================================================
   The Memorables — Character / Quote / Writer cards
   ============================================================ */
export function Memorables({ items }: { items: MemorableCard[] }) {
  if (items.length === 0) return null;
  return (
    <div className="br-pf-mem-grid">
      {items.map((m, i) => (
        <div
          key={i}
          className={`br-pf-mem-card is-${m.kind.toLowerCase()}`}
        >
          <div className="br-pf-mem-lbl">{m.kind}</div>
          {m.kind === 'Quote' ? (
            <>
              {m.quote ? <div className="br-pf-mem-q">&ldquo;{m.quote}&rdquo;</div> : null}
              {m.attribution ? <div className="br-pf-mem-attr">{m.attribution}</div> : null}
            </>
          ) : (
            <>
              {m.link ? <div className="br-pf-mem-name"><SmartLink link={m.link} /></div> : null}
              {m.source ? <div className="br-pf-mem-src">{m.source}</div> : null}
              {m.note ? <div className="br-pf-mem-note">{m.note}</div> : null}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Wish cards — The Ones That Got Away
   First card in array is rendered tall; rest follow.
   The "writer" variant (character I wish I had written) wraps full-width.
   ============================================================ */
export function WishCards({ items }: { items: WishCard[] }) {
  if (items.length === 0) return null;
  // We mirror the source HTML's layout: 1 tall left + remaining stacked right,
  // and the last "writer" variant becomes a full-width card below the grid.
  const tall = items.find((it) => it.tall);
  const rightCards = items.filter((it) => it !== tall && it.variant !== 'writer');
  const writerCard = items.find((it) => it.variant === 'writer' && it !== tall);

  function Card({ w }: { w: WishCard }) {
    return (
      <article className={`br-pf-wish-card is-${w.variant} ${w.tall ? 'is-tall' : ''}`}>
        <div className="br-pf-wish-label">{w.label}</div>
        <div className="br-pf-wish-val"><SmartLink link={w.link} /></div>
        {w.source ? <div className="br-pf-wish-source">{w.source}</div> : null}
        <div className="br-pf-wish-body">{w.body}</div>
        {w.echo ? <div className="br-pf-wish-echo">{w.echo}</div> : null}
      </article>
    );
  }

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div className="br-pf-wish-grid">
        {tall ? <Card w={tall} /> : null}
        {rightCards.map((c, i) => <Card w={c} key={i} />)}
      </div>
      {writerCard ? <div style={{ marginTop: 12 }}><Card w={writerCard} /></div> : null}
    </div>
  );
}

/* ============================================================
   Reading Circles — toggles + clubs + (optional) pods
   ============================================================ */
export function ReadingCirclesBlock({
  open,
  clubs,
  pods,
  editable,
}: {
  open: Toggle[];
  clubs: ClubEntry[];
  pods?: PodEntry[];
  editable?: boolean;
}) {
  return (
    <>
      {open.length > 0 ? (
        <div className="br-pf-field">
          <div className="br-pf-field-label">Open to...</div>
          {open.map((t, i) => (
            <div key={i} className="br-pf-toggle-row">
              <div>
                <div className="br-pf-toggle-label">{t.label}</div>
                {t.subtitle ? <div className="br-pf-toggle-sub">{t.subtitle}</div> : null}
              </div>
              <label className="br-pf-toggle">
                <input type="checkbox" defaultChecked={t.on} disabled={!editable} />
                <span className="br-pf-toggle-slider" />
              </label>
            </div>
          ))}
        </div>
      ) : null}
      {clubs.length > 0 ? (
        <div className="br-pf-field" style={{ marginTop: '1.25rem' }}>
          <div className="br-pf-field-label">Reader's Clubs joined</div>
          <ul className="br-pf-club-list">
            {clubs.map((c, i) => (
              <li className="br-pf-club-item" key={i}>
                <div className="br-pf-club-icon" style={{ background: c.iconBg }}>{c.icon}</div>
                <div>
                  <div className="br-pf-club-name"><SmartLink link={c.link} /></div>
                  <div className="br-pf-club-meta">{c.meta}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {pods && pods.length > 0 ? (
        <div className="br-pf-field" style={{ marginTop: '1.25rem' }}>
          <div className="br-pf-field-label">Reader Pods</div>
          {pods.map((p, i) => (
            <div className="br-pf-pod" key={i}>
              <div className="br-pf-pod-head">
                <span className="br-pf-pod-icon" aria-hidden="true">{p.icon}</span>
                <span className="br-pf-pod-name">{p.name}</span>
                <span className={`br-pf-pod-type is-${p.type === 'Reader Pod' ? 'reader' : 'writer'}`}>{p.type}</span>
              </div>
              <div className="br-pf-pod-desc">{p.description}</div>
              <div className="br-pf-pod-members">{p.members}</div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

/* ============================================================
   If I Could Sit With Anyone — meet card + optional haiku
   ============================================================ */
export function SitWithAnyone({
  label,
  body,
  haiku,
}: {
  label: string;
  body: string;
  haiku?: { text: string; attribution: string };
}) {
  return (
    <>
      <div className="br-pf-field">
        <div className="br-pf-meet">
          <div className="br-pf-meet-label">{label}</div>
          <div className="br-pf-meet-val">{body}</div>
        </div>
      </div>
      {haiku ? (
        <div className="br-pf-field" style={{ marginTop: '1.25rem' }}>
          <div className="br-pf-field-label">A haiku I love</div>
          <div className="br-pf-haiku">
            <p>
              {haiku.text.split('\n').map((l, i, arr) => (
                <span key={i}>
                  {l}
                  {i < arr.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
            <div className="br-pf-haiku-attr">{haiku.attribution}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* ============================================================
   Other Places You Can Find Me
   ============================================================ */
export function OtherPlaces({ links }: { links: ExternalLink[] }) {
  if (links.length === 0) return null;
  return (
    <ul className="br-pf-links">
      {links.map((l, i) => (
        <li className="br-pf-link-row" key={i}>
          <div className="br-pf-link-icon" aria-hidden="true">{l.icon}</div>
          <div>
            <div className="br-pf-link-label"><SmartLink link={l.link} /></div>
            {l.subtitle ? <div className="br-pf-link-sub">{l.subtitle}</div> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   Library block — body + TBR tags
   ============================================================ */
export function LibraryBlock({ body, tbr }: { body: string; tbr: { label: string; href?: string }[] }) {
  return (
    <>
      <div className="br-pf-field"><div className="br-pf-field-val">{body}</div></div>
      {tbr.length > 0 ? (
        <div className="br-pf-field" style={{ marginTop: '1rem' }}>
          <div className="br-pf-field-label">What's on my TBR</div>
          <div>
            {tbr.map((t, i) => (
              <span className="br-pf-tag" key={i}>
                {t.href ? <Link href={t.href} style={{ textDecoration: 'none', color: 'inherit' }}>{t.label}</Link> : t.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
