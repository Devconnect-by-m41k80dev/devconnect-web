'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter }    from 'next/navigation'
import { useI18n }      from '@/app/i18n'
import { useModal }     from '@/app/context/ModalContext'
import { useAuthStore } from '@/app/store/auth.store'
import { usersApi }     from '@/app/lib/api'
import { ShimmerBadge } from '@/app/components/ui/ShimmerBadge'
import { FaGithub }     from 'react-icons/fa'
import {
  ArrowRight, CheckCircle2, X, AlertCircle, Loader2, ShieldCheck,
  BriefcaseBusiness, Lock, Clock,
} from 'lucide-react'
import { Simulacion, SimulacionEstado } from '@/app/types/simulaciones'

const DEVELOPER_ROLE_KEYWORDS = ['frontend','backend','full stack','fullstack','mobile','devops','cloud','data engineer']
function isDevRole(name: string | null | undefined): boolean {
  if (!name) return false
  const lower = name.toLowerCase()
  return DEVELOPER_ROLE_KEYWORDS.some((kw) => lower.includes(kw))
}
const GITHUB_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/


function isInscripcionCerrada(simulacion: Simulacion | null): boolean {
  if (!simulacion) return false
  if (simulacion.estado === SimulacionEstado.CIERRE_INSCRIPCIONES) return true
  if (simulacion.estado === SimulacionEstado.EN_CURSO)              return true
  if (simulacion.estado === SimulacionEstado.FINALIZADO)            return true
  if (simulacion.fechaLimiteInscripcion) {
    return new Date() >= new Date(simulacion.fechaLimiteInscripcion)
  }
  return false
}

interface GitHubDialogProps { onSaved: () => void; onCancel: () => void }

function GitHubDialog({ onSaved, onCancel }: GitHubDialogProps) {
  const { t } = useI18n()
  const s = t.simulations
  const [value,    setValue]    = useState('')
  const [touched,  setTouched]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const { fetchMe } = useAuthStore()

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', fn); return () => document.removeEventListener('keydown', fn)
  }, [onCancel])
  useEffect(() => {
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const trimmed  = value.trim()
  const isValid  = GITHUB_REGEX.test(trimmed)
  const showErr  = touched && trimmed.length > 0 && !isValid

  const handleSave = useCallback(async () => {
    setTouched(true)
    if (!isValid || !trimmed) return
    setLoading(true); setApiError(null)
    try {
      await usersApi.updateProfile({ github: trimmed })
      await fetchMe(); onSaved()
    } catch { setApiError(s.ghDlgApiErr); setLoading(false) }
  }, [isValid, trimmed, fetchMe, onSaved, s])

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="gh-dlg-title" className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.62)' }} onClick={onCancel}>
      <div className="relative w-full max-w-md rounded-2xl border p-8 shadow-2xl anim-scale-in" style={{ background: 'var(--bg-raised)', borderColor: 'color-mix(in srgb, var(--brand) 30%, var(--border))' }} onClick={(e) => e.stopPropagation()}>
        <div aria-hidden className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--brand) 14%, transparent), transparent 65%)', filter: 'blur(40px)' }} />
        <button onClick={onCancel} className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-[color:var(--bg-overlay)]" style={{ color: 'var(--text-muted)' }} aria-label={s.ghDlgCancel}><X size={16} /></button>
        <div className="relative mb-5 inline-flex items-center justify-center h-12 w-12 rounded-2xl" style={{ background: 'color-mix(in srgb, var(--brand) 10%, var(--bg-overlay))', border: '1px solid color-mix(in srgb, var(--brand) 25%, var(--border))', color: 'var(--brand)' }}>
          <FaGithub size={22} />
        </div>
        <h2 id="gh-dlg-title" className="relative font-display font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>{s.ghDlgTitle}</h2>
        <p className="relative text-sm leading-[1.72] mb-6" style={{ color: 'var(--text-muted)' }}>{s.ghDlgSub}</p>
        <label htmlFor="gh-username-input" className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{s.ghDlgLabel}</label>
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono select-none" style={{ color: 'var(--text-dim)' }}>github.com/</span>
          <input ref={inputRef} id="gh-username-input" type="text" value={value} onChange={(e) => { setValue(e.target.value); setApiError(null) }} onBlur={() => setTouched(true)} onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }} placeholder={s.ghDlgPlaceholder} disabled={loading} maxLength={39} autoComplete="username" aria-invalid={showErr} className="w-full rounded-xl border px-3 py-2.5 text-sm font-mono outline-none transition-colors focus:ring-2 focus:ring-[--brand] disabled:opacity-60" style={{ paddingLeft: '6.75rem', background: 'var(--bg-overlay)', borderColor: showErr ? 'color-mix(in srgb, #ef4444 55%, var(--border))' : 'var(--border)', color: 'var(--text)' }} />
        </div>
        {showErr && <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs" style={{ color: '#ef4444' }}><AlertCircle size={12} strokeWidth={2} className="flex-shrink-0 mt-0.5" />{s.ghDlgValidErr}</p>}
        {apiError && <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs" style={{ color: '#ef4444' }}><AlertCircle size={12} strokeWidth={2} className="flex-shrink-0 mt-0.5" />{apiError}</p>}
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
          <button onClick={onCancel} disabled={loading} className="dc-btn-ghost flex-1 py-2.5 text-sm justify-center disabled:opacity-50">{s.ghDlgCancel}</button>
          <button onClick={handleSave} disabled={loading || !trimmed} className="dc-btn-primary flex-1 py-2.5 text-sm justify-center disabled:opacity-50">
            {loading ? <><Loader2 size={15} strokeWidth={2} className="animate-spin" />{s.ghDlgSaving}</> : <><FaGithub size={15} />{s.ghDlgSave}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

interface Req { icon: React.ElementType; key: 'req1'|'req2'|'req3'|'req4' }
const REQUIREMENTS: Req[] = [
  { icon: BriefcaseBusiness, key: 'req1' },
  { icon: CheckCircle2,      key: 'req2' },
  { icon: FaGithub,          key: 'req3' },
  { icon: ShieldCheck,       key: 'req4' },
]


interface SimulacionesCTAProps {
 
  simulacion?: Simulacion | null
}


function InscripcionesCerradasBadge() {
  const { t } = useI18n()
  const s = t.simulations
  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-center gap-3"
      role="status"
      aria-label={s.inscripcionesCerradas}
    >
      <div
        className="inline-flex items-center gap-3 rounded-2xl border px-6 py-4 w-full sm:w-auto"
        style={{
          background:  'var(--bg-raised)',
          borderColor: 'var(--border)',
          opacity:      0.85,
        }}
      >
        
        <span
          className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl"
          style={{
            background: 'color-mix(in srgb, var(--text-dim) 10%, var(--bg-overlay))',
            color:      'var(--text-dim)',
          }}
        >
          <Lock size={20} strokeWidth={1.75} />
        </span>

        <div className="flex flex-col gap-0.5 text-left">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-dim)' }}
          >
            <Clock size={11} strokeWidth={2} />
            {s.cierreInscripcionesBadge}
          </span>
          <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-muted)' }}>
            {s.inscripcionesCerradas}
          </p>
        </div>
      </div>
    </div>
  )
}


