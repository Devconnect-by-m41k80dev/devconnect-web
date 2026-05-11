export function ProjectCardTechStack({ techStack }: { techStack?: string[] }) {
  if (!techStack || techStack.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {techStack.slice(0, 5).map((tech) => (
        <span
          key={tech}
          className="font-mono text-[10px] px-2 py-0.5 rounded-md border"
          style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--bg-overlay)' }}
        >
          {tech}
        </span>
      ))}
      {techStack.length > 5 && (
        <span
          className="text-[10px] px-2 py-0.5 rounded-md"
          style={{ color: 'var(--text-dim)', background: 'var(--bg-overlay)' }}
        >
          +{techStack.length - 5}
        </span>
      )}
    </div>
  )
}