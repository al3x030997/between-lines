'use client';

import { useMemo } from 'react';
import type { Chapter } from '@/lib/mock-books';
import type { WorkSummary } from '@/lib/mock-writers';
import { IconPlus, IconChevronLeft, IconChevronRight } from '../read/sidebar-icons';

type Props = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  work: WorkSummary | undefined;
  chapters: Chapter[];
  activeSlug: string;
  onSelect: (slug: string) => void;
};

export function ChapterSidebar({ collapsed, onToggleCollapse, work, chapters, activeSlug, onSelect }: Props) {
  const totalWords = useMemo(() => chapters.reduce((acc, c) => acc + (c.words || 0), 0), [chapters]);
  const numComplete = useMemo(() => chapters.filter((c) => c.words > 0).length, [chapters]);
  const progressPct = chapters.length === 0 ? 0 : Math.round((numComplete / chapters.length) * 100);

  if (collapsed) {
    return (
      <aside className="br-write-sidebar is-collapsed" aria-label="Chapter sidebar">
        <button
          type="button"
          className="br-write-rail"
          onClick={onToggleCollapse}
          aria-label="Expand sidebar"
        >
          <span className="br-write-rail-fill" style={{ height: `${progressPct}%` }} aria-hidden="true" />
          <span className="br-write-rail-chev" aria-hidden="true">
            <IconChevronRight size={14} />
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="br-write-sidebar" aria-label="Chapter sidebar">
      <div className="br-write-chpanel">
        <div className="br-write-novel-header">
          <div className="br-write-novel-headrow">
            <div className="br-write-novel-title">{work?.title ?? 'Untitled'}</div>
            <button
              type="button"
              className="br-write-collapse-btn"
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
            >
              <IconChevronLeft size={16} />
            </button>
          </div>
          <div className="br-write-novel-meta">{work?.meta ?? ''}</div>
          <div className="br-write-progress" aria-hidden="true">
            <span className="br-write-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="br-write-novel-stats">
            {totalWords.toLocaleString()} words · {chapters.length} chapter{chapters.length === 1 ? '' : 's'}
          </div>
        </div>

        <button type="button" className="br-write-new-ch">
          <IconPlus size={16} />
          <span>New chapter</span>
        </button>

        <div className="br-write-chsection-label">Chapters</div>
        <div className="br-write-chlist-wrap">
          <ul className="br-write-chlist">
            {chapters.map((c) => {
              const isNew = c.title === 'New chapter' || c.words === 0;
              return (
                <li
                  key={c.slug}
                  className={`br-write-chitem ${c.slug === activeSlug ? 'is-active' : ''} ${isNew ? 'is-new' : ''}`}
                  onClick={() => onSelect(c.slug)}
                >
                  <span className="br-write-chnum">{c.num}</span>
                  <span className="br-write-chname">{c.title}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="br-write-chfoot">
          <span className="br-write-foot-dot" aria-hidden="true" />
          {progressPct}% drafted · {numComplete}/{chapters.length}
        </div>
      </div>
    </aside>
  );
}
