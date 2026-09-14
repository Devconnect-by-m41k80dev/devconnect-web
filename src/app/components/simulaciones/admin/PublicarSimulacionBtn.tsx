'use client'

──────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useEffect } from 'react'
import { useI18n }              from '@/app/i18n'
import { useSimulacionesStore } from '@/app/store/simulaciones.store'
import { ResultadoPublicacion } from '@/app/types/simulaciones'
import { FaGithub, FaDiscord } from 'react-icons/fa'
import {
  Rocket,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Users,
  ChevronRight,
} from 'lucide-react'



interface PublicarSimulacionBtnProps {
  simulacionId: string
  disabled?:    boolean
}

type DialogStep = 'confirm' | 'success' | 'error'


type L = 'en' | 'es'



export function PublicarSimulacionBtn({ simulacionId, disabled = false }: PublicarSimulacionBtnProps) {
  const { t, locale }     = useI18n()
  const s                 = t.simulations
  const l: L              = locale === 'es' ? 'es' : 'en'

  const publicarEquipos   = useSimulacionesStore((s) => s.publicarEquipos)
  const cargandoAccion    = useSimulacionesStore((s) => s.cargandoAccion)
  const errorAccion       = useSimulacionesStore((s) => s.errorAccion)
  const ultimaPublicacion = useSimulacionesStore((s) => s.ultimaPublicacion)
  const limpiarErrorAccion = useSimulacionesStore((s) => s.limpiarErrorAccion)

  const [open,   setOpen]   = useState(false)
  const [conIA,  setConIA]  = useState(true)
  const [step,   setStep]   = useState<DialogStep>('confirm')
  const [result, setResult] = useState<ResultadoPublicacion | null>(null)
  const [isRateLimit, setIsRateLimit] = useState(false)

 
  useEffect(() => {
    if (ultimaPublicacion && step === 'confirm' && !cargandoAccion) {
      setResult(ultimaPublicacion)
      setStep('success')
    }
  }, [ultimaPublicacion, cargandoAccion, step])

  
  useEffect(() => {
    if (errorAccion) {
      const isRL = errorAccion.toLowerCase().includes('limit') ||
                   errorAccion.includes('429') ||
                   errorAccion.includes('throttle')
      setIsRateLimit(isRL)
      setStep('error')
    }
  }, [errorAccion])

 
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  
  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape' && !cargandoAccion) handleClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [open, cargandoAccion])

  const handleOpen = () => {
    limpiarErrorAccion()
    setStep('confirm')
    setResult(null)
    setIsRateLimit(false)
    setOpen(true)
  }

  const handleClose = () => {
    if (cargandoAccion) return
    setOpen(false)
    setStep('confirm')
  }

  const handleConfirm = useCallback(async () => {
    await publicarEquipos(simulacionId, conIA)
  }, [publicarEquipos, simulacionId, conIA])

  
  const orchStepList = [
    { icon: FaDiscord,     key: 'discord' as const },
    { icon: FaGithub,      key: 'github'  as const },
    { icon: Sparkles,      key: 'ia'      as const, onlyIA: true },
    { icon: Zap,           key: 'entries' as const },
  ]

  return (
    <>
      
      <button
        onClick={handleOpen}
        disabled={disabled || cargandoAccion}
        className="dc-btn-primary flex flex-col items-start gap-0.5 px-5 py-3.5 disabled:opacity-50"
        style={{ minWidth: '220px' }}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Rocket size={15} strokeWidth={2} />
          {s.btnLabel}
        </span>
        <span
          className="text-[10px] font-normal opacity-75"
        >
          {s.btnSub}
        </span>
      </button>

      
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pub-dlg-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.65)' }}
          onClick={() => !cargandoAccion && handleClose()}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              background:  'var(--bg-raised)',
              borderColor: step === 'success'
                ? 'color-mix(in srgb, var(--accent) 30%, var(--border))'
                : step === 'error'
                ? 'color-mix(in srgb, var(--danger) 30%, var(--border))'
                : 'color-mix(in srgb, var(--brand) 28%, var(--border))',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            
            <div
              aria-hidden
              className="h-0.5 w-full"
              style={{
                background: step === 'success' ? 'var(--accent)'
                  : step === 'error' ? 'var(--danger)'
                  : 'linear-gradient(90deg, var(--brand), var(--accent))',
              }}
            />

            
            {!cargandoAccion && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-[color:var(--bg-overlay)]"
                style={{ color: 'var(--text-muted)' }}
                aria-label={s.cancelBtn}
              >
                <X size={15} />
              </button>
            )}

            <div className="p-7">

              
              {step === 'confirm' && (
                <>
                  
                  <div
                    className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-2xl"
                    style={{
                      background: 'color-mix(in srgb, var(--brand) 12%, var(--bg-overlay))',
                      border:     '1px solid color-mix(in srgb, var(--brand) 28%, var(--border))',
                      color:      'var(--brand)',
                    }}
                  >
                    <Rocket size={22} strokeWidth={1.75} />
                  </div>

                  <h2 id="pub-dlg-title" className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>
                    {s.dlgTitle}
                  </h2>
                  <p className="text-sm leading-[1.72] mb-6" style={{ color: 'var(--text-muted)' }}>
                    {s.dlgSub}
                  </p>

                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {orchStepList.map(({ icon: Icon, key, onlyIA }) => (
                      (!onlyIA || conIA) && (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
                          style={{
                            background:  'var(--bg-overlay)',
                            borderColor: 'var(--border)',
                            color:       'var(--text-muted)',
                          }}
                        >
                          <Icon size={12} strokeWidth={2} style={{ color: 'var(--brand)' }} />
                          {s.orchSteps[key][l]}
                          <ChevronRight size={10} strokeWidth={2} style={{ color: 'var(--text-dim)' }} />
                        </span>
                      )
                    ))}
                  </div>

                  
                  <div
                    className="flex items-start gap-4 rounded-xl border px-4 py-3.5 mb-6"
                    style={{
                      background:  conIA
                        ? 'color-mix(in srgb, var(--violet) 6%, var(--bg-overlay))'
                        : 'var(--bg-overlay)',
                      borderColor: conIA
                        ? 'color-mix(in srgb, var(--violet) 22%, var(--border))'
                        : 'var(--border)',
                    }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
                        {s.switchLabel}
                      </p>
                      <p className="text-xs leading-[1.6]" style={{ color: 'var(--text-dim)' }}>
                        {s.switchSub}
                      </p>
                    </div>
                    
                    <button
                      role="switch"
                      aria-checked={conIA}
                      onClick={() => setConIA((v) => !v)}
                      className="relative flex-shrink-0 h-6 w-11 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 mt-0.5"
                      style={{
                        background: conIA ? 'var(--violet)' : 'var(--bg-overlay)',
                        border:     `1.5px solid ${conIA ? 'var(--violet)' : 'var(--border)'}`,
                      }}
                    >
                      <span
                        className="absolute top-0.5 h-4 w-4 rounded-full shadow-sm transition-transform duration-200"
                        style={{
                          background:  'var(--bg-raised)',
                          left:        '2px',
                          transform:   conIA ? 'translateX(20px)' : 'translateX(0)',
                          boxShadow:   conIA ? '0 0 6px color-mix(in srgb, var(--violet) 40%, transparent)' : 'none',
                        }}
                      />
                    </button>
                  </div>

                  
                  <div className="flex flex-col-reverse sm:flex-row gap-2.5">
                    <button
                      onClick={handleClose}
                      className="dc-btn-ghost flex-1 py-2.5 text-sm justify-center"
                    >
                      {s.cancelBtn}
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={cargandoAccion}
                      className="dc-btn-primary flex-1 py-2.5 text-sm justify-center disabled:opacity-60"
                    >
                      {cargandoAccion
                        ? <><Loader2 size={14} strokeWidth={2} className="animate-spin" />{s.publishing}</>
                        : <><Rocket  size={14} strokeWidth={2} />{s.confirmBtn}</>}
                    </button>
                  </div>
                </>
              )}

              
              {step === 'success' && result && (
                <>
                  <div
                    className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-2xl"
                    style={{
                      background: 'color-mix(in srgb, var(--accent) 12%, var(--bg-overlay))',
                      border:     '1px solid color-mix(in srgb, var(--accent) 28%, var(--border))',
                      color:      'var(--accent)',
                    }}
                  >
                    <CheckCircle2 size={22} strokeWidth={1.75} />
                  </div>
                  <h2 className="font-display font-bold text-xl mb-5" style={{ color: 'var(--text)' }}>
                    {s.successTitle}
                  </h2>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { value: result.equiposPublicados,  label: s.teamsLabel,  color: 'var(--brand)' },
                      { value: result.usuariosNotificados, label: s.usersLabel, color: 'var(--accent)' },
                    ].map(({ value, label, color }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1 rounded-xl p-4"
                        style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}
                      >
                        <span className="font-display font-bold text-3xl" style={{ color }}>
                          {value}
                        </span>
                        <span className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button onClick={handleClose} className="dc-btn-primary w-full py-2.5 text-sm justify-center">
                    {s.closeBtn}
                  </button>
                </>
              )}

              
              {step === 'error' && (
                <>
                  <div
                    className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-2xl"
                    style={{
                      background: 'color-mix(in srgb, var(--danger) 12%, var(--bg-overlay))',
                      border:     '1px solid color-mix(in srgb, var(--danger) 28%, var(--border))',
                      color:      'var(--danger)',
                    }}
                  >
                    <AlertCircle size={22} strokeWidth={1.75} />
                  </div>
                  <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>
                    {isRateLimit
                      ? (l === 'es' ? 'Límite de velocidad alcanzado' : 'Rate limit reached')
                      : (l === 'es' ? 'Error al publicar' : 'Publish failed')}
                  </h2>
                  <p className="text-sm leading-[1.72] mb-6" style={{ color: 'var(--text-muted)' }}>
                    {isRateLimit ? s.rateLimitMsg : errorAccion}
                  </p>
                  <div className="flex gap-2.5">
                    <button onClick={handleClose} className="dc-btn-ghost flex-1 py-2.5 text-sm justify-center">
                      {s.cancelBtn}
                    </button>
                    <button
                      onClick={() => { setStep('confirm'); limpiarErrorAccion() }}
                      className="dc-btn-primary flex-1 py-2.5 text-sm justify-center"
                    >
                      {l === 'es' ? 'Reintentar' : 'Retry'}
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  )
}
