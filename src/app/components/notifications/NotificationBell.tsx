'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useAuthStore } from '@/app/store/auth.store'
import { useNotificationsStore } from '@/app/store/notifications.store'
import { cn } from '@/app/lib/utils'

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { user, isAuthenticated } = useAuthStore()
  const { pendingCount, fetchPending, reset } = useNotificationsStore()

  useEffect(() => {
    if (isAuthenticated && user?.id) fetchPending(user.id)
  }, [isAuthenticated, user?.id, fetchPending])

  useEffect(() => {
    if (!isAuthenticated) reset()
  }, [isAuthenticated, reset])

  if (!isAuthenticated) return null

  return (
    <Link
      href="/applications"
      className={cn(
        'relative p-2 rounded-lg transition-colors text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]',
        className
      )}
      aria-label={`Applications${pendingCount > 0 ? ` — ${pendingCount} pending` : ''}`}
    >
      <Bell size={17} />
      {pendingCount > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-white font-bold"
          style={{ background: 'var(--danger)', fontSize: '9px', padding: '0 3px' }}
        >
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      )}
    </Link>
  )
}
