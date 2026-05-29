import { notFound } from 'next/navigation';
import { ReaderShell } from '@/components/ReaderShell';
import { getChapter } from '@/lib/mock-books';

type PageProps = {
  params: { book: string; chapter: string };
};

export default function ChapterPage({ params }: PageProps) {
  const found = getChapter(params.book, params.chapter);
  if (!found) notFound();

  const { book, chapter, prev, next } = found;

  // For chapters without body content (locked or not written yet),
  // show a placeholder so the route still resolves.
  const body =
    chapter.body ??
    `<p><em>This chapter is not yet available to read in preview. Continue with the next chapter, or unlock the full book.</em></p>`;

  return (
    <ReaderShell
      bookSlug={book.slug}
      bookTitle={book.title}
      authorName={book.author}
      authorHandle={book.authorHandle}
      chapterNumber={chapter.num}
      chapterTitle={chapter.title}
      chapterBody={body}
      chapterCount={book.chapterCount}
      prev={prev ? { slug: prev.slug, title: prev.title } : undefined}
      next={next ? { slug: next.slug, title: next.title } : undefined}
    />
  );
}
