'use client'

import { FaGithub, FaDiscord } from 'react-icons/fa'

import { useMemo } from 'react'
import { useI18n }   from '@/app/i18n'
import {
  Equipo,
  MiembroEquipo,
  RolIT,
  MatchmakingEstado,
} from '@/app/types/simulaciones'
import {
  Users,
  ChevronRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'



const ROL_SHORT: Record<RolIT, string> = {
  [RolIT.FRONTEND_DEVELOPER]:   'FE',
  [RolIT.BACKEND_DEVELOPER]:    'BE',
  [RolIT.FULL_STACK_DEVELOPER]: 'FS',
  [RolIT.UX_UI_DESIGNER]:       'UX',
  [RolIT.DATA_SCIENTIST]:       'DS',
  [RolIT.DATA_ENGINEER]:        'DE',
  [RolIT.DATA_ANALYST]:         'DA',
  [RolIT.MOBILE_DEVELOPER]:     'MOB',
  [RolIT.QA_ENGINEER]:          'QA',
  [RolIT.DEVOPS_ENGINEER]:      'OPS',
  [RolIT.CLOUD_ENGINEER]:       'CLD',
  [RolIT.PRODUCT_MANAGER]:      'PM',
  [RolIT.PROJECT_MANAGER]:      'PMG',
  [RolIT.SCRUM_MASTER]:         'SM',
}

const ROL_FULL: Record<RolIT, string> = {
  [RolIT.FRONTEND_DEVELOPER]:   'Frontend Dev',
  [RolIT.BACKEND_DEVELOPER]:    'Backend Dev',
  [RolIT.FULL_STACK_DEVELOPER]: 'Full Stack',
  [RolIT.UX_UI_DESIGNER]:       'UX/UI Designer',
  [RolIT.DATA_SCIENTIST]:       'Data Scientist',
  [RolIT.DATA_ENGINEER]:        'Data Engineer',
  [RolIT.DATA_ANALYST]:         'Data Analyst',
  [RolIT.MOBILE_DEVELOPER]:     'Mobile Dev',
  [RolIT.QA_ENGINEER]:          'QA Engineer',
  [RolIT.DEVOPS_ENGINEER]:      'DevOps',
  [RolIT.CLOUD_ENGINEER]:       'Cloud Engineer',
  [RolIT.PRODUCT_MANAGER]:      'Product Manager',
  [RolIT.PROJECT_MANAGER]:      'Project Manager',
  [RolIT.SCRUM_MASTER]:         'Scrum Master',
}

type L = 'en' | 'es'


function MiembroChip({ miembro }: { miembro: MiembroEquipo }) {
  const initials = ROL_SHORT[miembro.rolAsignado] ?? '?'
  return (
    <span
      title={`${miembro.usuarioId} — ${ROL_FULL[miembro.rolAsignado]}`}
      className="inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-medium font-mono cursor-default"
      style={{
        background:  'color-mix(in srgb, var(--brand) 8%, var(--bg-overlay))',
        borderColor: 'color-mix(in srgb, var(--brand) 20%, var(--border))',
        color:       'var(--brand)',
      }}
    >
      {initials}
    </span>
  )
}



interface EquipoCardProps {
  equipo:     Equipo
  locale:     L
  selected:   boolean
  onSelect:   (equipoId: string) => void
}

function EquipoCard({ equipo, locale: l, selected, onSelect }: EquipoCardProps) {
  const isPublicado = equipo.matchmakingEstado === MatchmakingEstado.PUBLICADO

  
  const allStack = useMemo(() => {
    const front = equipo.stackFrontendMatch ?? []
    const back  = equipo.stackBackendMatch  ?? []
    return Array.from(new Set([...front, ...back]))
  }, [equipo.stackFrontendMatch, equipo.stackBackendMatch])

  return (
    <div
      className="dc-card p-5 flex flex-col gap-4 transition-all duration-200"
      style={{
        border: selected
          ? `1.5px solid color-mix(in srgb, var(--brand) 40%, var(--border))`
          : undefined,
        boxShadow: selected
          ? `0 0 0 3px color-mix(in srgb, var(--brand) 12%, transparent)`
          : undefined,
      }}
    >
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>
            {equipo.nombreAutogenerado}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full border px-2 py-0.5"
              style={{
                background:  isPublicado
                  ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                  : 'color-mix(in srgb, var(--warning) 10%, transparent)',
                borderColor: isPublicado
                  ? 'color-mix(in srgb, var(--accent) 25%, var(--border))'
                  : 'color-mix(in srgb, var(--warning) 25%, var(--border))',
                color: isPublicado ? 'var(--accent)' : 'var(--warning)',
              }}
            >
              {isPublicado
                ? <CheckCircle2 size={9} strokeWidth={2.5} />
                : <Clock size={9} strokeWidth={2.5} />}
              {equipo.matchmakingEstado}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
              {equipo.miembros.length} {s.memberCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {equipo.discordChannelUrl && (
            <a
              href={equipo.discordChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Discord"
              className="flex items-center justify-center h-7 w-7 rounded-lg transition-colors hover:bg-[color:var(--bg-overlay)]"
              style={{ color: '#5865F2' }}
            >
              <FaDiscord size={14} />
            </a>
          )}
          {equipo.githubRepoUrl && (
            <a
              href={equipo.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="flex items-center justify-center h-7 w-7 rounded-lg transition-colors hover:bg-[color:var(--bg-overlay)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <FaGithub size={14} />
            </a>
          )}
        </div>
      </div>

      
      {allStack.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-dim)' }}>
            Stack
          </p>
          <div className="flex flex-wrap gap-1">
            {allStack.slice(0, 8).map((tech) => (
              <span
                key={tech}
                className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium font-mono"
                style={{ background: 'var(--bg-overlay)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                {tech}
              </span>
            ))}
            {allStack.length > 8 && (
              <span className="text-[10px] italic" style={{ color: 'var(--text-dim)' }}>
                +{allStack.length - 8}
              </span>
            )}
          </div>
        </div>
      )}

      
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-dim)' }}>
          {l === 'es' ? 'Miembros' : 'Members'}
        </p>
        <div className="flex flex-wrap gap-1">
          {equipo.miembros.map((m) => (
            <MiembroChip key={m.id} miembro={m} />
          ))}
        </div>
      </div>

      
      <button
        onClick={() => onSelect(equipo.id)}
        className={[
          'w-full flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all duration-200',
          selected ? 'dc-btn-primary' : 'dc-btn-ghost',
        ].join(' ')}
      >
        <Users size={12} strokeWidth={2} />
        {selected
          ? (s.evalActiveBtn)
          : (s.evalBtn)}
        {!selected && <ChevronRight size={12} strokeWidth={2} />}
      </button>
    </div>
  )
}



interface EquiposGridProps {
  equipos:          Equipo[]
  equipoSeleccionado: string | null
  onEquipoSelect:   (equipoId: string) => void
}

export function EquiposGrid({ equipos, equipoSeleccionado, onEquipoSelect }: EquiposGridProps) {
  const { t, locale } = useI18n()
  const s = t.simulations
  const l: L       = locale === 'es' ? 'es' : 'en'

  if (equipos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Users size={32} strokeWidth={1.5} className="mb-3" style={{ color: 'var(--text-dim)' }} />
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
          {s.noTeams}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {s.noTeamsSub}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-base" style={{ color: 'var(--text)' }}>
          {s.teams}
          <span className="ml-2 text-sm font-normal" style={{ color: 'var(--text-dim)' }}>
            ({equipos.length})
          </span>
        </h2>
        {equipoSeleccionado && (
          <span className="text-xs" style={{ color: 'var(--brand)' }}>
            {s.evalActive}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {equipos.map((eq) => (
          <EquipoCard
            key={eq.id}
            equipo={eq}
            locale={l}
            selected={equipoSeleccionado === eq.id}
            onSelect={onEquipoSelect}
          />
        ))}
      </div>
    </div>
  )
}
