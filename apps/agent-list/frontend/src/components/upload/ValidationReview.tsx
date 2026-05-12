'use client'

import Badge from '@/components/ui/Badge'
import { TextInput, Select } from '@/components/ui/Input'
import { SUBMISSION_STATUSES, STATUS_LABELS, type SubmissionStatus } from '@/lib/types'

export interface PreviewRow {
  agent_name: string
  agent_agency: string | null
  agent_email: string | null
  agent_genres: string[] | null
  status: SubmissionStatus
  date_sent: string | null
  date_responded: string | null
  notes: string | null
  // raw values used in error messages — not posted
  rawStatus?: string
  rawDateSent?: string
  rawDateResponded?: string
}

export interface RowIssue {
  rowIndex: number
  field: keyof PreviewRow
  message: string
  severity: 'error' | 'warning'
}

interface Props {
  rows: PreviewRow[]
  issues: RowIssue[]
  onChange: (idx: number, patch: Partial<PreviewRow>) => void
}

export default function ValidationReview({ rows, issues, onChange }: Props) {
  const issuesByRow = issues.reduce<Record<number, RowIssue[]>>((acc, issue) => {
    ;(acc[issue.rowIndex] ??= []).push(issue)
    return acc
  }, {})

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border">
          <tr>
            <th className="py-2 pr-3 font-medium">Agent</th>
            <th className="py-2 pr-3 font-medium">Agency</th>
            <th className="py-2 pr-3 font-medium">Status</th>
            <th className="py-2 pr-3 font-medium">Sent</th>
            <th className="py-2 pr-3 font-medium">Responded</th>
            <th className="py-2 pr-3 font-medium">Issues</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const rowIssues = issuesByRow[idx] || []
            const hasError = rowIssues.some((i) => i.severity === 'error')
            return (
              <tr
                key={idx}
                className={`border-b border-border/40 ${hasError ? 'bg-red-500/5' : ''}`}
              >
                <td className="py-2 pr-3">
                  <TextInput
                    value={row.agent_name}
                    onChange={(e) => onChange(idx, { agent_name: e.target.value })}
                    className="text-xs py-1"
                  />
                </td>
                <td className="py-2 pr-3">
                  <TextInput
                    value={row.agent_agency ?? ''}
                    onChange={(e) =>
                      onChange(idx, { agent_agency: e.target.value || null })
                    }
                    className="text-xs py-1"
                  />
                </td>
                <td className="py-2 pr-3">
                  <Select
                    value={row.status}
                    onChange={(e) =>
                      onChange(idx, { status: e.target.value as SubmissionStatus })
                    }
                    className="text-xs py-1"
                  >
                    {SUBMISSION_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="py-2 pr-3">
                  <TextInput
                    type="date"
                    value={isoToDateInput(row.date_sent)}
                    onChange={(e) =>
                      onChange(idx, {
                        date_sent: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null,
                      })
                    }
                    className="text-xs py-1"
                  />
                </td>
                <td className="py-2 pr-3">
                  <TextInput
                    type="date"
                    value={isoToDateInput(row.date_responded)}
                    onChange={(e) =>
                      onChange(idx, {
                        date_responded: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null,
                      })
                    }
                    className="text-xs py-1"
                  />
                </td>
                <td className="py-2 pr-3">
                  <div className="flex flex-col gap-1">
                    {rowIssues.length === 0 ? (
                      <span className="text-muted">OK</span>
                    ) : (
                      rowIssues.map((issue, i) => (
                        <Badge
                          key={i}
                          tone={issue.severity === 'error' ? 'danger' : 'warning'}
                        >
                          {issue.message}
                        </Badge>
                      ))
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function isoToDateInput(iso: string | null): string {
  if (!iso) return ''
  return iso.slice(0, 10)
}
