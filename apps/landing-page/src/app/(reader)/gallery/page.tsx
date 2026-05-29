import type { Metadata } from 'next';
import Link from 'next/link';
import { GalleryRail } from '@/components/gallery/GalleryRail';
import { getAllBooks, getBook, getBooksBySection, type Book } from '@/lib/mock-books';

export const metadata: Metadata = {
  title: 'Gallery - BetweenReads',
  description: 'A cinematic reader gallery for BetweenLines and BetweenReads picks.',
};

function hasBadge(book: Book, kind: string): boolean {
  return book.badges.some((badge) => badge.kind === kind);
}

function uniqueBooks(books: Book[]): Book[] {
  const seen = new Set<string>();
  return books.filter((book) => {
    if (seen.has(book.slug)) return false;
    seen.add(book.slug);
    return true;
  });
}

export default function GalleryPage() {
  const allBooks = getAllBooks();
  const hero = getBook('small-fires-soft-rain') ?? getBooksBySection('bl')[0];

  if (!hero) {
    return (
      <main className="br-gallery-page">
        <section className="br-gallery-empty">
          <h1>BetweenReads Gallery</h1>
          <p>The gallery is waiting for its first titles.</p>
        </section>
      </main>
    );
  }

  const betweenLinesBooks = uniqueBooks([
    hero,
    ...allBooks.filter((book) => book.section === 'bl' || hasBadge(book, 'bl')),
  ]);
  const readHereFirst = betweenLinesBooks.filter((book) => book.slug !== hero.slug).slice(0, 7);
  const readerPicks = uniqueBooks(
    allBooks
      .filter((book) => hasBadge(book, 'rp') || (book.readerPicks ?? 0) >= 35)
      .filter((book) => book.slug !== hero.slug),
  ).slice(0, 8);
  const midnightShelf = uniqueBooks(
    allBooks
      .filter((book) => book.tags.some((tag) => ['Reflective', 'Quiet', 'Gothic', 'Mystery'].includes(tag)))
      .filter((book) => book.slug !== hero.slug),
  ).slice(0, 8);

  return (
    <main className="br-gallery-page">
      <section className="br-gallery-hero" aria-labelledby="br-gallery-title">
        <div className="br-gallery-hero-copy">
          <p className="br-gallery-overline">BetweenLines Journal</p>
          <h1 id="br-gallery-title">Stories selected like cinema.</h1>
          <p className="br-gallery-dek">
            The new BetweenReads gallery puts the journal first: original fiction, reader-loved
            discoveries, and polished picks from writers worth following.
          </p>
          <div className="br-gallery-hero-actions">
            <Link href={`/read/${hero.slug}`} className="br-gallery-primary">
              Start with {hero.title}
            </Link>
            <Link href="/betweenlines#journal-submission" className="br-gallery-secondary">
              Submit to BetweenLines
            </Link>
          </div>
          <div className="br-gallery-stats" aria-label="Gallery highlights">
            <span>
              <strong>{betweenLinesBooks.length}</strong>
              BetweenLines picks
            </span>
            <span>
              <strong>{readerPicks.length}</strong>
              reader favorites
            </span>
            <span>
              <strong>June</strong>
              journal issue
            </span>
          </div>
        </div>

        <Link className="br-gallery-hero-feature" href={`/read/${hero.slug}`}>
          <span className="br-gallery-feature-art" style={{ background: hero.cover }} />
          <span className="br-gallery-feature-glass">
            <span className="br-gallery-feature-label">Featured in BetweenLines</span>
            <span className="br-gallery-feature-title">{hero.title}</span>
            <span className="br-gallery-feature-author">by {hero.author}</span>
            <span className="br-gallery-feature-blurb">{hero.blurb}</span>
          </span>
        </Link>
      </section>

      <GalleryRail
        title="BetweenLines premieres"
        kicker="Journal-first fiction"
        books={betweenLinesBooks}
        ranked
      />
      <GalleryRail
        title="Read here first"
        kicker="Originals and polished excerpts"
        books={readHereFirst}
      />
      <GalleryRail
        title="BetweenReads reader favorites"
        kicker="Successful picks from the shelves"
        books={readerPicks}
        ranked
      />
      <GalleryRail
        title="Quiet rooms after dark"
        kicker="Atmospheric discoveries"
        books={midnightShelf}
      />
    </main>
  );
}
