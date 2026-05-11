'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { useI18n } from '@/app/i18n'
import { useNotificationsStore } from '@/app/store/notifications.store'
import { ApplicationStatusBadge } from '@/app/components/ui/Badge'
import { AppliedProject } from '@/app/types/entities/applied-project.entity'
import { ApplicationStatus } from '@/app/types/enums'
import { useEffect } from 'react'

const DISCORD_URL = 'https://discord.gg/5xEWnfJDjt'

interface Props { apps: AppliedProject[]; loading: boolean }


function AcceptedDiscordBanner({ projectTitle }: { projectTitle: string }) {
  return (
    <div
      className="mt-3 rounded-xl border p-3.5 anim-scale-in"
      style={{
        background: 'color-mix(in srgb, #5865F2 8%, transparent)',
        borderColor: 'color-mix(in srgb, #5865F2 28%, transparent)',
      }}
    >
      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>
        🎉 You were accepted to <span style={{ color: '#5865F2' }}>{projectTitle}</span>
      </p>
      <p className="text-xs mb-2.5" style={{ color: 'var(--text-muted)' }}>
        Join the DevConnect community to collaborate on this project ✅
      </p>
      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
        style={{ background: '#5865F2' }}
      >
        
        <svg width="13" height="10" viewBox="0 0 127.14 96.36" fill="white">
          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
        </svg>
        Join Discord →
      </a>
    </div>
  )
}

export function ProfileApplicationsList({ apps, loading }: Props) {
  const { t, locale } = useI18n()
  const { markAcceptedSeen } = useNotificationsStore()

  
  useEffect(() => {
    if (!loading && apps.some(a => a.status === ApplicationStatus.ACCEPTED)) {
      markAcceptedSeen()
    }
  }, [loading, apps, markAcceptedSeen])

  return (
    <div className="anim-fade-up delay-1">
      <h2 className="font-semibold mb-4" style={{ color: 'var(--text)' }}>
        {t.profile.applications}
      </h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="dc-card p-4">
              <div className="dc-skeleton h-4 w-1/3 rounded mb-2" />
              <div className="dc-skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="dc-card p-10 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {t.profile.noApplications}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app, i) => {
            const isAccepted = app.status === ApplicationStatus.ACCEPTED

            return (
              <div
                key={app.applicationId}
                className={`dc-card p-4 anim-fade-up delay-${Math.min(i + 1, 5)}`}
                style={
                  isAccepted
                    ? {
                        borderColor: 'color-mix(in srgb, var(--success) 30%, var(--border))',
                        background: 'color-mix(in srgb, var(--success) 3%, var(--bg-raised))',
                      }
                    : {}
                }
              >
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/projects/${app.project?.id}`}
                      className="text-sm font-medium hover:text-[--brand] transition-colors truncate block"
                      style={{ color: 'var(--text)' }}
                    >
                      {app.project?.title}
                    </Link>
                    {app.message && (
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {app.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <ApplicationStatusBadge status={app.status} locale={locale} />
                    <Link
                      href={`/projects/${app.project?.id}`}
                      className="p-1.5 rounded-lg hover:bg-[--bg-overlay] transition-colors"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>

                
                {isAccepted && app.project?.title && (
                  <AcceptedDiscordBanner projectTitle={app.project.title} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
