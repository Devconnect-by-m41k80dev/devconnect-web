'use client'


import { useState, useEffect, useCallback } from 'react'
import { useRouter }                  from 'next/navigation'
import { useI18n }                    from '@/app/i18n'
import { useAuthStore }               from '@/app/store/auth.store'
import { useSimulacionesStore }       from '@/app/store/simulaciones.store'
import { selectHitoActivo }           from '@/app/store/simulaciones.store'
import { Navbar }                     from '@/app/components/layout/Navbar'
import { Footer }                     from '@/app/components/layout/Footer'
import { HitoTimeline }              from '@/app/components/simulaciones/dashboard/HitoTimeline'
import { ProblematicaCard }          from '@/app/components/simulaciones/dashboard/ProblematicaCard'
import { EntregablesTable }          from '@/app/components/simulaciones/dashboard/EntregablesTable'
import { NotificacionesToast }       from '@/app/components/simulaciones/dashboard/NotificacionesToast'
import {
  BriefcaseBusiness,
  RefreshCw,
  Users,
  Clock,
  AlertCircle,
  Loader2,
  Sparkles,
  MessageSquareCode,
  GitBranch,
  Cpu,
} from 'lucide-react'
import { SimulacionEstado } from '@/app/types/simulaciones'


function useSimulacionIdFromQuery(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('sim')
}


const COPY = {
  pageTitle:    { en: 'My Simulation',       es: 'Mi Simulación'           },
  pageSub:      { en: 'Team dashboard',      es: 'Panel del equipo'        },
  retryBtn:     { en: 'Retry',               es: 'Reintentar'              },
  
  waitingTitle: { en: 'Awaiting team assignment', es: 'Esperando asignación de equipo' },
  waitingSub:   { en: 'The simulation admin is running the matchmaking algorithm. You\'ll be notified as soon as your team is ready.',
                  es: 'El administrador está ejecutando el algoritmo de matchmaking. Recibirás una notificación en cuanto tu equipo esté listo.' },
 
  noSimTitle:   { en: 'No active simulation', es: 'Sin simulación activa'   },
  noSimSub:     { en: 'You are not enrolled in any active simulation. Check the Simulations page to apply for the next cohort.',
                  es: 'No estás inscrito en ninguna simulación activa. Revisa la página de Simulaciones para postularte a la próxima cohorte.' },
  noSimBtn:     { en: 'Go to Simulations',   es: 'Ir a Simulaciones'        },
  
  colProgress:  { en: 'Progress',            es: 'Progreso'                },
  colCase:      { en: 'Business Case',       es: 'Caso de Negocio'         },
  
  loadingLabel: { en: 'Loading your dashboard…', es: 'Cargando tu panel…' },
} as const

type L = 'en' | 'es'


function SkeletonBlock({
  className = '',
  style = {},
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ background: 'var(--bg-overlay)', ...style }}
    />
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 mt-8">
      
      <div className="dc-card p-6 flex flex-col gap-4">
        <SkeletonBlock style={{ height: '1.25rem', width: '55%' }} />
        <SkeletonBlock style={{ height: '0.625rem', borderRadius: '9999px' }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <SkeletonBlock style={{ width: '2rem', height: '2rem', borderRadius: '9999px', flexShrink: 0 }} />
            <SkeletonBlock style={{ flex: 1, height: '4rem' }} />
          </div>
        ))}
      </div>

      
      <div className="flex flex-col gap-6">
        
        <div className="dc-card p-6 flex flex-col gap-4">
          <SkeletonBlock style={{ height: '1rem', width: '30%' }} />
          <SkeletonBlock style={{ height: '1.75rem', width: '70%' }} />
          <SkeletonBlock style={{ height: '6rem' }} />
          <SkeletonBlock style={{ height: '4rem' }} />
        </div>
        
        <div className="dc-card p-6 flex flex-col gap-3">
          <SkeletonBlock style={{ height: '1.25rem', width: '40%' }} />
          {[1, 2].map((i) => (
            <SkeletonBlock key={i} style={{ height: '5rem' }} />
          ))}
        </div>
      </div>
    </div>
  )
}


