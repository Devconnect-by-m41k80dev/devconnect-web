'use client'

import { cn } from '@/app/lib/utils'
import { useI18n } from '@/app/i18n'
import { ProjectStatus } from '@/app/types/enums'

interface Props { selected: ProjectStatus | undefined; onSelect: (s: ProjectStatus) => void }

export function StatusPicker({ selected, onSelect }: Props) {
  const { t } = useI18n()
  return (
    <div>
      <label className="dc-label">{t.projects.filterStatus}</label>
      <div className="flex flex-wrap gap-2">
        {Object.values(ProjectStatus).map(s => (
          <button key={s} type="button" onClick={() => onSelect(s)} className={cn('px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-100', selected === s ? 'text-white border-transparent' : 'border-[--border] text-[--text-muted] hover:border-[--brand] hover:text-[--brand]')} style={selected === s ? { background: 'var(--brand)' } : {}}>
            {t.status[s]}
          </button>
        ))}
      </div>
    </div>
  )
}
