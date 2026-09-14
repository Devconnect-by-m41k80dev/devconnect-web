'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
}

export function TextReveal({
  text,
  className = '',
  style,
  delay = 60,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current

    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  const words = text.trim().split(/\s+/)

  return (
    <span
      ref={ref}
      className={`block ${className}`}
      style={style}
      aria-label={text}
    >
      <span
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: '0.28em',
          rowGap: '0',
          maxWidth: '100%',
        }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'inline-block',
              flexShrink: 0,
              opacity: visible ? 1 : 0,
              transform: visible
                ? 'translateY(0)'
                : 'translateY(12px)',
              transition: `
                opacity 360ms cubic-bezier(0.16, 1, 0.3, 1) ${i * delay}ms,
                transform 360ms cubic-bezier(0.16, 1, 0.3, 1) ${i * delay}ms
              `,
              willChange: 'opacity, transform',
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  )
}