'use client'


import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter }                from 'next/navigation'
import { useI18n }                  from '@/app/i18n'
import { useAuthStore }             from '@/app/store/auth.store'
import { useSimulacionesStore }     from '@/app/store/simulaciones.store'
import { Role }                     from '@/app/types/enums'
import { simGet }                   from '@/app/lib/http/sim-http-client'
import { Equipo, Simulacion }       from '@/app/types/simulaciones'
import { Navbar }                   from '@/app/components/layout/Navbar'
import { Footer }                   from '@/app/components/layout/Footer'
import { FlotantesPanel }          from '@/app/components/simulaciones/admin/FlotantesPanel'
import { PublicarSimulacionBtn }   from '@/app/components/simulaciones/admin/PublicarSimulacionBtn'
import { EquiposGrid }             from '@/app/components/simulaciones/admin/EquiposGrid'
import { HitoEvaluacionPanel }     from '@/app/components/simulaciones/admin/HitoEvaluacionPanel'
import { CertificadoEmitirBtn }    from '@/app/components/simulaciones/admin/CertificadoEmitirBtn'
import {
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Loader2,
  ChevronDown,
  Users,
  Zap,
} from 'lucide-react'

type L = 'en' | 'es'

function Sk({ h = '1rem', w = '100%', r = '0.75rem' }: { h?: string; w?: string; r?: string }) {
  return (
    <div
      className="animate-pulse"
      style={{ height: h, width: w, borderRadius: r, background: 'var(--bg-overlay)' }}
    />
  )
}

function AdminSkeleton() {
  return (
    <div className="flex flex-col gap-6 mt-6">
      
      <div className="dc-card p-5 flex flex-wrap gap-3 items-center">
        <Sk h="2.5rem" w="220px" />
        <Sk h="2.5rem" w="160px" />
        <Sk h="2.5rem" w="180px" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="dc-card p-5 flex flex-col gap-3">
                <Sk h="1.1rem" w="60%" />
                <Sk h="0.7rem" w="40%" />
                <Sk h="2.5rem" />
                <Sk h="4rem" />
              </div>
            ))}
          </div>
        </div>
        <div className="dc-card p-5 flex flex-col gap-3">
          <Sk h="1.1rem" w="55%" />
          {[1,2,3].map((i) => <Sk key={i} h="3rem" />)}
        </div>
      </div>
    </div>
  )
}


