import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBook } from '@/lib/mock-books';

type PageProps = {
  params: { book: string };
};

export default function BookPage({ params }: PageProps) {
  const book = getBook(params.book);
  if (!book) notFound();

  const firstFreeChapter = book.chapters.find((c) => c.access.type === 'free');
  const readHref = firstFreeChapter
    ? `/read/${book.slug}/${firstFreeChapter.slug}`
    : `/read/${book.slug}/${book.chapters[0]?.slug ?? ''}`;

  const isClassic = book.category.toLowerCase().includes('classic');

  return (
    <div>
      <Link href="/read" className="br-book-back">
        ← Back to discover
      </Link>

      <section className="br-book-hero">
        <div className="br-book-eyebrow">{book.category}</div>
        <h1 className="br-book-title">{book.title}</h1>
        <div className="br-book-author">
          by <a>{book.author}</a>
          {book.authorHandle ? (
            <>
              <span className="br-sep">·</span>
              <span style={{ fontSize: 12, color: 'var(--v11-ink-mute)' }}>@{book.authorHandle}</span>
            </>
          ) : null}
          {book.publishYear ? (
            <>
              <span className="br-sep">·</span>
              <span style={{ fontSize: 12 }}>{book.publishYear}</span>
            </>
          ) : null}
        </div>

        {book.badges.length > 0 ? (
          <div className="br-book-badges">
            {book.badges.map((b, i) => (
              <span key={i} className={`br-badge br-badge-${b.kind}`}>
                {b.label}
              </span>
            ))}
          </div>
        ) : null}

        {book.tags.length > 0 ? (
          <div className="br-book-tags">
            {book.tags.map((t) => (
              <span key={t} className="br-tag">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="br-book-blurb">
          {(book.blurbLong ?? book.blurb).split('\n\n').map((p, i) => (
            <p key={i} style={{ marginBottom: i < (book.blurbLong ?? book.blurb).split('\n\n').length - 1 ? '1rem' : 0 }}>
              {p}
            </p>
          ))}
        </div>

        <div className="br-book-actions">
          <Link href={readHref} className="br-btn br-btn-primary br-btn-lg">
            Read now — free
          </Link>
          {!isClassic && book.price ? (
            <button type="button" className="br-btn br-btn-accent br-btn-lg">
              Buy — {book.price}
            </button>
          ) : null}
          <button type="button" className="br-btn br-btn-ghost br-btn-lg">
            {isClassic ? '🔖 Save' : 'Follow writer'}
          </button>
        </div>

        {book.alsoOn && book.alsoOn.length > 0 ? (
          <div className="br-book-also">
            <span>Also {isClassic ? 'on' : 'available on'}</span>
            {book.alsoOn.map((a) => (
              <a key={a.label} className="br-also-link" href={a.href} target="_blank" rel="noreferrer">
                {a.label}
              </a>
            ))}
          </div>
        ) : null}
      </section>

      <div className="br-book-stats">
        <div className="br-bs-item">
          <div className="br-bs-num">{book.wordsLabel ?? book.words.toLocaleString()}</div>
          <div className="br-bs-lbl">Words</div>
        </div>
        <div className="br-bs-item">
          <div className="br-bs-num">{book.chapterCount}</div>
          <div className="br-bs-lbl">Chapters</div>
        </div>
        {book.readerPicks ? (
          <div className="br-bs-item">
            <div className="br-bs-num">{book.readerPicks}</div>
            <div className="br-bs-lbl">Reader picks</div>
          </div>
        ) : null}
        <div className="br-bs-item">
          <div className="br-bs-num">{book.estRead}</div>
          <div className="br-bs-lbl">Est. read</div>
        </div>
        {book.publishYear ? (
          <div className="br-bs-item">
            <div className="br-bs-num">{book.publishYear}</div>
            <div className="br-bs-lbl">Published</div>
          </div>
        ) : null}
      </div>

      <div className="br-chapters">
        <div className="br-chapters-label br-sec-title">Chapters</div>
        <ul style={{ listStyle: 'none' }}>
          {book.chapters.map((c) => {
            const isReadable = c.access.type === 'free' || (c.access.type === 'rc' && c.body);
            const href = isReadable ? `/read/${book.slug}/${c.slug}` : undefined;
            const row = (
              <>
                <span className="br-ch-num">{c.num}</span>
                <span className="br-ch-row-title">{c.title}</span>
                <span className="br-ch-row-words">{c.words.toLocaleString()} w</span>
                {c.access.type === 'free' ? (
                  <span className="br-ch-row-status br-ch-status-free">Free</span>
                ) : c.access.type === 'rc' ? (
                  <span className="br-ch-row-status br-ch-status-lock">
                    🔒 <span className="br-ch-status-rc">{c.access.cost} RC</span>
                  </span>
                ) : (
                  <span className="br-ch-row-status br-ch-status-sub">Subscribe</span>
                )}
              </>
            );
            return (
              <li className="br-ch-row" key={c.slug}>
                {href ? (
                  <Link
                    href={href}
                    style={{ display: 'contents', color: 'inherit' }}
                  >
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {!isClassic ? (
        <div className="br-unlock-nudge">
          <div className="br-unlock-text">
            <div className="br-unlock-title">Unlock all {book.chapterCount} chapters</div>
            <div className="br-unlock-sub">Subscribe for $10/month · or use ReadCredits</div>
          </div>
          <div className="br-unlock-actions">
            <button type="button" className="br-btn br-btn-ghost">
              Use 5 RC
            </button>
            <button type="button" className="br-btn br-btn-premium">
              Subscribe
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
