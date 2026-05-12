'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import DropZone from '@/components/upload/DropZone'
import ColumnMapper from '@/components/upload/ColumnMapper'
import ValidationReview, {
  type PreviewRow,
  type RowIssue,
} from '@/components/upload/ValidationReview'
import { parseCsv } from '@/lib/csv'
import { parseXlsx } from '@/lib/xlsx'
import {
  CANONICAL_FIELDS,
  FIELD_LABELS,
  autoMapHeaders,
  normalizeStatus,
  parseDate,
  parseGenres,
  type CanonicalField,
} from '@/lib/columnMapping'
import { listApi, ApiError } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import type { SubmissionCreate } from '@/lib/types'

type Step = 'upload' | 'map' | 'review' | 'importing' | 'done'

interface RawTable {
  filename: string
  headers: string[]
  rows: string[][]
}

export default function UploadPage() {
  const router = useRouter()
  const toast = useToast()
  const [step, setStep] = useState<Step>('upload')
  const [parsing, setParsing] = useState(false)
  const [raw, setRaw] = useState<RawTable | null>(null)
  const [mapping, setMapping] = useState<Record<number, CanonicalField>>({})
  const [rows, setRows] = useState<PreviewRow[]>([])

  const handleFile = async (file: File) => {
    setParsing(true)
    try {
      let parsed
      if (file.name.toLowerCase().endsWith('.xlsx')) {
        parsed = await parseXlsx(file)
      } else {
        const text = await file.text()
        parsed = parseCsv(text)
      }
      if (parsed.headers.length === 0) {
        toast.error('Empty file — no headers found.')
        return
      }
      setRaw({ filename: file.name, headers: parsed.headers, rows: parsed.rows })
      setMapping(autoMapHeaders(parsed.headers))
      setStep('map')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to parse file')
    } finally {
      setParsing(false)
    }
  }

  const proceedToReview = () => {
    if (!raw) return
    if (!Object.values(mapping).includes('agent_name')) {
      toast.error('Map at least the Agent name column to continue.')
      return
    }
    const previewed = raw.rows.map((row) => buildPreviewRow(row, mapping))
    setRows(previewed)
    setStep('review')
  }

  const issues = useMemo<RowIssue[]>(() => {
    return rows.flatMap<RowIssue>((row, idx) => {
      const out: RowIssue[] = []
      if (!row.agent_name?.trim()) {
        out.push({ rowIndex: idx, field: 'agent_name', message: 'Missing agent name', severity: 'error' })
      }
      if (row.rawStatus && row.status === 'researching' && row.rawStatus.trim()) {
        if (!normalizeStatus(row.rawStatus)) {
          out.push({
            rowIndex: idx,
            field: 'status',
            message: `Unknown status "${row.rawStatus}" → researching`,
            severity: 'warning',
          })
        }
      }
      if (row.rawDateSent && !row.date_sent) {
        out.push({
          rowIndex: idx,
          field: 'date_sent',
          message: `Bad date "${row.rawDateSent}"`,
          severity: 'error',
        })
      }
      if (row.rawDateResponded && !row.date_responded) {
        out.push({
          rowIndex: idx,
          field: 'date_responded',
          message: `Bad date "${row.rawDateResponded}"`,
          severity: 'error',
        })
      }
      return out
    }).concat(duplicateIssues(rows))
  }, [rows])

  const errorCount = issues.filter((i) => i.severity === 'error').length

  const updateRow = (idx: number, patch: Partial<PreviewRow>) => {
    setRows((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], ...patch }
      // Clear raw markers once user edited the corresponding field
      if ('status' in patch) next[idx].rawStatus = undefined
      if ('date_sent' in patch) next[idx].rawDateSent = undefined
      if ('date_responded' in patch) next[idx].rawDateResponded = undefined
      return next
    })
  }

  const commit = async () => {
    if (errorCount > 0) {
      toast.error(`Resolve ${errorCount} error${errorCount === 1 ? '' : 's'} before importing.`)
      return
    }
    setStep('importing')
    const payload: SubmissionCreate[] = rows
      .filter((r) => r.agent_name?.trim())
      .map((r) => ({
        agent_name: r.agent_name.trim(),
        agent_agency: r.agent_agency,
        agent_email: r.agent_email,
        agent_genres: r.agent_genres,
        status: r.status,
        date_sent: r.date_sent,
        date_responded: r.date_responded,
        notes: r.notes,
      }))
    try {
      const result = await listApi.submissions.bulk(payload)
      if (result.errors.length) {
        toast.error(
          `Imported ${result.created.length}, skipped ${result.errors.length} row(s) with server-side errors.`,
        )
      } else {
        toast.success(`Imported ${result.created.length} submission(s).`)
      }
      router.push('/table')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Import failed')
      setStep('review')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-heading)]">Import your list</h1>
        <p className="text-sm text-muted mt-1">
          Drop your spreadsheet to bring every query into one place. Or skip it and start empty.
        </p>
      </div>

      {step === 'upload' && (
        <Card className="space-y-4">
          {parsing ? (
            <div className="text-center py-12">
              <Spinner /> <span className="ml-2 text-sm text-muted">Parsing…</span>
            </div>
          ) : (
            <DropZone onFile={handleFile} />
          )}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-xs text-muted">
              Supports .csv, .tsv, .xlsx — first row should be headers.
            </p>
            <Button variant="ghost" onClick={() => router.push('/table')}>
              Skip and start empty →
            </Button>
          </div>
        </Card>
      )}

      {step === 'map' && raw && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text font-medium">{raw.filename}</p>
              <p className="text-xs text-muted">
                {raw.rows.length} row{raw.rows.length === 1 ? '' : 's'} · {raw.headers.length} columns
              </p>
            </div>
            <Button variant="ghost" onClick={() => setStep('upload')}>
              ← Pick a different file
            </Button>
          </div>
          <ColumnMapper
            headers={raw.headers}
            sampleRow={raw.rows[0] ?? null}
            mapping={mapping}
            onChange={(idx, field) => {
              setMapping((prev) => {
                const next = { ...prev }
                if (field === null) {
                  delete next[idx]
                } else {
                  // Remove this field from any other column
                  for (const key of Object.keys(next)) {
                    if (next[Number(key)] === field) delete next[Number(key)]
                  }
                  next[idx] = field
                }
                return next
              })
            }}
          />
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border text-xs">
            {CANONICAL_FIELDS.map((f) => {
              const mapped = Object.values(mapping).includes(f)
              return (
                <Badge key={f} tone={mapped ? 'accent' : 'muted'}>
                  {FIELD_LABELS[f]}
                  {mapped ? '' : ' — unmapped'}
                </Badge>
              )
            })}
          </div>
          <div className="flex justify-end pt-3 border-t border-border">
            <Button onClick={proceedToReview}>Review {raw.rows.length} row{raw.rows.length === 1 ? '' : 's'} →</Button>
          </div>
        </Card>
      )}

      {step === 'review' && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {rows.length} row{rows.length === 1 ? '' : 's'} ready
              {errorCount > 0 && (
                <span className="ml-2 text-red-400">
                  · {errorCount} error{errorCount === 1 ? '' : 's'} to resolve
                </span>
              )}
            </p>
            <Button variant="ghost" onClick={() => setStep('map')}>
              ← Back to mapping
            </Button>
          </div>
          <ValidationReview rows={rows} issues={issues} onChange={updateRow} />
          <div className="flex justify-end pt-3 border-t border-border">
            <Button onClick={commit} disabled={errorCount > 0}>
              Import {rows.length} submission{rows.length === 1 ? '' : 's'}
            </Button>
          </div>
        </Card>
      )}

      {step === 'importing' && (
        <Card>
          <div className="text-center py-12">
            <Spinner />
            <p className="text-sm text-muted mt-3">Importing…</p>
          </div>
        </Card>
      )}
    </div>
  )
}