export default function SimulacionesAdminPage() {
  const { locale }                         = useI18n()
  const l: L                               = locale === 'es' ? 'es' : 'en'
  const router                             = useRouter()
  const { isAuthenticated, user }          = useAuthStore()

 const cargarSimulaciones    = useSimulacionesStore((s) => s.cargarSimulaciones)
  const cargarFlotantes       = useSimulacionesStore((s) => s.cargarFlotantes)
  const generarEquipos        = useSimulacionesStore((s) => s.generarEquipos)
  const simulaciones          = useSimulacionesStore((s) => s.simulaciones)
  const flotantes             = useSimulacionesStore((s) => s.flotantes)
  const cargandoAdmin         = useSimulacionesStore((s) => s.cargandoAdmin)
  const cargandoAccion        = useSimulacionesStore((s) => s.cargandoAccion)
  const errorAdmin            = useSimulacionesStore((s) => s.errorAdmin)
  const errorAccion           = useSimulacionesStore((s) => s.errorAccion)
  const ultimoMatchmaking     = useSimulacionesStore((s) => s.ultimoMatchmaking)
  const limpiarErrorAdmin     = useSimulacionesStore((s) => s.limpiarErrorAdmin)
  const limpiarErrorAccion    = useSimulacionesStore((s) => s.limpiarErrorAccion)

 const [simActiva,           setSimActiva]           = useState<string>('')
  const [equipoSeleccionado,  setEquipoSeleccionado]  = useState<string | null>(null)
  const [equipos,             setEquipos]             = useState<Equipo[]>([])
  const [loadingEquipos,      setLoadingEquipos]      = useState(false)

 
  const simulacionObj: Simulacion | null = useMemo(
    () => simulaciones.find((s) => s.id === simActiva) ?? null,
    [simulaciones, simActiva],
  )

  
  const equipoObj: Equipo | null = useMemo(
    () => equipos.find((e) => e.id === equipoSeleccionado) ?? null,
    [equipos, equipoSeleccionado],
  )

 
  useEffect(() => {
    if (!isAuthenticated) { router.replace('/simulaciones'); return }
    if (user && user.role !== Role.ADMIN) { router.replace('/simulaciones/dashboard') }
  }, [isAuthenticated, user, router])

  
  useEffect(() => {
    if (!isAuthenticated || user?.role !== Role.ADMIN) return
    cargarSimulaciones()
  }, [isAuthenticated, user, cargarSimulaciones])

  
  useEffect(() => {
    if (simulaciones.length > 0 && !simActiva) {
      setSimActiva(simulaciones[0].id)
    }
  }, [simulaciones, simActiva])

  
  useEffect(() => {
    if (!simActiva) return
    cargarFlotantes(simActiva)
    setLoadingEquipos(true)
    setEquipoSeleccionado(null)
    simGet<Equipo[]>(`/equipos/simulacion/${simActiva}`)
      .then(setEquipos)
      .catch(() => setEquipos([]))
      .finally(() => setLoadingEquipos(false))
  }, [simActiva, cargarFlotantes])

  
  useEffect(() => {
    if (!ultimoMatchmaking || !simActiva) return
    setEquipos(ultimoMatchmaking.equipos)
  }, [ultimoMatchmaking, simActiva])

  
  const handleGenerarEquipos = useCallback(async () => {
    if (!simActiva) return
    limpiarErrorAccion()
    await generarEquipos(simActiva, 3)
  }, [simActiva, generarEquipos, limpiarErrorAccion])

  const handleRefreshEquipos = useCallback(() => {
    if (!simActiva) return
    setLoadingEquipos(true)
    simGet<Equipo[]>(`/equipos/simulacion/${simActiva}`)
      .then(setEquipos)
      .catch(() => {})
      .finally(() => setLoadingEquipos(false))
  }, [simActiva])

  
  if (!isAuthenticated || !user) return null
  if (user.role !== Role.ADMIN) return null

  const isLoading = cargandoAdmin && simulaciones.length === 0

  return (
    <div className="dc-page">
      <Navbar />

      <main className="dc-container pb-20">

        
        <div className="dc-page-header anim-fade-up">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'color-mix(in srgb, var(--brand) 14%, transparent)', color: 'var(--brand)' }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="dc-page-title">
                {l === 'es' ? 'Mesa de Control' : 'Admin Dashboard'}
              </h1>
              <p className="dc-page-header-sub">
                {l === 'es' ? 'Simulaciones Laborales — Panel de Administración' : 'Labor Simulations — Admin Panel'}
              </p>
            </div>
          </div>
        </div>

        
        {isLoading && <AdminSkeleton />}

        
        {!isLoading && errorAdmin && (
          <div
            className="flex items-start gap-3 rounded-2xl border p-5 mt-6 anim-fade-up"
            role="alert"
            style={{ background: 'color-mix(in srgb, var(--danger) 6%, var(--bg-raised))', borderColor: 'color-mix(in srgb, var(--danger) 25%, var(--border))' }}
          >
            <AlertCircle size={18} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
            <div className="flex-1">
              <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
                {l === 'es' ? 'Error al cargar' : 'Load error'}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{errorAdmin}</p>
            </div>
            <button onClick={() => { limpiarErrorAdmin(); cargarSimulaciones() }} className="dc-btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5 shrink-0">
              <RefreshCw size={12} strokeWidth={2} />
              {l === 'es' ? 'Reintentar' : 'Retry'}
            </button>
          </div>
        )}

        {!isLoading && !errorAdmin && (
          <>
            
            <div
              className="dc-card p-4 mb-6 flex flex-wrap items-center gap-3 anim-fade-up"
            >
              
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <label
                  htmlFor="sim-select"
                  className="text-xs font-semibold uppercase tracking-wider shrink-0"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {l === 'es' ? 'Simulación:' : 'Simulation:'}
                </label>
                <div className="relative flex-1">
                  <select
                    id="sim-select"
                    value={simActiva}
                    onChange={(e) => setSimActiva(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm appearance-none outline-none focus:ring-2 focus:ring-[--brand]"
                    style={{ background: 'var(--bg-overlay)', borderColor: 'var(--border)', color: 'var(--text)', paddingRight: '2rem' }}
                  >
                    {simulaciones.length === 0 && (
                      <option value="">{l === 'es' ? 'Sin simulaciones' : 'No simulations'}</option>
                    )}
                    {simulaciones.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre} · {s.estado}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
                </div>
              </div>

              
              <div aria-hidden className="hidden sm:block h-8 w-px" style={{ background: 'var(--border)' }} />

              
              <button
                onClick={handleGenerarEquipos}
                disabled={!simActiva || cargandoAccion}
                className="dc-btn-ghost flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50"
              >
                {cargandoAccion
                  ? <Loader2 size={14} strokeWidth={2} className="animate-spin" />
                  : <Users    size={14} strokeWidth={2} />}
                {l === 'es' ? 'Generar Equipos' : 'Run Matchmaking'}
              </button>

             
              {simActiva && (
                <PublicarSimulacionBtn
                  simulacionId={simActiva}
                  disabled={!simActiva || equipos.length === 0}
                />
              )}

              
              <button
                onClick={handleRefreshEquipos}
                disabled={loadingEquipos}
                className="dc-btn-ghost p-2 disabled:opacity-50"
                title={l === 'es' ? 'Actualizar equipos' : 'Refresh teams'}
              >
                <RefreshCw size={15} strokeWidth={2} className={loadingEquipos ? 'animate-spin' : ''} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            
            {ultimoMatchmaking && (
              <div
                className="flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 mb-6 anim-fade-up"
                style={{
                  background:  'color-mix(in srgb, var(--accent) 5%, var(--bg-raised))',
                  borderColor: 'color-mix(in srgb, var(--accent) 20%, var(--border))',
                }}
              >
                <Zap size={14} strokeWidth={2} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {l === 'es'
                    ? `Último matchmaking: ${ultimoMatchmaking.equiposGenerados} equipos · ${ultimoMatchmaking.participantesAsignados} asignados · ${ultimoMatchmaking.participantesSinEquipo} flotantes`
                    : `Last matchmaking: ${ultimoMatchmaking.equiposGenerados} teams · ${ultimoMatchmaking.participantesAsignados} assigned · ${ultimoMatchmaking.participantesSinEquipo} floating`}
                </p>
              </div>
            )}

            
            {errorAccion && (
              <div
                className="flex items-start gap-2.5 rounded-xl border px-4 py-3 mb-6"
                role="alert"
                style={{ background: 'color-mix(in srgb, var(--danger) 6%, var(--bg-raised))', borderColor: 'color-mix(in srgb, var(--danger) 25%, var(--border))' }}
              >
                <AlertCircle size={14} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
                <p className="text-sm flex-1" style={{ color: 'var(--text-muted)' }}>{errorAccion}</p>
                <button onClick={limpiarErrorAccion} className="text-xs underline shrink-0" style={{ color: 'var(--text-dim)' }}>
                  {l === 'es' ? 'Cerrar' : 'Dismiss'}
                </button>
              </div>
            )}

            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

             
              <div className="flex flex-col gap-6 min-w-0">

                
                {loadingEquipos ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1,2,3].map((i) => (
                      <div key={i} className="dc-card p-5 flex flex-col gap-3">
                        <Sk h="1.1rem" w="60%" /><Sk h="0.7rem" w="40%" /><Sk h="3rem" /><Sk h="4rem" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EquiposGrid
                    equipos={equipos}
                    equipoSeleccionado={equipoSeleccionado}
                    onEquipoSelect={(id) => setEquipoSeleccionado((prev) => prev === id ? null : id)}
                  />
                )}

                
                {equipoSeleccionado && equipoObj && (
                  <div className="anim-fade-up">
                    <HitoEvaluacionPanel
                      equipoId={equipoSeleccionado}
                      equipo={equipoObj}
                    />

                    
                    <div
                      className="dc-card p-5 mt-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                          {l === 'es' ? 'Certificados' : 'Certificates'}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                          {equipoObj.nombreAutogenerado}
                        </p>
                      </div>
                      {simActiva && (
                        <CertificadoEmitirBtn
                          simulacionId={simActiva}
                          equipoId={equipoSeleccionado}
                          equipoNombre={equipoObj.nombreAutogenerado}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              
              <aside className="flex flex-col gap-6">
                {simActiva && (
                  <FlotantesPanel
                    simulacionId={simActiva}
                    equipos={equipos}
                  />
                )}

                
                {flotantes.length > 0 && (
                  <div
                    className="rounded-xl border px-4 py-3 flex items-center gap-3"
                    style={{
                      background:  'color-mix(in srgb, var(--warning) 6%, var(--bg-raised))',
                      borderColor: 'color-mix(in srgb, var(--warning) 22%, var(--border))',
                    }}
                  >
                    <AlertCircle size={14} strokeWidth={2} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {flotantes.length}{' '}
                      {l === 'es' ? 'alumno(s) sin equipo asignado.' : 'student(s) without a team.'}
                    </p>
                  </div>
                )}
              </aside>

            </div>
          </>
        )}

      </main>

      <Footer />
    </div>
  )
}
