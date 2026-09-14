'use client'


import { useState, useCallback, useMemo } from 'react'
import { useI18n }              from '@/app/i18n'
import { useSimulacionesStore } from '@/app/store/simulaciones.store'
import { simGet }               from '@/app/lib/http/sim-http-client'
import {
  Entregable,
  Equipo,
  EntregableEstado,
  EntregableTipo,
  HITO_ENTREGABLES,
} from '@/app/types/simulaciones'
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertCircle,
  Loader2,
  FileText,
  Eye,
  Clock,
} from 'lucide-react'
import { useEffect } from 'react'


function sanitizeFeedback(raw: string): string {
  return raw
    
    .replace(/<[^>]*>/g, '')
    
    .replace(/javascript\s*:/gi, '')
    
    .replace(/data\s*:/gi, '')
    
    .replace(/vbscript\s*:/gi, '')
    
    .replace(/on\w+\s*=/gi, '')
    
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
}


function sanitizeFeedbackParaLectura(raw: string | null | undefined): string {
  if (!raw) return ''
  return raw
    
    .replace(/<[^>]*>/g, '')
    
    // eslint-disable-next-line no-misleading-character-class
    .replace(/[\u202A-\u202E\u2066-\u2069\u200F\u200E]/g, '')
   
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    .trim()
}



const TIPO_LABEL: Record<EntregableTipo, { en: string; es: string }> = {
  [EntregableTipo.FIGMA]:      { en: 'Figma Prototype',    es: 'Prototipo Figma'      },
  [EntregableTipo.PRD]:        { en: 'PRD Document',       es: 'Documento PRD'        },
  [EntregableTipo.REPO_FRONT]: { en: 'Frontend Repo',      es: 'Repositorio Frontend' },
  [EntregableTipo.REPO_BACK]:  { en: 'Backend Repo',       es: 'Repositorio Backend'  },
  [EntregableTipo.DEMO]:       { en: 'Live Demo',          es: 'Demo en Vivo'         },
}

type L = 'en' | 'es'



const ESTADO_COLOR: Record<EntregableEstado, string> = {
  [EntregableEstado.APROBADO]:    'var(--accent)',
  [EntregableEstado.EN_REVISION]: 'var(--warning)',
  [EntregableEstado.RECHAZADO]:   'var(--danger)',
  [EntregableEstado.PENDIENTE]:   'var(--brand)',
}

const ESTADO_ICON: Record<EntregableEstado, React.ElementType> = {
  [EntregableEstado.APROBADO]:    CheckCircle2,
  [EntregableEstado.EN_REVISION]: Eye,
  [EntregableEstado.RECHAZADO]:   XCircle,
  [EntregableEstado.PENDIENTE]:   Clock,
}



interface EntregableEvalRowProps {
  tipo:        EntregableTipo
  entregable?: Entregable
  locale:      L
  feedback:    string
  onApprove:   (id: string) => void
  onReject:    (id: string) => void
  loadingId:   string | null
  feedbackRequired: boolean
}

