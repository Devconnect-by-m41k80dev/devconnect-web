'use client'

import Link from 'next/link'
import { MapPin, Calendar, Globe, UserPlus, UserMinus } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { SlSocialLinkedin } from 'react-icons/sl'
import { Avatar } from '@/app/components/ui/Avatar'
import { Spinner } from '@/app/components/ui/Spinner'
import { useI18n } from '@/app/i18n'
import { formatDate, cn } from '@/app/lib/utils'
import { User } from '@/app/types/entities'
import { UserProfileTab } from '@/app/hooks/useUserProfile'

interface Props {
  profile:       User
  followers:     User[]
  following:     User[]
  isOwnProfile:  boolean
  isFollowing:   boolean
  followLoading: boolean
  activeTab:     UserProfileTab
  onTabChange:   (t: UserProfileTab) => void
  onFollow:      () => void
}

export function UserProfileSidebar({ profile, followers, following, isOwnProfile, isFollowing, followLoading, activeTab, onTabChange, onFollow }: Props) {
  const { t, locale } = useI18n()
  return (
    <div className="dc-card p-6 anim-fade-up">
      <div className="text-center mb-5">
        <Avatar fullName={profile.fullName} profileImageUrl={profile.profileImageUrl} size="xl" className="mx-auto mb-4" />
        <h1 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>{profile.fullName}</h1>
        {profile.professionalRole && <p className="text-sm" style={{ color: 'var(--brand)' }}>{profile.professionalRole.name}</p>}
      </div>

      
      <div className="grid grid-cols-2 divide-x rounded-xl overflow-hidden border mb-4" style={{ borderColor: 'var(--border)' }}>
        {(['followers', 'following'] as UserProfileTab[]).map(tab => (
          <button key={tab} onClick={() => onTabChange(tab)} className={cn('py-3 text-center transition-colors', activeTab === tab ? 'bg-[--bg-overlay]' : 'hover:bg-[--bg-overlay]')}>
            <p className="font-bold text-base leading-none" style={{ color: 'var(--text)' }}>{tab === 'followers' ? followers.length : following.length}</p>
            <p className="text-[10px] mt-0.5 capitalize" style={{ color: 'var(--text-muted)' }}>{tab}</p>
          </button>
        ))}
      </div>

      {!isOwnProfile && (
        <button onClick={onFollow} disabled={followLoading} className={cn('w-full py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 flex items-center justify-center gap-2', isFollowing ? 'hover:border-[--danger] hover:text-[--danger]' : 'dc-btn-primary border-transparent')} style={isFollowing ? { borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'transparent' } : {}}>
          {followLoading ? <Spinner size="sm" /> : isFollowing ? <><UserMinus size={15} /> Unfollow</> : <><UserPlus size={15} /> Follow</>}
        </button>
      )}
      {isOwnProfile && <Link href="/profile" className="dc-btn-ghost w-full py-2.5 text-sm flex items-center justify-center gap-1.5">Edit my profile</Link>}

      {profile.bio && <p className="text-sm leading-relaxed mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{profile.bio}</p>}

      <div className="space-y-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        {profile.location && <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}><MapPin size={13} style={{ color: 'var(--text-dim)' }} />{profile.location}</div>}
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}><Calendar size={13} style={{ color: 'var(--text-dim)' }} />{t.profile.memberSince} {formatDate(profile.createdAt, locale)}</div>
      </div>

      {(profile.github || profile.linkedin || profile.portfolio) && (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          {profile.github && <SocialBtn href={profile.github} icon={<SiGithub size={15} />} hover="--brand" />}
          {profile.linkedin && <SocialBtn href={profile.linkedin} icon={<SlSocialLinkedin size={15} />} hover="--accent" />}
          {profile.portfolio && <SocialBtn href={profile.portfolio} icon={<Globe size={15} />} hover="--success" />}
        </div>
      )}
    </div>
  )
}

function SocialBtn({ href, icon, hover }: { href: string; icon: React.ReactNode; hover: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg border transition-all hover:border-[${hover}] hover:text-[${hover}]`} style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{icon}</a>
  )
}
