'use client'


import { useMemo } from 'react'
import { useI18n } from '@/app/i18n'
import {
  Entregable,
  EntregableEstado,
  EntregableTipo,
  HITO_ENTREGABLES,
  selectEntregablesPorHito,
  selectHitoCompletado,
  selectHitoActivo,
} from '@/app/types/simulaciones'
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Lock,
  Trophy,
  ChevronRight,
} from 'lucide-react'



type HitoStatus = 'COMPLETADO' | 'EN_REVISION' | 'RECHAZADO' | 'ACTIVO' | 'BLOQUEADO'

interface HitoDisplay {
  number:      1 | 2 | 3
  status:      HitoStatus
  entregables: Entregable[]
  tipos:       readonly EntregableTipo[]
}



function resolveHitoStatus(entregables: Entregable[], hito: 1 | 2 | 3, hitoActivo: 1 | 2 | 3 | null): HitoStatus {
  const del = entregables.filter((e) => e.hito === hito)

  if (del.length === 0) {
    return hitoActivo === hito ? 'ACTIVO' : 'BLOQUEADO'
  }

  
  if (del.some((e) => e.estado === EntregableEstado.RECHAZADO))   return 'RECHAZADO'
  if (del.some((e) => e.estado === EntregableEstado.EN_REVISION)) return 'EN_REVISION'
  if (del.every((e) => e.estado === EntregableEstado.APROBADO))   return 'COMPLETADO'
  return 'ACTIVO'
}



interface StatusConfig {
  colorVar:   string
  bgVar:      string
  borderVar:  string
  Icon:       React.ElementType
  labelEn:    string
  labelEs:    string
}

const STATUS_CONFIG: Record<HitoStatus, StatusConfig> = {
  COMPLETADO:  {
    colorVar:  'var(--accent)',
    bgVar:     'color-mix(in srgb, var(--accent) 10%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--accent) 25%, var(--border))',
    Icon:      CheckCircle2,
    labelEn:   'Completed',
    labelEs:   'Completado',
  },
  EN_REVISION: {
    colorVar:  'var(--warning)',
    bgVar:     'color-mix(in srgb, var(--warning) 10%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--warning) 25%, var(--border))',
    Icon:      Eye,
    labelEn:   'In Review',
    labelEs:   'En Revisión',
  },
  RECHAZADO:   {
    colorVar:  'var(--danger)',
    bgVar:     'color-mix(in srgb, var(--danger) 10%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--danger) 28%, var(--border))',
    Icon:      AlertTriangle,
    labelEn:   'Action Required',
    labelEs:   'Requiere Acción',
  },
  ACTIVO:      {
    colorVar:  'var(--brand)',
    bgVar:     'color-mix(in srgb, var(--brand) 8%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--brand) 22%, var(--border))',
    Icon:      Clock,
    labelEn:   'In Progress',
    labelEs:   'En Progreso',
  },
  BLOQUEADO:   {
    colorVar:  'var(--text-dim)',
    bgVar:     'var(--bg-raised)',
    borderVar: 'var(--border)',
    Icon:      Lock,
    labelEn:   'Locked',
    labelEs:   'Bloqueado',
  },
}



const TIPO_LABEL: Record<EntregableTipo, { en: string; es: string }> = {
  [EntregableTipo.FIGMA]:      { en: 'Figma Prototype', es: 'Prototipo Figma'    },
  [EntregableTipo.PRD]:        { en: 'PRD Document',    es: 'Documento PRD'      },
  [EntregableTipo.REPO_FRONT]: { en: 'Frontend Repo',   es: 'Repositorio Front'  },
  [EntregableTipo.REPO_BACK]:  { en: 'Backend Repo',    es: 'Repositorio Back'   },
  [EntregableTipo.DEMO]:       { en: 'Live Demo',       es: 'Demo en Vivo'       },
}