function buildPreviewRow(rawRow: string[], mapping: Record<number, CanonicalField>): PreviewRow {
  const get = (field: CanonicalField): string => {
    const idx = Object.entries(mapping).find(([, f]) => f === field)?.[0]
    if (idx === undefined) return ''
    return rawRow[Number(idx)] ?? ''
  }

  const rawStatus = get('status').trim()
  const rawSent = get('date_sent').trim()
  const rawResp = get('date_responded').trim()
  const status = normalizeStatus(rawStatus) ?? 'researching'

  return {
    agent_name: get('agent_name').trim(),
    agent_agency: get('agent_agency').trim() || null,
    agent_email: get('agent_email').trim() || null,
    agent_genres: parseGenres(get('agent_genres')),
    status,
    date_sent: parseDate(rawSent),
    date_responded: parseDate(rawResp),
    notes: get('notes').trim() || null,
    rawStatus: rawStatus || undefined,
    rawDateSent: rawSent || undefined,
    rawDateResponded: rawResp || undefined,
  }
}

function duplicateIssues(rows: PreviewRow[]): RowIssue[] {
  const seen = new Map<string, number>()
  const issues: RowIssue[] = []
  rows.forEach((row, idx) => {
    const key = `${row.agent_name.toLowerCase().trim()}|${(row.agent_agency || '').toLowerCase().trim()}`
    if (!row.agent_name.trim()) return
    const prior = seen.get(key)
    if (prior !== undefined) {
      issues.push({
        rowIndex: idx,
        field: 'agent_name',
        message: `Duplicate of row ${prior + 1}`,
        severity: 'warning',
      })
    } else {
      seen.set(key, idx)
    }
  })
  return issues
}
