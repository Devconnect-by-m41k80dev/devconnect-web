'use client'

import { useI18n } from '@/app/i18n'
import { User } from '@/app/types/entities'

export function ProfileSkills({ skills }: { skills: User['skills'] }) {
  const { t } = useI18n()
  if (!skills || skills.length === 0) return null
  return (
    <div className="dc-card p-5 anim-fade-up delay-1">
      <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>{t.profile.skillsLabel}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map(s => (
          <span key={s.id} className="font-mono text-xs px-2.5 py-1 rounded-lg border"
            style={{ color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 22%, transparent)', background: 'color-mix(in srgb, var(--accent) 7%, transparent)' }}>
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}
