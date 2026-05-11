'use client'

import { cn } from '@/app/lib/utils'

interface Props { page: number; totalPages: number; onPageChange: (n: number) => void }

export function ProjectsPagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button onClick={() => onPageChange(Math.max(1, page-1))} disabled={page === 1} className="dc-btn-ghost py-2 px-4 text-sm">← Prev</button>
      {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
        const n = i + 1
        return (
          <button key={n} onClick={() => onPageChange(n)} className={cn('w-9 h-9 rounded-lg text-sm font-medium transition-all duration-100', page === n ? 'text-white' : 'text-[--text-muted] hover:bg-[--bg-overlay]')} style={page === n ? { background: 'var(--brand)' } : {}}>
            {n}
          </button>
        )
      })}
      <button onClick={() => onPageChange(Math.min(totalPages, page+1))} disabled={page === totalPages} className="dc-btn-ghost py-2 px-4 text-sm">Next →</button>
    </div>
  )
}
