'use client'
import { useRef, useCallback } from 'react'
interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode; className?: string
}
export function MagneticButton({ children, className = '', ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 6
    el.style.transform = `translate(${x}px, ${y}px)`
  }, [])
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)'
  }, [])
  return (
    <a ref={ref} className={className} {...props}
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1)', ...props.style }}
    >{children}</a>
  )
}
