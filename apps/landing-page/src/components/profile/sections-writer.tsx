import Link from 'next/link';
import type { WriterProfile } from '@/lib/mock-writers';
import { NumberedBookList, SmartLink, TagList } from './primitives';

/* ============================================================
   My Writing — genre/style/influences, WIPs, on-platform
   ============================================================ */
export function MyWritingBlock({ data }: { data: WriterProfile['myWriting'] }) {
  return (
    <>
      <div className="br-pf-two-col" style={{ marginBottom: '1.25rem' }}>
        <div className="br-pf-field">
          <div className="br-pf-field-label">Genre</div>
          <div className="br-pf-field-val">{data.genre}</div>
        </div>
        <div className="br-pf-field">
          <div className="br-pf-field-label">Style</div>
          <div className="br-pf-field-val">{data.style}</div>
        </div>
        <div className="br-pf-field">
          <div className="br-pf-field-label">Influences</div>
          <TagList tags={data.influences} />
        </div>
        <div className="br-pf-field">
          <div className="br-pf-field-label">Languages I write in</div>
          <div className="br-pf-field-val">{data.languages}</div>
        </div>
      </div>
      <div className="br-pf-field">
        <div className="br-pf-field-label">Works in progress</div>
        {data.wips.map((w, i) => (
          <div key={i} className="br-pf-wip">
            <div className="br-pf-wip-title">
              {w.link.kind === 'book' && w.link.slug ? (
                <Link href={`/studio?work=${w.link.slug}`} style={{ color: 'var(--v11-ink)' }}>
                  {w.link.title}
                </Link>
              ) : (
                <SmartLink link={w.link} />
              )}
            </div>
            <div className="br-pf-wip-meta">
              <span>{w.meta}</span>
              <span className={`br-pf-wip-stage is-${w.stage.toLowerCase()}`}>{w.stage}</span>
            </div>
            <div className="br-pf-wip-desc">{w.description}</div>
          </div>
        ))}
      </div>
      {data.onPlatform.length > 0 ? (
        <div className="br-pf-field" style={{ marginTop: '1.25rem' }}>
          <div className="br-pf-field-label">Wrote on Between Reads</div>
          <NumberedBookList items={data.onPlatform} />
        </div>
      ) : null}
    </>
  );
}

/* ============================================================
   The Writers Who Made Me
   ============================================================ */
export function WritersWhoMadeMeBlock({ data }: { data: WriterProfile['writersWhoMadeMe'] }) {
  return (
    <div className="br-pf-two-col">
      <div className="br-pf-field">
        <div className="br-pf-field-label">Literary influences</div>
        <TagList tags={data.influences} />
      </div>
      <div className="br-pf-field">
        <div className="br-pf-field-label">Books that changed how I write</div>
        <NumberedBookList items={data.booksThatChangedMe} />
      </div>
    </div>
  );
}

/* ============================================================
   My Reader
   ============================================================ */
export function MyReaderBlock({ data }: { data: WriterProfile['myReader'] }) {
  return (
    <>
      <div className="br-pf-field"><div className="br-pf-field-val">{data.body}</div></div>
      <div className="br-pf-two-col" style={{ marginTop: '1rem' }}>
        <div className="br-pf-field">
          <div className="br-pf-field-label">Ideal reader genre</div>
          <TagList tags={data.idealGenres.map((g) => ({ label: g }))} />
        </div>
        <div className="br-pf-field">
          <div className="br-pf-field-label">Mood of my work</div>
          <TagList tags={data.moods.map((m) => ({ label: m }))} />
        </div>
      </div>
    </>
  );
}

/* ============================================================
   My Writing Life
   ============================================================ */
export function MyWritingLifeBlock({ items }: { items: WriterProfile['myWritingLife'] }) {
  return (
    <div className="br-pf-two-col">
      {items.map((it, i) => (
        <div className="br-pf-field" key={i}>
          <div className="br-pf-field-label">{it.label}</div>
          <div className="br-pf-field-val">{it.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   My Beta Circle
   ============================================================ */
export function MyBetaCircleBlock({ data, editable }: { data: WriterProfile['myBetaCircle']; editable?: boolean }) {
  return (
    <>
      <div className="br-pf-field">
        <div className="br-pf-field-label">Active manuscripts</div>
        <div className="br-pf-beta-card">
          <div className="br-pf-beta-head">
            <span style={{ fontSize: 18 }} aria-hidden="true">🔒</span>
            <span className="br-pf-beta-title">{data.active.title}</span>
            <span className="br-pf-beta-st">{data.active.stage}</span>
          </div>
          <div className="br-pf-beta-rd">{data.active.meta}</div>
          <div className="br-pf-beta-chips">
            {data.active.betaReaders.map((r) => (
              <span className="br-pf-bc" key={r.handle}>
                <Link href={`/reader/${r.handle}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {r.icon} {r.displayName}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="br-pf-field" style={{ marginTop: '1.25rem' }}>
        <div className="br-pf-field-label">Writer Pod</div>
        <div className="br-pf-pod">
          <div className="br-pf-pod-head">
            <span className="br-pf-pod-icon" aria-hidden="true">{data.pod.icon}</span>
            <span className="br-pf-pod-name">{data.pod.name}</span>
            <span className="br-pf-pod-type is-writer">{data.pod.type}</span>
          </div>
          <div className="br-pf-pod-desc">{data.pod.description}</div>
          <div className="br-pf-pod-members">{data.pod.members}</div>
        </div>
      </div>
      <div className="br-pf-field" style={{ marginTop: '1rem' }}>
        <div className="br-pf-toggle-row">
          <div>
            <div className="br-pf-toggle-label">{data.acceptRequests.label}</div>
            {data.acceptRequests.subtitle ? (
              <div className="br-pf-toggle-sub">{data.acceptRequests.subtitle}</div>
            ) : null}
          </div>
          <label className="br-pf-toggle">
            <input type="checkbox" defaultChecked={data.acceptRequests.on} disabled={!editable} />
            <span className="br-pf-toggle-slider" />
          </label>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   Last Three Read + All-Time Favourites (side by side, writer)
   ============================================================ */
export function BookPair({
  last3,
  allTime,
  last3Label = 'Last three read',
  allTimeLabel = 'All-time favourites',
}: {
  last3: WriterProfile['last3Read'];
  allTime: WriterProfile['allTimeFavourites'];
  last3Label?: string;
  allTimeLabel?: string;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div>
        <div className="br-pf-field-label" style={{ marginBottom: '0.85rem' }}>{last3Label}</div>
        <NumberedBookList items={last3} />
      </div>
      <div>
        <div className="br-pf-field-label" style={{ marginBottom: '0.85rem' }}>{allTimeLabel}</div>
        <NumberedBookList items={allTime} />
      </div>
    </div>
  );
}
