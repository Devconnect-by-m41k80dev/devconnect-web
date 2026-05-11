'use client'

import { useStats } from '@/app/hooks/useStats'
import { useI18n } from '@/app/i18n'


function formatStatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return n.toString()
}

export function Stats() {
  const { t } = useI18n()
  const { stats, loading } = useStats()

  const items = [
    { value: stats?.projects,     label: t.landing.statsProjects },
    { value: stats?.users,        label: t.landing.statsDevs },
    { value: stats?.applications, label: t.landing.statsApplications },
  ]

  return (
    <div className="dc-container">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 anim-fade-up delay-4">
        {items.map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="font-display text-3xl font-bold" style={{ color: 'var(--text)' }}>
              {loading || value === undefined ? (
                <span className="dc-skeleton inline-block h-8 w-16 rounded align-middle" />
              ) : (
                formatStatNumber(value)
              )}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
