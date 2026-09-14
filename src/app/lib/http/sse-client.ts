'use client'


import { useEffect, useRef, useCallback } from 'react'
import { NotificacionSSE } from '@/app/types/simulaciones'


const SSE_URL: string = `${
  process.env.NEXT_PUBLIC_SIMULATIONS_API_URL ?? 'http://localhost:3001/api'
}/notificaciones/stream`


const RECONNECT_DELAY_MS = 5_000


let connectionCounter = 0



export type SSEMessageHandler = (notificacion: NotificacionSSE) => void
export type SSEErrorHandler   = (event: Event) => void

export interface UseSimulacionesSSEOptions {
  
  onMessage:  SSEMessageHandler
  
  onError?:   SSEErrorHandler
  /**
   * Si es false el hook no abre la conexión.
   * @default true
   */
  enabled?:   boolean
}


export function useSimulacionesSSE({
  onMessage,
  onError,
  enabled = true,
}: UseSimulacionesSSEOptions): void {

  
  const esRef = useRef<EventSource | null>(null)

  
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  
  const mountedRef = useRef<boolean>(false)

 
  const connectionIdRef = useRef<number>(0)

  
  const onMessageRef = useRef<SSEMessageHandler>(onMessage)
  const onErrorRef   = useRef<SSEErrorHandler | undefined>(onError)

  useEffect(() => { onMessageRef.current = onMessage }, [onMessage])
  useEffect(() => { onErrorRef.current   = onError   }, [onError])

  /**
   * Abre una nueva conexión EventSource.
   *
   * @param expectedId - ID del ciclo de conexión que autoriza esta apertura.
   *   Si al momento de ejecutar expectedId !== connectionIdRef.current,
   *   la llamada es de un ciclo obsoleto y se descarta sin abrir socket.
   */
  const conectar = useCallback((expectedId: number): void => {
   
    if (expectedId !== connectionIdRef.current) return

    
    if (
      esRef.current &&
      (esRef.current.readyState === EventSource.CONNECTING ||
       esRef.current.readyState === EventSource.OPEN)
    ) {
      return
    }

    
    if (!mountedRef.current) return

    const es = new EventSource(SSE_URL, { withCredentials: true })
    esRef.current = es

    // ── Handler de mensaje ────────────────────────────────────────────────
    es.onmessage = (event: MessageEvent): void => {
      if (!mountedRef.current) return
     
      if (es !== esRef.current) return

      try {
        const payload = JSON.parse(event.data as string) as NotificacionSSE
        onMessageRef.current(payload)
      } catch {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[SSE] Payload malformado:', event.data)
        }
      }
    }

   
    es.onerror = (event: Event): void => {
      if (onErrorRef.current) onErrorRef.current(event)

      if (es.readyState === EventSource.CLOSED) {
        es.close()
        
        if (es === esRef.current) esRef.current = null

        if (mountedRef.current) {
           
          const idParaReconectar = connectionIdRef.current
          reconnectTimerRef.current = setTimeout(() => {
            conectar(idParaReconectar)
          }, RECONNECT_DELAY_MS)
        }
      }
      
    }
  }, []) 


  useEffect(() => {
    if (!enabled) {
      if (esRef.current) {
        esRef.current.close()
        esRef.current = null
      }
      return
    }

   
    const myConnectionId = ++connectionCounter
    connectionIdRef.current = myConnectionId
    mountedRef.current = true

    conectar(myConnectionId)

    return (): void => {
     
      mountedRef.current = false

     
      connectionIdRef.current = ++connectionCounter

      if (reconnectTimerRef.current !== null) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }

      if (esRef.current) {
        esRef.current.close()
        esRef.current = null
      }
    }
  }, [enabled, conectar])
}


export function supportsSSE(): boolean {
  return typeof window !== 'undefined' && 'EventSource' in window
}


export function getSSEUrl(): string {
  return SSE_URL
}
