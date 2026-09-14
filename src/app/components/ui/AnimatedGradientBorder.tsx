'use client'

interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function AnimatedGradientBorder({ children, className = '', style }: Props) {
  return (
    <div className={`relative ${className}`} style={style}>
      
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          padding: '1px',
          background: 'conic-gradient(from var(--angle, 0deg), var(--brand), var(--accent), #60A5FA, var(--brand))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: 'spin-border 4s linear infinite',
        }}
      />
      <style>{`
        @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes spin-border { to { --angle: 360deg; } }
      `}</style>
      {children}
    </div>
  )
}
