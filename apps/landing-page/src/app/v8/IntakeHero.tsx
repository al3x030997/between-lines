'use client';

import { useState } from 'react';
import ReaderForm, { READER_INITIAL, type ReaderAnswers } from './intake/ReaderForm';
import WriterForm, { WRITER_INITIAL, type WriterAnswers } from './intake/WriterForm';
import { INTAKE_CSS } from './intake/intakeCss';

export type IntakeRegion = 'reader' | 'writer';
export type ReaderIntent = 'later' | 'now';

export type IntakeSubmit =
  | { region: 'reader'; intent: ReaderIntent; answers: ReaderAnswers }
  | { region: 'writer'; answers: WriterAnswers };

type Props = {
  initialMode?: IntakeRegion;
  onBack?: () => void;
  onSubmit: (payload: IntakeSubmit) => void;
};

export default function IntakeHero({ initialMode = 'reader', onBack, onSubmit }: Props) {
  const [mode, setMode] = useState<IntakeRegion>(initialMode);
  const [readerAnswers, setReaderAnswers] = useState<ReaderAnswers>(READER_INITIAL);
  const [writerAnswers, setWriterAnswers] = useState<WriterAnswers>(WRITER_INITIAL);

  const handleReaderSubmit = (intent: ReaderIntent) =>
    onSubmit({ region: 'reader', intent, answers: readerAnswers });

  const handleWriterSubmit = () =>
    onSubmit({ region: 'writer', answers: writerAnswers });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: INTAKE_CSS }} />
      <div className="v8-intake" role="region" aria-label="Get started">
        {onBack && (
          <button type="button" className="v8-intake-back" onClick={onBack}>
            <span aria-hidden="true">←</span> back
          </button>
        )}
        <div
          className={`v8-intake-toggle${mode === 'reader' ? ' is-reader' : ''}`}
          role="tablist"
          aria-label="Choose your path"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'writer'}
            className={`v8-intake-toggle-btn${mode === 'writer' ? ' is-active' : ''}`}
            onClick={() => setMode('writer')}
          >
            I&rsquo;m writer first
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'reader'}
            className={`v8-intake-toggle-btn${mode === 'reader' ? ' is-active' : ''}`}
            onClick={() => setMode('reader')}
          >
            I&rsquo;m reader first
          </button>
          <span className="v8-intake-toggle-bar" aria-hidden="true" />
        </div>

        <div className="v8-intake-formslot" key={mode}>
          {mode === 'reader' ? (
            <ReaderForm
              answers={readerAnswers}
              onChange={setReaderAnswers}
              onSubmit={handleReaderSubmit}
            />
          ) : (
            <WriterForm
              answers={writerAnswers}
              onChange={setWriterAnswers}
              onSubmit={handleWriterSubmit}
            />
          )}
        </div>
      </div>
    </>
  );
}
