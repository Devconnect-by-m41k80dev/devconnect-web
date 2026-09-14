'use client'


import { useState, useCallback } from 'react'
import { useI18n }               from '@/app/i18n'
import { useSimulacionesStore }  from '@/app/store/simulaciones.store'
import {
  Entregable,
  EntregableEstado,
  EntregableTipo,
  HITO_ENTREGABLES,
} from '@/app/types/simulaciones'
import {
  ExternalLink,
  Send,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  Link2,
  AlertCircle,
} from 'lucide-react'



const URL_REGEX = /^https?:\/\/.{3,}/i



function sanitizeFeedbackParaLectura(raw: string | null | undefined): string {
  if (!raw) return ''
  return raw
    .replace(/<[^>]*>/g, '')                        
    .replace(/[\u202A-\u202E\u2066-\u2069\u200F\u200E]/g, '')  
    .replace(/[\u200B-\u200D\uFEFF]/g, '')         
    .replace(/javascript\s*:/gi, '')               
    .replace(/data\s*:/gi, '')                     
    .trim()
}

function isValidUrl(val: string): boolean {
  return URL_REGEX.test(val.trim())
}


type L = 'en' | 'es'



interface EstadoVisual {
  colorVar:   string
  bgVar:      string
  borderVar:  string
  Icon:       React.ElementType
  label:      (l: L) => string
}

const ESTADO_VISUAL: Record<EntregableEstado, EstadoVisual> = {
  [EntregableEstado.APROBADO]: {
    colorVar:  'var(--accent)',
    bgVar:     'color-mix(in srgb, var(--accent) 10%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--accent) 25%, var(--border))',
    Icon:      CheckCircle2,
    label:     (l) => s.approved,
  },
  [EntregableEstado.EN_REVISION]: {
    colorVar:  'var(--warning)',
    bgVar:     'color-mix(in srgb, var(--warning) 10%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--warning) 25%, var(--border))',
    Icon:      Eye,
    label:     (l) => s.inReview,
  },
  [EntregableEstado.RECHAZADO]: {
    colorVar:  'var(--danger)',
    bgVar:     'color-mix(in srgb, var(--danger) 10%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--danger) 28%, var(--border))',
    Icon:      AlertTriangle,
    label:     (l) => s.rejected,
  },
  [EntregableEstado.PENDIENTE]: {
    colorVar:  'var(--brand)',
    bgVar:     'color-mix(in srgb, var(--brand) 8%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--brand) 22%, var(--border))',
    Icon:      Clock,
    label:     (l) => s.pending,
  },
}



interface FeedbackBannerProps {
  comentarios: string | null | undefined
  locale:      L
}

function FeedbackBanner({ comentarios, locale: l }: FeedbackBannerProps) {
  const [open, setOpen] = useState(true)

  return (
    <div
      className="mt-3 rounded-xl overflow-hidden"
      style={{
        background:  'color-mix(in srgb, var(--danger) 6%, var(--bg-overlay))',
        border:      '1px solid color-mix(in srgb, var(--danger) 28%, var(--border))',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--danger)' }}>
          <AlertTriangle size={12} strokeWidth={2} />
          {s.feedbackTitle}
        </span>
        <span style={{ color: 'var(--danger)' }}>
          {open
            ? <ChevronUp   size={13} strokeWidth={1.75} />
            : <ChevronDown size={13} strokeWidth={1.75} />}
        </span>
      </button>

      {open && (
        <div
          className="px-3.5 pb-3 text-xs leading-[1.72] whitespace-pre-wrap"
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--danger) 20%, var(--border))',
            color:     'var(--text-muted)',
            paddingTop: '0.625rem',
          }}
        >
          
          {sanitizeFeedbackParaLectura(comentarios)}
        </div>
      )}
    </div>
  )
}


interface EntregableRowProps {
  entregable?:   Entregable
  tipo:          EntregableTipo
  locale:        L
  onSubmit:      (entregableId: string, url: string) => Promise<void>
  equipoId:      string
}

