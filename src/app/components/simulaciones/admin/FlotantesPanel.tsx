'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useI18n }              from '@/app/i18n'
import { useSimulacionesStore } from '@/app/store/simulaciones.store'
import { simPost }              from '@/app/lib/http/sim-http-client'
import {
  PerfilSimulacion,
  Equipo,
  RolIT,
  MiembroEquipo,
} from '@/app/types/simulaciones'
import {
  Users,
  UserPlus,
  X,
  Loader2,
  AlertCircle,
  ChevronDown,
  Filter,
} from 'lucide-react'



const ROL_LABEL: Record<RolIT, string> = {
  [RolIT.FRONTEND_DEVELOPER]:   'Frontend Dev',
  [RolIT.BACKEND_DEVELOPER]:    'Backend Dev',
  [RolIT.FULL_STACK_DEVELOPER]: 'Full Stack',
  [RolIT.UX_UI_DESIGNER]:       'UX/UI',
  [RolIT.DATA_SCIENTIST]:       'Data Scientist',
  [RolIT.DATA_ENGINEER]:        'Data Engineer',
  [RolIT.DATA_ANALYST]:         'Data Analyst',
  [RolIT.MOBILE_DEVELOPER]:     'Mobile Dev',
  [RolIT.QA_ENGINEER]:          'QA',
  [RolIT.DEVOPS_ENGINEER]:      'DevOps',
  [RolIT.CLOUD_ENGINEER]:       'Cloud',
  [RolIT.PRODUCT_MANAGER]:      'Product Manager',
  [RolIT.PROJECT_MANAGER]:      'Project Manager',
  [RolIT.SCRUM_MASTER]:         'Scrum Master',
}

type L = 'en' | 'es'



interface AssignDialogProps {
  perfil:        PerfilSimulacion
  equipos:       Equipo[]
  simulacionId:  string
  locale:        L
  onSuccess:     () => void
  onCancel:      () => void
}

