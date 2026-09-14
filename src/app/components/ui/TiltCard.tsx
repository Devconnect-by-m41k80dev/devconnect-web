'use client'

import { useRef, useCallback } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  maxTilt?: number
}

export function TiltCard({ children, className = '', style, maxTilt = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width  / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    const rotateX = (-dy * maxTilt).toFixed(2)
    const rotateY = ( dx * maxTilt).toFixed(2)
    ref.current.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`
  }, [maxTilt])

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
