'use client'

import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import Tabs from '@/components/ui/Tabs'
import Badge from '@/components/ui/Badge'
import { TextArea } from '@/components/ui/Input'
import { listApi, ApiError } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import {
  MATERIAL_TYPES,
  MATERIAL_LABELS,
  type MaterialType,
  type MaterialVersion,
} from '@/lib/types'

export default function MaterialsPage() {
  const toast = useToast()
  const [active, setActive] = useState<MaterialType>('query')
  const [versionsByType, setVersionsByType] = useState<Record<MaterialType, MaterialVersion[]>>({
    query: [],
    synopsis: [],
    sample: [],
  })
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null)

  const load = async () => {
    try {
      const lists = await Promise.all(MATERIAL_TYPES.map((t) => listApi.materials.list(t)))
      const next: Record<MaterialType, MaterialVersion[]> = {
        query: lists[0],
        synopsis: lists[1],
        sample: lists[2],
      }
      setVersionsByType(next)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load materials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const versions = versionsByType[active]
  const latest = versions[0] ?? null

  // When switching tabs, default the editor to the latest version's content
  useEffect(() => {
    setDraft(latest?.content ?? '')
    setSelectedVersionId(latest?.id ?? null)
  }, [active, latest?.id])

  const selectedVersion = useMemo(
    () => versions.find((v) => v.id === selectedVersionId) ?? null,
    [versions, selectedVersionId],
  )

  const isDraftNewer = selectedVersionId === latest?.id && draft !== (latest?.content ?? '')

  const saveNewVersion = async () => {
    if (!draft.trim()) {
      toast.error('Cannot save an empty version.')
      return
    }
    setSaving(true)
    try {
      const created = await listApi.materials.create(active, draft)
      setVersionsByType((prev) => ({ ...prev, [active]: [created, ...prev[active]] }))
      setSelectedVersionId(created.id)
      toast.success(`Saved ${MATERIAL_LABELS[active]} v${created.version_number}`)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-heading)]">Materials</h1>
        <p className="text-xs text-muted mt-0.5">
          Every saved version is immutable — submissions can link back to the exact text that went out.
        </p>
      </div>

      <Tabs
        tabs={MATERIAL_TYPES.map((t) => ({
          key: t,
          label: (
            <span className="flex items-center gap-2">
              {MATERIAL_LABELS[t]}
              <Badge tone="muted">{versionsByType[t].length}</Badge>
            </span>
          ),
        }))}
        active={active}
        onChange={setActive}
      />

      {loading ? (
        <Card>
          <div className="text-center py-6">
            <Spinner /> <span className="ml-2 text-sm text-muted">Loading…</span>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
          <Card className="p-3">
            <p className="text-xs text-muted px-2 pb-2">Versions</p>
            {versions.length === 0 ? (
              <p className="text-xs text-muted px-2 py-4">No versions yet — write something below and save v1.</p>
            ) : (
              <ul className="space-y-1">
                {versions.map((v) => (
                  <li key={v.id}>
                    <button
                      onClick={() => {
                        setSelectedVersionId(v.id)
                        setDraft(v.content ?? '')
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between ${
                        selectedVersionId === v.id ? 'bg-accent/15 text-accent' : 'hover:bg-bg/50 text-text'
                      }`}
                    >
                      <span className="font-medium">v{v.version_number}</span>
                      <span className="text-muted">{new Date(v.created_at).toLocaleDateString()}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{MATERIAL_LABELS[active]}</p>
                {selectedVersion && (
                  <Badge tone="accent">
                    v{selectedVersion.version_number}
                    {selectedVersion.id === latest?.id ? ' · latest' : ''}
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                onClick={saveNewVersion}
                disabled={saving || (!isDraftNewer && versions.length > 0)}
              >
                {saving
                  ? 'Saving…'
                  : versions.length === 0
                    ? 'Save v1'
                    : `Save v${(latest?.version_number ?? 0) + 1}`}
              </Button>
            </div>
            <TextArea
              value={draft}
              onChange={(e) => {
                // Editing always switches focus to the latest version
                if (selectedVersionId !== latest?.id) {
                  setSelectedVersionId(latest?.id ?? null)
                }
                setDraft(e.target.value)
              }}
              placeholder={`Write your ${MATERIAL_LABELS[active].toLowerCase()} here…`}
              rows={20}
              className="text-sm leading-relaxed"
            />
            {selectedVersion && selectedVersion.id !== latest?.id && (
              <p className="text-xs text-muted">
                Viewing an older version. Editing will start a new draft from this text — saving creates v
                {(latest?.version_number ?? 0) + 1}.
              </p>
            )}
          </Card>
        </div>
      )}

      {!loading && Object.values(versionsByType).every((v) => v.length === 0) && (
        <EmptyState
          title="No materials saved yet"
          description="Save a version of your query, synopsis, or sample pages, then link it from any submission row."
        />
      )}
    </div>
  )
}
