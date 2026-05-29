'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addRC, getMockSession } from '@/lib/mock-session';
import type { Chapter } from '@/lib/mock-books';

const DEFAULT_RC_COST = 5;

function rcCostFor(ch: Chapter): number {
  return ch.access.type === 'rc' ? ch.access.cost : DEFAULT_RC_COST;
}

type Props = {
  bookSlug: string;
  bookTitle: string;
  chapters: Chapter[];
};

export function ChapterList({ bookSlug, bookTitle, chapters }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState<Chapter | null>(null);
  const [mounted, setMounted] = useState(false);
  const [rcBalance, setRcBalance] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setRcBalance(getMockSession()?.rc ?? 0);
  }, []);

  useEffect(() => {
    if (!pending) return;
    setRcBalance(getMockSession()?.rc ?? 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPending(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [pending]);

  function useRc(ch: Chapter) {
    if (ch.access.type === 'free') return;
    addRC(-rcCostFor(ch));
    setPending(null);
    router.push(`/read/${bookSlug}/${ch.slug}`);
  }

  return (
    <>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {chapters.map((c) => {
          const row = (
            <>
              <span className="br-ch-num">{c.num}</span>
              <span className="br-ch-row-title">{c.title}</span>
              <span className="br-ch-row-words">{c.words.toLocaleString()} w</span>
              {c.access.type === 'free' ? (
                <span className="br-ch-row-status br-ch-status-free">Free</span>
              ) : (
                <span
                  className="br-ch-row-status br-ch-status-lock"
                  aria-label="Locked — unlock with credits or subscription"
                >
                  🔒
                </span>
              )}
            </>
          );

          if (c.access.type === 'free') {
            return (
              <li className="br-ch-row" key={c.slug}>
                <Link
                  href={`/read/${bookSlug}/${c.slug}`}
                  style={{ display: 'contents', color: 'inherit' }}
                  aria-label={`Read ${c.title}`}
                >
                  {row}
                </Link>
              </li>
            );
          }

          return (
            <li className="br-ch-row br-ch-row-locked" key={c.slug}>
              <button
                type="button"
                className="br-ch-row-btn"
                onClick={() => setPending(c)}
                aria-haspopup="dialog"
                aria-label={`Unlock ${c.title}`}
              >
                {row}
              </button>
            </li>
          );
        })}
      </ul>

      {mounted && pending
        ? createPortal(
            <div
              className="br-paywall-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="br-paywall-headline"
            >
              <button
                type="button"
                className="br-paywall-backdrop"
                aria-label="Close paywall"
                onClick={() => setPending(null)}
              />
              <div className="br-paywall-modal">
                <div className="br-paywall-eyebrow">Chapter locked</div>
                <h2 id="br-paywall-headline" className="br-paywall-headline">
                  Unlock &ldquo;{pending.title}&rdquo;
                </h2>
                <p className="br-paywall-meta">
                  Chapter {pending.num} · {pending.words.toLocaleString()} words ·{' '}
                  {bookTitle}
                </p>

                <div className="br-paywall-options">
                  <RcOption
                    ch={pending}
                    balance={rcBalance}
                    onUse={() => useRc(pending)}
                  />

                  <Link
                    href="/checkout?plan=powerreader&billing=monthly&source=chapter"
                    className="br-paywall-option is-sub"
                    onClick={() => setPending(null)}
                  >
                    <div className="br-paywall-option-mark">✦</div>
                    <div className="br-paywall-option-body">
                      <div className="br-paywall-option-title">
                        Subscribe for $10/month
                      </div>
                      <div className="br-paywall-option-sub">
                        Every chapter of every book, plus BetweenLines. Cancel anytime.
                      </div>
                    </div>
                    <div className="br-paywall-option-cta">Choose →</div>
                  </Link>
                </div>

                <button
                  type="button"
                  className="br-paywall-cancel"
                  onClick={() => setPending(null)}
                >
                  Not now
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function RcOption({
  ch,
  balance,
  onUse,
}: {
  ch: Chapter;
  balance: number | null;
  onUse: () => void;
}) {
  const cost = rcCostFor(ch);
  const enough = balance !== null && balance >= cost;
  return (
    <button
      type="button"
      className={`br-paywall-option is-rc ${enough ? '' : 'is-short'}`}
      onClick={enough ? onUse : undefined}
      aria-disabled={!enough}
    >
      <div className="br-paywall-option-mark">🔓</div>
      <div className="br-paywall-option-body">
        <div className="br-paywall-option-title">
          Spend {cost} Reading Credit{cost === 1 ? '' : 's'}
        </div>
        <div className="br-paywall-option-sub">
          {enough
            ? `Unlocks this chapter only. You have ${balance} RC.`
            : `You have ${balance ?? 0} RC. Top up to spend ${cost} RC on this chapter.`}
        </div>
      </div>
      <div className="br-paywall-option-cta">{enough ? 'Use →' : 'Top up'}</div>
    </button>
  );
}
