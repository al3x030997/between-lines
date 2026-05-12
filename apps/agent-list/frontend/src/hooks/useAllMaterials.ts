'use client'

import { useCallback, useEffect, useState } from 'react'
import { listApi } from '@/lib/api'
import { MATERIAL_TYPES, type MaterialVersion } from '@/lib/types'

export function useAllMaterials() {
  const [versions, setVersions] = useState<MaterialVersion[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const lists = await Promise.all(MATERIAL_TYPES.map((t) => listApi.materials.list(t)))
      setVersions(lists.flat())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  // id -> version_number
  const byId = new Map(versions.map((v) => [v.id, v.version_number]))

  return { versions, byId, loading, reload }
}
