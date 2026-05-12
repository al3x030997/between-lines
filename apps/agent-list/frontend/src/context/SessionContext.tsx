'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { listApi } from '@/lib/api'
import type { ManuscriptStub } from '@/lib/types'

interface SessionState {
  manuscript: ManuscriptStub | null
  loading: boolean
  error: string | null
}

const SessionContext = createContext<SessionState>({
  manuscript: null,
  loading: true,
  error: null,
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({
    manuscript: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    listApi.manuscript
      .get()
      .then((manuscript) => {
        if (cancelled) return
        setState({ manuscript, loading: false, error: null })
      })
      .catch((err: Error) => {
        if (cancelled) return
        setState({ manuscript: null, loading: false, error: err.message })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>
}

export function useSession() {
  return useContext(SessionContext)
}