const ESTADO_LABEL: Record<EntregableEstado, { en: string; es: string }> = {
  [EntregableEstado.PENDIENTE]:   { en: 'Pending',     es: 'Pendiente'    },
  [EntregableEstado.EN_REVISION]: { en: 'In Review',   es: 'En Revisión'  },
  [EntregableEstado.APROBADO]:    { en: 'Approved',    es: 'Aprobado'     },
  [EntregableEstado.RECHAZADO]:   { en: 'Rejected',    es: 'Rechazado'    },
}

const HITO_TITLE: Record<1 | 2 | 3, { en: string; es: string }> = {
  1: { en: 'Milestone 1 — Design & Planning',        es: 'Hito 1 — Diseño y Planning'          },
  2: { en: 'Milestone 2 — Development & QA',         es: 'Hito 2 — Desarrollo y QA'            },
  3: { en: 'Milestone 3 — Demo Day & Certificates',  es: 'Hito 3 — Demo Day y Certificados'    },
}



interface HitoTimelineProps {
  entregables:   Entregable[]
  onHitoSelect?: (hito: 1 | 2 | 3) => void
  hitoSelected:  1 | 2 | 3
}



export function HitoTimeline({ entregables, onHitoSelect, hitoSelected }: HitoTimelineProps) {
  const { t, locale } = useI18n()
  const s = t.simulations
  const l          = locale === 'es' ? 'es' : 'en'

  const hitoActivo = useMemo(() => selectHitoActivo(entregables), [entregables])
  const porHito    = useMemo(() => selectEntregablesPorHito(entregables), [entregables])

  const hitos: HitoDisplay[] = useMemo(() => ([1, 2, 3] as const).map((n) => ({
    number:      n,
    status:      resolveHitoStatus(entregables, n, hitoActivo),
    entregables: porHito[n],
    tipos:       HITO_ENTREGABLES[n],
  })), [entregables, hitoActivo, porHito])

 
  const totalAprobados  = entregables.filter((e) => e.estado === EntregableEstado.APROBADO).length
  const totalEntregables = Object.values(HITO_ENTREGABLES).flat().length  // siempre 5
  const pct = Math.round((totalAprobados / totalEntregables) * 100)

  return (
    <div className="dc-card p-6 anim-fade-up">

      
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2
            className="font-semibold text-base mb-0.5"
            style={{ color: 'var(--text)' }}
          >
            {s.dashTeamProgress}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            {l === 'es'
              ? `${totalAprobados} de ${totalEntregables} entregables aprobados`
              : `${totalAprobados} of ${totalEntregables} deliverables approved`}
          </p>
        </div>

        
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold shrink-0"
          style={{
            background:  pct === 100 ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'color-mix(in srgb, var(--brand) 10%, transparent)',
            borderColor: pct === 100 ? 'color-mix(in srgb, var(--accent) 30%, transparent)' : 'color-mix(in srgb, var(--brand) 25%, transparent)',
            color:       pct === 100 ? 'var(--accent)' : 'var(--brand)',
          }}
        >
          {pct === 100 && <Trophy size={11} strokeWidth={2} />}
          {pct}%
        </span>
      </div>

      
      <div
        className="relative h-1.5 rounded-full mb-6 overflow-hidden"
        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={l === 'es' ? `${s.dashColProgress}: ${pct}%` : `${s.dashColProgress}: ${pct}%`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width:      `${pct}%`,
            background: pct === 100
              ? 'linear-gradient(90deg, var(--accent), var(--brand))'
              : 'linear-gradient(90deg, var(--brand), var(--accent))',
          }}
        />
      </div>

      
      <div className="flex flex-col gap-3">
        {hitos.map((hito, idx) => {
          const cfg      = STATUS_CONFIG[hito.status]
          const isActive = hito.number === hitoSelected
          const canClick = hito.status !== 'BLOQUEADO'

          return (
            <div key={hito.number} className="flex items-stretch gap-0">

              
              <div className="flex flex-col items-center mr-4 shrink-0">
                
                <button
                  onClick={() => canClick && onHitoSelect?.(hito.number)}
                  disabled={!canClick}
                  aria-label={`${s.dashColProgress} ${HITO_TITLE[hito.number][l]}`}
                  className="relative flex items-center justify-center rounded-full transition-all duration-200 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    width:       isActive ? '2.5rem' : '2rem',
                    height:      isActive ? '2.5rem' : '2rem',
                    background:  cfg.bgVar,
                    border:      `${isActive ? '2px' : '1.5px'} solid ${cfg.borderVar}`,
                    color:       cfg.colorVar,
                    boxShadow:   isActive
                      ? `0 0 16px color-mix(in srgb, ${cfg.colorVar} 30%, transparent)`
                      : 'none',
                    flexShrink: 0,
                  }}
                >
                  <cfg.Icon size={isActive ? 15 : 13} strokeWidth={2} />
                </button>

                
                {idx < 2 && (
                  <div
                    className="flex-1 w-px mt-1"
                    style={{
                      minHeight:  '1.5rem',
                      background: selectHitoCompletado(entregables, hito.number)
                        ? `linear-gradient(180deg, ${cfg.colorVar}, var(--border))`
                        : 'var(--border)',
                    }}
                  />
                )}
              </div>

              
              <button
                onClick={() => canClick && onHitoSelect?.(hito.number)}
                disabled={!canClick}
                className={[
                  'flex-1 text-left rounded-xl px-4 py-3 mb-3 transition-all duration-200',
                  'disabled:cursor-default',
                  canClick && !isActive ? 'hover:border-[--brand] hover:shadow-sm' : '',
                ].join(' ')}
                style={{
                  background:  isActive ? cfg.bgVar : 'var(--bg-overlay)',
                  border:      `1.5px solid ${isActive ? cfg.borderVar : 'var(--border)'}`,
                  cursor:      canClick ? 'pointer' : 'default',
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className="text-sm font-semibold leading-tight"
                    style={{ color: isActive ? cfg.colorVar : 'var(--text)' }}
                  >
                    {HITO_TITLE[hito.number][l]}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    
                    <span
                      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                      style={{
                        background:  cfg.bgVar,
                        borderColor: cfg.borderVar,
                        color:       cfg.colorVar,
                      }}
                    >
                      <cfg.Icon size={9} strokeWidth={2.5} />
                      {l === 'es' ? cfg.labelEs : cfg.labelEn}
                    </span>
                    {canClick && !isActive && (
                      <ChevronRight size={14} strokeWidth={1.5} style={{ color: 'var(--text-dim)' }} />
                    )}
                  </div>
                </div>

                
                <div className="flex flex-wrap gap-1.5">
                  {hito.tipos.map((tipo) => {
                    const entregable = hito.entregables.find((e) => e.tipo === tipo)
                    const estado     = entregable?.estado ?? null

                    const estadoColor: Record<EntregableEstado, string> = {
                      [EntregableEstado.APROBADO]:    'var(--accent)',
                      [EntregableEstado.EN_REVISION]: 'var(--warning)',
                      [EntregableEstado.RECHAZADO]:   'var(--danger)',
                      [EntregableEstado.PENDIENTE]:   'var(--brand)',
                    }

                    return (
                      <span
                        key={tipo}
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          background:  estado
                            ? `color-mix(in srgb, ${estadoColor[estado]} 8%, var(--bg-raised))`
                            : 'var(--bg-raised)',
                          borderColor: estado
                            ? `color-mix(in srgb, ${estadoColor[estado]} 22%, var(--border))`
                            : 'var(--border)',
                          color: estado ? estadoColor[estado] : 'var(--text-dim)',
                        }}
                        title={estado ? ESTADO_LABEL[estado][l] : (l === 'es' ? 'Sin subir' : 'Not submitted')}
                      >
                        {TIPO_LABEL[tipo][l]}
                        {estado && (
                          <>
                            {' · '}
                            {ESTADO_LABEL[estado][l]}
                          </>
                        )}
                      </span>
                    )
                  })}
                </div>

              </button>
            </div>
          )
        })}
      </div>

    </div>
  )
}
