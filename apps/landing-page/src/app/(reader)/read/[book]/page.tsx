import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBook } from '@/lib/mock-books';
import { writerSlugForHandle } from '@/lib/mock-writers';
import { ChapterList } from '@/components/ChapterList';
import { CommunityVoices } from '@/components/CommunityVoices';
import { TipWriterButton } from '@/components/TipWriterButton';

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
  const writerSlug = writerSlugForHandle(book.authorHandle);

  return (
    <div>
      <Link href="/read" className="br-book-back">
        ← Back to discover
      </Link>

      <section className="br-book-hero">
        <div className="br-book-eyebrow">{book.category}</div>
        <h1 className="br-book-title">{book.title}</h1>
        <div className="br-book-author">
          by{' '}
          {writerSlug ? (
            <Link href={`/writer/${writerSlug}`}>{book.author}</Link>
          ) : (
            <span>{book.author}</span>
          )}
          {book.authorHandle && writerSlug ? (
            <>
              <span className="br-sep">·</span>
              <Link href={`/writer/${writerSlug}`} style={{ fontSize: 12, color: 'var(--br-writer)' }}>
                @{book.authorHandle}
              </Link>
            </>
          ) : book.authorHandle ? (
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
          {!isClassic ? (
            <TipWriterButton
              authorName={book.author}
              authorHandle={book.authorHandle}
              size="lg"
            />
          ) : null}
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
        <span className="br-bs-item">
          <span className="br-bs-num">{book.wordsLabel ?? book.words.toLocaleString()}</span>
          <span className="br-bs-lbl">words</span>
        </span>
        <span className="br-bs-item">
          <span className="br-bs-num">{book.chapterCount}</span>
          <span className="br-bs-lbl">chapters</span>
        </span>
        {book.readerPicks ? (
          <span className="br-bs-item">
            <span className="br-bs-num">{book.readerPicks}</span>
            <span className="br-bs-lbl">reader picks</span>
          </span>
        ) : null}
        <span className="br-bs-item">
          <span className="br-bs-num">{book.estRead}</span>
          <span className="br-bs-lbl">est. read</span>
        </span>
        {book.publishYear ? (
          <span className="br-bs-item">
            <span className="br-bs-num">{book.publishYear}</span>
            <span className="br-bs-lbl">published</span>
          </span>
        ) : null}
      </div>

      <CommunityVoices />

      <div className="br-chapters">
        <div className="br-chapters-label br-sec-title">Chapters</div>
        <ChapterList bookSlug={book.slug} bookTitle={book.title} chapters={book.chapters} />
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
