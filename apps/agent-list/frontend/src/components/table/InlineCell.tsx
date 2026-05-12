'use client'

import { useEffect, useRef, useState } from 'react'

export function InlineText({
  value,
  onCommit,
  placeholder = '',
  className = '',
}: {
  value: string | null
  onCommit: (next: string | null) => void
  placeholder?: string
  className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(value ?? '')
  }, [value])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false)
          const trimmed = draft.trim()
          const next = trimmed === '' ? null : trimmed
          if (next !== value) onCommit(next)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
          if (e.key === 'Escape') {
            setDraft(value ?? '')
            setEditing(false)
          }
        }}
        className={`w-full h-full px-2 bg-bg text-text text-[13px] outline-none ring-1 ring-accent/60 ring-inset ${className}`}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={`w-full h-full text-left px-2 truncate text-[13px] ${
        value ? 'text-text' : 'text-muted/40'
      } ${className}`}
    >
      {value || placeholder || ''}
    </button>
  )
}

export function InlineDate({
  value,
  onCommit,
}: {
  value: string | null
  onCommit: (next: string | null) => void
}) {
  return (
    <input
      type="date"
      value={value ? value.slice(0, 10) : ''}
      onChange={(e) => {
        const v = e.target.value
        onCommit(v ? new Date(v).toISOString() : null)
      }}
      className="w-full h-full px-2 bg-transparent text-[13px] text-text outline-none focus:ring-1 focus:ring-accent/60 focus:ring-inset [color-scheme:dark]"
    />
  )
}
