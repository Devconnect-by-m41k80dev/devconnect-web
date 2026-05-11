'use client'

import { useState, useEffect, useCallback } from 'react'
import { projectsApi } from '@/app/lib/api'
import { Project } from '@/app/types/entities'

interface UseMyProjectsResult {
  projects: Project[]
  loading:  boolean
  error:    boolean
  refetch:  () => void
}

export function useMyProjects(userId: string | undefined): UseMyProjectsResult {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(false)

  const fetch = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(false)
    try {
      const res = await projectsApi.getAll({ limit: 100, page: 1 })
      setProjects(res.data.filter((p) => p.owner.id === userId))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  return { projects, loading, error, refetch: fetch }
}
