'use client'

import { useState, useEffect } from 'react'
import { statsApi, PlatformStats } from '@/app/lib/api/stats.api'

interface UseStatsResult {
  stats:   PlatformStats | null
  loading: boolean
  error:   boolean
}

export function useStats(): UseStatsResult {
  const [stats,   setStats]   = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    statsApi.getStats()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading, error }
}
