'use client'

import { useState, useEffect, useCallback } from 'react'
import { projectsApi } from '@/app/lib/api'
import { Project } from '@/app/types/entities'
import { GetProjectsDto } from '@/app/types/dtos'
import { useDebounce } from './useDebounce'

const INITIAL_FILTERS: GetProjectsDto = {
  page: 1, limit: 12,
  status: '' as GetProjectsDto['status'],
  tech: '', search: '',
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [total,    setTotal]    = useState(0)
  const [page,     setPage]     = useState(1)
  const [loading,  setLoading]  = useState(true)
  const [filters,  setFilters]  = useState<GetProjectsDto>(INITIAL_FILTERS)

  const debouncedSearch = useDebounce(filters.search ?? '', 380)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await projectsApi.getAll({
        ...filters,
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
        tech:   filters.tech   || undefined,
        page,
      })
      setProjects(res.data)
      setTotal(res.meta.total)
    } catch {
      setProjects([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [filters, debouncedSearch, page])

  useEffect(() => { load() }, [load])

  const setFilter = <K extends keyof GetProjectsDto>(key: K, value: GetProjectsDto[K]) => {
    setPage(1)
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setPage(1)
    setFilters(INITIAL_FILTERS)
  }

  const totalPages = Math.ceil(total / (filters.limit ?? 12))
  const hasFilters = !!(filters.status || filters.tech || filters.search)

  return { projects, total, page, setPage, loading, filters, setFilter, clearFilters, totalPages, hasFilters }
}
