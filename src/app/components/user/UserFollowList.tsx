'use client'

import Link from 'next/link'
import { Users, MapPin, ExternalLink } from 'lucide-react'
import { Avatar } from '@/app/components/ui/Avatar'
import { cn } from '@/app/lib/utils'
import { User } from '@/app/types/entities'
import { UserProfileTab } from '@/app/hooks/useUserProfile'

interface Props { tab: UserProfileTab; list: User[] }

export function UserFollowList({ tab, list }: Props) {
  if (list.length === 0) return (
    <div className="dc-card p-16 text-center">
      <Users size={32} className="mx-auto mb-3" style={{ color: 'var(--text-dim)' }} />
      <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{tab === 'followers' ? 'No followers yet' : 'Not following anyone yet'}</p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{tab === 'followers' ? "When someone follows this user, they'll appear here." : "When this user follows someone, they'll appear here."}</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {list.map((u, i) => (
        <Link key={u.id} href={`/users/${u.id}`} className={cn('dc-card-interactive flex items-center gap-4 p-4 no-underline anim-fade-up', `delay-${Math.min(i+1,5)}`)}>
          <Avatar fullName={u.fullName} profileImageUrl={u.profileImageUrl} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{u.fullName}</p>
            {u.professionalRole && <p className="text-xs truncate" style={{ color: 'var(--brand)' }}>{u.professionalRole.name}</p>}
            {u.location && <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-dim)' }}><MapPin size={10} />{u.location}</p>}
          </div>
          {u.skills && u.skills.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1 justify-end max-w-[130px]">
              {u.skills.slice(0,3).map(s => <span key={s.id} className="font-mono text-[10px] px-2 py-0.5 rounded border" style={{ color: 'var(--text-dim)', borderColor: 'var(--border)', background: 'var(--bg-overlay)' }}>{s.name}</span>)}
            </div>
          )}
          <ExternalLink size={12} className="shrink-0" style={{ color: 'var(--text-dim)' }} />
        </Link>
      ))}
    </div>
  )
}
