'use client'


import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useId,
} from 'react'
import { createPortal }         from 'react-dom'
import { useI18n }              from '@/app/i18n'
import { useSimulacionesStore } from '@/app/store/simulaciones.store'
import { useSimulacionesSSE }   from '@/app/lib/http/sse-client'
import {
  NotificacionSSE,
  NotificacionTipo,
} from '@/app/types/simulaciones'
import {
  CheckCircle2,
  AlertTriangle,
  Trophy,
  BellRing,
  Rocket,
  Users,
  X,
} from 'lucide-react'


interface NotifTypeConfig {
  Icon:         React.ElementType
  colorVar:     string
  bgVar:        string
  borderVar:    string
  durationMs:   number
}

const NOTIF_CONFIG: Record<NotificacionTipo, NotifTypeConfig> = {
  EQUIPO_ASIGNADO: {
    Icon:       Users,
    colorVar:  'var(--brand)',
    bgVar:     'color-mix(in srgb, var(--brand) 8%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--brand) 25%, var(--border))',
    durationMs: 8_000,
  },
  ENTREGABLE_APROBADO: {
    Icon:       CheckCircle2,
    colorVar:  'var(--accent)',
    bgVar:     'color-mix(in srgb, var(--accent) 8%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--accent) 25%, var(--border))',
    durationMs: 6_000,
  },
  ENTREGABLE_RECHAZADO: {
    Icon:       AlertTriangle,
    colorVar:  'var(--danger)',
    bgVar:     'color-mix(in srgb, var(--danger) 8%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--danger) 28%, var(--border))',
    durationMs: 10_000,  
  },
  HITO_COMPLETADO: {
    Icon:       Trophy,
    colorVar:  'var(--violet)',
    bgVar:     'color-mix(in srgb, var(--violet) 8%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--violet) 25%, var(--border))',
    durationMs: 8_000,
  },
  CERTIFICADO_EMITIDO: {
    Icon:       Trophy,
    colorVar:  '#f59e0b',  
    bgVar:     'color-mix(in srgb, #f59e0b 8%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, #f59e0b 30%, var(--border))',
    durationMs: 12_000,
  },
  SIMULACION_PUBLICADA: {
    Icon:       Rocket,
    colorVar:  'var(--brand)',
    bgVar:     'color-mix(in srgb, var(--brand) 8%, var(--bg-raised))',
    borderVar: 'color-mix(in srgb, var(--brand) 25%, var(--border))',
    durationMs: 8_000,
  },
}



interface ToastAction {
  label:    string
  onClick:  () => void
}



interface ActiveToast {
  id:          string
  notif:       NotificacionSSE
  config:      NotifTypeConfig
  visible:     boolean          
  action?:     ToastAction
}


const MAX_TOASTS    = 4
const APPEAR_DELAY  = 16   



interface ToastItemProps {
  toast:     ActiveToast
  onDismiss: (id: string) => void
  locale:    'en' | 'es'
}

function ToastItem({ toast, onDismiss, locale: l }: ToastItemProps) {
  const { notif, config, visible } = toast
  const { Icon } = config

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-auto flex w-full max-w-sm flex-col gap-0 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
      style={{
        background:   config.bgVar,
        border:       `1.5px solid ${config.borderVar}`,
        opacity:      visible ? 1 : 0,
        transform:    visible ? 'translateY(0) scale(1)' : 'translateY(1.5rem) scale(0.96)',
        boxShadow:    `0 8px 32px rgba(0,0,0,0.22), 0 0 0 1px ${config.borderVar}`,
      }}
    >
     
      <div
        aria-hidden
        className="h-0.5 w-full"
        style={{ background: config.colorVar }}
      />

      <div className="flex items-start gap-3 px-4 pt-3 pb-3.5">
        
        <span
          className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-xl mt-0.5"
          style={{
            background: `color-mix(in srgb, ${config.colorVar} 14%, transparent)`,
            color:       config.colorVar,
          }}
        >
          <Icon size={16} strokeWidth={2} />
        </span>

        
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold leading-snug mb-0.5 truncate"
            style={{ color: 'var(--text)' }}
          >
            {notif.titulo}
          </p>
          <p
            className="text-xs leading-[1.62]"
            style={{ color: 'var(--text-muted)' }}
          >
            {notif.mensaje}
          </p>

          
          {toast.action && (
            <button
              onClick={() => { toast.action!.onClick(); onDismiss(toast.id) }}
              className="mt-1.5 text-xs font-semibold underline transition-opacity hover:opacity-70"
              style={{ color: config.colorVar }}
            >
              {l === 'es' ? toast.action.label : toast.action.label}
            </button>
          )}
        </div>

       
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 p-1 rounded-md transition-colors hover:bg-[color:var(--bg-overlay)] mt-0.5"
          style={{ color: 'var(--text-dim)' }}
          aria-label={l === 'es' ? 'Cerrar notificación' : 'Dismiss notification'}
        >
          <X size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}


