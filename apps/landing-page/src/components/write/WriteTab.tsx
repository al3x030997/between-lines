'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Chapter } from '@/lib/mock-books';
import type { NudgeReason } from '@/components/SignupNudge';
import { PreviewOverlay } from './PreviewOverlay';

type Props = {
  workTitle: string;
  /** Byline shown in the preview overlay, e.g. "@handle" or "Your pen name". */
  authorLabel?: string;
  /** Place the cursor in the pad on mount when the chapter is empty (new writer). */
  autoFocus?: boolean;
  chapter: Chapter | null;
  onTitleEdit: (title: string) => void;
  /**
   * When set (the logged-out /write landing editor), the Save / Preview /
   * Publish actions become sign-up hooks: instead of their in-app behaviour
   * they open the sign-up nudge with the given reason. Omitted in the real
   * Studio, where the buttons keep their normal behaviour.
   */
  onGuestNudge?: (reason: NudgeReason) => void;
};

export function WriteTab({ workTitle, authorLabel = 'Your pen name', autoFocus = false, chapter, onTitleEdit, onGuestNudge }: Props) {
  const padRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [autosave, setAutosave] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [toast, setToast] = useState<string | null>(null);

  // Reset pad when chapter changes
  useEffect(() => {
    if (!padRef.current) return;
    if (chapter?.body) {
      padRef.current.innerHTML = chapter.body;
    } else {
      padRef.current.innerHTML = '';
      // A new writer's cursor should already be in the page, ready to type.
      if (autoFocus) padRef.current.focus();
    }
    recountWords();
  }, [chapter?.slug, autoFocus]);

  const recountWords = useCallback(() => {
    const text = padRef.current?.innerText ?? '';
    setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
  }, []);

  const autosaveTimers = useRef<{ saving: ReturnType<typeof setTimeout> | null; fade: ReturnType<typeof setTimeout> | null }>({ saving: null, fade: null });

  const onPadInput = useCallback(() => {
    recountWords();
    setAutosave('saving');
    if (autosaveTimers.current.saving) clearTimeout(autosaveTimers.current.saving);
    if (autosaveTimers.current.fade) clearTimeout(autosaveTimers.current.fade);
    autosaveTimers.current.saving = setTimeout(() => {
      setAutosave('saved');
      autosaveTimers.current.fade = setTimeout(() => setAutosave('idle'), 1800);
    }, 1100);
  }, [recountWords]);

  const fmt = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    padRef.current?.focus();
  }, []);

  const onFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result ?? '');
      if (padRef.current) padRef.current.innerText = text;
      recountWords();
    };
    reader.readAsText(f);
  }, [recountWords]);

  const onPublish = useCallback(() => {
    if (onGuestNudge) {
      onGuestNudge('publish');
      return;
    }
    setToast('Chapter published — visible to your beta readers now');
    setTimeout(() => setToast(null), 2400);
  }, [onGuestNudge]);

  const onSaveDraft = useCallback(() => {
    if (onGuestNudge) onGuestNudge('draft');
  }, [onGuestNudge]);

  const onPreview = useCallback(() => {
    if (onGuestNudge) {
      onGuestNudge('draft');
      return;
    }
    setPreviewOpen(true);
  }, [onGuestNudge]);

  return (
    <div className="br-write-pad-wrap">
      <div className="br-write-topbar">
        <label style={{ flexShrink: 0 }}>
          <input
            type="file"
            accept=".txt,.md"
            style={{ display: 'none' }}
            onChange={onFileUpload}
          />
          <span
            className="br-write-btn-sm"
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement | null;
              input?.click();
            }}
            style={{ cursor: 'pointer' }}
          >
            📄 Upload file
          </span>
        </label>
        <span style={{ flex: 1 }} />
        <button type="button" className="br-write-btn-sm" onClick={onSaveDraft}>Save as draft</button>
        <button type="button" className="br-write-btn-sm" onClick={onPreview}>Preview</button>
        <button type="button" className="br-write-btn-sm is-primary" onClick={onPublish}>Publish</button>
      </div>
      <div className="br-write-fmtbar">
        <button type="button" className="br-write-fmtbtn" style={{ fontWeight: 700 }} onClick={() => fmt('bold')} aria-label="Bold">B</button>
        <button type="button" className="br-write-fmtbtn" style={{ fontStyle: 'italic' }} onClick={() => fmt('italic')} aria-label="Italic">I</button>
        <button type="button" className="br-write-fmtbtn" style={{ textDecoration: 'underline' }} onClick={() => fmt('underline')} aria-label="Underline">U</button>
        <button type="button" className="br-write-fmtbtn" style={{ fontSize: 10, fontWeight: 700 }} onClick={() => fmt('formatBlock', 'h2')} aria-label="Heading">H2</button>
        <button type="button" className="br-write-fmtbtn" style={{ fontSize: 14 }} onClick={() => fmt('formatBlock', 'blockquote')} aria-label="Quote">&ldquo;</button>
        <button type="button" className="br-write-fmtbtn" style={{ fontSize: 13 }} onClick={() => fmt('insertUnorderedList')} aria-label="List">☰</button>
        <div className="br-write-fmtdiv" />
        <button type="button" className="br-write-fmtbtn" onClick={() => fmt('undo')} aria-label="Undo">↩</button>
        <button type="button" className="br-write-fmtbtn" onClick={() => fmt('redo')} aria-label="Redo">↪</button>
        <div className="br-write-fmtsep" />
        <span className={`br-write-autosave ${autosave === 'idle' ? '' : 'is-on'}`}>
          {autosave === 'saving' ? 'Saving…' : autosave === 'saved' ? 'Saved' : ''}
        </span>
        <span className="br-write-wc">{wordCount.toLocaleString()} word{wordCount === 1 ? '' : 's'}</span>
      </div>
      <div className="br-write-pad-scroll">
        <div
          ref={padRef}
          className="br-write-pad"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Paste or write your chapter here — or upload a file above..."
          onInput={onPadInput}
          spellCheck
          aria-label="Chapter content"
          role="textbox"
        />
      </div>

      <PreviewOverlay
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        mode={previewMode}
        onModeChange={setPreviewMode}
        eyebrow={`${workTitle} · ${authorLabel}`}
        title={chapter?.title ?? 'Chapter'}
        bodyHtml={padRef.current?.innerHTML ?? ''}
      />

      {toast ? (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--theme-strong-cta-bg)',
            color: 'var(--theme-strong-cta-fg)',
            padding: '12px 22px',
            borderRadius: 10,
            boxShadow: 'var(--br-shadow-pop)',
            fontSize: 13,
            zIndex: 400,
          }}
        >
          {toast}
        </div>
      ) : null}
      {/* keep onTitleEdit accessible to future use */}
      <span style={{ display: 'none' }} aria-hidden onClick={() => onTitleEdit('')} />
    </div>
  );
}
