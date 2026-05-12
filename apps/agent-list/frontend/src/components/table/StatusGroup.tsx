'use client'

import { useState, type ReactNode } from 'react'
import StatusPill from './StatusPill'
import type { SubmissionStatus } from '@/lib/types'

export default function StatusGroup({
  status,
  count,
  children,
  rightSlot,
  defaultOpen = true,
}: {
  status: SubmissionStatus
  count: number
  children: ReactNode
  rightSlot?: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <div
        className="flex items-center justify-between py-2 cursor-pointer select-none group"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <ChevronIcon
            className={`w-3 h-3 text-muted/70 transition-transform ${open ? 'rotate-90' : ''}`}
          />
          <StatusPill status={status} withDot />
          <span className="text-[11px] text-muted">{count}</span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>{rightSlot}</div>
      </div>
      {open && children}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
