import type { ReaderProfile } from '@/lib/mock-readers';
import { SmartLink, TagList } from './primitives';

/* ============================================================
   How I Read — 6 small field rows in a 2-col grid
   ============================================================ */
export function HowIReadBlock({ items, genres }: { items: ReaderProfile['howIRead']; genres: string[] }) {
  return (
    <>
      <div className="br-pf-two-col">
        {items.map((r, i) => (
          <div className="br-pf-field" key={i}>
            <div className="br-pf-field-label">{r.label}</div>
            <div className="br-pf-field-val">{r.value}</div>
          </div>
        ))}
      </div>
      {genres.length > 0 ? (
        <div className="br-pf-field" style={{ marginTop: '1rem' }}>
          <div className="br-pf-field-label">Favourite genres</div>
          <TagList tags={genres.map((g) => ({ label: g }))} />
        </div>
      ) : null}
    </>
  );
}

/* ============================================================
   My Favourite Authors
   ============================================================ */
export function FavouriteAuthorsBlock({ data }: { data: ReaderProfile['favouriteAuthors'] }) {
  return (
    <>
      <div className="br-pf-two-col">
        <div className="br-pf-field">
          <div className="br-pf-field-label">Recently reading</div>
          <TagList tags={data.recently} />
        </div>
        <div className="br-pf-field">
          <div className="br-pf-field-label">All-time favourites</div>
          <TagList tags={data.allTime} />
        </div>
      </div>
      {data.onPlatform.length > 0 ? (
        <div className="br-pf-field" style={{ marginTop: '1rem' }}>
          <div className="br-pf-field-label">Writers I follow on Between Reads</div>
          <TagList tags={data.onPlatform} />
        </div>
      ) : null}
    </>
  );
}

/* ============================================================
   Books That Undid Me — 2 emo cards (laugh / cry)
   ============================================================ */
export function BooksThatUndidMeBlock({ items }: { items: ReaderProfile['booksThatUndidMe'] }) {
  if (items.length === 0) return null;
  return (
    <div className="br-pf-emo-grid">
      {items.map((it, i) => (
        <div key={i} className={`br-pf-emo-card is-${it.variant}`}>
          <div className="br-pf-emo-icon" aria-hidden="true">{it.icon}</div>
          <div className="br-pf-emo-label">{it.label}</div>
          <div className="br-pf-emo-val"><SmartLink link={it.link} /></div>
          {it.author ? <div className="br-pf-emo-author">{it.author}</div> : null}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   When the Book Became a Film — tag list
   ============================================================ */
export function WhenBookBecameFilmBlock({ items }: { items: ReaderProfile['whenBookBecameFilm'] }) {
  if (items.length === 0) return null;
  return (
    <div className="br-pf-field">
      <div className="br-pf-field-label">Favourite adaptations</div>
      <TagList tags={items} />
    </div>
  );
}

/* ============================================================
   My Genre Passions — blue card
   ============================================================ */
export function GenrePassionBlock({ data }: { data: NonNullable<ReaderProfile['genrePassion']> }) {
  return (
    <div className="br-pf-genre-card">
      <div className="br-pf-genre-label">{data.icon} {data.label}</div>
      <div className="br-pf-genre-inner">
        <div>
          <div className="br-pf-genre-field-label">Favourite character</div>
          <div className="br-pf-genre-field-val">
            <SmartLink link={data.favouriteCharacter.link} />
            <br />
            <span style={{ fontSize: 11, color: 'var(--v11-ink-trace)' }}>{data.favouriteCharacter.meta}</span>
          </div>
        </div>
        <div>
          <div className="br-pf-genre-field-label">Favourite book</div>
          <div className="br-pf-genre-field-val">
            <SmartLink link={data.favouriteBook.link} />
            <br />
            <span style={{ fontSize: 11, color: 'var(--v11-ink-trace)' }}>{data.favouriteBook.meta}</span>
          </div>
        </div>
        <div>
          <div className="br-pf-genre-field-label">Favourite writer</div>
          <div className="br-pf-genre-field-val">
            <SmartLink link={data.favouriteWriter.link} />
            <br />
            <span style={{ fontSize: 11, color: 'var(--v11-ink-trace)' }}>{data.favouriteWriter.meta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
