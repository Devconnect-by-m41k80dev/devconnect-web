'use client'

import { Search, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { useI18n } from '@/app/i18n'


interface Props {
  search:       string
  hasFilters:   boolean
  filtersOpen:  boolean
  onSearchChange:(v: string) => void
  onSearchClear: () => void
  onToggleFilters:() => void
}

export function ProjectsSearchBar({ search, hasFilters, filtersOpen, onSearchChange, onSearchClear, onToggleFilters }: Props) {
  const { t } = useI18n()
  return (
    <div className="flex gap-3 mb-5 anim-fade-up delay-1">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-dim)' }} />
        <input type="search" value={search} onChange={e => onSearchChange(e.target.value)} placeholder={t.projects.search} className="dc-input pl-9" />
        {search && <button onClick={onSearchClear} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }}><X size={13} /></button>}
      </div>
      <button onClick={onToggleFilters} className={cn('dc-btn-ghost py-2.5 px-3.5 relative gap-2', filtersOpen && 'border-[--brand] text-[--brand]')}>
        <SlidersHorizontal size={15} />
        <span className="hidden sm:block text-sm">{t.projects.filterStatus}</span>
        {hasFilters && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-white text-[9px] flex items-center justify-center font-bold" style={{ background: 'var(--brand)' }}>•</span>}
      </button>
    </div>
  )
}
