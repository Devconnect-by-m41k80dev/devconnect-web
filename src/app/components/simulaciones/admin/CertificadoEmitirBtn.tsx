'use client'
 
import { useState, useCallback, useEffect } from 'react'
import { useI18n }              from '@/app/i18n'
import { useSimulacionesStore } from '@/app/store/simulaciones.store'
import {
  CertificadoTipo,
  ResultadoEmisionCertificados,
} from '@/app/types/simulaciones'
import {
  Trophy,
  Award,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
} from 'lucide-react'



interface CertificadoEmitirBtnProps {
  simulacionId: string
  equipoId:     string
  equipoNombre: string
  disabled?:    boolean
}

type DialogStep = 'select' | 'confirm' | 'success' | 'error'


type L = 'en' | 'es'



export function CertificadoEmitirBtn({
  simulacionId,
  equipoId,
  equipoNombre,
  disabled = false,
}: CertificadoEmitirBtnProps) {
  const { t, locale }                 = useI18n()
  const s                             = t.simulations
  const l: L                          = locale === 'es' ? 'es' : 'en'

  const emitirParticipacion           = useSimulacionesStore((s) => s.emitirCertificadosParticipacion)
  const seleccionarGanador            = useSimulacionesStore((s) => s.seleccionarGanador)
  const cargandoAccion                = useSimulacionesStore((s) => s.cargandoAccion)
  const errorAccion                   = useSimulacionesStore((s) => s.errorAccion)
  const ultimosCertificados           = useSimulacionesStore((s) => s.ultimosCertificados)
  const limpiarErrorAccion            = useSimulacionesStore((s) => s.limpiarErrorAccion)

  const [open,       setOpen]       = useState(false)
  const [step,       setStep]       = useState<DialogStep>('select')
  const [tipoSel,    setTipoSel]    = useState<CertificadoTipo>(CertificadoTipo.PARTICIPACION)
  const [result,     setResult]     = useState<ResultadoEmisionCertificados | null>(null)
  const [copiedIdx,  setCopiedIdx]  = useState<number | null>(null)

  
  useEffect(() => {
    if (ultimosCertificados && step === 'confirm' && !cargandoAccion && !errorAccion) {
      setResult(ultimosCertificados)
      setStep('success')
    }
  }, [ultimosCertificados, cargandoAccion, errorAccion, step])

  
  useEffect(() => {
    if (errorAccion && step === 'confirm') {
      setStep('error')
    }
  }, [errorAccion, step])

  
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
    setStep('select')
    setResult(null)
    setOpen(true)
  }

  const handleClose = () => {
    if (cargandoAccion) return
    setOpen(false)
    setStep('select')
  }

  const handleConfirm = useCallback(async () => {
    limpiarErrorAccion()
    if (tipoSel === CertificadoTipo.GANADOR) {
      await seleccionarGanador(simulacionId, equipoId)
    } else {
      await emitirParticipacion(simulacionId, equipoId)
    }
  }, [tipoSel, simulacionId, equipoId, seleccionarGanador, emitirParticipacion, limpiarErrorAccion])

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    })
  }

  const isGanador = tipoSel === CertificadoTipo.GANADOR

  return (
    <>
      
      <button
        onClick={handleOpen}
        disabled={disabled || cargandoAccion}
        className="relative flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-200 disabled:opacity-50 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
          color:       '#fff',
          boxShadow:   '0 4px 16px rgba(217, 119, 6, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
          border:      '1px solid rgba(255,255,255,0.12)',
        }}
      >
        
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
          }}
        />
        <Trophy size={16} strokeWidth={2} />
        {s.btnLabel}
      </button>

      
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-dlg-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.68)' }}
          onClick={() => !cargandoAccion && handleClose()}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              background:  'var(--bg-raised)',
              borderColor: step === 'success'
                ? 'rgba(245,158,11,0.40)'
                : step === 'error'
                ? 'color-mix(in srgb, var(--danger) 30%, var(--border))'
                : 'rgba(245,158,11,0.28)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            
            <div
              aria-hidden
              className="h-0.5 w-full"
              style={{
                background: step === 'error'
                  ? 'var(--danger)'
                  : 'linear-gradient(90deg, #f59e0b, #fcd34d, #f59e0b)',
              }}
            />

            
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(245,158,11,0.12), transparent 65%)',
                filter:     'blur(30px)',
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

            <div className="relative p-7">

              
              {step === 'select' && (
                <>
                  <div
                    className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-2xl"
                    style={{
                      background: 'rgba(245,158,11,0.12)',
                      border:     '1px solid rgba(245,158,11,0.28)',
                      color:      '#f59e0b',
                    }}
                  >
                    <Award size={22} strokeWidth={1.75} />
                  </div>
                  <h2 id="cert-dlg-title" className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text)' }}>
                    {s.dlgTitle}
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                    {s.dlgSub} <strong style={{ color: 'var(--text)' }}>"{equipoNombre}"</strong>
                  </p>

                  
                  <div className="flex flex-col gap-3 mb-6">
                    {([CertificadoTipo.PARTICIPACION, CertificadoTipo.GANADOR] as const).map((tipo) => {
                      const isSelected = tipoSel === tipo
                      const isGanadorOpt = tipo === CertificadoTipo.GANADOR
                      return (
                        <button
                          key={tipo}
                          onClick={() => setTipoSel(tipo)}
                          className="text-left rounded-xl border px-4 py-3.5 transition-all duration-150 flex items-start gap-3"
                          style={{
                            background:  isSelected
                              ? isGanadorOpt
                                ? 'rgba(245,158,11,0.08)'
                                : 'color-mix(in srgb, var(--brand) 8%, var(--bg-overlay))'
                              : 'var(--bg-overlay)',
                            borderColor: isSelected
                              ? isGanadorOpt ? 'rgba(245,158,11,0.35)' : 'color-mix(in srgb, var(--brand) 30%, var(--border))'
                              : 'var(--border)',
                            boxShadow:   isSelected && isGanadorOpt
                              ? '0 0 16px rgba(245,158,11,0.14)'
                              : 'none',
                          }}
                        >
                          <span
                            className="mt-0.5 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-xl"
                            style={{
                              background: isGanadorOpt ? 'rgba(245,158,11,0.12)' : 'color-mix(in srgb, var(--brand) 10%, transparent)',
                              color:      isGanadorOpt ? '#f59e0b' : 'var(--brand)',
                            }}
                          >
                            {isGanadorOpt ? <Trophy size={16} strokeWidth={2} /> : <Award size={16} strokeWidth={2} />}
                          </span>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                              {tipo === CertificadoTipo.PARTICIPACION ? s.participacion : s.ganador}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {tipo === CertificadoTipo.PARTICIPACION ? s.participacionDesc : s.ganadorDesc}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2
                              size={16} strokeWidth={2}
                              className="ml-auto flex-shrink-0 mt-0.5"
                              style={{ color: isGanadorOpt ? '#f59e0b' : 'var(--brand)' }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex gap-2.5">
                    <button onClick={handleClose} className="dc-btn-ghost flex-1 py-2.5 text-sm justify-center">
                      {s.cancelBtn}
                    </button>
                    <button
                      onClick={() => setStep('confirm')}
                      className="flex-1 py-2.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: isGanador
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                          : 'var(--brand)',
                        color:  '#fff',
                        border: 'none',
                        boxShadow: isGanador ? '0 4px 12px rgba(245,158,11,0.30)' : 'none',
                      }}
                    >
                      <Trophy size={14} strokeWidth={2} />
                      {l === 'es' ? 'Siguiente' : 'Next'}
                    </button>
                  </div>
                </>
              )}

              
              {step === 'confirm' && (
                <>
                  <div
                    className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-2xl"
                    style={{
                      background: isGanador ? 'rgba(245,158,11,0.12)' : 'color-mix(in srgb, var(--brand) 10%, var(--bg-overlay))',
                      border:     `1px solid ${isGanador ? 'rgba(245,158,11,0.28)' : 'color-mix(in srgb, var(--brand) 25%, var(--border))'}`,
                      color:      isGanador ? '#f59e0b' : 'var(--brand)',
                    }}
                  >
                    <Trophy size={22} strokeWidth={1.75} />
                  </div>
                  <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>
                    {s.confirmTitle}
                  </h2>
                  <p className="text-sm leading-[1.72] mb-6" style={{ color: 'var(--text-muted)' }}>
                    {s.certConfirmText(tipoSel, equipoNombre)}
                  </p>
                  <div className="flex gap-2.5">
                    <button onClick={() => setStep('select')} disabled={cargandoAccion} className="dc-btn-ghost flex-1 py-2.5 text-sm justify-center disabled:opacity-50">
                      {s.backBtn}
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={cargandoAccion}
                      className="flex-1 py-2.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                      style={{
                        background: isGanador
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                          : 'var(--brand)',
                        color:     '#fff',
                        boxShadow: isGanador ? '0 4px 12px rgba(245,158,11,0.30)' : 'none',
                      }}
                    >
                      {cargandoAccion
                        ? <><Loader2 size={14} strokeWidth={2} className="animate-spin" />{s.issuingBtn}</>
                        : <><Trophy  size={14} strokeWidth={2} />{s.issueBtn}</>}
                    </button>
                  </div>
                </>
              )}

              
              {step === 'success' && result && (
                <>
                  <div
                    className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-2xl"
                    style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.28)', color: '#f59e0b' }}
                  >
                    <CheckCircle2 size={22} strokeWidth={1.75} />
                  </div>
                  <h2 className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text)' }}>
                    {s.successTitle}
                  </h2>
                  <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                    {s.successSub}
                  </p>

                  <div
                    className="flex items-center justify-center gap-2 rounded-xl py-3 mb-5"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)' }}
                  >
                    <Trophy size={20} strokeWidth={1.75} style={{ color: '#f59e0b' }} />
                    <span className="font-display font-bold text-2xl" style={{ color: '#f59e0b' }}>
                      {result.certificadosEmitidos}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {s.issuedLabel}
                    </span>
                  </div>

                  
                  {result.certificados.length > 0 && (
                    <div className="mb-5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>
                        {s.codesLabel}
                      </p>
                      <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                        {result.certificados.map((cert, idx) => (
                          <div
                            key={cert.id}
                            className="flex items-center gap-2 rounded-lg border px-3 py-2"
                            style={{ background: 'var(--bg-overlay)', borderColor: 'var(--border)' }}
                          >
                            <span className="text-xs font-mono flex-1 truncate" style={{ color: 'var(--text-muted)' }}>
                              {cert.codigoVerificacion}
                            </span>
                            <button
                              onClick={() => copyCode(cert.codigoVerificacion, idx)}
                              className="flex items-center gap-1 text-[10px] font-medium flex-shrink-0 transition-colors"
                              style={{ color: copiedIdx === idx ? 'var(--accent)' : 'var(--text-dim)' }}
                              title={s.copyLabel}
                            >
                              {copiedIdx === idx
                                ? <><Check size={11} strokeWidth={2} />{s.copiedLabel}</>
                                : <><Copy size={11} strokeWidth={2} />{s.copyLabel}</>}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={handleClose} className="dc-btn-primary w-full py-2.5 text-sm justify-center">
                    {s.closeBtn}
                  </button>
                </>
              )}

              
              {step === 'error' && (
                <>
                  <div
                    className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-2xl"
                    style={{ background: 'color-mix(in srgb, var(--danger) 10%, var(--bg-overlay))', border: '1px solid color-mix(in srgb, var(--danger) 25%, var(--border))', color: 'var(--danger)' }}
                  >
                    <AlertCircle size={22} strokeWidth={1.75} />
                  </div>
                  <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>
                    {l === 'es' ? 'Error al emitir' : 'Issuance failed'}
                  </h2>
                  <p className="text-sm leading-[1.72] mb-6" style={{ color: 'var(--text-muted)' }}>
                    {errorAccion}
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
