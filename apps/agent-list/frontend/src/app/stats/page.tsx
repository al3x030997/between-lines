'use client'

import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { useSubmissions } from '@/hooks/useSubmissions'
import {
  STATUS_LABELS,
  SUBMISSION_STATUSES,
  type Submission,
  type SubmissionStatus,
} from '@/lib/types'

const RESPONSE_STATUSES: SubmissionStatus[] = [
  'partial_requested',
  'full_requested',
  'offer',
  'rejected',
]
const REQUEST_STATUSES: SubmissionStatus[] = ['partial_requested', 'full_requested', 'offer']

const PIE_COLORS = ['#a8a29e', '#78716c', '#f59e0b', '#fbbf24', '#fcd34d', '#4ade80', '#f87171', '#57534e']

export default function StatsPage() {
  const { submissions, loading } = useSubmissions()

  const tiles = useMemo(() => computeTiles(submissions), [submissions])
  const pieData = useMemo(() => buildPieData(submissions), [submissions])
  const lineData = useMemo(() => buildLineData(submissions), [submissions])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">
        <Spinner />
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <EmptyState
          title="No data yet"
          description="Stats appear once you have submissions in your list."
          action={
            <Link href="/">
              <Button>Import your list</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-heading)]">Stats</h1>
        <p className="text-xs text-muted mt-0.5">
          Computed from your submissions — updates instantly as the list changes.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile label="Queries sent" value={String(tiles.totalSent)} />
        <Tile label="Response rate" value={tiles.totalSent > 0 ? `${tiles.responseRate}%` : '—'} />
        <Tile label="Request rate" value={tiles.totalSent > 0 ? `${tiles.requestRate}%` : '—'} />
        <Tile
          label="Avg response time"
          value={tiles.avgDays !== null ? `${tiles.avgDays}d` : '—'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted mb-3">Status breakdown</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#292524',
                    border: '1px solid #44403c',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs mt-3">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-muted">{d.name}</span>
                <span className="ml-auto text-text">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wider text-muted mb-3">Queries by month</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#44403c" />
                <XAxis dataKey="label" stroke="#a8a29e" fontSize={11} />
                <YAxis stroke="#a8a29e" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#292524',
                    border: '1px solid #44403c',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="text-3xl font-[family-name:var(--font-heading)] mt-1">{value}</p>
    </Card>
  )
}

function computeTiles(submissions: Submission[]) {
  const sent = submissions.filter((s) => s.status !== 'researching' && s.status !== 'queued')
  const responded = sent.filter((s) =>
    RESPONSE_STATUSES.includes(s.status as SubmissionStatus) ||
    s.status === 'closed_no_response',
  )
  const responses = sent.filter((s) =>
    RESPONSE_STATUSES.includes(s.status as SubmissionStatus),
  )
  const requests = sent.filter((s) =>
    REQUEST_STATUSES.includes(s.status as SubmissionStatus),
  )
  const days: number[] = []
  sent.forEach((s) => {
    if (s.date_sent && s.date_responded) {
      const d = (new Date(s.date_responded).getTime() - new Date(s.date_sent).getTime()) / 86_400_000
      if (d >= 0) days.push(d)
    }
  })

  return {
    totalSent: sent.length,
    responseRate: sent.length === 0 ? 0 : Math.round((responses.length / sent.length) * 100),
    requestRate: sent.length === 0 ? 0 : Math.round((requests.length / sent.length) * 100),
    avgDays: days.length === 0 ? null : Math.round(days.reduce((a, b) => a + b, 0) / days.length),
    responded: responded.length,
  }
}

function buildPieData(submissions: Submission[]) {
  const counts: Record<SubmissionStatus, number> = Object.fromEntries(
    SUBMISSION_STATUSES.map((s) => [s, 0]),
  ) as Record<SubmissionStatus, number>
  submissions.forEach((s) => {
    counts[s.status as SubmissionStatus] = (counts[s.status as SubmissionStatus] ?? 0) + 1
  })
  return SUBMISSION_STATUSES
    .filter((s) => counts[s] > 0)
    .map((s) => ({ name: STATUS_LABELS[s], value: counts[s] }))
}

function buildLineData(submissions: Submission[]) {
  const buckets = new Map<string, number>()
  submissions.forEach((s) => {
    if (!s.date_sent) return
    const d = new Date(s.date_sent)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  })
  return Array.from(buckets.entries())
    .sort()
    .map(([key, count]) => {
      const [y, m] = key.split('-')
      const date = new Date(Number(y), Number(m) - 1, 1)
      return {
        label: date.toLocaleString(undefined, { month: 'short', year: '2-digit' }),
        count,
      }
    })
}
