import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBetaReadingRequest } from '@/lib/mock-beta-reading';
import { writerSlugForHandle } from '@/lib/mock-writers';

type PageProps = {
  params: { request: string };
};

export default function BetaReadingRequestPage({ params }: PageProps) {
  const request = getBetaReadingRequest(params.request);
  if (!request) notFound();

  const writerSlug = writerSlugForHandle(request.authorHandle);

  return (
    <div>
      <Link href="/library?tab=betareading" className="br-book-back">
        ← Back to beta reading
      </Link>

      <section className="br-book-hero br-beta-detail-hero">
        <div className="br-book-eyebrow">Beta request · {request.type}</div>
        <h1 className="br-book-title">{request.title}</h1>
        <div className="br-book-author">
          by{' '}
          {writerSlug ? (
            <Link href={`/writer/${writerSlug}`}>{request.author}</Link>
          ) : (
            <span>{request.author}</span>
          )}
          <span className="br-sep">·</span>
          <span style={{ fontSize: 12 }}>{request.stage}</span>
        </div>

        <div className="br-book-badges">
          <span className="br-badge br-badge-bp">Beta Reading</span>
          <span className="br-badge br-badge-mp">{request.rewardCredits} Swap Credits</span>
        </div>

        <div className="br-book-tags">
          <span className="br-tag">{request.genre}</span>
          <span className="br-tag">{request.mood}</span>
          <span className="br-tag">{request.deadline} feedback window</span>
        </div>

        <div className="br-book-blurb">
          <p>{request.blurb}</p>
        </div>

        <div className="br-book-actions br-beta-detail-actions">
          <Link href={`/read/beta/${request.slug}/start`} className="br-btn br-btn-primary br-btn-lg">
            Start beta reading
          </Link>
          <button
            type="button"
            className="br-beta-chat-action"
            aria-label={`Write ${request.author}`}
          >
            <span aria-hidden="true">💬</span>
            <span>Write author</span>
          </button>
        </div>
      </section>

      <div className="br-book-stats">
        <span className="br-bs-item">
          <span className="br-bs-num">{request.words.toLocaleString('en-US')}</span>
          <span className="br-bs-lbl">words</span>
        </span>
        <span className="br-bs-item">
          <span className="br-bs-num">{request.chapters}</span>
          <span className="br-bs-lbl">chapters</span>
        </span>
        <span className="br-bs-item">
          <span className="br-bs-num">{request.slotsOpen}</span>
          <span className="br-bs-lbl">slots open</span>
        </span>
        <span className="br-bs-item">
          <span className="br-bs-num">{request.estRead}</span>
          <span className="br-bs-lbl">est. read</span>
        </span>
      </div>

      <section className="br-beta-note-card" aria-labelledby="beta-author-note">
        <div className="br-sec-title" id="beta-author-note">
          Personal note from the author
        </div>
        <p>{request.note}</p>
      </section>

      <section className="br-beta-guidance-card" aria-labelledby="beta-focus-points">
        <div>
          <div className="br-sec-title" id="beta-focus-points">
            Important for this beta read
          </div>
          <p className="br-beta-guidance-intro">
            Keep these points in mind while reading and when you leave feedback.
          </p>
        </div>
        <ul className="br-beta-focus-list">
          {request.focusPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <div className="br-unlock-nudge br-beta-start-nudge">
        <div className="br-unlock-text">
          <div className="br-unlock-title">Ready to begin?</div>
          <div className="br-unlock-sub">
            Start the manuscript now and earn {request.rewardCredits} Swap Credits when feedback is complete.
          </div>
        </div>
        <div className="br-unlock-actions">
          <Link href={`/read/beta/${request.slug}/start`} className="br-btn br-btn-primary">
            Start beta reading
          </Link>
          <button
            type="button"
            className="br-beta-chat-icon"
            aria-label={`Write ${request.author}`}
            title={`Write ${request.author}`}
          >
            💬
          </button>
        </div>
      </div>
    </div>
  );
}
