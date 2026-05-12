'use client'

import { useCallback, useEffect, useState } from 'react'
import { listApi, ApiError } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import type { Submission, SubmissionCreate, SubmissionUpdate } from '@/lib/types'

export function useSubmissions() {
  const toast = useToast()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const data = await listApi.submissions.list()
      setSubmissions(data)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    reload()
  }, [reload])

  const create = async (data: SubmissionCreate) => {
    try {
      const created = await listApi.submissions.create(data)
      setSubmissions((prev) => [created, ...prev])
      return created
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to create submission')
      throw err
    }
  }

  const update = async (id: number, data: SubmissionUpdate) => {
    // Optimistic update
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } as Submission : s)),
    )
    try {
      const updated = await listApi.submissions.update(id, data)
      setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)))
      return updated
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Save failed')
      reload()
      throw err
    }
  }

  const remove = async (id: number) => {
    const snapshot = submissions
    setSubmissions((prev) => prev.filter((s) => s.id !== id))
    try {
      await listApi.submissions.remove(id)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Delete failed')
      setSubmissions(snapshot)
    }
  }

  return { submissions, loading, reload, create, update, remove }
}
