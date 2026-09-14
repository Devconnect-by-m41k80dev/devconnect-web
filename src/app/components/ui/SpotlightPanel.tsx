'use client'

import { useRef, useCallback } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function SpotlightPanel({ children, className = '', style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !spotRef.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    spotRef.current.style.setProperty('--x', `${x}px`)
    spotRef.current.style.setProperty('--y', `${y}px`)
    spotRef.current.style.opacity = '1'
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (spotRef.current) spotRef.current.style.opacity = '0'
  }, [])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
     
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 0,
          background: 'radial-gradient(280px circle at var(--x, 50%) var(--y, 50%), color-mix(in srgb, var(--brand) 9%, transparent), transparent 70%)',
        }}
      />
      {children}
    </div>
  )
}
