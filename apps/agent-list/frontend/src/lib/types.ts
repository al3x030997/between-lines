export const SUBMISSION_STATUSES = [
  'researching',
  'queued',
  'submitted',
  'partial_requested',
  'full_requested',
  'offer',
  'rejected',
  'closed_no_response',
] as const

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number]

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  researching: 'Researching',
  queued: 'Queued',
  submitted: 'Submitted',
  partial_requested: 'Partial requested',
  full_requested: 'Full requested',
  offer: 'Offer',
  rejected: 'Rejected',
  closed_no_response: 'Closed (no response)',
}

export const MATERIAL_TYPES = ['query', 'synopsis', 'sample'] as const
export type MaterialType = (typeof MATERIAL_TYPES)[number]

export const MATERIAL_LABELS: Record<MaterialType, string> = {
  query: 'Query Letter',
  synopsis: 'Synopsis',
  sample: 'Sample Pages',
}

export const MATERIAL_BADGE_PREFIX: Record<MaterialType, string> = {
  query: 'Q',
  synopsis: 'S',
  sample: 'P',
}

export interface Submission {
  id: number
  agent_id: number | null
  manuscript_id: number | null
  agent_name: string
  agent_agency: string | null
  agent_email: string | null
  agent_genres: string[] | null
  status: SubmissionStatus
  date_sent: string | null
  date_responded: string | null
  query_version_id: number | null
  synopsis_version_id: number | null
  sample_version_id: number | null
  notes: string | null
  response_text: string | null
  created_at: string
  updated_at: string
}

export type SubmissionCreate = Partial<
  Omit<Submission, 'id' | 'created_at' | 'updated_at' | 'manuscript_id'>
> & {
  agent_name: string
  status?: SubmissionStatus
}

export type SubmissionUpdate = Partial<
  Omit<Submission, 'id' | 'created_at' | 'updated_at' | 'manuscript_id' | 'agent_id'>
>

export interface BulkImportError {
  row_index: number
  field: string | null
  message: string
}

export interface BulkImportResult {
  created: Submission[]
  errors: BulkImportError[]
}

export interface MaterialVersion {
  id: number
  type: MaterialType
  version_number: number
  content: string | null
  created_at: string
}

export interface DirectoryAgent {
  id: number
  name: string
  agency: string | null
  profile_url: string
  genres: string[] | null
  keywords: string[] | null
  audience: string[] | null
  hard_nos_keywords: string[] | null
  submission_req: Record<string, unknown> | null
  is_open: boolean | null
  review_status: string
  opted_out: boolean
}

export interface ManuscriptStub {
  id: number
  title: string
}
