'use client'


import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  Simulacion,
  Equipo,
  Proyecto,
  Entregable,
  PerfilSimulacion,
  Certificado,
  ResultadoMatchmaking,
  ResultadoPublicacion,
  ResultadoEmisionCertificados,
  NotificacionSSE,
  EntregableEstado,
} from '@/app/types/simulaciones'
import type { UIState } from '@/app/types/simulaciones'
import {
  simGet,
  simPost,
  simPatch,
} from '@/app/lib/http/sim-http-client'



interface AlumnoState {
 
  miSimulacion:   Simulacion | null
  
  miPerfil:       PerfilSimulacion | null
  
  miEquipo:       Equipo | null
 
  miProyecto:     Proyecto | null
 
  misEntregables: Entregable[]
  
  misCertificados: Certificado[]

  entregablesMutando: Record<string, true>
}


interface AdminState {
  
  simulaciones:      Simulacion[]
  
  flotantes:         PerfilSimulacion[]
  
  ultimoMatchmaking: ResultadoMatchmaking | null
  
  ultimaPublicacion: ResultadoPublicacion | null
  
  ultimosCertificados: ResultadoEmisionCertificados | null
}


interface NotificacionesState {
  
  notificaciones:     NotificacionSSE[]
 
  noLeidasCount:      number
}



type SimulacionesState = AlumnoState & AdminState & NotificacionesState & UIState



interface AlumnoActions {
  
  cargarDatosAlumno: (simulacionId: string) => Promise<void>

  
  subirUrlEntregable: (entregableId: string, urlLink: string) => Promise<void>

 
  recargarEntregables: () => Promise<void>

  
  limpiarAlumno: () => void
}

interface AdminActions {
 
  cargarSimulaciones: () => Promise<void>

  
  cargarFlotantes: (simulacionId: string) => Promise<void>

  
  generarEquipos: (simulacionId: string, miembrosMinimos: number) => Promise<void>

  
  publicarEquipos: (simulacionId: string, conIA: boolean) => Promise<void>

  
  evaluarEntregable: (
    entregableId: string,
    estado: EntregableEstado.APROBADO | EntregableEstado.RECHAZADO,
    comentarios: string,
  ) => Promise<void>

  
  emitirCertificadosParticipacion: (
    simulacionId: string,
    equipoId: string,
  ) => Promise<void>

  
  seleccionarGanador: (simulacionId: string, equipoId: string) => Promise<void>

  
  limpiarAdmin: () => void
}

interface NotificacionesActions {
  
  agregarNotificacion: (notificacion: NotificacionSSE) => void

  
  marcarLeida: (notificacionId: string) => void

  
  marcarTodasLeidas: () => void


  limpiarNotificaciones: () => void
}

interface UIActions {
  
  limpiarErrorAlumno: () => void
  
  limpiarErrorAdmin:  () => void
  
  limpiarErrorAccion: () => void
}

type SimulacionesActions =
  & AlumnoActions
  & AdminActions
  & NotificacionesActions
  & UIActions


const ALUMNO_INITIAL: AlumnoState = {
  miSimulacion:       null,
  miPerfil:           null,
  miEquipo:           null,
  miProyecto:         null,
  misEntregables:     [],
  misCertificados:    [],
  entregablesMutando: {},
}

const ADMIN_INITIAL: AdminState = {
  simulaciones:        [],
  flotantes:           [],
  ultimoMatchmaking:   null,
  ultimaPublicacion:   null,
  ultimosCertificados: null,
}

const NOTIFICACIONES_INITIAL: NotificacionesState = {
  notificaciones:  [],
  noLeidasCount:   0,
}

const UI_INITIAL: UIState = {
  cargandoAlumno: false,
  cargandoAdmin: false,
  cargandoAccion: false,
  errorAlumno: null,
  errorAdmin: null,
  errorAccion: null,
}



