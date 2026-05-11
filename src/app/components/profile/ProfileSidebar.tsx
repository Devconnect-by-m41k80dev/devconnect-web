'use client'

import Link from 'next/link'
import { MapPin, Calendar, Globe, Edit2, ExternalLink } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { SlSocialLinkedin } from 'react-icons/sl'
import { Avatar } from '@/app/components/ui/Avatar'
import { useI18n } from '@/app/i18n'
import { formatDate } from '@/app/lib/utils'
import { User } from '@/app/types/entities'

interface ProfileSidebarProps {
  user: User
  onEditClick: () => void
}

export function ProfileSidebar({ user, onEditClick }: ProfileSidebarProps) {
  const { t, locale } = useI18n()
  return (
    <div className="dc-card p-6 text-center anim-fade-up">
      <Avatar fullName={user.fullName} profileImageUrl={user.profileImageUrl} size="xl" className="mx-auto mb-4" />
      <h1 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--text)' }}>{user.fullName}</h1>
      {user.professionalRole && <p className="text-sm mb-3" style={{ color: 'var(--brand)' }}>{user.professionalRole.name}</p>}
      {user.bio && <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{user.bio}</p>}

      <div className="space-y-2 text-left mt-3">
        {user.location && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <MapPin size={13} style={{ color: 'var(--text-dim)' }} />{user.location}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <Calendar size={13} style={{ color: 'var(--text-dim)' }} />
          {t.profile.memberSince} {formatDate(user.createdAt, locale)}
        </div>
      </div>

      {(user.github || user.linkedin || user.portfolio) && (
        <div className="flex items-center justify-center gap-3 mt-5 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
          {user.github && <SocialLink href={user.github} icon={<SiGithub size={15} />} hoverColor="--brand" />}
          {user.linkedin && <SocialLink href={user.linkedin} icon={<SlSocialLinkedin size={15} />} hoverColor="--accent" />}
          {user.portfolio && <SocialLink href={user.portfolio} icon={<Globe size={15} />} hoverColor="--success" />}
        </div>
      )}

      <button onClick={onEditClick} className="dc-btn-ghost w-full mt-5 py-2 text-sm gap-1.5">
        <Edit2 size={13} /> {t.profile.editProfile}
      </button>
      <Link href={`/users/${user.id}`} className="mt-2 text-xs flex items-center justify-center gap-1 transition-colors hover:text-[--brand]" style={{ color: 'var(--text-dim)' }}>
        <ExternalLink size={11} /> View public profile
      </Link>
    </div>
  )
}

function SocialLink({ href, icon, hoverColor }: { href: string; icon: React.ReactNode; hoverColor: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className={`p-2 rounded-lg border transition-all hover:border-[${hoverColor}] hover:text-[${hoverColor}]`}
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
      {icon}
    </a>
  )
}
