'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getBook, type Chapter } from '@/lib/mock-books';
import { getWriterWorks, type WorkSummary } from '@/lib/mock-writers';
import { useMockSession } from '@/lib/useMockSession';
import { WorkDropdown } from './WorkDropdown';
import { ChapterSidebar } from './ChapterSidebar';
import { WriteTab } from './WriteTab';
import { ChapterSettingsTab } from './ChapterSettingsTab';
import { NovelSettingsTab } from './NovelSettingsTab';

type Tab = 'write' | 'chsettings' | 'novelsettings';

export function WriteShell() {
  const { session, ready } = useMockSession();
  const params = useSearchParams();

  const works: WorkSummary[] = useMemo(() => {
    if (!session) return [];
    return getWriterWorks(session.handle);
  }, [session]);

  // Selected work (defaults to first in the list, or matches ?work=<slug>)
  const [workId, setWorkId] = useState<string>('');
  useEffect(() => {
    if (works.length === 0) return;
    const queryWork = params.get('work');
    const matched = queryWork ? works.find((w) => w.id === queryWork || w.bookSlug === queryWork) : null;
    setWorkId(matched?.id ?? works[0]!.id);
  }, [params, works]);

  const activeWork = works.find((w) => w.id === workId);

  // Chapters loaded from mock-books if the work has a bookSlug, else synthesized
  const chapters: Chapter[] = useMemo(() => {
    if (!activeWork) return [];
    if (activeWork.bookSlug) {
      const book = getBook(activeWork.bookSlug);
      if (book) {
        // Append a "New chapter" placeholder at the end so the demo always has
        // an active draft target (matches the source HTML).
        const last = book.chapters[book.chapters.length - 1];
        const nextNum = (last?.num ?? 0) + Math.max(1, book.chapterCount - book.chapters.length + 1);
        return [
          ...book.chapters,
          { num: nextNum, slug: 'new-chapter', title: 'New chapter', words: 0, access: { type: 'free' } },
        ];
      }
    }
    // Synthesize a small chapter list for editor-only works
    return [
      { num: 1, slug: 'ch-1', title: 'Chapter 1', words: 1200, access: { type: 'free' } },
      { num: 2, slug: 'ch-2', title: 'Chapter 2', words: 980, access: { type: 'free' } },
      { num: 3, slug: 'new-chapter', title: 'New chapter', words: 0, access: { type: 'free' } },
    ];
  }, [activeWork]);

  // Default active chapter = "New chapter" (the demo's blank slate)
  const [activeChapterSlug, setActiveChapterSlug] = useState<string>('');
  useEffect(() => {
    if (chapters.length === 0) return;
    setActiveChapterSlug(chapters[chapters.length - 1]!.slug);
  }, [chapters]);

  const activeChapter = chapters.find((c) => c.slug === activeChapterSlug) ?? null;

  // UI state
  const [tab, setTab] = useState<Tab>('write');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [workMenuOpen, setWorkMenuOpen] = useState(false);

  if (!ready) {
    return (
      <main className="br-handoff">
        <div className="br-handoff-wordmark"><span>Between</span>Reads</div>
        <div className="br-handoff-rule" />
        <div className="br-handoff-msg br-handoff-dots">Opening the writing room</div>
      </main>
    );
  }

  if (!session?.roles.includes('writer')) {
    return (
      <main className="br-pf-page">
        <section className="br-pf-section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h1 className="br-pf-display-name" style={{ marginBottom: 12 }}>The Writing Room</h1>
          <p className="br-pf-bio" style={{ fontFamily: 'var(--br-font-serif)', fontStyle: 'italic', fontSize: 15 }}>
            Become a writer on BetweenReads to start uploading your work. The reading experience is unchanged for readers.
          </p>
        </section>
      </main>
    );
  }

  return (
    <div className="br-write-shell">
      {/* Tab bar */}
      <div className="br-write-tabbar">
        <button
          type="button"
          className={`br-write-tab ${tab === 'write' ? 'is-active' : ''}`}
          onClick={() => setTab('write')}
        >
          Write
        </button>
        <button
          type="button"
          className={`br-write-tab ${tab === 'chsettings' ? 'is-active' : ''}`}
          onClick={() => setTab('chsettings')}
        >
          Chapter Settings
        </button>
        <button
          type="button"
          className={`br-write-tab ${tab === 'novelsettings' ? 'is-active' : ''}`}
          onClick={() => setTab('novelsettings')}
        >
          Novel Settings
        </button>
        <WorkDropdown
          works={works}
          activeId={workId}
          onChange={(id) => {
            setWorkId(id);
            setWorkMenuOpen(false);
          }}
          open={workMenuOpen}
          onToggle={() => setWorkMenuOpen((v) => !v)}
          onClose={() => setWorkMenuOpen(false)}
        />
      </div>

      {/* Main split */}
      <div className="br-write-main">
        <ChapterSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
          work={activeWork}
          chapters={chapters}
          activeSlug={activeChapterSlug}
          onSelect={setActiveChapterSlug}
        />
        <div className="br-write-right">
          {tab === 'write' ? (
            <WriteTab
              workTitle={activeWork?.title ?? ''}
              chapter={activeChapter}
              onTitleEdit={(newTitle) => {
                // Mocked — in v1 we don't persist
                if (activeChapter) activeChapter.title = newTitle;
              }}
            />
          ) : null}
          {tab === 'chsettings' ? (
            <ChapterSettingsTab chapter={activeChapter} onCancel={() => setTab('write')} />
          ) : null}
          {tab === 'novelsettings' ? (
            <NovelSettingsTab
              work={activeWork}
              chapters={chapters}
              onCancel={() => setTab('write')}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
