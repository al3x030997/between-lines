'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBook, type Chapter } from '@/lib/mock-books';
import {
  getWriterLibraryWorks,
  getWriterWorks,
  type WorkSummary,
  type WriterLibraryWork,
} from '@/lib/mock-writers';
import { useMockSession } from '@/lib/useMockSession';
import { StoreTabs, type TabDef } from '@/components/StoreTabs';
import { WorkDropdown } from './WorkDropdown';
import { ChapterSidebar } from './ChapterSidebar';
import { WriteTab } from './WriteTab';
import { ChapterSettingsTab } from './ChapterSettingsTab';
import { NovelSettingsTab } from './NovelSettingsTab';
import { WriterLibrary, makeDraftWork, type LibraryStatusFilter } from './WriterLibrary';
import { AgentReadyStub, AudioStub, CommunityStub, PersonalStorefrontStub } from './WriterStubs';
import { WriterSearch } from './WriterSearch';
import { AnalyticsDashboard } from './AnalyticsDashboard';

type TopTab = 'library' | 'write' | 'audio' | 'analytics' | 'storefront' | 'agentready' | 'community';
type EditorSubTab = 'write' | 'chsettings' | 'novelsettings';

const TOP_TABS: TabDef<TopTab>[] = [
  { id: 'library', label: 'Your Library' },
  { id: 'write', label: 'Write' },
  { id: 'audio', label: 'Audio' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'storefront', label: 'Personal Storefront' },
  { id: 'agentready', label: 'Agent Ready' },
  { id: 'community', label: 'Community' },
];

function isTopTab(value: string | null): value is TopTab {
  return (
    value === 'library' ||
    value === 'write' ||
    value === 'audio' ||
    value === 'analytics' ||
    value === 'storefront' ||
    value === 'agentready' ||
    value === 'community'
  );
}

