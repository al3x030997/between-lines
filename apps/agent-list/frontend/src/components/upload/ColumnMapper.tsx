'use client'

import { Select } from '@/components/ui/Input'
import { CANONICAL_FIELDS, FIELD_LABELS, type CanonicalField } from '@/lib/columnMapping'

const NONE = '__none__'

export default function ColumnMapper({
  headers,
  sampleRow,
  mapping,
  onChange,
}: {
  headers: string[]
  sampleRow: string[] | null
  mapping: Record<number, CanonicalField>
  onChange: (idx: number, field: CanonicalField | null) => void
}) {
  const used = new Set(Object.values(mapping))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-muted uppercase tracking-wider border-b border-border">
          <tr>
            <th className="py-2 pr-4 font-medium">Your column</th>
            <th className="py-2 pr-4 font-medium">Sample value</th>
            <th className="py-2 pr-4 font-medium">Maps to</th>
          </tr>
        </thead>
        <tbody>
          {headers.map((header, idx) => {
            const current = mapping[idx]
            return (
              <tr key={idx} className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium text-text">{header || `Column ${idx + 1}`}</td>
                <td className="py-2 pr-4 text-muted truncate max-w-[260px]">
                  {sampleRow?.[idx] ?? ''}
                </td>
                <td className="py-2 pr-4">
                  <Select
                    value={current ?? NONE}
                    onChange={(e) =>
                      onChange(idx, e.target.value === NONE ? null : (e.target.value as CanonicalField))
                    }
                  >
                    <option value={NONE}>— Skip this column —</option>
                    {CANONICAL_FIELDS.map((field) => {
                      const disabled = field !== current && used.has(field)
                      return (
                        <option key={field} value={field} disabled={disabled}>
                          {FIELD_LABELS[field]}
                          {disabled ? ' (already mapped)' : ''}
                        </option>
                      )
                    })}
                  </Select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
