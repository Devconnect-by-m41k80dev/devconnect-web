'use client'

import { Users } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { UserProfileTab } from '@/app/hooks/useUserProfile'

interface Props {
  activeTab:  UserProfileTab
  followers:  number
  following:  number
  onTabChange:(t: UserProfileTab) => void
}

export function UserTabBar({ activeTab, followers, following, onTabChange }: Props) {
  const tabs: { key: UserProfileTab; label: string; count: number }[] = [
    { key: 'followers', label: `Followers (${followers})`, count: followers },
    { key: 'following', label: `Following (${following})`, count: following },
  ]
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}>
      {tabs.map(({ key, label }) => (
        <button key={key} onClick={() => onTabChange(key)} className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2', activeTab === key ? 'text-white' : 'text-[--text-muted] hover:text-[--text]')} style={activeTab === key ? { background: 'var(--brand)' } : {}}>
          <Users size={14} />{label}
        </button>
      ))}
    </div>
  )
}
