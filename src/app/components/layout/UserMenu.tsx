'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, User, LogOut, Bell } from 'lucide-react'
import { Avatar } from '@/app/components/ui/Avatar'
import { cn } from '@/app/lib/utils'
import { useAuthStore } from '@/app/store/auth.store'
import { useNotificationsStore } from '@/app/store/notifications.store'
import { useI18n } from '@/app/i18n'

export function UserMenu() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const { t } = useI18n()
  const { pendingCount, fetchPending, reset } = useNotificationsStore()

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (isAuthenticated && user?.id) fetchPending(user.id)
  }, [isAuthenticated, user?.id, fetchPending])

  useEffect(() => {
    if (!isAuthenticated) reset()
  }, [isAuthenticated, reset])

  if (!isAuthenticated || !user) return null

  const hasPending = pendingCount > 0

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center gap-1.5 p-1 rounded-xl transition-colors hover:bg-[--bg-overlay]"
      >
        <div className="relative">
          <Avatar fullName={user.fullName} profileImageUrl={user.profileImageUrl} size="sm" />
          {hasPending && (
            <span
              className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: 'var(--danger)', fontSize: '9px', padding: '0 3px' }}
            >
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          )}
        </div>
        <ChevronDown
          size={12}
          className={cn('hidden sm:block text-[--text-dim] transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border py-1.5 shadow-xl anim-scale-in"
          style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
        >
          <div className="px-4 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{user.fullName}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>

          <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]">
            <User size={14} /> {t.nav.profile}
          </Link>

          <Link href="/applications" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]">
            <Bell size={14} />
            <span className="flex-1">{t.nav.applications}</span>
            {hasPending && (
              <span className="ml-auto min-w-[20px] h-5 rounded-full flex items-center justify-center text-white font-bold text-[10px] px-1.5" style={{ background: 'var(--danger)' }}>
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </Link>

          <div className="border-t mt-1 pt-1" style={{ borderColor: 'var(--border)' }}>
            <button onClick={() => { logout(); setOpen(false) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-red-400 hover:bg-red-500/8">
              <LogOut size={14} /> {t.nav.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