export function SimulacionesCTA({ simulacion = null }: SimulacionesCTAProps) {
  const { t }                           = useI18n()
  const s                               = t.simulations
  const { openAuth }                    = useModal()
  const router                          = useRouter()
  const { isAuthenticated, user }       = useAuthStore()
  const [showGHDialog, setShowGHDialog] = useState(false)


  const inscripcionesCerradas = isInscripcionCerrada(simulacion)

  const handleApply = useCallback(() => {
   
    if (inscripcionesCerradas) return

    if (!isAuthenticated || !user) { openAuth('register'); return }
    const needsGitHub = isDevRole(user.professionalRole?.name ?? null) && !user.github
    if (needsGitHub) { setShowGHDialog(true); return }
    router.push('/simulaciones/dashboard')
  }, [inscripcionesCerradas, isAuthenticated, user, openAuth, router])

  const handleGHSaved = useCallback(() => {
    setShowGHDialog(false); router.push('/simulaciones/dashboard')
  }, [router])

  return (
    <>
      {showGHDialog && !inscripcionesCerradas && (
        <GitHubDialog onSaved={handleGHSaved} onCancel={() => setShowGHDialog(false)} />
      )}
      <section id="sim-cta" className="relative py-24 sm:py-32 overflow-hidden" aria-labelledby="sim-cta-heading">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: 'var(--border)' }} />
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 70%)' }} />
        <div className="dc-container relative">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-12">
              <div className="mb-5"><ShimmerBadge>{s.ctaBadge}</ShimmerBadge></div>
              <h2 id="sim-cta-heading" className="font-display font-bold tracking-tight mb-4" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)', lineHeight: '1.1', color: 'var(--text)' }}>
                {s.ctaTitle1}{' '}<span className="text-gradient-hero">{s.ctaTitle2}</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s.ctaSub}</p>
            </div>

           
            <div className="rounded-3xl p-6 sm:p-8 mb-8" style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--text-dim)' }}>{s.reqTitle}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REQUIREMENTS.map(({ icon: Icon, key }) => (
                  <li key={key} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}>
                    <span className="flex-shrink-0 mt-0.5 flex items-center justify-center h-7 w-7 rounded-lg" style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)', color: 'var(--accent)' }}>
                      <Icon size={14} />
                    </span>
                    <span className="text-sm leading-[1.55]" style={{ color: 'var(--text-muted)' }}>{s[key]}</span>
                  </li>
                ))}
              </ul>
            </div>

           
            {inscripcionesCerradas ? (
              <InscripcionesCerradasBadge />
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleApply}
                  className="dc-btn-primary w-full sm:w-auto px-10 py-3.5 text-base"
                >
                  {s.ctaBtn}<ArrowRight size={17} strokeWidth={2} />
                </button>
                {!isAuthenticated && (
                  <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>{s.loginFirst}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}


const DEVELOPER_ROLE_KEYWORDS = ['frontend','backend','full stack','fullstack','mobile','devops','cloud','data engineer']
function isDevRole(name: string | null | undefined): boolean {
  if (!name) return false
  const lower = name.toLowerCase()
  return DEVELOPER_ROLE_KEYWORDS.some((kw) => lower.includes(kw))
}
const GITHUB_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/

interface GitHubDialogProps { onSaved: () => void; onCancel: () => void }
