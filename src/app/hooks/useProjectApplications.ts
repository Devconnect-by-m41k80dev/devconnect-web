'use client'

import { useState, useEffect, useCallback } from 'react'
import { projectsApi } from '@/app/lib/api'
import { ProjectApplication } from '@/app/types/entities'
import { ApplicationStatus } from '../types/enums'


interface UseProjectApplicationsResult {
  applications: ProjectApplication[]
  total:        number
  loading:      boolean
  error:        boolean
  refetch:      () => void
  accept:       (applicationId: string) => Promise<void>
  reject:       (applicationId: string) => Promise<void>
}

export function useProjectApplications(
  projectId: string | undefined
): UseProjectApplicationsResult {
  const [applications, setApplications] = useState<ProjectApplication[]>([])
  const [total,        setTotal]        = useState(0)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState(false)

  const fetch = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    setError(false)
    try {
      const res = await projectsApi.getApplications(projectId, { limit: 50, page: 1 })
      setApplications(res.data)
      setTotal(res.meta.total)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { fetch() }, [fetch])

  const accept = useCallback(async (applicationId: string) => {
    await projectsApi.acceptApplication(applicationId)
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId ? { ...a, status: ApplicationStatus.ACCEPTED } : a
      )

    )
  }, [])

  const reject = useCallback(async (applicationId: string) => {
    await projectsApi.rejectApplication(applicationId)
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId ? { ...a, status: ApplicationStatus.REJECTED } : a
      )
    )
  }, [])

  return { applications, total, loading, error, refetch: fetch, accept, reject }
}
