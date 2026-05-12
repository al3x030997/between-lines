'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { listApi } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import {
  MATERIAL_TYPES,
  MATERIAL_LABELS,
  type MaterialType,
  type MaterialVersion,
  type Submission,
} from '@/lib/types'

const FIELD_BY_TYPE: Record<MaterialType, keyof Pick<Submission, 'query_version_id' | 'synopsis_version_id' | 'sample_version_id'>> = {
  query: 'query_version_id',
  synopsis: 'synopsis_version_id',
  sample: 'sample_version_id',
}

export default function MaterialPickerModal({
  open,
  onClose,
  submission,
  onSave,
}: {
  open: boolean
  onClose: () => void
  submission: Submission | null
  onSave: (
    id: number,
    patch: {
      query_version_id: number | null
      synopsis_version_id: number | null
      sample_version_id: number | null
    },
  ) => Promise<void>
}) {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [versionsByType, setVersionsByType] = useState<Record<MaterialType, MaterialVersion[]>>({
    query: [],
    synopsis: [],
    sample: [],
  })
  const [selection, setSelection] = useState<{
    query_version_id: number | null
    synopsis_version_id: number | null
    sample_version_id: number | null
  }>({ query_version_id: null, synopsis_version_id: null, sample_version_id: null })
  const [previewType, setPreviewType] = useState<MaterialType>('query')

  useEffect(() => {
    if (!open || !submission) return
    setLoading(true)
    Promise.all(MATERIAL_TYPES.map((t) => listApi.materials.list(t)))
      .then((lists) => {
        setVersionsByType({ query: lists[0], synopsis: lists[1], sample: lists[2] })
      })
      .finally(() => setLoading(false))
    setSelection({
      query_version_id: submission.query_version_id,
      synopsis_version_id: submission.synopsis_version_id,
      sample_version_id: submission.sample_version_id,
    })
  }, [open, submission])

  if (!submission) return null

  const save = async () => {
    try {
      await onSave(submission.id, selection)
      toast.success('Materials linked')
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const previewVersionId = selection[FIELD_BY_TYPE[previewType]]
  const previewVersion = versionsByType[previewType].find((v) => v.id === previewVersionId) ?? null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Materials for ${submission.agent_name}`}
      widthClass="max-w-4xl"
    >
      {loading ? (
        <div className="text-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {MATERIAL_TYPES.map((t) => {
              const versions = versionsByType[t]
              const fieldKey = FIELD_BY_TYPE[t]
              const selectedId = selection[fieldKey]
              return (
                <div
                  key={t}
                  className={`border rounded-lg p-3 cursor-pointer ${
                    previewType === t ? 'border-accent' : 'border-border'
                  }`}
                  onClick={() => setPreviewType(t)}
                >
                  <p className="text-xs uppercase tracking-wider text-muted mb-2">
                    {MATERIAL_LABELS[t]}
                  </p>
                  {versions.length === 0 ? (
                    <p className="text-xs text-muted">No versions saved yet.</p>
                  ) : (
                    <select
                      value={selectedId ?? ''}
                      onChange={(e) =>
                        setSelection((prev) => ({
                          ...prev,
                          [fieldKey]: e.target.value ? Number(e.target.value) : null,
                        }))
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-bg border border-border rounded px-2 py-1 text-xs"
                    >
                      <option value="">— None —</option>
                      {versions.map((v) => (
                        <option key={v.id} value={v.id}>
                          v{v.version_number} — {new Date(v.created_at).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )
            })}
          </div>

          <div className="border border-border rounded-lg p-4 bg-bg/40 max-h-[40vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-muted">
                Preview — {MATERIAL_LABELS[previewType]}
              </p>
              {previewVersion && <Badge tone="accent">v{previewVersion.version_number}</Badge>}
            </div>
            {previewVersion ? (
              <pre className="text-xs whitespace-pre-wrap font-[family-name:var(--font-body)] leading-relaxed">
                {previewVersion.content}
              </pre>
            ) : (
              <p className="text-xs text-muted">No version selected for this material.</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={save}>Save links</Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