export function WriteShell() {
  const { session, ready } = useMockSession();
  const params = useSearchParams();
  const router = useRouter();

  const works: WorkSummary[] = useMemo(() => {
    if (!session) return [];
    return getWriterWorks(session.handle);
  }, [session]);

  const libraryWorks: WriterLibraryWork[] = useMemo(() => {
    if (!session) return [];
    return getWriterLibraryWorks(session.handle);
  }, [session]);

  const [workId, setWorkId] = useState<string>('');
  useEffect(() => {
    if (works.length === 0) return;
    const queryWork = params.get('work');
    const matched = queryWork ? works.find((w) => w.id === queryWork || w.bookSlug === queryWork) : null;
    setWorkId(matched?.id ?? works[0]!.id);
  }, [params, works]);

  const activeWork = works.find((w) => w.id === workId);

  const chapters: Chapter[] = useMemo(() => {
    if (!activeWork) return [];
    if (activeWork.bookSlug) {
      const book = getBook(activeWork.bookSlug);
      if (book) {
        const last = book.chapters[book.chapters.length - 1];
        const nextNum = (last?.num ?? 0) + Math.max(1, book.chapterCount - book.chapters.length + 1);
        return [
          ...book.chapters,
          { num: nextNum, slug: 'new-chapter', title: 'New chapter', words: 0, access: { type: 'free' } },
        ];
      }
    }
    return [
      { num: 1, slug: 'ch-1', title: 'Chapter 1', words: 1200, access: { type: 'free' } },
      { num: 2, slug: 'ch-2', title: 'Chapter 2', words: 980, access: { type: 'free' } },
      { num: 3, slug: 'new-chapter', title: 'New chapter', words: 0, access: { type: 'free' } },
    ];
  }, [activeWork]);

  const [activeChapterSlug, setActiveChapterSlug] = useState<string>('');
  useEffect(() => {
    if (chapters.length === 0) return;
    setActiveChapterSlug(chapters[chapters.length - 1]!.slug);
  }, [chapters]);

  const activeChapter = chapters.find((c) => c.slug === activeChapterSlug) ?? null;

  const [topTab, setTopTab] = useState<TopTab>('library');
  const [editorSubTab, setEditorSubTab] = useState<EditorSubTab>('write');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [workMenuOpen, setWorkMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<LibraryStatusFilter>('all');
  const [drafts, setDrafts] = useState<WriterLibraryWork[]>([]);
  const [writerQuery, setWriterQuery] = useState('');

  const addWork = () => {
    setDrafts((current) => [...current, makeDraftWork(current.length + 1)]);
  };

  useEffect(() => {
    const requestedTab = params.get('tab');
    if (isTopTab(requestedTab)) {
      setTopTab(requestedTab);
      return;
    }
    if (requestedTab === 'chsettings' || requestedTab === 'novelsettings') {
      setTopTab('write');
      setEditorSubTab(requestedTab);
      return;
    }
    const requestedView = params.get('view');
    const requestedWork = params.get('work');
    if (requestedView === 'editor' || requestedWork) {
      setTopTab('write');
    } else {
      setTopTab('library');
    }
  }, [params]);

  const changeTopTab = (id: TopTab) => {
    setTopTab(id);
    setWorkMenuOpen(false);
    if (id === 'library') {
      router.push('/write');
    } else if (id === 'write') {
      const next = new URLSearchParams();
      next.set('view', 'editor');
      if (workId) next.set('work', workId);
      router.push(`/write?${next.toString()}`);
    } else {
      router.push(`/write?tab=${id}`);
    }
  };

  const openEditorForWork = (id: string, nextSubTab: EditorSubTab = 'write') => {
    if (!id) return;
    setWorkId(id);
    setEditorSubTab(nextSubTab);
    setTopTab('write');
    setWorkMenuOpen(false);
    const next = new URLSearchParams();
    next.set('view', 'editor');
    next.set('work', id);
    if (nextSubTab !== 'write') next.set('tab', nextSubTab);
    router.push(`/write?${next.toString()}`);
  };

  const previewWork = (work: WriterLibraryWork) => {
    if (work.bookSlug) {
      router.push(`/read/${work.bookSlug}`);
      return;
    }
    openEditorForWork(work.id, 'write');
  };

  const mergedLibraryWorks = useMemo(() => [...libraryWorks, ...drafts], [libraryWorks, drafts]);

  const filteredLibraryWorks = useMemo(() => {
    let result = mergedLibraryWorks;
    if (statusFilter !== 'all') {
      result = result.filter((w) => w.status === statusFilter);
    }
    const q = writerQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((w) =>
        w.title.toLowerCase().includes(q)
        || (w.pitch?.toLowerCase().includes(q) ?? false)
        || w.meta.toLowerCase().includes(q),
      );
    }
    return result;
  }, [mergedLibraryWorks, statusFilter, writerQuery]);

  const libraryCounts = useMemo<Record<LibraryStatusFilter, number>>(() => {
    const base: Record<LibraryStatusFilter, number> = { all: mergedLibraryWorks.length, Published: 0, Drafting: 0, Editing: 0, Private: 0 };
    for (const w of mergedLibraryWorks) base[w.status] = (base[w.status] ?? 0) + 1;
    return base;
  }, [mergedLibraryWorks]);

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

  // Editor mode keeps its own dedicated chrome (chapter sidebar + editor body).
  // The top-level writer tabs are dropped — a back button takes the writer
  // back to the library instead.
  if (topTab === 'write') {
    return (
      <div className="br-write-shell br-write-shell-editor br-write-page">
        {/* Row 2: same tabsbar as library mode so the global section nav
            (Search + Your Library / Write / Audio / ...) stays at the
            same y-position across /write surfaces. "Write" is active
            here because topTab === 'write'. */}
        <div className="br-write-tabsbar">
          <div className="br-write-tabsbar-inner">
            <WriterSearch query={writerQuery} onChange={setWriterQuery} />
            <StoreTabs<TopTab>
              tabs={TOP_TABS}
              active={topTab}
              onChange={changeTopTab}
              ariaLabel="Writer sections"
            />
          </div>
        </div>
        {/* Row 3: editor-specific context strip — work title + meta.
            The redundant "Back to library" button is dropped because
            the tabsbar's "Your Library" tab does the same thing. */}
        <div className="br-write-editor-topbar">
          {activeWork ? (
            <span className="br-write-editor-work" aria-label="Active work">
              <span className="br-write-editor-work-title">{activeWork.title}</span>
              <span className="br-write-editor-work-meta">{activeWork.meta}</span>
            </span>
          ) : null}
        </div>
        <div className="br-write-editor-subbar">
          <button
            type="button"
            className={`br-write-subtab ${editorSubTab === 'write' ? 'is-active' : ''}`}
            onClick={() => setEditorSubTab('write')}
          >
            Write
          </button>
          <button
            type="button"
            className={`br-write-subtab ${editorSubTab === 'chsettings' ? 'is-active' : ''}`}
            onClick={() => setEditorSubTab('chsettings')}
          >
            Chapter settings
          </button>
          <button
            type="button"
            className={`br-write-subtab ${editorSubTab === 'novelsettings' ? 'is-active' : ''}`}
            onClick={() => setEditorSubTab('novelsettings')}
          >
            Novel settings
          </button>
          <WorkDropdown
            works={works}
            activeId={workId}
            onChange={(id) => {
              setWorkId(id);
              setWorkMenuOpen(false);
              openEditorForWork(id, editorSubTab);
            }}
            open={workMenuOpen}
            onToggle={() => setWorkMenuOpen((v) => !v)}
            onClose={() => setWorkMenuOpen(false)}
          />
        </div>
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
            {editorSubTab === 'write' ? (
              <WriteTab
                workTitle={activeWork?.title ?? ''}
                chapter={activeChapter}
                onTitleEdit={(newTitle) => {
                  if (activeChapter) activeChapter.title = newTitle;
                }}
              />
            ) : null}
            {editorSubTab === 'chsettings' ? (
              <ChapterSettingsTab chapter={activeChapter} onCancel={() => setEditorSubTab('write')} />
            ) : null}
            {editorSubTab === 'novelsettings' ? (
              <NovelSettingsTab
                work={activeWork}
                chapters={chapters}
                onCancel={() => setEditorSubTab('write')}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="br-write-shell br-write-shell-discover br-write-page">
      <div className="br-write-tabsbar">
        <div className="br-write-tabsbar-inner">
          <WriterSearch query={writerQuery} onChange={setWriterQuery} />
          <StoreTabs<TopTab>
            tabs={TOP_TABS}
            active={topTab}
            onChange={changeTopTab}
            ariaLabel="Writer sections"
          />
        </div>
      </div>
      <div className="br-write-stage">
        {topTab === 'library' ? (
          <WriterLibrary
            works={filteredLibraryWorks}
            allWorks={mergedLibraryWorks}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            counts={libraryCounts}
            onAddWork={addWork}
            onOpenEditor={(id) => openEditorForWork(id, 'write')}
            onOpenSettings={(id) => openEditorForWork(id, 'novelsettings')}
            onOpenStorefront={(id) => openEditorForWork(id, 'novelsettings')}
            onPreview={previewWork}
          />
        ) : null}
        {topTab === 'analytics' ? <AnalyticsDashboard works={mergedLibraryWorks} /> : null}
        {topTab === 'audio' ? <AudioStub /> : null}
        {topTab === 'storefront' ? <PersonalStorefrontStub /> : null}
        {topTab === 'agentready' ? <AgentReadyStub /> : null}
        {topTab === 'community' ? <CommunityStub /> : null}
      </div>
    </div>
  );
}
