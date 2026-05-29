import { notFound } from 'next/navigation';
import { ReaderShell } from '@/components/ReaderShell';
import { getBetaReadingRequest } from '@/lib/mock-beta-reading';

type PageProps = {
  params: { request: string };
};

export default function StartBetaReadingPage({ params }: PageProps) {
  const request = getBetaReadingRequest(params.request);
  if (!request) notFound();

  return (
    <ReaderShell
      bookSlug={`beta/${request.slug}`}
      bookTitle={request.title}
      chapterNumber={1}
      chapterTitle={request.openingTitle}
      chapterBody={request.openingBody}
      chapterCount={request.chapters}
    />
  );
}
