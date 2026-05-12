'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import StatusGroup from '@/components/table/StatusGroup'
import FilterBar, { type FilterState } from '@/components/table/FilterBar'
import MaterialsBadges from '@/components/table/MaterialsBadges'
import MaterialPickerModal from '@/components/materials/MaterialPickerModal'
import { InlineText, InlineDate } from '@/components/table/InlineCell'
import { useSubmissions } from '@/hooks/useSubmissions'
import { useAllMaterials } from '@/hooks/useAllMaterials'
import {
  SUBMISSION_STATUSES,
  type Submission,
  type SubmissionStatus,
  type SubmissionUpdate,
} from '@/lib/types'

const GRID =
  'grid grid-cols-[minmax(180px,1.4fr)_minmax(140px,1.1fr)_110px_64px_110px_minmax(160px,2fr)_28px]'

export default function TablePage() {
  const { submissions, loading, create, update, remove } = useSubmissions()
  const { byId: versionByMaterialId } = useAllMaterials()
  const [filters, setFilters] = useState<FilterState>({ agency: '', genre: '', q: '' })
  const [addingFor, setAddingFor] = useState<SubmissionStatus | null>(null)
  const [pickerFor, setPickerFor] = useState<Submission | null>(null)

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase().trim()
    return submissions.filter((s) => {
      if (q) {
        const haystack = [s.agent_name, s.agent_agency, s.notes]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [submissions, filters])

  const groups = useMemo(() => {
    const map: Record<SubmissionStatus, Submission[]> = Object.fromEntries(
      SUBMISSION_STATUSES.map((s) => [s, [] as Submission[]]),
    ) as Record<SubmissionStatus, Submission[]>
    filtered.forEach((s) => {
      map[s.status as SubmissionStatus]?.push(s)
    })
    Object.keys(map).forEach((k) => {
      map[k as SubmissionStatus].sort((a, b) => {
        const aDate = a.date_sent || a.created_at
        const bDate = b.date_sent || b.created_at
        return aDate < bDate ? 1 : -1
      })
    })
    return map
  }, [filtered])

  if (loading) {
    return (
      <div className="px-6 py-10 text-center text-muted">
        <Spinner /> <span className="ml-2 text-sm">Loading…</span>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <EmptyState
          title="No submissions yet"
          description="Import a spreadsheet to bring in your existing list, or add agents from the directory."
          action={
            <div className="flex justify-center gap-2">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-md text-sm bg-accent text-stone-900 hover:bg-accent-hover"
              >
                Import spreadsheet
              </Link>
              <Link
                href="/directory"
                className="px-3 py-1.5 rounded-md text-sm border border-border text-text hover:bg-surface"
              >
                Browse directory
              </Link>
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-6xl">
      <div className="flex items-baseline justify-between mb-1">
        <h1 className="text-xl text-text font-[family-name:var(--font-heading)]">
          Submissions
        </h1>
        <Link href="/" className="text-[12px] text-muted hover:text-text">
          Import more
        </Link>
      </div>
      <p className="text-[11px] text-muted mb-3">
        Grouped by status · {filtered.length} of {submissions.length} records
      </p>

      <FilterBar value={filters} agencies={[]} genres={[]} onChange={setFilters} />

      {/* Sticky column-header row */}
      <div
        className={`${GRID} sticky top-12 lg:top-0 z-20 bg-bg border-b border-border/60 text-[10px] uppercase tracking-wider text-muted/80`}
      >
        <HeaderCell>Agent</HeaderCell>
        <HeaderCell>Agency</HeaderCell>
        <HeaderCell>Sent</HeaderCell>
        <HeaderCell align="right">Days</HeaderCell>
        <HeaderCell>Materials</HeaderCell>
        <HeaderCell>Notes</HeaderCell>
        <HeaderCell />
      </div>

      <div className="divide-y divide-border/30">
        {SUBMISSION_STATUSES.map((status) => {
          const rows = groups[status]
          if (rows.length === 0 && addingFor !== status) return null
          return (
            <StatusGroup
              key={status}
              status={status}
              count={rows.length}
              defaultOpen={rows.length > 0 && status !== 'closed_no_response'}
              rightSlot={
                <button
                  onClick={() => setAddingFor(status)}
                  className="text-[11px] text-muted hover:text-text px-1.5 py-0.5"
                >
                  + Add
                </button>
              }
            >
              <SubmissionRows
                rows={rows}
                versionByMaterialId={versionByMaterialId}
                onUpdate={update}
                onDelete={remove}
                onPickMaterials={setPickerFor}
              />
              {addingFor === status && (
                <AddRecordRow
                  onCancel={() => setAddingFor(null)}
                  onSubmit={async (data) => {
                    await create({ ...data, status })
                    setAddingFor(null)
                  }}
                />
              )}
            </StatusGroup>
          )
        })}
      </div>

      <MaterialPickerModal
        open={pickerFor !== null}
        onClose={() => setPickerFor(null)}
        submission={pickerFor}
        onSave={async (id, patch) => {
          await update(id, patch)
        }}
      />
    </div>
  )
}

function SubmissionRows({
  rows,
  versionByMaterialId,
  onUpdate,
  onDelete,
  onPickMaterials,
}: {
  rows: Submission[]
  versionByMaterialId: Map<number, number>
  onUpdate: (id: number, patch: SubmissionUpdate) => Promise<unknown>
  onDelete: (id: number) => Promise<void>
  onPickMaterials: (submission: Submission) => void
}) {
  if (rows.length === 0) return null
  return (
    <>
      {rows.map((row) => (
        <div
          key={row.id}
          className={`${GRID} h-9 border-t border-border/20 group hover:bg-surface/40`}
        >
          <Cell>
            <InlineText
              value={row.agent_name}
              onCommit={(v) => v && onUpdate(row.id, { agent_name: v })}
              className="font-medium"
            />
          </Cell>
          <Cell>
            <InlineText
              value={row.agent_agency}
              onCommit={(v) => onUpdate(row.id, { agent_agency: v })}
            />
          </Cell>
          <Cell>
            <InlineDate
              value={row.date_sent}
              onCommit={(v) => onUpdate(row.id, { date_sent: v })}
            />
          </Cell>
          <Cell className="justify-end pr-3 text-[12px] text-muted">{daysOut(row)}</Cell>
          <Cell padded>
            <button
              onClick={() => onPickMaterials(row)}
              className="px-1 py-0.5 rounded hover:bg-surface"
              title="Link materials"
            >
              <MaterialsBadges submission={row} versionByMaterialId={versionByMaterialId} />
            </button>
          </Cell>
          <Cell>
            <InlineText
              value={row.notes}
              onCommit={(v) => onUpdate(row.id, { notes: v })}
            />
          </Cell>
          <Cell className="justify-center">
            <button
              onClick={() => {
                if (confirm(`Delete submission for ${row.agent_name}?`)) onDelete(row.id)
              }}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-rose-400 text-sm leading-none"
              title="Delete"
            >
              ×
            </button>
          </Cell>
        </div>
      ))}
    </>
  )
}

function AddRecordRow({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void
  onSubmit: (data: { agent_name: string; agent_agency: string | null }) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [agency, setAgency] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({
        agent_name: name.trim(),
        agent_agency: agency.trim() || null,
      })
      setName('')
      setAgency('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className={`${GRID} h-9 border-t border-border/20 bg-surface/30`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') submit()
        if (e.key === 'Escape') onCancel()
      }}
    >
      <Cell>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Agent name"
          className="w-full h-full px-2 bg-transparent text-[13px] text-text outline-none focus:ring-1 focus:ring-accent/60 focus:ring-inset placeholder:text-muted/50"
        />
      </Cell>
      <Cell>
        <input
          value={agency}
          onChange={(e) => setAgency(e.target.value)}
          placeholder="Agency"
          className="w-full h-full px-2 bg-transparent text-[13px] text-text outline-none focus:ring-1 focus:ring-accent/60 focus:ring-inset placeholder:text-muted/50"
        />
      </Cell>
      <Cell />
      <Cell />
      <Cell padded>
        <div className="flex items-center gap-2">
          <button
            onClick={submit}
            disabled={!name.trim() || submitting}
            className="px-2 py-0.5 rounded text-[11px] bg-accent text-stone-900 hover:bg-accent-hover disabled:opacity-40"
          >
            Add
          </button>
          <button
            onClick={onCancel}
            className="text-[11px] text-muted hover:text-text"
          >
            Cancel
          </button>
        </div>
      </Cell>
      <Cell />
      <Cell />
    </div>
  )
}

function Cell({
  children,
  className = '',
  padded = false,
}: {
  children?: React.ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <div
      className={`flex items-center min-w-0 ${padded ? 'px-2' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

function HeaderCell({
  children,
  align = 'left',
}: {
  children?: React.ReactNode
  align?: 'left' | 'right'
}) {
  return (
    <div
      className={`flex items-center px-2 h-8 ${align === 'right' ? 'justify-end' : ''}`}
    >
      {children && <span>{children}</span>}
    </div>
  )
}

function daysOut(row: Submission): string {
  if (!row.date_sent) return '—'
  const sent = new Date(row.date_sent)
  const end = row.date_responded ? new Date(row.date_responded) : new Date()
  const days = Math.max(0, Math.floor((end.getTime() - sent.getTime()) / 86_400_000))
  return `${days}d`
}