export const useSimulacionesStore = create<SimulacionesState & SimulacionesActions>()(
  devtools(
    (set, get) => ({
      
      ...ALUMNO_INITIAL,
      ...ADMIN_INITIAL,
      ...NOTIFICACIONES_INITIAL,
      ...UI_INITIAL,



      cargarDatosAlumno: async (simulacionId: string): Promise<void> => {
        set({ cargandoAlumno: true, errorAlumno: null })

        try {
          
          const [simulacion, perfil, equipo] = await Promise.all([
            simGet<Simulacion>(`/simulaciones/${simulacionId}`),
            simGet<PerfilSimulacion>(`/perfiles/me/${simulacionId}`),
            simGet<Equipo | null>(`/equipos/me/${simulacionId}`).catch(() => null),
          ])

          
          let proyecto:     Proyecto | null    = null
          let entregables:  Entregable[]       = []
          let certificados: Certificado[]      = []

          if (equipo) {
            ;[proyecto, entregables, certificados] = await Promise.all([
              simGet<Proyecto>(`/proyectos/equipo/${equipo.id}`).catch(() => null),
              simGet<Entregable[]>(`/entregables/equipo/${equipo.id}`).catch(() => []),
              simGet<Certificado[]>(`/certificados/me/${simulacionId}`).catch(() => []),
            ])
          }

          set({
            miSimulacion:    simulacion,
            miPerfil:        perfil,
            miEquipo:        equipo,
            miProyecto:      proyecto,
            misEntregables:  entregables,
            misCertificados: certificados,
            cargandoAlumno:  false,
          })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al cargar datos de la simulación'
          set({ cargandoAlumno: false, errorAlumno: msg })
        }
      },

      subirUrlEntregable: async (entregableId: string, urlLink: string): Promise<void> => {
        const previousEntregables = get().misEntregables

        
        set((state) => ({
          misEntregables: state.misEntregables.map((e) =>
            e.id === entregableId ? { ...e, urlLink, estado: 'PENDIENTE' as EntregableEstado } : e,
          ),
          entregablesMutando: { ...state.entregablesMutando, [entregableId]: true },
          cargandoAccion:     true,
          errorAccion:        null,
        }))

        try {
          const entregableActualizado = await simPatch<Entregable, { urlLink: string }>(
            `/entregables/${entregableId}`,
            { urlLink },
          )

          
          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [entregableId]: _released, ...restMutando } = state.entregablesMutando
            return {
              misEntregables: state.misEntregables.map((e) =>
                e.id === entregableId ? entregableActualizado : e,
              ),
              entregablesMutando: restMutando,
              cargandoAccion:     false,
            }
          })
        } catch (err: unknown) {
          
          const msg = err instanceof Error ? err.message : 'Error al subir el entregable'
          set((state) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [entregableId]: _released, ...restMutando } = state.entregablesMutando
            return {
              misEntregables:     previousEntregables,
              entregablesMutando: restMutando,
              cargandoAccion:     false,
              errorAccion:        msg,
            }
          })
        }
      },

      recargarEntregables: async (): Promise<void> => {
        const { miEquipo } = get()
        if (!miEquipo) return

        try {
          const entregablesDelServidor = await simGet<Entregable[]>(`/entregables/equipo/${miEquipo.id}`)

        
          set((state) => {
            const mutando = state.entregablesMutando
            const hasMutaciones = Object.keys(mutando).length > 0

            if (!hasMutaciones) {
              
              return { misEntregables: entregablesDelServidor }
            }

            
            const mergeado = entregablesDelServidor.map((entregableServidor) => {
              if (mutando[entregableServidor.id]) {
               
                const localOptimista = state.misEntregables.find(
                  (e) => e.id === entregableServidor.id,
                )
                
                return localOptimista ?? entregableServidor
              }
              
              return entregableServidor
            })

            return { misEntregables: mergeado }
          })
        } catch {
        
        }
      },

      limpiarAlumno: (): void => {
        set({ ...ALUMNO_INITIAL })
      },

     
      cargarSimulaciones: async (): Promise<void> => {
        set({ cargandoAdmin: true, errorAdmin: null })

        try {
          const simulaciones = await simGet<Simulacion[]>('/simulaciones')
          set({ simulaciones, cargandoAdmin: false })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al cargar simulaciones'
          set({ cargandoAdmin: false, errorAdmin: msg })
        }
      },

      cargarFlotantes: async (simulacionId: string): Promise<void> => {
        set({ cargandoAdmin: true, errorAdmin: null })

        try {
          const flotantes = await simGet<PerfilSimulacion[]>(
            `/admin/simulaciones/${simulacionId}/flotantes`,
          )
          set({ flotantes, cargandoAdmin: false })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al cargar alumnos flotantes'
          set({ cargandoAdmin: false, errorAdmin: msg })
        }
      },

      generarEquipos: async (simulacionId: string, miembrosMinimos: number): Promise<void> => {
        set({ cargandoAccion: true, errorAccion: null })

        try {
          const resultado = await simPost<ResultadoMatchmaking, { miembrosMinimos: number }>(
            `/admin/simulaciones/${simulacionId}/generar-equipos`,
            { miembrosMinimos },
          )

          set({
            ultimoMatchmaking: resultado,
            
            flotantes:         resultado.flotantes.length > 0
              ? get().flotantes.filter((f) => resultado.flotantes.includes(f.id))
              : [],
            cargandoAccion: false,
          })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al generar equipos'
          set({ cargandoAccion: false, errorAccion: msg })
        }
      },

      publicarEquipos: async (simulacionId: string, conIA: boolean): Promise<void> => {
        set({ cargandoAccion: true, errorAccion: null })

        try {
          const resultado = await simPatch<ResultadoPublicacion>(
            `/admin/simulaciones/${simulacionId}/publicar?ia=${conIA}`,
          )

          set({
            ultimaPublicacion: resultado,
            
            flotantes:         [],
            cargandoAccion:    false,
          })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al publicar la simulación'
          set({ cargandoAccion: false, errorAccion: msg })
        }
      },

      evaluarEntregable: async (
        entregableId: string,
        estado: EntregableEstado.APROBADO | EntregableEstado.RECHAZADO,
        comentarios: string,
      ): Promise<void> => {
        set({ cargandoAccion: true, errorAccion: null })

        try {
          await simPatch<Entregable, {
            estado:      EntregableEstado
            comentarios: string
          }>(`/entregables/${entregableId}/evaluar`, { estado, comentarios })

          set({ cargandoAccion: false })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al evaluar el entregable'
          set({ cargandoAccion: false, errorAccion: msg })
        }
      },

      emitirCertificadosParticipacion: async (
        simulacionId: string,
        equipoId: string,
      ): Promise<void> => {
        set({ cargandoAccion: true, errorAccion: null })

        try {
          const resultado = await simPost<ResultadoEmisionCertificados>(
            `/admin/simulaciones/${simulacionId}/equipos/${equipoId}/emitir-certificados`,
          )

          set({ ultimosCertificados: resultado, cargandoAccion: false })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al emitir certificados'
          set({ cargandoAccion: false, errorAccion: msg })
        }
      },

      seleccionarGanador: async (simulacionId: string, equipoId: string): Promise<void> => {
        set({ cargandoAccion: true, errorAccion: null })

        try {
          const resultado = await simPatch<ResultadoEmisionCertificados, { equipoId: string }>(
            `/admin/simulaciones/${simulacionId}/seleccionar-ganador`,
            { equipoId },
          )

          set({ ultimosCertificados: resultado, cargandoAccion: false })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error al seleccionar ganador'
          set({ cargandoAccion: false, errorAccion: msg })
        }
      },

      limpiarAdmin: (): void => {
        set({ ...ADMIN_INITIAL })
      },

  
      agregarNotificacion: (notificacion: NotificacionSSE): void => {
        set((state) => ({
          
          notificaciones: [notificacion, ...state.notificaciones].slice(0, 50),
          noLeidasCount:  state.noLeidasCount + 1,
        }))
      },

      marcarLeida: (notificacionId: string): void => {
        set((state) => {
          const notif = state.notificaciones.find((n) => n.id === notificacionId)
          if (!notif || notif.leida) return state

          return {
            notificaciones: state.notificaciones.map((n) =>
              n.id === notificacionId ? { ...n, leida: true } : n,
            ),
            noLeidasCount: Math.max(0, state.noLeidasCount - 1),
          }
        })
      },

      marcarTodasLeidas: (): void => {
        set((state) => ({
          notificaciones: state.notificaciones.map((n) => ({ ...n, leida: true })),
          noLeidasCount:  0,
        }))
      },

      limpiarNotificaciones: (): void => {
        set({ ...NOTIFICACIONES_INITIAL })
      },

      
      limpiarErrorAlumno:  (): void => set({ errorAlumno: null }),
      limpiarErrorAdmin:   (): void => set({ errorAdmin: null }),
      limpiarErrorAccion:  (): void => set({ errorAccion: null }),
    }),
    { name: 'SimulacionesStore' }, 
  ),
)


export function selectEntregablesPorHito(
  entregables: Entregable[],
): Record<1 | 2 | 3, Entregable[]> {
  return {
    1: entregables.filter((e) => e.hito === 1),
    2: entregables.filter((e) => e.hito === 2),
    3: entregables.filter((e) => e.hito === 3),
  }
}



export function selectHitoCompletado(entregables: Entregable[], hito: 1 | 2 | 3): boolean {
  const delHito = entregables.filter((e) => e.hito === hito)
  return delHito.length > 0 && delHito.every((e) => e.estado === EntregableEstado.APROBADO)
}


export function selectHitoActivo(entregables: Entregable[]): 1 | 2 | 3 | null {
  if (!selectHitoCompletado(entregables, 1)) return 1
  if (!selectHitoCompletado(entregables, 2)) return 2
  if (!selectHitoCompletado(entregables, 3)) return 3
  return null
}
