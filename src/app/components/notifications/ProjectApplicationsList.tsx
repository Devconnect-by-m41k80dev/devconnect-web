'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, UserPlus } from 'lucide-react'
import { useI18n } from '@/app/i18n'
import { useProjectApplications } from '@/app/hooks/useProjectApplications'
import { ApplicationItem } from './ApplicationItem'
import { cn } from '@/app/lib/utils'

type Filter = 'pending' | 'accepted' | 'rejected' | 'all'

interface ProjectApplicationsListProps {
  projectId: string
  isOwner:   boolean
}

export function ProjectApplicationsList({ projectId, isOwner }: ProjectApplicationsListProps) {
  const { t, locale } = useI18n()
  const { applications, loading, accept, reject } = useProjectApplications(isOwner ? projectId : undefined)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('pending')

  if (!isOwner) return null

  const counts = {
    pending:  applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    all:      applications.length,
  }

  const visible = filter === 'all' ? applications : applications.filter((a) => a.status === filter)

  const handleAccept = async (id: string) => {
    setActionLoading(id); try { await accept(id) } finally { setActionLoading(null) }
  }
  const handleReject = async (id: string) => {
    setActionLoading(id); try { await reject(id) } finally { setActionLoading(null) }
  }

  if (loading) return (
    <div className="dc-card p-6 space-y-3">
      <div className="dc-skeleton h-4 w-1/3 rounded" />
      {[1,2].map(i => <div key={i} className="dc-card p-4"><div className="flex items-center gap-4"><div className="dc-skeleton w-10 h-10 rounded-xl"/><div className="flex-1 space-y-2"><div className="dc-skeleton h-4 w-1/3 rounded"/><div className="dc-skeleton h-3 w-1/2 rounded"/></div></div></div>)}
    </div>
  )

  return (
    <div className="dc-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <UserPlus size={15} style={{ color: 'var(--brand)' }} />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Applications</h2>
          {counts.pending > 0 && (
            <span className="min-w-[20px] h-5 rounded-full flex items-center justify-center text-white font-bold text-[10px] px-1.5" style={{ background: 'var(--danger)' }}>{counts.pending}</span>
          )}
        </div>
        <Link href="/applications" className="text-xs transition-colors hover:text-[--brand]" style={{ color: 'var(--text-muted)' }}>Manage all →</Link>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-xl border mb-5" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
        {(['pending', 'accepted', 'rejected', 'all'] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5', filter === f ? 'text-white' : 'text-[--text-muted] hover:text-[--text]')} style={filter === f ? { background: 'var(--brand)' } : {}}>
            {t.applications[f]}
            {counts[f] > 0 && <span className="min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold text-[9px] px-1" style={filter === f ? { background: 'rgba(255,255,255,0.2)' } : { background: 'var(--bg-overlay)', color: 'var(--text-dim)' }}>{counts[f]}</span>}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="py-10 text-center"><Users size={28} className="mx-auto mb-2" style={{ color: 'var(--text-dim)' }}/><p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.applications.empty}</p></div>
      ) : (
        <div className="space-y-3">
          {visible.map((app, i) => (
            <div key={app.id} className={`anim-fade-up delay-${Math.min(i+1,5)}`}>
              <ApplicationItem application={app} locale={locale} actionLoading={actionLoading} onAccept={handleAccept} onReject={handleReject} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
