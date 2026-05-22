'use client';

import { useRef } from 'react';

export type FileSlot = {
  file: File | null;
  error: string | null;
};

type Props = {
  slot: FileSlot;
  onChange: (next: FileSlot) => void;
  accept: string[];
  maxMB: number;
  /** Short label, e.g. "Upload your draft". */
  title?: string;
  /** Sub-text below the title when empty; defaults to accept list + size. */
  subtitle?: string;
};

export default function FileDrop({
  slot,
  onChange,
  accept,
  maxMB,
  title,
  subtitle,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const maxBytes = maxMB * 1024 * 1024;

  const handle = (file: File | null) => {
    if (!file) {
      onChange({ file: null, error: null });
      return;
    }
    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    if (!accept.includes(ext)) {
      onChange({
        file: null,
        error: `Unsupported format. Try ${accept.join(', ')}`,
      });
      return;
    }
    if (file.size > maxBytes) {
      onChange({
        file: null,
        error: `File is over ${maxMB} MB. Trim and try again.`,
      });
      return;
    }
    onChange({ file, error: null });
  };

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const hasFile = !!slot.file;
  const hasError = !!slot.error;
  const displayTitle = title ?? 'Choose a file to upload';
  const displaySub = subtitle ?? `${accept.join(' · ')} · up to ${maxMB} MB`;

  return (
    <div className="v8-upload">
      <label
        className={`v8-upload-dropzone${hasFile ? ' has-file' : ''}${hasError ? ' has-error' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(',')}
          hidden
          onChange={(e) => handle(e.target.files?.[0] ?? null)}
        />
        <span className="v8-upload-text">
          <span className="v8-upload-title">
            {slot.file ? slot.file.name : displayTitle}
          </span>
          <span className="v8-upload-sub">
            {slot.file ? fmtSize(slot.file.size) : displaySub}
          </span>
        </span>
        <span className="v8-upload-icon" aria-hidden="true">
          {slot.file ? '✓' : '↑'}
        </span>
      </label>
      {slot.error && (
        <span className="v8-upload-error" role="alert">
          {slot.error}
        </span>
      )}
      {slot.file && (
        <button
          type="button"
          className="v8-upload-clear"
          onClick={() => {
            if (inputRef.current) inputRef.current.value = '';
            handle(null);
          }}
        >
          Remove
        </button>
      )}
    </div>
  );
}
