import type { SubmissionStatus } from './types'
import { SUBMISSION_STATUSES } from './types'

export const CANONICAL_FIELDS = [
  'agent_name',
  'agent_agency',
  'agent_email',
  'agent_genres',
  'status',
  'date_sent',
  'date_responded',
  'notes',
] as const

export type CanonicalField = (typeof CANONICAL_FIELDS)[number]

export const FIELD_LABELS: Record<CanonicalField, string> = {
  agent_name: 'Agent name',
  agent_agency: 'Agency',
  agent_email: 'Email',
  agent_genres: 'Genres',
  status: 'Status',
  date_sent: 'Date sent',
  date_responded: 'Date responded',
  notes: 'Notes',
}

const FIELD_ALIASES: Record<CanonicalField, string[]> = {
  agent_name: ['agent', 'agentname', 'agent name', 'name', 'who'],
  agent_agency: ['agency', 'agencyname', 'firm'],
  agent_email: ['email', 'mail', 'contact', 'contactemail'],
  agent_genres: ['genre', 'genres', 'category', 'categories'],
  status: ['status', 'state', 'stage', 'phase'],
  date_sent: ['datesent', 'date sent', 'sent', 'sentdate', 'submitted', 'datesubmitted', 'datequeried', 'queried'],
  date_responded: ['dateresponded', 'date responded', 'response', 'responsedate', 'replied'],
  notes: ['notes', 'note', 'comment', 'comments', 'remarks'],
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const dp: number[] = Array(b.length + 1)
  for (let j = 0; j <= b.length; j++) dp[j] = j
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j]
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = tmp
    }
  }
  return dp[b.length]
}

function bestField(header: string): CanonicalField | null {
  const norm = normalize(header)
  if (!norm) return null
  let bestField: CanonicalField | null = null
  let bestScore = Infinity
  for (const field of CANONICAL_FIELDS) {
    const aliases = FIELD_ALIASES[field]
    for (const alias of aliases) {
      const aNorm = normalize(alias)
      if (norm === aNorm) return field
      // Allow short prefix matches (e.g. "Date" matching "date_sent" prefer date_sent)
      const dist = levenshtein(norm, aNorm)
      const tolerance = Math.max(1, Math.floor(aNorm.length * 0.25))
      if (dist <= tolerance && dist < bestScore) {
        bestScore = dist
        bestField = field
      }
    }
  }
  return bestField
}

export function autoMapHeaders(headers: string[]): Record<number, CanonicalField> {
  const mapping: Record<number, CanonicalField> = {}
  const used = new Set<CanonicalField>()
  headers.forEach((header, idx) => {
    const guess = bestField(header)
    if (guess && !used.has(guess)) {
      mapping[idx] = guess
      used.add(guess)
    }
  })
  return mapping
}

const STATUS_ALIASES: Record<string, SubmissionStatus> = {
  research: 'researching',
  researching: 'researching',
  queue: 'queued',
  queued: 'queued',
  submit: 'submitted',
  submitted: 'submitted',
  sent: 'submitted',
  query: 'submitted',
  queried: 'submitted',
  partial: 'partial_requested',
  partialrequested: 'partial_requested',
  full: 'full_requested',
  fullrequested: 'full_requested',
  offer: 'offer',
  reject: 'rejected',
  rejected: 'rejected',
  pass: 'rejected',
  closed: 'closed_no_response',
  cnr: 'closed_no_response',
  closednoresponse: 'closed_no_response',
}

export function normalizeStatus(value: string): SubmissionStatus | null {
  const norm = normalize(value)
  if (!norm) return null
  if ((SUBMISSION_STATUSES as readonly string[]).includes(norm)) {
    return norm as SubmissionStatus
  }
  return STATUS_ALIASES[norm] ?? null
}

export function parseDate(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const d = new Date(trimmed)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export function parseGenres(value: string): string[] | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed
    .split(/[,;|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}