function EntregableEvalRow({
  tipo,
  entregable,
  locale: l,
  feedback,
  onApprove,
  onReject,
  loadingId,
  feedbackRequired,
}: EntregableEvalRowProps) {
  if (!entregable?.urlLink) {
    return (
      <div
        className="flex items-center gap-3 rounded-xl border px-4 py-3 opacity-50"
        style={{ background: 'var(--bg-overlay)', borderColor: 'var(--border)' }}
      >
        <FileText size={14} strokeWidth={1.75} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {TIPO_LABEL[tipo][l]} — {s.notSubmitted}
        </p>
      </div>
    )
  }

  const estado     = entregable.estado
  const isLoading  = loadingId === entregable.id
  const isApproved = estado === EntregableEstado.APROBADO
  const isRejected = estado === EntregableEstado.RECHAZADO
  const Icon       = ESTADO_ICON[estado]
  const color      = ESTADO_COLOR[estado]

  return (
    <div
      className="rounded-xl border px-4 py-3 transition-all duration-200"
      style={{
        background:  `color-mix(in srgb, ${color} 4%, var(--bg-overlay))`,
        borderColor: `color-mix(in srgb, ${color} 22%, var(--border))`,
      }}
    >
      
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
              {TIPO_LABEL[tipo][l]}
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background:  `color-mix(in srgb, ${color} 10%, transparent)`,
                borderColor: `color-mix(in srgb, ${color} 25%, var(--border))`,
                color,
              }}
            >
              <Icon size={9} strokeWidth={2.5} />
              {estado}
            </span>
          </div>
          <a
            href={entregable.urlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono truncate max-w-[260px] underline transition-opacity hover:opacity-70"
            style={{ color: 'var(--brand)' }}
          >
            {entregable.urlLink.length > 50
              ? `${entregable.urlLink.slice(0, 50)}…`
              : entregable.urlLink}
            <ExternalLink size={10} strokeWidth={2} />
          </a>
        </div>

        
        {!isApproved && !isRejected && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onApprove(entregable.id)}
              disabled={isLoading}
              title={s.approveBtn}
              className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
              style={{
                background:  'color-mix(in srgb, var(--accent) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--accent) 28%, var(--border))',
                color:       'var(--accent)',
              }}
            >
              {isLoading
                ? <Loader2 size={12} strokeWidth={2} className="animate-spin" />
                : <CheckCircle2 size={12} strokeWidth={2} />}
              {s.approveBtn}
            </button>
            <button
              onClick={() => onReject(entregable.id)}
              disabled={isLoading || (feedbackRequired && !feedback.trim())}
              title={
                feedbackRequired && !feedback.trim()
                  ? (s.feedbackFirst)
                  : (s.rejectBtn)
              }
              className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40"
              style={{
                background:  'color-mix(in srgb, var(--danger) 10%, transparent)',
                borderColor: 'color-mix(in srgb, var(--danger) 28%, var(--border))',
                color:       'var(--danger)',
              }}
            >
              {isLoading
                ? <Loader2 size={12} strokeWidth={2} className="animate-spin" />
                : <XCircle size={12} strokeWidth={2} />}
              {s.rejectBtn}
            </button>
          </div>
        )}

       
        {(isApproved || isRejected) && (
          <span className="text-xs font-semibold flex-shrink-0" style={{ color }}>
            {isApproved ? '✓' : '✗'}
          </span>
        )}
      </div>

      
      {entregable.comentarios && (
        <div
          className="mt-2 rounded-lg px-3 py-2 text-xs leading-[1.65] whitespace-pre-wrap"
          style={{
            background:  `color-mix(in srgb, ${color} 6%, var(--bg-raised))`,
            border:      `1px solid color-mix(in srgb, ${color} 18%, var(--border))`,
            color:       'var(--text-muted)',
          }}
        >
          
          {sanitizeFeedbackParaLectura(entregable.comentarios)}
        </div>
      )}
    </div>
  )
}



interface HitoEvaluacionPanelProps {
  equipoId:    string
  equipo:      Equipo
}