function AssignDialog({ perfil, equipos, simulacionId, locale: l, onSuccess, onCancel }: AssignDialogProps) {
  const [equipoId,    setEquipoId]    = useState('')
  const [rolAsignado, setRolAsignado] = useState<RolIT>(perfil.rolPostulado)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  const cargarFlotantes  = useSimulacionesStore((s) => s.cargarFlotantes)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape' && !loading) onCancel() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [loading, onCancel])

  const handleAssign = useCallback(async () => {
    if (!equipoId) return
    setLoading(true)
    setError(null)
    try {
      await simPost<MiembroEquipo, { usuarioId: string; rolAsignado: RolIT }>(
        `/admin/equipos/${equipoId}/anadir-miembro`,
        { usuarioId: perfil.usuarioId, rolAsignado },
      )
      await cargarFlotantes(simulacionId)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : (s.assignFailed))
      setLoading(false)
    }
  }, [equipoId, rolAsignado, perfil.usuarioId, simulacionId, cargarFlotantes, onSuccess, l])

 
  const equiposDisponibles = equipos.filter((e) => e.simulacionId === simulacionId)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-dlg-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={() => !loading && onCancel()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border p-7 shadow-2xl"
        style={{ background: 'var(--bg-raised)', borderColor: 'color-mix(in srgb, var(--brand) 28%, var(--border))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {!loading && (
          <button onClick={onCancel} className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-[color:var(--bg-overlay)]" style={{ color: 'var(--text-muted)' }}>
            <X size={15} />
          </button>
        )}

        <div className="mb-5 inline-flex items-center justify-center h-11 w-11 rounded-xl" style={{ background: 'color-mix(in srgb, var(--brand) 10%, var(--bg-overlay))', border: '1px solid color-mix(in srgb, var(--brand) 25%, var(--border))', color: 'var(--brand)' }}>
          <UserPlus size={20} strokeWidth={1.75} />
        </div>

        <h2 id="assign-dlg-title" className="font-display font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>
          {s.assignDlgTitle}
        </h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
          {s.appliedRole + ' '}
          <span className="font-semibold" style={{ color: 'var(--brand)' }}>
            {ROL_LABEL[perfil.rolPostulado]}
          </span>
        </p>

        
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
          {s.targetTeam}
        </label>
        <div className="relative mb-4">
          <select
            value={equipoId}
            onChange={(e) => setEquipoId(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border px-3 py-2.5 text-sm appearance-none outline-none focus:ring-2 focus:ring-[--brand] disabled:opacity-60"
            style={{ background: 'var(--bg-overlay)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <option value="">{s.selectTeam}</option>
            {equiposDisponibles.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.nombreAutogenerado} ({eq.miembros.length} {s.memberCount})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
        </div>

        
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
          {s.roleInTeam}
        </label>
        <div className="relative mb-5">
          <select
            value={rolAsignado}
            onChange={(e) => setRolAsignado(e.target.value as RolIT)}
            disabled={loading}
            className="w-full rounded-xl border px-3 py-2.5 text-sm appearance-none outline-none focus:ring-2 focus:ring-[--brand] disabled:opacity-60"
            style={{ background: 'var(--bg-overlay)', borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            {Object.values(RolIT).map((r) => (
              <option key={r} value={r}>{ROL_LABEL[r]}</option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'var(--danger)' }}>
            <AlertCircle size={12} strokeWidth={2} />{error}
          </p>
        )}

        <div className="flex gap-2.5">
          <button onClick={onCancel} disabled={loading} className="dc-btn-ghost flex-1 py-2.5 text-sm justify-center disabled:opacity-50">
            {s.ghDlgCancel}
          </button>
          <button onClick={handleAssign} disabled={loading || !equipoId} className="dc-btn-primary flex-1 py-2.5 text-sm justify-center disabled:opacity-50">
            {loading
              ? <><Loader2 size={13} strokeWidth={2} className="animate-spin" />{s.assigning}</>
              : <><UserPlus size={13} strokeWidth={2} />{s.assignBtn}</>}
          </button>
        </div>
      </div>
    </div>
  )
}



interface FlotantesPanelProps {
  simulacionId:  string
  equipos:       Equipo[]
}

export function FlotantesPanel({ simulacionId, equipos }: FlotantesPanelProps) {
  const { locale }          = useI18n()
  const l: L                = locale === 'es' ? 'es' : 'en'
  const flotantes           = useSimulacionesStore((s) => s.flotantes)
  const cargandoAdmin       = useSimulacionesStore((s) => s.cargandoAdmin)
  const cargarFlotantes     = useSimulacionesStore((s) => s.cargarFlotantes)

  const [filtroRol,       setFiltroRol]       = useState<RolIT | 'ALL'>('ALL')
  const [perfilAsignando, setPerfilAsignando] = useState<PerfilSimulacion | null>(null)

  
  useEffect(() => { cargarFlotantes(simulacionId) }, [simulacionId, cargarFlotantes])

  
  const rolesPresentes = useMemo(() => {
    const set = new Set<RolIT>(flotantes.map((f) => f.rolPostulado))
    return Array.from(set)
  }, [flotantes])

  const flotantesFiltrados = useMemo(() =>
    filtroRol === 'ALL'
      ? flotantes
      : flotantes.filter((f) => f.rolPostulado === filtroRol),
    [flotantes, filtroRol],
  )

  return (
    <>
      {perfilAsignando && (
        <AssignDialog
          perfil={perfilAsignando}
          equipos={equipos}
          simulacionId={simulacionId}
          locale={l}
          onSuccess={() => setPerfilAsignando(null)}
          onCancel={() => setPerfilAsignando(null)}
        />
      )}

      <div className="dc-card p-6">
        
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Users size={16} strokeWidth={2} style={{ color: 'var(--warning)' }} />
              <h2 className="font-semibold text-base" style={{ color: 'var(--text)' }}>
                {s.floatingStudents}
              </h2>
              {flotantes.length > 0 && (
                <span
                  className="inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold"
                  style={{ background: 'var(--warning)', color: '#000' }}
                >
                  {flotantes.length}
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              {s.floatingStatus}
            </p>
          </div>

          <button
            onClick={() => cargarFlotantes(simulacionId)}
            disabled={cargandoAdmin}
            className="dc-btn-ghost px-3 py-1.5 text-xs disabled:opacity-50"
          >
            {cargandoAdmin
              ? <Loader2 size={12} strokeWidth={2} className="animate-spin" />
              : s.refreshBtn}
          </button>
        </div>

        
        {rolesPresentes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button
              onClick={() => setFiltroRol('ALL')}
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors"
              style={{
                background:  filtroRol === 'ALL' ? 'var(--brand)' : 'var(--bg-overlay)',
                borderColor: filtroRol === 'ALL' ? 'var(--brand)' : 'var(--border)',
                color:       filtroRol === 'ALL' ? '#fff' : 'var(--text-muted)',
              }}
            >
              <Filter size={9} strokeWidth={2} />
              {s.allFilter}
            </button>
            {rolesPresentes.map((r) => (
              <button
                key={r}
                onClick={() => setFiltroRol(r)}
                className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors"
                style={{
                  background:  filtroRol === r ? 'var(--brand)' : 'var(--bg-overlay)',
                  borderColor: filtroRol === r ? 'var(--brand)' : 'var(--border)',
                  color:       filtroRol === r ? '#fff' : 'var(--text-muted)',
                }}
              >
                {ROL_LABEL[r]}
              </button>
            ))}
          </div>
        )}

        
        {flotantes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Users size={28} strokeWidth={1.5} className="mb-3" style={{ color: 'var(--text-dim)' }} />
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
              {s.noFloating}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {flotantesFiltrados.map((perfil) => (
              <div
                key={perfil.id}
                className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
                style={{
                  background:  'color-mix(in srgb, var(--warning) 5%, var(--bg-overlay))',
                  borderColor: 'color-mix(in srgb, var(--warning) 20%, var(--border))',
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                    {perfil.usuarioId}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[10px] font-medium rounded-full border px-2 py-0.5"
                      style={{
                        background:  'color-mix(in srgb, var(--brand) 10%, transparent)',
                        borderColor: 'color-mix(in srgb, var(--brand) 22%, var(--border))',
                        color:       'var(--brand)',
                      }}
                    >
                      {ROL_LABEL[perfil.rolPostulado]}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      {perfil.nivelExperiencia} · {perfil.bloqueHorario.replace('BLOQUE_', '')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setPerfilAsignando(perfil)}
                  className="dc-btn-ghost flex-shrink-0 px-3 py-1.5 text-xs flex items-center gap-1.5"
                >
                  <UserPlus size={12} strokeWidth={2} />
                  {s.assignBtn}
                </button>
              </div>
            ))}

            {filtroRol !== 'ALL' && flotantesFiltrados.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: 'var(--text-dim)' }}>
                {l === 'es' ? 'Sin flotantes con ese rol.' : 'No floating students with that role.'}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}
