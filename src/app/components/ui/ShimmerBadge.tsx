'use client'
interface Props { children: React.ReactNode }
export function ShimmerBadge({ children }: Props) {
  return (
    <span
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-3.5 py-1.5 text-xs font-semibold"
      style={{
        background: 'color-mix(in srgb, var(--brand) 8%, transparent)',
        borderColor: 'color-mix(in srgb, var(--brand) 28%, transparent)',
        color: 'var(--brand)',
      }}
    >
      {/* shimmer sweep */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, color-mix(in srgb, var(--brand) 20%, transparent) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer-sweep 2.6s ease-in-out infinite',
        }}
      />
      <style>{`@keyframes shimmer-sweep{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="relative">{children}</span>
    </span>
  )
}