function EntregableRow({ entregable, tipo, locale: l, onSubmit, equipoId: _ }: EntregableRowProps) {
  const [url,       setUrl]       = useState(entregable?.urlLink ?? '')
  const [touched,   setTouched]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const estado     = entregable?.estado ?? null
  const canEdit    = !estado || estado === EntregableEstado.RECHAZADO || estado === EntregableEstado.PENDIENTE
  const isApproved = estado === EntregableEstado.APROBADO
  const showInput  = canEdit && !isApproved
  const urlTouched = touched && url.trim().length > 0
  const urlInvalid = urlTouched && !isValidUrl(url)

  const visual = estado ? ESTADO_VISUAL[estado] : null

  const handleSubmit = useCallback(async () => {
    setTouched(true)
    if (!entregable || !isValidUrl(url)) return

    setSubmitting(true)
    try {
      await onSubmit(entregable.id, url.trim())
    } finally {
      setSubmitting(false)
    }
  }, [entregable, url, onSubmit])

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200"
      style={{
        background:  visual ? visual.bgVar : 'var(--bg-overlay)',
        border:      `1.5px solid ${visual ? visual.borderVar : 'var(--border)'}`,
      }}
    >
      
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
            {TIPO_LABEL[tipo][l]}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            {TIPO_DESC[tipo][l]}
          </p>
        </div>

       
        {visual && (
          <span
            className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shrink-0"
            style={{
              background:  visual.bgVar,
              borderColor: visual.borderVar,
              color:       visual.colorVar,
            }}
          >
            <visual.Icon size={9} strokeWidth={2.5} />
            {visual.label(l)}
          </span>
        )}
      </div>

      
      {entregable?.urlLink && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3 text-xs font-mono truncate"
          style={{
            background:  'var(--bg-raised)',
            border:      '1px solid var(--border)',
          }}
        >
          <Link2 size={11} strokeWidth={2} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
          <span className="truncate flex-1" style={{ color: 'var(--text-muted)' }}>
            {entregable.urlLink}
          </span>
          <a
            href={entregable.urlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 font-sans font-medium transition-colors"
            style={{ color: 'var(--brand)' }}
            aria-label={`${s.viewLink} ${TIPO_LABEL[tipo][l]}`}
          >
            {s.viewLink}
            <ExternalLink size={10} strokeWidth={2} />
          </a>
        </div>
      )}

      
      {showInput && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setTouched(false) }}
                onBlur={() => setTouched(true)}
                onKeyDown={handleKey}
                placeholder={s.urlPlaceholder}
                disabled={submitting || isApproved}
                aria-invalid={urlInvalid}
                aria-describedby={urlInvalid ? `url-err-${tipo}` : undefined}
                className="w-full rounded-lg border px-3 py-2 text-xs font-mono outline-none transition-colors focus:ring-2 focus:ring-[--brand] disabled:opacity-60"
                style={{
                  background:  'var(--bg-raised)',
                  borderColor: urlInvalid
                    ? 'color-mix(in srgb, var(--danger) 55%, var(--border))'
                    : 'var(--border)',
                  color:       'var(--text)',
                }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !url.trim() || isApproved}
              className="dc-btn-primary shrink-0 px-4 py-2 text-xs disabled:opacity-50"
              aria-label={
                estado === EntregableEstado.RECHAZADO
                  ? s.resubmitBtn
                  : s.submitBtn
              }
            >
              {submitting
                ? <Loader2 size={13} strokeWidth={2} className="animate-spin" />
                : <Send    size={13} strokeWidth={2} />}
              {submitting
                ? s.submitting
                : estado === EntregableEstado.RECHAZADO
                  ? s.resubmitBtn
                  : s.submitBtn}
            </button>
          </div>

         
          {urlInvalid && (
            <p
              id={`url-err-${tipo}`}
              role="alert"
              className="flex items-center gap-1.5 text-[11px]"
              style={{ color: 'var(--danger)' }}
            >
              <AlertCircle size={11} strokeWidth={2} />
              {s.urlInvalid}
            </p>
          )}
        </div>
      )}

      {/* Banner de feedback si fue RECHAZADO */}
      {estado === EntregableEstado.RECHAZADO && entregable?.comentarios && (
        <FeedbackBanner comentarios={entregable.comentarios} locale={l} />
      )}
    </div>
  )
}



interface EntregablesTableProps {
  hito:        1 | 2 | 3
  entregables: Entregable[]
  equipoId:    string
}

export function EntregablesTable({ hito, entregables, equipoId }: EntregablesTableProps) {
  const { t, locale }        = useI18n()
  const s                    = t.simulations
  const l: L                 = locale === 'es' ? 'es' : 'en'
  const subirUrlEntregable   = useSimulacionesStore((s) => s.subirUrlEntregable)
  const errorAccion          = useSimulacionesStore((s) => s.errorAccion)
  const limpiarErrorAccion   = useSimulacionesStore((s) => s.limpiarErrorAccion)

  
  const tiposDelHito = HITO_ENTREGABLES[hito]

  
  const entregableByTipo: Partial<Record<EntregableTipo, Entregable>> = {}
  for (const e of entregables) {
    entregableByTipo[e.tipo] = e
  }

  const handleSubmit = useCallback(async (entregableId: string, url: string) => {
    await subirUrlEntregable(entregableId, url)
  }, [subirUrlEntregable])

  return (
    <div className="dc-card p-6 anim-fade-up delay-2">

      
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2
            className="font-semibold text-base mb-0.5"
            style={{ color: 'var(--text)' }}
          >
            {s.tableTitle}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
            {s.hitoLabel} {hito} · {tiposDelHito.length}{' '}
            {l === 'es' ? 'entregables requeridos' : 'required deliverables'}
          </p>
        </div>

        
        <span
          className="text-xs font-semibold tabular-nums shrink-0"
          style={{ color: 'var(--text-dim)' }}
        >
          {entregables.filter((e) => e.hito === hito && e.estado === EntregableEstado.APROBADO).length}
          {' / '}
          {tiposDelHito.length}
          {' '}
          {l === 'es' ? 'aprobados' : 'approved'}
        </span>
      </div>

      {errorAccion && (
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-4"
          style={{
            background:  'color-mix(in srgb, var(--danger) 8%, var(--bg-overlay))',
            border:      '1px solid color-mix(in srgb, var(--danger) 28%, var(--border))',
          }}
          role="alert"
        >
          <AlertCircle size={14} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
          <span className="text-sm flex-1" style={{ color: 'var(--text-muted)' }}>
            {errorAccion}
          </span>
          <button
            onClick={limpiarErrorAccion}
            className="shrink-0 text-xs underline transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-dim)' }}
          >
            {l === 'es' ? 'Cerrar' : 'Dismiss'}
          </button>
        </div>
      )}

      
      {tiposDelHito.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--text-dim)' }}>
          {s.noEntregables}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {tiposDelHito.map((tipo) => (
            <EntregableRow
              key={tipo}
              tipo={tipo}
              entregable={entregableByTipo[tipo]}
              locale={l}
              onSubmit={handleSubmit}
              equipoId={equipoId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
