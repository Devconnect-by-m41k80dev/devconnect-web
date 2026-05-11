'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, ChevronRight, Clock, Layers } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { useI18n } from '@/app/i18n'
import { useAuthStore } from '@/app/store/auth.store'
import { useNotifications } from '@/app/hooks/useNotifications'
import { Navbar } from '@/app/components/layout/Navbar'
import { Footer } from '@/app/components/layout/Footer'
import { ApplicationItem } from '@/app/components/notifications/ApplicationItem'

type Filter = 'pending' | 'accepted' | 'rejected' | 'all'

function PageSkeleton() {
  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 space-y-2">{[1,2,3].map(i=><div key={i} className="dc-skeleton h-14 rounded-xl"/>)}</div>
      <div className="lg:col-span-3 space-y-3"><div className="dc-skeleton h-10 w-full rounded-xl"/>{[1,2,3].map(i=><div key={i} className="dc-card p-5"><div className="flex items-center gap-4"><div className="dc-skeleton w-10 h-10 rounded-xl"/><div className="flex-1 space-y-2"><div className="dc-skeleton h-4 w-1/3 rounded"/><div className="dc-skeleton h-3 w-1/2 rounded"/></div><div className="dc-skeleton h-8 w-24 rounded-xl"/></div></div>)}</div>
    </div>
  )
}

export default function ApplicationsPage() {
  const { t, locale } = useI18n()
  const { user } = useAuthStore()
  const { groups, totalPending, loading, error, accept, reject } = useNotifications(user?.id)

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [filter,          setFilter]           = useState<Filter>('pending')
  const [actionLoading,   setActionLoading]    = useState<string | null>(null)

  const resolvedActive = activeProjectId ?? (groups.find(g => g.pendingCount > 0) ?? groups[0])?.project.id ?? null
  const activeGroup    = groups.find(g => g.project.id === resolvedActive)
  const filteredApps   = (activeGroup?.applications ?? []).filter(a => filter === 'all' ? true : a.status === filter)
  const counts         = { pending: activeGroup?.pendingCount ?? 0, accepted: activeGroup?.applications.filter(a=>a.status==='accepted').length??0, rejected: activeGroup?.applications.filter(a=>a.status==='rejected').length??0, all: activeGroup?.applications.length??0 }

  const handle = (fn: (id:string)=>Promise<void>) => async (id: string) => {
    setActionLoading(id); try { await fn(id) } finally { setActionLoading(null) }
  }

  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <div className="dc-page-header anim-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'color-mix(in srgb, var(--brand) 14%, transparent)', color: 'var(--brand)' }}><Bell size={20} /></div>
            <div><h1 className="dc-page-title">{t.applications.title}</h1><p className="dc-page-header-sub">{t.applications.sub}</p></div>
          </div>
          {!loading && totalPending > 0 && <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full shrink-0" style={{ background: 'color-mix(in srgb, var(--danger) 12%, transparent)', color: 'var(--danger)' }}><Clock size={13}/>{totalPending} pending</span>}
        </div>

        {loading ? <PageSkeleton /> : error ? (
          <div className="dc-card p-16 text-center"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.common.error}</p></div>
        ) : groups.length === 0 ? (
          <div className="dc-card p-20 text-center"><Bell size={38} className="mx-auto mb-4" style={{ color: 'var(--text-dim)' }}/><p className="font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>{t.applications.noApps}</p><p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{t.applications.noAppsSub}</p><Link href="/projects/new" className="dc-btn-primary py-2.5 px-6 inline-flex gap-2"><Layers size={15}/>Create a project</Link></div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6 anim-fade-up delay-1">
            <div className="lg:col-span-1 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3 px-1" style={{ color: 'var(--text-dim)' }}>{t.applications.yourProjects}</p>
              {groups.map(g => (
                <button key={g.project.id} onClick={() => { setActiveProjectId(g.project.id); setFilter('pending') }} className={cn('w-full text-left px-3.5 py-3 rounded-xl border transition-all duration-150 flex items-center gap-3', g.project.id === resolvedActive ? 'border-[--brand] bg-[--brand]/5' : 'border-transparent hover:border-[--border] hover:bg-[--bg-overlay]')}>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate" style={{ color: g.project.id === resolvedActive ? 'var(--brand)' : 'var(--text)' }}>{g.project.title}</p><p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{g.applications.length} {t.applications.total}</p></div>
                  <div className="flex items-center gap-1.5 shrink-0">{g.pendingCount > 0 && <span className="min-w-[20px] h-5 rounded-full flex items-center justify-center text-white font-bold text-[10px] px-1.5" style={{ background: 'var(--danger)' }}>{g.pendingCount}</span>}<ChevronRight size={13} style={{ color: 'var(--text-dim)' }}/></div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-3 space-y-4">
              {activeGroup && (
                <>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div><Link href={`/projects/${activeGroup.project.id}`} className="font-semibold text-sm hover:text-[--brand] transition-colors" style={{ color: 'var(--text)' }}>{activeGroup.project.title} →</Link><p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{activeGroup.applications.length} applicant{activeGroup.applications.length!==1?'s':''}</p></div>
                    <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
                      {(['pending','accepted','rejected','all'] as Filter[]).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all', filter===f?'text-white':'text-[--text-muted] hover:text-[--text]')} style={filter===f?{background:'var(--brand)'}:{}}>
                          {t.applications[f]}{counts[f]>0&&<span className="min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold text-[9px] px-1" style={filter===f?{background:'rgba(255,255,255,0.2)'}:{background:'var(--bg-overlay)',color:'var(--text-dim)'}}>{counts[f]}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  {filteredApps.length === 0 ? <div className="dc-card p-12 text-center"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.applications.empty}</p></div> : (
                    <div className="space-y-3">
                      {filteredApps.map((app,i) => <div key={app.id} className={`anim-fade-up delay-${Math.min(i+1,5)}`}><ApplicationItem application={app} locale={locale} actionLoading={actionLoading} onAccept={handle(accept)} onReject={handle(reject)}/></div>)}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}