export function HitoEvaluacionPanel({ equipoId, equipo }: HitoEvaluacionPanelProps) {
  const { locale }          = useI18n()
  const l: L                = locale === 'es' ? 'es' : 'en'
  const evaluarEntregable   = useSimulacionesStore((s) => s.evaluarEntregable)
  const limpiarErrorAccion  = useSimulacionesStore((s) => s.limpiarErrorAccion)
  const errorAccion         = useSimulacionesStore((s) => s.errorAccion)

  const [hitoActivo,    setHitoActivo]    = useState<1 | 2 | 3>(1)
  const [feedback,      setFeedback]      = useState('')
  const [loadingId,     setLoadingId]     = useState<string | null>(null)
  const [entregables,   setEntregables]   = useState<Entregable[]>([])
  const [loadingData,   setLoadingData]   = useState(false)

  
  useEffect(() => {
    if (!equipoId) return
    setLoadingData(true)
    simGet<Entregable[]>(`/entregables/equipo/${equipoId}`)
      .then(setEntregables)
      .catch(() => setEntregables([]))
      .finally(() => setLoadingData(false))
  }, [equipoId])

  const tiposDelHito = HITO_ENTREGABLES[hitoActivo]
  const entregableMap: Partial<Record<EntregableTipo, Entregable>> = useMemo(() => {
    const map: Partial<Record<EntregableTipo, Entregable>> = {}
    for (const e of entregables) { map[e.tipo] = e }
    return map
  }, [entregables])

  const handleApprove = useCallback(async (entregableId: string) => {
    setLoadingId(entregableId)
    limpiarErrorAccion()
    const sanitized = sanitizeFeedback(feedback)
    await evaluarEntregable(entregableId, EntregableEstado.APROBADO, sanitized)
   
    const updated = await simGet<Entregable[]>(`/entregables/equipo/${equipoId}`).catch(() => entregables)
    setEntregables(updated)
    setLoadingId(null)
  }, [feedback, equipoId, entregables, evaluarEntregable, limpiarErrorAccion])

  const handleReject = useCallback(async (entregableId: string) => {
    const sanitized = sanitizeFeedback(feedback)
    if (!sanitized) return   // Rechazar sin feedback bloqueado en UI y aquí
    setLoadingId(entregableId)
    limpiarErrorAccion()
    await evaluarEntregable(entregableId, EntregableEstado.RECHAZADO, sanitized)
    const updated = await simGet<Entregable[]>(`/entregables/equipo/${equipoId}`).catch(() => entregables)
    setEntregables(updated)
    setLoadingId(null)
    setFeedback('')
  }, [feedback, equipoId, entregables, evaluarEntregable, limpiarErrorAccion])

  const charCount    = feedback.length
  const maxChars     = 1000
  const feedbackWarn = charCount > maxChars * 0.85

  return (
    <div className="dc-card p-6">
      
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="font-semibold text-base mb-0.5" style={{ color: 'var(--text)' }}>
            {s.hitoEvalTitle}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            {equipo.nombreAutogenerado}
          </p>
        </div>

        
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              onClick={() => { setHitoActivo(n); setFeedback('') }}
              className="h-8 w-8 rounded-lg border text-xs font-bold transition-all duration-150"
              style={{
                background:  hitoActivo === n ? 'var(--brand)' : 'var(--bg-overlay)',
                borderColor: hitoActivo === n ? 'var(--brand)' : 'var(--border)',
                color:       hitoActivo === n ? '#fff' : 'var(--text-muted)',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      
      {loadingData && (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={20} strokeWidth={1.75} className="animate-spin" style={{ color: 'var(--brand)' }} />
        </div>
      )}

      
      {!loadingData && (
        <div className="flex flex-col gap-2.5 mb-5">
          {tiposDelHito.map((tipo) => (
            <EntregableEvalRow
              key={tipo}
              tipo={tipo}
              entregable={entregableMap[tipo]}
              locale={l}
              feedback={sanitizeFeedback(feedback)}
              onApprove={handleApprove}
              onReject={handleReject}
              loadingId={loadingId}
              feedbackRequired={true}
            />
          ))}
        </div>
      )}

      
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {s.feedbackLabel}
          </label>
          <span
            className="text-[10px] tabular-nums"
            style={{ color: feedbackWarn ? 'var(--warning)' : 'var(--text-dim)' }}
          >
            {charCount}/{maxChars}
          </span>
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value.slice(0, maxChars))}
          rows={4}
          placeholder={
            s.feedbackPlaceholder
          }
          className="w-full rounded-xl border px-3.5 py-3 text-sm font-mono resize-none outline-none transition-colors focus:ring-2 focus:ring-[--brand]"
          style={{
            background:  'var(--bg-overlay)',
            borderColor: feedbackWarn
              ? 'color-mix(in srgb, var(--warning) 40%, var(--border))'
              : 'var(--border)',
            color:       'var(--text)',
          }}
        />
        <p className="mt-1 text-[10px]" style={{ color: 'var(--text-dim)' }}>
          {l === 'es'
            ? 'El HTML será eliminado automáticamente antes de enviarse al servidor.'
            : 'HTML tags will be stripped automatically before sending to the server.'}
        </p>
      </div>

      
      {errorAccion && (
        <div
          className="flex items-start gap-2 rounded-xl border px-3.5 py-3 mt-3"
          role="alert"
          style={{
            background:  'color-mix(in srgb, var(--danger) 6%, var(--bg-overlay))',
            borderColor: 'color-mix(in srgb, var(--danger) 25%, var(--border))',
          }}
        >
          <AlertCircle size={13} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{errorAccion}</p>
        </div>
      )}
    </div>
  )
}
