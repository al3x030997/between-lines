import type { Submission } from '@/lib/types'
import { MATERIAL_BADGE_PREFIX } from '@/lib/types'

export default function MaterialsBadges({
  submission,
  versionByMaterialId,
}: {
  submission: Submission
  versionByMaterialId: Map<number, number>
}) {
  const items: Array<{ key: string; label: string }> = []
  if (submission.query_version_id) {
    const v = versionByMaterialId.get(submission.query_version_id)
    if (v) items.push({ key: 'q', label: `${MATERIAL_BADGE_PREFIX.query} v${v}` })
  }
  if (submission.synopsis_version_id) {
    const v = versionByMaterialId.get(submission.synopsis_version_id)
    if (v) items.push({ key: 's', label: `${MATERIAL_BADGE_PREFIX.synopsis} v${v}` })
  }
  if (submission.sample_version_id) {
    const v = versionByMaterialId.get(submission.sample_version_id)
    if (v) items.push({ key: 'p', label: `${MATERIAL_BADGE_PREFIX.sample} v${v}` })
  }
  if (items.length === 0) return <span className="text-muted/40 text-[12px]">—</span>
  return (
    <div className="flex gap-1 flex-wrap">
      {items.map((it) => (
        <span
          key={it.key}
          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25"
        >
          {it.label}
        </span>
      ))}
    </div>
  )
}
