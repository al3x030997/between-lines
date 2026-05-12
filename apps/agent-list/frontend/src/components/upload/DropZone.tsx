'use client'

import { useRef, useState, type DragEvent } from 'react'

const ACCEPTED_EXT = '.csv,.tsv,.xlsx'
const MAX_SIZE = 20 * 1024 * 1024 // 20 MB

export default function DropZone({
  onFile,
  disabled,
}: {
  onFile: (file: File) => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = (file: File): boolean => {
    if (!file.name.match(/\.(csv|tsv|xlsx)$/i)) {
      setError('Only .csv, .tsv, and .xlsx files are supported.')
      return false
    }
    if (file.size > MAX_SIZE) {
      setError('File too large (max 20 MB).')
      return false
    }
    setError(null)
    return true
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file && validate(file)) onFile(file)
  }

  const handleChange = () => {
    const el = inputRef.current
    if (!el?.files?.[0]) return
    const file = el.files[0]
    if (validate(file)) onFile(file)
    el.value = ''
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-accent bg-accent/5' : 'border-border hover:border-muted'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <p className="text-base text-text">
          Drop your spreadsheet or <span className="text-accent">browse</span>
        </p>
        <p className="text-xs text-muted mt-2">.csv, .tsv, .xlsx — max 20 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  )
}
