'use client'

import { X } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { useI18n } from '@/app/i18n'
import { GetProjectsDto } from '@/app/types/dtos'
import { ProjectStatus } from '@/app/types/enums'

const ALL_STATUSES = Object.values(ProjectStatus)
const COMMON_TECHS = ['React','Next.js','Vue','Angular','NestJS','Node.js','Python','Go','Rust','TypeScript','PostgreSQL','MongoDB']

interface Props {
  filters:    GetProjectsDto
  hasFilters: boolean
  setFilter:  <K extends keyof GetProjectsDto>(key: K, value: GetProjectsDto[K]) => void
  onClear:    () => void
}

export function ProjectsFilterPanel({ filters, hasFilters, setFilter, onClear }: Props) {
  const { t } = useI18n()
  return (
    <div className="dc-card p-5 mb-5 anim-scale-in">
      <div className="flex flex-wrap gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-dim)' }}>{t.projects.filterStatus}</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={!filters.status} onClick={() => setFilter('status', '' as GetProjectsDto['status'])} label={t.projects.allStatuses} />
            {ALL_STATUSES.map(s => <FilterChip key={s} active={filters.status === s} onClick={() => setFilter('status', s)} label={t.status[s]} />)}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-dim)' }}>{t.projects.filterTech}</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_TECHS.map(tech => <FilterChip key={tech} active={filters.tech === tech} onClick={() => setFilter('tech', filters.tech === tech ? '' : tech)} label={tech} accent />)}
          </div>
        </div>
      </div>
      {hasFilters && <button onClick={onClear} className="mt-4 text-xs flex items-center gap-1.5 hover:text-[--danger] transition-colors" style={{ color: 'var(--text-dim)' }}><X size={11} /> Clear all filters</button>}
    </div>
  )
}

function FilterChip({ active, onClick, label, accent }: { active: boolean; onClick: () => void; label: string; accent?: boolean }) {
  const activeColor = accent ? 'var(--accent)' : 'var(--brand)'
  return (
    <button onClick={onClick}
      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-100', active ? 'text-white border-transparent' : 'border-[--border] text-[--text-muted]',
        !active && (accent ? 'hover:border-[--accent] hover:text-[--accent]' : 'hover:border-[--brand] hover:text-[--brand]'))}
      style={active ? { background: activeColor } : {}}>
      {label}
    </button>
  )
}
