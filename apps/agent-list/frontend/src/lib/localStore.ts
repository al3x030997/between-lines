/**
 * localStorage-backed stub of the agent-list backend, used for preview when
 * the FastAPI server isn't running. Mirrors the shapes returned by the API
 * routes so the rest of the app doesn't have to know which path it's on.
 */
import sampleAgentsData from '@/data/sampleAgents.json'
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

const KEY = 'agent-list:preview-store:v2'

const SAMPLE_AGENTS = sampleAgentsData as DirectoryAgent[]

interface Store {
  manuscript: ManuscriptStub
  submissions: Submission[]
  materials: MaterialVersion[]
  nextSubmissionId: number
  nextMaterialId: number
}

function emptyStore(): Store {
  return {
    manuscript: { id: 1, title: 'Untitled' },
    submissions: [],
    materials: [],
    nextSubmissionId: 1,
    nextMaterialId: 1,
  }
}

// Seed config: agent id from sampleAgents.json + status + relative dates.
// `daysAgoSent` / `daysAgoResp` are days back from "now" so the data feels
// fresh whenever the preview is opened.
const SEED_PLAN: Array<{
  agentId: number
  status: Submission['status']
  daysAgoSent?: number
  daysAgoResp?: number
  notes?: string
}> = [
  { agentId: 1, status: 'researching', notes: 'Strong literary/cozy fantasy fit; check MSWL for new posts.' },
  { agentId: 8, status: 'researching', notes: 'Boutique agency — confirm she’s open before sending.' },
  { agentId: 13, status: 'queued', notes: 'Folkloric/romantasy, perfect match. Personalize before sending.' },
  { agentId: 3, status: 'submitted', daysAgoSent: 17 },
  { agentId: 11, status: 'submitted', daysAgoSent: 31, notes: 'WME — 6–8 week response window.' },
  { agentId: 4, status: 'partial_requested', daysAgoSent: 39, daysAgoResp: 21, notes: 'Requested first 50 pages.' },
  { agentId: 5, status: 'full_requested', daysAgoSent: 65, daysAgoResp: 38, notes: 'Full ms requested + bio.' },
  { agentId: 6, status: 'offer', daysAgoSent: 86, daysAgoResp: 7, notes: 'Offer of representation — nudging others.' },
  { agentId: 7, status: 'rejected', daysAgoSent: 60, daysAgoResp: 24, notes: 'Pass; "couldn’t connect with the voice."' },
  { agentId: 10, status: 'closed_no_response', daysAgoSent: 115, notes: 'No response after 4 months — closing.' },
]

function isoDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function buildSeed(): Store {
  const store = emptyStore()
  const ts = nowIso()
  SEED_PLAN.forEach((row) => {
    const agent = SAMPLE_AGENTS.find((a) => a.id === row.agentId)
    if (!agent) return
    const id = store.nextSubmissionId++
    const created =
      row.daysAgoSent !== undefined ? isoDaysAgo(row.daysAgoSent + 1) : ts
    store.submissions.push({
      id,
      agent_id: agent.id,
      manuscript_id: store.manuscript.id,
      agent_name: agent.name,
      agent_agency: agent.agency,
      agent_email: null,
      agent_genres: agent.genres,
      status: row.status,
      date_sent: row.daysAgoSent !== undefined ? isoDaysAgo(row.daysAgoSent) : null,
      date_responded:
        row.daysAgoResp !== undefined ? isoDaysAgo(row.daysAgoResp) : null,
      query_version_id: null,
      synopsis_version_id: null,
      sample_version_id: null,
      notes: row.notes ?? null,
      response_text: null,
      created_at: created,
      updated_at: created,
    })
  })
  // Newest entries first to match the API's ordering.
  store.submissions.reverse()
  return store
}

function read(): Store {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) {
      const seeded = buildSeed()
      write(seeded)
      return seeded
    }
    return { ...emptyStore(), ...(JSON.parse(raw) as Partial<Store>) } as Store
  } catch {
    return emptyStore()
  }
}

function write(store: Store): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(store))
}

function nowIso(): string {
  return new Date().toISOString()
}

function buildSubmission(
  store: Store,
  data: SubmissionCreate,
): Submission {
  const id = store.nextSubmissionId++
  const ts = nowIso()
  return {
    id,
    agent_id: data.agent_id ?? null,
    manuscript_id: store.manuscript.id,
    agent_name: data.agent_name,
    agent_agency: data.agent_agency ?? null,
    agent_email: data.agent_email ?? null,
    agent_genres: data.agent_genres ?? null,
    status: data.status ?? 'researching',
    date_sent: data.date_sent ?? null,
    date_responded: data.date_responded ?? null,
    query_version_id: data.query_version_id ?? null,
    synopsis_version_id: data.synopsis_version_id ?? null,
    sample_version_id: data.sample_version_id ?? null,
    notes: data.notes ?? null,
    response_text: data.response_text ?? null,
    created_at: ts,
    updated_at: ts,
  }
}

export const localStore = {
  manuscript: {
    get(): ManuscriptStub {
      const store = read()
      return store.manuscript
    },
  },
  submissions: {
    list(): Submission[] {
      return read().submissions
    },
    create(data: SubmissionCreate): Submission {
      const store = read()
      const submission = buildSubmission(store, data)
      store.submissions = [submission, ...store.submissions]
      write(store)
      return submission
    },
    update(id: number, patch: SubmissionUpdate): Submission {
      const store = read()
      const idx = store.submissions.findIndex((s) => s.id === id)
      if (idx === -1) throw new Error(`Submission ${id} not found`)
      const merged: Submission = {
        ...store.submissions[idx],
        ...patch,
        updated_at: nowIso(),
      } as Submission
      store.submissions[idx] = merged
      write(store)
      return merged
    },
    remove(id: number): void {
      const store = read()
      store.submissions = store.submissions.filter((s) => s.id !== id)
      write(store)
    },
    bulk(rows: SubmissionCreate[]): BulkImportResult {
      const store = read()
      const created: Submission[] = []
      rows.forEach((row) => {
        if (!row.agent_name?.trim()) return
        const submission = buildSubmission(store, row)
        store.submissions = [submission, ...store.submissions]
        created.push(submission)
      })
      write(store)
      return { created, errors: [] }
    },
  },
  materials: {
    list(type: MaterialType): MaterialVersion[] {
      return read()
        .materials.filter((m) => m.type === type)
        .sort((a, b) => b.version_number - a.version_number)
    },
    create(type: MaterialType, content: string): MaterialVersion {
      const store = read()
      const existing = store.materials.filter((m) => m.type === type)
      const next: MaterialVersion = {
        id: store.nextMaterialId++,
        type,
        version_number:
          existing.reduce((max, m) => Math.max(max, m.version_number), 0) + 1,
        content,
        created_at: nowIso(),
      }
      store.materials = [next, ...store.materials]
      write(store)
      return next
    },
    getVersion(id: number): MaterialVersion {
      const match = read().materials.find((m) => m.id === id)
      if (!match) throw new Error(`Material version ${id} not found`)
      return match
    },
  },
  directory: {
    add(id: number): Submission {
      const agent = SAMPLE_AGENTS.find((a) => a.id === id)
      if (!agent) throw new Error('Agent not found')
      return localStore.submissions.create({
        agent_id: agent.id,
        agent_name: agent.name,
        agent_agency: agent.agency,
        agent_genres: agent.genres,
        status: 'researching',
      })
    },
  },
}