interface ToastPortalProps {
  toasts:    ActiveToast[]
  onDismiss: (id: string) => void
  locale:    'en' | 'es'
}

function ToastPortal({ toasts, onDismiss, locale }: ToastPortalProps) {
  
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      aria-label={locale === 'es' ? 'Notificaciones' : 'Notifications'}
      className="pointer-events-none fixed bottom-5 right-4 z-[100] flex w-full max-w-sm flex-col-reverse gap-2.5"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} locale={locale} />
      ))}
    </div>,
    document.body,
  )
}



interface NotificacionesToastProps {
  
  enabled?:          boolean
  
  simulacionId?:     string | null
  
  onEntregableChange?: () => void
}

export function NotificacionesToast({
  enabled          = true,
  simulacionId,
  onEntregableChange,
}: NotificacionesToastProps) {
  const { locale }           = useI18n()
  const l                    = locale === 'es' ? 'es' : 'en'
  const agregarNotificacion  = useSimulacionesStore((s) => s.agregarNotificacion)

  const [toasts, setToasts]  = useState<ActiveToast[]>([])
  const timersRef            = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const baseId               = useId()
  const toastCount           = useRef(0)

  
  const dismiss = useCallback((id: string) => {
    
    setToasts((prev) =>
      prev.map((t) => t.id === id ? { ...t, visible: false } : t),
    )

    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
      const timer = timersRef.current.get(id)
      if (timer) { clearTimeout(timer); timersRef.current.delete(id) }
    }, 320)
  }, [])

  
  const handleMessage = useCallback((notif: NotificacionSSE) => {
    
    agregarNotificacion(notif)

   
    if (
      onEntregableChange &&
      (notif.tipo === 'ENTREGABLE_APROBADO' || notif.tipo === 'ENTREGABLE_RECHAZADO')
    ) {
      onEntregableChange()
    }

    
    const config  = NOTIF_CONFIG[notif.tipo] ?? NOTIF_CONFIG.SIMULACION_PUBLICADA
    const id      = `${baseId}-${++toastCount.current}`

    const newToast: ActiveToast = {
      id,
      notif,
      config,
      visible: false,   
    }

    setToasts((prev) => {
      const next = [newToast, ...prev].slice(0, MAX_TOASTS)
      return next
    })

    
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => t.id === id ? { ...t, visible: true } : t),
      )
    }, APPEAR_DELAY)

    
    const timer = setTimeout(() => dismiss(id), config.durationMs)
    timersRef.current.set(id, timer)
  }, [agregarNotificacion, onEntregableChange, dismiss, baseId])

  
  useEffect(() => {
    const timers = timersRef.current
    return () => { timers.forEach(clearTimeout); timers.clear() }
  }, [])

 
  useSimulacionesSSE({
    onMessage: handleMessage,
    enabled:   enabled && !!simulacionId,
    onError:   () => {
      
    },
  })

 
  const unread = useSimulacionesStore((s) => s.noLeidasCount)

  return (
    <>
      
      {toasts.length > 0 && (
        <ToastPortal toasts={toasts} onDismiss={dismiss} locale={l} />
      )}

     
      {enabled && !!simulacionId && (
        <div
          aria-hidden
          className="fixed bottom-5 left-4 z-[99] flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium select-none pointer-events-none transition-opacity duration-500"
          style={{
            background:  'var(--bg-raised)',
            borderColor: 'var(--border)',
            color:       'var(--text-dim)',
            opacity:     unread > 0 ? 1 : 0.45,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: 'var(--accent)', animationDuration: '2.5s' }}
          />
          {l === 'es' ? 'Conectado' : 'Live'}
          {unread > 0 && (
            <span
              className="inline-flex items-center justify-center h-4 w-4 rounded-full text-[9px] font-bold"
              style={{ background: 'var(--brand)', color: '#fff' }}
            >
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>
      )}
    </>
  )
}


export { BellRing }
