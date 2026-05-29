'use client'

import { useEffect, useMemo, useState } from 'react'
import { TextInput } from '@/components/ui/Input'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import AgentCard from '@/components/directory/AgentCard'
import { listApi, ApiError } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import type { DirectoryAgent } from '@/lib/types'

export default function DirectoryPage() {
  const toast = useToast()
  const [agents, setAgents] = useState<DirectoryAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGenre, setActiveGenre] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    listApi.directory
      .list({ limit: 200 })
      .then((data) => setAgents(data))
      .catch((err: unknown) =>
        toast.error(err instanceof ApiError ? err.message : 'Failed to load directory'),
      )
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allGenres = useMemo(() => {
    const counts = new Map<string, number>()
    agents.forEach((a) => a.genres?.forEach((g) => counts.set(g, (counts.get(g) ?? 0) + 1)))
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([g]) => g)
  }, [agents])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return agents.filter((a) => {
      if (activeGenre && !a.genres?.includes(activeGenre)) return false
      if (q) {
        const haystack = [a.name, a.agency, ...(a.genres ?? [])].filter(Boolean).join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [agents, activeGenre, search])

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-[family-name:var(--font-heading)]">Agent directory</h1>
        <p className="text-xs text-muted mt-0.5">
          Approved profiles from the agent-match crawler. Add any to your list to start tracking.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <TextInput
          placeholder="Search by name, agency, or genre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72"
        />
      </div>

      {allGenres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <GenreChip
            label="All"
            active={activeGenre === null}
            onClick={() => setActiveGenre(null)}
          />
          {allGenres.slice(0, 20).map((g) => (
            <GenreChip
              key={g}
              label={g}
              active={activeGenre === g}
              onClick={() => setActiveGenre(activeGenre === g ? null : g)}
            />
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <Spinner /> <span className="ml-2 text-sm text-muted">Loading directory…</span>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No agents match"
          description="Try clearing filters or removing search terms."
        />
      ) : (
        <>
          <p className="text-xs text-muted mb-3">{filtered.length} agents</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((a) => (
              <AgentCard key={a.id} agent={a} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function GenreChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
        active
          ? 'bg-accent text-zinc-900 border-accent'
          : 'border-border text-muted hover:text-text hover:border-muted'
      }`}
    >
      {label}
    </button>
  )
}
