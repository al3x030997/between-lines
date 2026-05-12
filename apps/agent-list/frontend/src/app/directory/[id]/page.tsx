'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { listApi, ApiError } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import type { DirectoryAgent } from '@/lib/types'

export default function AgentProfilePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const toast = useToast()
  const [agent, setAgent] = useState<DirectoryAgent | null>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!params?.id) return
    setLoading(true)
    listApi.directory
      .get(Number(params.id))
      .then(setAgent)
      .catch((err: unknown) =>
        toast.error(err instanceof ApiError ? err.message : 'Failed to load profile'),
      )
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id])

  const addToList = async () => {
    if (!agent) return
    setAdding(true)
    try {
      await listApi.directory.add(agent.id)
      toast.success(`Added ${agent.name} to your list`)
      router.push('/table')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to add')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <Spinner />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-sm text-muted">Agent not found.</p>
        <Link href="/directory" className="text-accent text-sm mt-2 inline-block">
          ← Back to directory
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
      <Link href="/directory" className="text-xs text-muted hover:text-text">
        ← Directory
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[family-name:var(--font-heading)] leading-tight">
            {agent.name}
          </h1>
          {agent.agency && <p className="text-sm text-muted mt-1">{agent.agency}</p>}
          {agent.is_open === false && (
            <Badge tone="warning" className="mt-2">
              Currently closed to queries
            </Badge>
          )}
        </div>
        <Button onClick={addToList} disabled={adding}>
          {adding ? 'Adding…' : 'Add to my list'}
        </Button>
      </div>

      {agent.genres && agent.genres.length > 0 && (
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted mb-2">Genres</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.genres.map((g) => (
              <Badge key={g} tone="accent">
                {g}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {agent.audience && agent.audience.length > 0 && (
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted mb-2">Audience</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.audience.map((a) => (
              <Badge key={a}>{a}</Badge>
            ))}
          </div>
        </Card>
      )}

      {agent.keywords && agent.keywords.length > 0 && (
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted mb-2">Wishlist keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.keywords.map((k) => (
              <Badge key={k}>{k}</Badge>
            ))}
          </div>
        </Card>
      )}

      {agent.hard_nos_keywords && agent.hard_nos_keywords.length > 0 && (
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted mb-2">Not for them</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.hard_nos_keywords.map((k) => (
              <Badge key={k} tone="danger">
                {k}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {agent.submission_req && Object.keys(agent.submission_req).length > 0 && (
        <Card>
          <p className="text-xs uppercase tracking-wider text-muted mb-2">Submission requirements</p>
          <pre className="text-xs whitespace-pre-wrap font-[family-name:var(--font-body)]">
            {JSON.stringify(agent.submission_req, null, 2)}
          </pre>
        </Card>
      )}

      {agent.profile_url && (
        <p className="text-xs text-muted">
          Source:{' '}
          <a
            href={agent.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            {agent.profile_url}
          </a>
        </p>
      )}
    </div>
  )
}
