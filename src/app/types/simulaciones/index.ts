export enum SimulacionEstado {
    RECLUTAMIENTO = 'RECLUTAMIENTO',
    CIERRE_INSCRIPCIONES = 'CIERRE_INSCRIPCIONES',
    EN_CURSO = 'EN_CURSO',
    FINALIZADO = 'FINALIZADO',
}

export enum MatchmakingEstado {
    BORRADOR = 'BORRADOR',
    PUBLICADO = 'PUBLICADO',
}

export enum PerfilEstado {
    INSCRITO = 'INSCRITO',
    PENDIENTE_ASIGNACION = 'PENDIENTE_ASIGNACION',
    ASIGNADO = 'ASIGNADO',
    BAJA = 'BAJA',
}


export enum RolIT {
  FRONTEND_DEVELOPER   = 'FRONTEND_DEVELOPER',
  BACKEND_DEVELOPER    = 'BACKEND_DEVELOPER',
  FULL_STACK_DEVELOPER = 'FULL_STACK_DEVELOPER',
  UX_UI_DESIGNER       = 'UX_UI_DESIGNER',
  DATA_SCIENTIST       = 'DATA_SCIENTIST',
  DATA_ENGINEER        = 'DATA_ENGINEER',
  DATA_ANALYST         = 'DATA_ANALYST',
  MOBILE_DEVELOPER     = 'MOBILE_DEVELOPER',
  QA_ENGINEER          = 'QA_ENGINEER',
  DEVOPS_ENGINEER      = 'DEVOPS_ENGINEER',
  CLOUD_ENGINEER       = 'CLOUD_ENGINEER',
  PRODUCT_MANAGER      = 'PRODUCT_MANAGER',
  PROJECT_MANAGER      = 'PROJECT_MANAGER',
  SCRUM_MASTER         = 'SCRUM_MASTER',
}

export const ROLES_QUE_REQUIEREN_GITHUB = new Set<RolIT>([
  RolIT.FRONTEND_DEVELOPER,
  RolIT.BACKEND_DEVELOPER,
  RolIT.FULL_STACK_DEVELOPER,
  RolIT.MOBILE_DEVELOPER,
  RolIT.DEVOPS_ENGINEER,
  RolIT.CLOUD_ENGINEER,
  RolIT.DATA_ENGINEER,
])

export enum NivelExperiencia {
  TRAINEE = 'TRAINEE',
  JUNIOR  = 'JUNIOR',
}

export enum BloqueHorario {
  BLOQUE_MANANA = 'BLOQUE_MANANA',
  BLOQUE_TARDE  = 'BLOQUE_TARDE',
  BLOQUE_NOCHE  = 'BLOQUE_NOCHE',
}

export enum EntregableTipo {
  FIGMA      = 'FIGMA',
  PRD        = 'PRD',
  REPO_FRONT = 'REPO_FRONT',
  REPO_BACK  = 'REPO_BACK',
  DEMO       = 'DEMO',
}

export enum EntregableEstado {
  PENDIENTE   = 'PENDIENTE',
  EN_REVISION = 'EN_REVISION',
  APROBADO    = 'APROBADO',
  RECHAZADO   = 'RECHAZADO',
}

export enum CertificadoTipo {
  PARTICIPACION = 'PARTICIPACION',
  GANADOR       = 'GANADOR',
}

export const HITO_ENTREGABLES: Readonly<Record<1 | 2 | 3, readonly EntregableTipo[]>> = {
  1: [EntregableTipo.FIGMA, EntregableTipo.PRD],
  2: [EntregableTipo.REPO_FRONT, EntregableTipo.REPO_BACK],
  3: [EntregableTipo.DEMO],
} as const


export function getHitoPorTipo(tipo: EntregableTipo): 1 | 2 | 3 | null {
  for (const [hito, tipos] of Object.entries(HITO_ENTREGABLES) as [string, readonly EntregableTipo[]][]) {
    if (tipos.includes(tipo)) return Number(hito) as 1 | 2 | 3
  }
  return null
}

export interface Tecnologia {
    id: string
    nombre: string
    tipo: string
}

export interface UsuarioSimulacion {
    id: string
    fullName: string
    email: string
    profileImage: string | null
    githubUsername: string | null
}

export interface PerfilSimulacion {
    id: string
    usuarioId: string
    simulacionId: string
    zonaHoraria: string
    bloqueoHorario: BloqueHorario
    horasDisponiblesSemana: number
    nivelExperiencia: NivelExperiencia
    estado: PerfilEstado
    githubUsername: string | null
    tecnologias: Tecnologia[]
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

export interface Simulacion {
    id: string
    nombre: string
    fechaInicio: string
    fechaFin: string
    fechaLimiteInscripcion: string | null
    scheduleJobId: string | null
    estado: SimulacionEstado
    matchmakingEstado: MatchmakingEstado
    createdAt: string
    updatedAt: string
}

export interface MiembroEquipo {
    id: string
    usuarioId: string
    equipoId: string
    rolAsignado: RolIT
    createdAt: string
    deletedAt: string | null
}

export interface Equipo {
    id: string
    nombreAutogenerado: string
    simulacionId: string
    stackFrontendMatch: string[] | null
    stackBackendMatch: string[] | null
    matchmakingEstado: MatchmakingEstado
    discordChannelUrl: string | null
    discordTextChannelId: string | null
    discordVoiceChannelId: string | null
    githubRepoUrl: string | null
    githubUsername: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    miembros: MiembroEquipo[]
}

export interface Proyecto {
  id:                  string
  equipoId:            string
  titulo:              string 
  contextoNegocio:     string
  requerimientosMvp:   string
  criteriosAceptacion: string
  stackUsado:          string[] | null
  generadoPorIa:       boolean
  createdAt:           string
  updatedAt:           string
}



export interface Entregable {
    id: string
    equipoId: string
    tipo : EntregableTipo
    urlLink: string | null
    estado: EntregableEstado
    comentarios: string | null
    hito: 1 | 2 | 3 
    evaluadoPor: string | null
    evaluadoEn: string | null
    createdAt: string
    updatedAt: string
} 

export interface Certificado {
    id: string
    miembroEquipoId: string
    sumulacionId: string
    equipoId: string
    usuarioId: string
    tipo: CertificadoTipo
    codigoVerificacion: string
    fechaEmision: string
    createdAt: string
}

export interface ResultadoMatchmaking {
  equiposGenerados:         number
  participantesAsignados:   number
  participantesSinEquipo:   number
  flotantes:                string[]
  equipos:                  Equipo[]
}


export interface ResultadoPublicacion {
  simulacionId:      string
  equiposPublicados: number
  usuariosNotificados: number
  equipos:           Equipo[]
}

export interface ResultadoEmisionCertificados {
  certificadosEmitidos: number
  certificados:         Certificado[]
}

export type NotificacionTipo =
  | 'EQUIPO_ASIGNADO'
  | 'ENTREGABLE_APROBADO'
  | 'ENTREGABLE_RECHAZADO'
  | 'HITO_COMPLETADO'
  | 'CERTIFICADO_EMITIDO'
  | 'SIMULACION_PUBLICADA'


  export interface NotificacionSSE {
  id:        string
  tipo:      NotificacionTipo
  titulo:    string
  mensaje:   string
  leida:     boolean
  createdAt: string
  data:      Record<string, unknown> | null
}

export type UIState = {
  cargandoAlumno: boolean
  cargandoAdmin: boolean
  cargandoAccion: boolean
  errorAlumno: string | null
  errorAdmin: string | null
  errorAccion: string | null
}
