'use client'

import { Plus, X } from 'lucide-react'
import { useI18n } from '@/app/i18n'

interface Props {
  techStack:  string[]
  techInput:  string
  onInput:    (v: string) => void
  onAdd:      () => void
  onRemove:   (t: string) => void
}

export function TechStackInput({ techStack, techInput, onInput, onAdd, onRemove }: Props) {
  const { t } = useI18n()
  return (
    <div>
      <label className="dc-label">
        {t.project.techStack}
        <span className="text-xs ml-1" style={{ color: 'var(--text-dim)' }}>({t.common.optional}, max 20)</span>
      </label>
      <div className="flex gap-2 mb-3">
        <input type="text" value={techInput} onChange={e => onInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAdd() } }} placeholder="e.g. NestJS" className="dc-input flex-1" />
        <button type="button" onClick={onAdd} disabled={!techInput.trim() || techStack.length >= 20} className="dc-btn-ghost py-2.5 px-3.5 disabled:opacity-40"><Plus size={16} /></button>
      </div>
      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {techStack.map(tech => (
            <span key={tech} className="flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg border" style={{ color: 'var(--accent)', borderColor: 'color-mix(in srgb, var(--accent) 22%, transparent)', background: 'color-mix(in srgb, var(--accent) 7%, transparent)' }}>
              {tech}<button type="button" onClick={() => onRemove(tech)} className="hover:text-[--danger] transition-colors"><X size={11} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