function CierreInscripcionesWaiting({ locale: l }: { locale: L }) {
  const { t } = useI18n()
  const s = t.simulations

  const etapas = [
    { icon: Cpu,               label: s.cierreEtapa1, done: true  },
    { icon: Users,             label: s.cierreEtapa2, done: false },
    { icon: MessageSquareCode, label: s.cierreEtapa3, done: false },
    { icon: GitBranch,         label: s.cierreEtapa4, done: false },
  ]

  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-4 text-center anim-fade-up">
      
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full"
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--violet) 8%, transparent), transparent 65%)',
          filter:     'blur(70px)',
        }}
      />

      
      <div
        className="relative mb-8 flex items-center justify-center h-24 w-24 rounded-3xl"
        style={{
          background: 'color-mix(in srgb, var(--violet) 12%, var(--bg-raised))',
          border:     '1.5px solid color-mix(in srgb, var(--violet) 28%, var(--border))',
          boxShadow:  '0 0 32px color-mix(in srgb, var(--violet) 20%, transparent)',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 rounded-3xl border-2 border-transparent animate-spin"
          style={{
            borderTopColor:    'var(--violet)',
            borderRightColor:  'var(--brand)',
            animationDuration: '3s',
          }}
        />
        <Sparkles size={40} strokeWidth={1.5} style={{ color: 'var(--violet)' }} />
      </div>

      
      <h2
        className="font-display font-bold mb-4 max-w-lg"
        style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', lineHeight: '1.18', color: 'var(--text)' }}
      >
        {s.cierreInscripcionesTitle}
      </h2>

      
      <p
        className="text-sm sm:text-base leading-[1.78] mb-10 max-w-md"
        style={{ color: 'var(--text-muted)' }}
      >
        {s.cierreInscripcionesSub}
      </p>

      
      <div className="w-full max-w-sm flex flex-col gap-2.5 mb-10">
        {etapas.map(({ icon: Icon, label, done }, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 rounded-xl border px-4 py-3"
            style={{
              background:  done
                ? 'color-mix(in srgb, var(--accent) 6%, var(--bg-raised))'
                : idx === 1
                ? 'color-mix(in srgb, var(--violet) 5%, var(--bg-raised))'
                : 'var(--bg-raised)',
              borderColor: done
                ? 'color-mix(in srgb, var(--accent) 22%, var(--border))'
                : idx === 1
                ? 'color-mix(in srgb, var(--violet) 18%, var(--border))'
                : 'var(--border)',
              opacity: idx > 1 ? 0.5 : 1,
            }}
          >
            <span
              className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-lg"
              style={{
                background: done
                  ? 'color-mix(in srgb, var(--accent) 14%, transparent)'
                  : 'color-mix(in srgb, var(--violet) 12%, transparent)',
                color: done ? 'var(--accent)' : 'var(--violet)',
              }}
            >
              {idx === 1
                ? <Loader2 size={14} strokeWidth={2} className="animate-spin" />
                : <Icon size={14} strokeWidth={2} />}
            </span>
            <span className="text-sm font-medium flex-1 text-left" style={{ color: done ? 'var(--accent)' : 'var(--text-muted)' }}>
              {label}
            </span>
            {done && <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
          </div>
        ))}
      </div>

      
      <div
        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium"
        style={{
          background:  'color-mix(in srgb, var(--brand) 8%, var(--bg-raised))',
          borderColor: 'color-mix(in srgb, var(--brand) 22%, var(--border))',
          color:       'var(--brand)',
        }}
      >
        <Clock size={11} strokeWidth={2} className="animate-pulse" style={{ animationDuration: '2s' }} />
        {s.cierreMatchmakingLabel}
      </div>

      
      <div className="w-full max-w-2xl mt-14 opacity-25 pointer-events-none" aria-hidden>
        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-4">
          <div className="dc-card p-4 flex flex-col gap-3">
            <Sk h="0.875rem" w="50%" /><Sk h="0.5rem" r="9999px" />
            {[1,2,3].map((i) => <Sk key={i} h="2.5rem" />)}
          </div>
          <div className="flex flex-col gap-3">
            <div className="dc-card p-4 flex flex-col gap-2"><Sk h="0.875rem" w="35%" /><Sk h="4rem" /></div>
            <div className="dc-card p-4 flex flex-col gap-2">
              <Sk h="0.875rem" w="45%" />{[1,2].map((i) => <Sk key={i} h="3rem" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function SinEquipoState({ locale: l }: { locale: L }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="mb-6 flex items-center justify-center h-20 w-20 rounded-3xl"
        style={{
          background: 'color-mix(in srgb, var(--brand) 10%, var(--bg-raised))',
          border:     '1px solid color-mix(in srgb, var(--brand) 22%, var(--border))',
          color:      'var(--brand)',
        }}
      >
        <Users size={36} strokeWidth={1.5} />
      </div>

      <h2
        className="font-display font-bold text-xl mb-3"
        style={{ color: 'var(--text)' }}
      >
        {COPY.waitingTitle[l]}
      </h2>
      <p
        className="text-sm leading-[1.78] max-w-sm"
        style={{ color: 'var(--text-muted)' }}
      >
        {COPY.waitingSub[l]}
      </p>

      <div
        className="mt-8 flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium"
        style={{
          background:  'color-mix(in srgb, var(--warning) 8%, var(--bg-raised))',
          borderColor: 'color-mix(in srgb, var(--warning) 25%, var(--border))',
          color:       'var(--warning)',
        }}
      >
        <Clock size={12} strokeWidth={2} className="animate-spin" style={{ animationDuration: '3s' }} />
        {l === 'es' ? 'Matchmaking en progreso…' : 'Matchmaking in progress…'}
      </div>
    </div>
  )
}


function SinSimulacionState({ locale: l, onNavigate }: { locale: L; onNavigate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="mb-6 flex items-center justify-center h-20 w-20 rounded-3xl"
        style={{
          background: 'color-mix(in srgb, var(--text-dim) 8%, var(--bg-raised))',
          border:     '1px solid var(--border)',
          color:      'var(--text-dim)',
        }}
      >
        <BriefcaseBusiness size={36} strokeWidth={1.5} />
      </div>
      <h2
        className="font-display font-bold text-xl mb-3"
        style={{ color: 'var(--text)' }}
      >
        {COPY.noSimTitle[l]}
      </h2>
      <p
        className="text-sm leading-[1.78] max-w-sm mb-8"
        style={{ color: 'var(--text-muted)' }}
      >
        {COPY.noSimSub[l]}
      </p>
      <button onClick={onNavigate} className="dc-btn-primary px-6 py-2.5 text-sm">
        {COPY.noSimBtn[l]}
      </button>
    </div>
  )
}



export default function SimulacionesDashboardPage() {
  const { locale }         = useI18n()
  const l: L               = locale === 'es' ? 'es' : 'en'
  const router             = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  
  const cargarDatosAlumno  = useSimulacionesStore((s) => s.cargarDatosAlumno)
  const recargarEntregables= useSimulacionesStore((s) => s.recargarEntregables)
  const miSimulacion       = useSimulacionesStore((s) => s.miSimulacion)
  const miEquipo           = useSimulacionesStore((s) => s.miEquipo)
  const miProyecto         = useSimulacionesStore((s) => s.miProyecto)
  const misEntregables     = useSimulacionesStore((s) => s.misEntregables)
  const cargandoAlumno     = useSimulacionesStore((s) => s.cargandoAlumno)
  const errorAlumno        = useSimulacionesStore((s) => s.errorAlumno)
  const limpiarErrorAlumno = useSimulacionesStore((s) => s.limpiarErrorAlumno)

  
  const hitoActivo                      = selectHitoActivo(misEntregables)
  const [hitoSelected, setHitoSelected] = useState<1 | 2 | 3>(1)
  useEffect(() => {
    if (hitoActivo) setHitoSelected(hitoActivo)
  }, [hitoActivo])

  
  const [simId, setSimId] = useState<string | null>(null)

  useEffect(() => {
    
    const fromQuery = useSimulacionIdFromQuery()
    const fromStore = miSimulacion?.id ?? null
    setSimId(fromQuery ?? fromStore)
  }, [miSimulacion])

  
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/simulaciones')
    }
  }, [isAuthenticated, router])

  
  useEffect(() => {
    if (!simId || !isAuthenticated) return

    let active = true

    const run = async () => {
      
      if (!active) return
      await cargarDatosAlumno(simId)
    }

    run()

    return () => {
      
      active = false
    }
  }, [simId, isAuthenticated, cargarDatosAlumno])

  
  const handleRetry = useCallback(() => {
    limpiarErrorAlumno()
    if (simId) cargarDatosAlumno(simId)
  }, [simId, cargarDatosAlumno, limpiarErrorAlumno])

  
  const handleEntregableChange = useCallback(() => {
    recargarEntregables()
  }, [recargarEntregables])

  
  if (!isAuthenticated) return null

  return (
    <div className="dc-page">
      <Navbar />

      
      <NotificacionesToast
        enabled={isAuthenticated}
        simulacionId={simId}
        onEntregableChange={handleEntregableChange}
      />

      <main className="dc-container pb-20">

        
        <div className="dc-page-header anim-fade-up">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'color-mix(in srgb, var(--brand) 14%, transparent)',
                color:      'var(--brand)',
              }}
            >
              <BriefcaseBusiness size={20} />
            </div>
            <div>
              <h1 className="dc-page-title">{COPY.pageTitle[l]}</h1>
              <p className="dc-page-header-sub">
                {miSimulacion
                  ? miSimulacion.nombre
                  : COPY.pageSub[l]}
              </p>
            </div>
          </div>

          
          {miSimulacion && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
              style={{
                background:  'color-mix(in srgb, var(--brand) 8%, transparent)',
                borderColor: 'color-mix(in srgb, var(--brand) 22%, transparent)',
                color:       'var(--brand)',
              }}
            >
              {miSimulacion.estado}
            </span>
          )}
        </div>

       
        {cargandoAlumno && (
          <>
            <div className="flex items-center gap-2 mb-2" aria-live="polite" aria-label={COPY.loadingLabel[l]}>
              <Loader2 size={14} strokeWidth={2} className="animate-spin" style={{ color: 'var(--text-dim)' }} />
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                {COPY.loadingLabel[l]}
              </span>
            </div>
            <DashboardSkeleton />
          </>
        )}

        
        {!cargandoAlumno && errorAlumno && (
          <div
            className="flex items-start gap-3 rounded-2xl border p-5 mt-6 anim-fade-up"
            role="alert"
            style={{
              background:  'color-mix(in srgb, var(--danger) 6%, var(--bg-raised))',
              borderColor: 'color-mix(in srgb, var(--danger) 25%, var(--border))',
            }}
          >
            <AlertCircle size={18} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
            <div className="flex-1">
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
                {l === 'es' ? 'Error al cargar el dashboard' : 'Failed to load the dashboard'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{errorAlumno}</p>
            </div>
            <button
              onClick={handleRetry}
              className="dc-btn-ghost shrink-0 px-3 py-1.5 text-xs flex items-center gap-1.5"
            >
              <RefreshCw size={12} strokeWidth={2} />
              {COPY.retryBtn[l]}
            </button>
          </div>
        )}

        
        {!cargandoAlumno && !errorAlumno && !simId && (
          <SinSimulacionState
            locale={l}
            onNavigate={() => router.push('/simulaciones')}
          />
        )}

        
        {!cargandoAlumno && !errorAlumno && simId && miSimulacion &&
         miSimulacion.estado === SimulacionEstado.CIERRE_INSCRIPCIONES && !miEquipo && (
          <CierreInscripcionesWaiting locale={l} />
        )}

        
        {!cargandoAlumno && !errorAlumno && simId && miSimulacion && !miEquipo &&
         miSimulacion.estado !== SimulacionEstado.CIERRE_INSCRIPCIONES && (
          <SinEquipoState locale={l} />
        )}

        
        {!cargandoAlumno && !errorAlumno && miSimulacion && miEquipo && (
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 mt-2">

            
            <aside aria-label={COPY.colProgress[l]}>
              <HitoTimeline
                entregables={misEntregables}
                hitoSelected={hitoSelected}
                onHitoSelect={setHitoSelected}
              />
            </aside>

            
            <div className="flex flex-col gap-6 min-w-0">

              
              <div
                className="flex items-center gap-3 rounded-2xl border px-4 py-3 anim-fade-up"
                style={{
                  background:  'var(--bg-raised)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className="flex items-center justify-center h-9 w-9 rounded-xl shrink-0"
                  style={{
                    background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                    color:      'var(--accent)',
                  }}
                >
                  <Users size={16} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                    {miEquipo.nombreAutogenerado}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    {miEquipo.miembros.length}{' '}
                    {l === 'es' ? 'miembros' : 'members'}
                    {miEquipo.discordChannelUrl && (
                      <>
                        {' · '}
                        <a
                          href={miEquipo.discordChannelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline transition-opacity hover:opacity-70"
                          style={{ color: 'var(--brand)' }}
                        >
                          Discord
                        </a>
                      </>
                    )}
                    {miEquipo.githubRepoUrl && (
                      <>
                        {' · '}
                        <a
                          href={miEquipo.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline transition-opacity hover:opacity-70"
                          style={{ color: 'var(--brand)' }}
                        >
                          GitHub
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </div>

              
              {miProyecto ? (
                <ProblematicaCard proyecto={miProyecto} />
              ) : (
                <div
                  className="dc-card p-6 flex flex-col items-center justify-center text-center py-12 anim-fade-up delay-1"
                >
                  <BriefcaseBusiness size={32} strokeWidth={1.5} className="mb-3" style={{ color: 'var(--text-dim)' }} />
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                    {l === 'es' ? 'Caso de negocio pendiente' : 'Business case pending'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    {l === 'es'
                      ? 'El Admin publicará el caso de negocio junto con el matchmaking.'
                      : 'The Admin will publish the business case together with the matchmaking.'}
                  </p>
                </div>
              )}

              
              <EntregablesTable
                hito={hitoSelected}
                entregables={misEntregables}
                equipoId={miEquipo.id}
              />

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
