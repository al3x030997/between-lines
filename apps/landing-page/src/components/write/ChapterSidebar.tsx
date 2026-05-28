'use client';

import { useMemo } from 'react';
import type { Chapter } from '@/lib/mock-books';
import type { WorkSummary } from '@/lib/mock-writers';

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

  return (
    <aside className={`br-write-sidebar ${collapsed ? 'is-collapsed' : ''}`} aria-label="Chapter sidebar">
      <div className="br-write-vbar" aria-hidden="true">
        <div className="br-write-vbar-fill" style={{ height: `${progressPct}%` }} />
        <button
          type="button"
          className="br-write-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>
      {!collapsed ? (
        <div className="br-write-chpanel">
          <div className="br-write-novel-header">
            <div className="br-write-novel-title">{work?.title ?? 'Untitled'}</div>
            <div className="br-write-novel-meta">{work?.meta ?? ''}</div>
            <div className="br-write-novel-stats">
              {totalWords.toLocaleString()} words · {chapters.length} chapter{chapters.length === 1 ? '' : 's'}
            </div>
          </div>
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
            <button type="button" className="br-write-add-ch">＋ Add chapter</button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
