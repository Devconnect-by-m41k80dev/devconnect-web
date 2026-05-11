'use client'

import { create } from 'zustand'
import { projectsApi } from '@/app/lib/api'

interface NotificationsState {
  pendingCount:  number   
  acceptedCount: number   
  lastFetched:   number | null
  loading:       boolean
}

interface NotificationsActions {
  fetchPending:   (userId: string) => Promise<void>
  decrement:      (by?: number) => void
  markAcceptedSeen: () => void   
  invalidate:     () => void
  reset:          () => void
}

const CACHE_TTL        = 60_000  
const SEEN_KEY         = 'dc-accepted-seen' 

function getSeenIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}

function saveSeenIds(ids: Set<string>) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...ids])) } catch { /* noop */ }
}

export const useNotificationsStore = create<NotificationsState & NotificationsActions>()(
  (set, get) => ({
    pendingCount:  0,
    acceptedCount: 0,
    lastFetched:   null,
    loading:       false,

    fetchPending: async (userId: string) => {
      const { lastFetched, loading } = get()
      if (loading) return
      if (lastFetched && Date.now() - lastFetched < CACHE_TTL) return

      set({ loading: true })
      try {
        
        const res   = await projectsApi.getAll({ limit: 100, page: 1 })
        const owned = res.data.filter(p => p.owner.id === userId)

        let pendingCount = 0
        if (owned.length > 0) {
          const results = await Promise.allSettled(
            owned.map(p => projectsApi.getApplications(p.id, { limit: 50, page: 1 }))
          )
          for (const r of results) {
            if (r.status === 'fulfilled') {
              pendingCount += r.value.data.filter(a => a.status === 'pending').length
            }
          }
        }

        
        const applied = await projectsApi.getApplied()
        const seenIds = getSeenIds()
        const newAccepted = applied.filter(
          a => a.status === 'accepted' && !seenIds.has(a.applicationId)
        )

        set({
          pendingCount,
          acceptedCount: newAccepted.length,
          lastFetched: Date.now(),
        })
      } catch {
        
      } finally {
        set({ loading: false })
      }
    },

    decrement: (by = 1) =>
      set(s => ({ pendingCount: Math.max(0, s.pendingCount - by) })),

    
    markAcceptedSeen: () => {
      
      projectsApi.getApplied().then(applied => {
        const seenIds = getSeenIds()
        applied
          .filter(a => a.status === 'accepted')
          .forEach(a => seenIds.add(a.applicationId))
        saveSeenIds(seenIds)
        set({ acceptedCount: 0 })
      }).catch(() => {
        set({ acceptedCount: 0 })
      })
    },

    invalidate: () => set({ lastFetched: null }),

    reset: () => set({ pendingCount: 0, acceptedCount: 0, lastFetched: null }),
  })
)
