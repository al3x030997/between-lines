import sampleAgentsData from '@/data/sampleAgents.json'
import { localStore } from './localStore'
import type {
  BulkImportResult,
  DirectoryAgent,
  ManuscriptStub,
  MaterialType,
  MaterialVersion,
  Submission,
  SubmissionCreate,
  SubmissionUpdate,
} from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const SAMPLE_AGENTS = sampleAgentsData as DirectoryAgent[]

function filterSampleAgents(params: {
  genre?: string
  q?: string
  limit?: number
  offset?: number
}): DirectoryAgent[] {
  const q = params.q?.toLowerCase().trim()
  let rows = SAMPLE_AGENTS
  if (params.genre) {
    rows = rows.filter((a) =>
      a.genres?.some((g) => g.toLowerCase() === params.genre!.toLowerCase()),
    )
  }
  if (q) {
    rows = rows.filter((a) =>
      [a.name, a.agency, ...(a.genres ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }
  const offset = params.offset ?? 0
  const limit = params.limit ?? rows.length
  return rows.slice(offset, offset + limit)
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  }
  if (init?.body && !(init.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  if (res.status === 204) {
    return undefined as T
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.detail || res.statusText)
  }

  return res.json()
}

/**
 * Wrap a real API call with a localStorage fallback so the app stays usable
 * when the FastAPI backend isn't running. We only fall back on transport-level
 * failures (network error / fetch threw) — once the backend is reachable, real
 * `ApiError` responses propagate.
 */
async function withFallback<T>(real: () => Promise<T>, stub: () => T): Promise<T> {
  try {
    return await real()
  } catch (err) {
    if (err instanceof ApiError) throw err
    return stub()
  }
}

export const listApi = {
  manuscript: {
    get: () =>
      withFallback(
        () => request<ManuscriptStub>('/api/list/manuscript'),
        () => localStore.manuscript.get(),
      ),
  },
  submissions: {
    list: () =>
      withFallback(
        () => request<Submission[]>('/api/list/submissions'),
        () => localStore.submissions.list(),
      ),
    create: (data: SubmissionCreate) =>
      withFallback(
        () =>
          request<Submission>('/api/list/submissions', {
            method: 'POST',
            body: JSON.stringify(data),
          }),
        () => localStore.submissions.create(data),
      ),
    bulk: (rows: SubmissionCreate[]) =>
      withFallback(
        () =>
          request<BulkImportResult>('/api/list/submissions/bulk', {
            method: 'POST',
            body: JSON.stringify(rows),
          }),
        () => localStore.submissions.bulk(rows),
      ),
    update: (id: number, data: SubmissionUpdate) =>
      withFallback(
        () =>
          request<Submission>(`/api/list/submissions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
          }),
        () => localStore.submissions.update(id, data),
      ),
    remove: (id: number) =>
      withFallback(
        () => request<void>(`/api/list/submissions/${id}`, { method: 'DELETE' }),
        () => {
          localStore.submissions.remove(id)
        },
      ),
  },
  materials: {
    list: (type: MaterialType) =>
      withFallback(
        () => request<MaterialVersion[]>(`/api/list/materials/${type}`),
        () => localStore.materials.list(type),
      ),
    create: (type: MaterialType, content: string) =>
      withFallback(
        () =>
          request<MaterialVersion>(`/api/list/materials/${type}`, {
            method: 'POST',
            body: JSON.stringify({ content }),
          }),
        () => localStore.materials.create(type, content),
      ),
    getVersion: (id: number) =>
      withFallback(
        () => request<MaterialVersion>(`/api/list/materials/version/${id}`),
        () => localStore.materials.getVersion(id),
      ),
  },
  directory: {
    list: (params: { genre?: string; q?: string; limit?: number; offset?: number } = {}) => {
      const search = new URLSearchParams()
      if (params.genre) search.set('genre', params.genre)
      if (params.q) search.set('q', params.q)
      if (params.limit !== undefined) search.set('limit', String(params.limit))
      if (params.offset !== undefined) search.set('offset', String(params.offset))
      const qs = search.toString()
      return withFallback(
        () => request<DirectoryAgent[]>(`/api/list/directory${qs ? `?${qs}` : ''}`),
        () => filterSampleAgents(params),
      )
    },
    get: (id: number) =>
      withFallback(
        () => request<DirectoryAgent>(`/api/list/directory/${id}`),
        () => {
          const match = SAMPLE_AGENTS.find((a) => a.id === id)
          if (!match) throw new ApiError(404, 'Agent not found')
          return match
        },
      ),
    add: (id: number) =>
      withFallback(
        () => request<Submission>(`/api/list/directory/${id}/add`, { method: 'POST' }),
        () => localStore.directory.add(id),
      ),
  },
}
