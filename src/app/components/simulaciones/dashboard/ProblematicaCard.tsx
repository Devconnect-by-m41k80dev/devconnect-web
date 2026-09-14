'use client'


import { useState, useMemo } from 'react'
import { useI18n }           from '@/app/i18n'
import { Proyecto }          from '@/app/types/simulaciones'
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Building2,
  ListChecks,
  ClipboardCheck,
} from 'lucide-react'


function renderInline(text: string, key: string | number): React.ReactNode {
  
  const RE = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g
  const parts: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null

  // eslint-disable-next-line no-cond-assign
  while ((m = RE.exec(text)) !== null) {
    
    if (m.index > last) parts.push(text.slice(last, m.index))

    if (m[1]) {
      
      parts.push(
        <strong key={`${key}-b-${m.index}`} style={{ color: 'var(--text)', fontWeight: 600 }}>
          {m[2]}
        </strong>,
      )
    } else if (m[3]) {
      
      parts.push(
        <em key={`${key}-i-${m.index}`} style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          {m[4]}
        </em>,
      )
    } else if (m[5]) {
      
      parts.push(
        <code
          key={`${key}-c-${m.index}`}
          className="rounded px-1 py-0.5 text-[0.78em] font-mono"
          style={{
            background:  'color-mix(in srgb, var(--brand) 10%, var(--bg-overlay))',
            color:       'var(--brand)',
            border:      '1px solid color-mix(in srgb, var(--brand) 20%, var(--border))',
          }}
        >
          {m[6]}
        </code>,
      )
    }

    last = RE.lastIndex
  }

  
  if (last < text.length) parts.push(text.slice(last))

  return <>{parts}</>
}


function parseMarkdown(md: string): React.ReactNode[] {
  if (!md?.trim()) return []

  const lines  = md.split('\n')
  const nodes: React.ReactNode[] = []
  let   listItems: string[] = []
  let   nodeIdx = 0

  const flushList = () => {
    if (listItems.length === 0) return
    nodes.push(
      <ul
        key={`ul-${nodeIdx++}`}
        className="my-3 flex flex-col gap-1.5 pl-0"
      >
        {listItems.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm leading-[1.72]"
            style={{ color: 'var(--text-muted)' }}
          >
            <span
              className="mt-[0.35em] flex-shrink-0 h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--brand)' }}
              aria-hidden
            />
            <span>{renderInline(item, `li-${nodeIdx}-${i}`)}</span>
          </li>
        ))}
      </ul>,
    )
    listItems = []
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    
    if (line.startsWith('## ')) {
      flushList()
      nodes.push(
        <h3
          key={`h2-${nodeIdx++}`}
          className="mt-5 mb-2 text-sm font-bold uppercase tracking-wider"
          style={{ color: 'var(--text)' }}
        >
          {renderInline(line.slice(3), nodeIdx)}
        </h3>,
      )
      continue
    }

    // H3
    if (line.startsWith('### ')) {
      flushList()
      nodes.push(
        <h4
          key={`h3-${nodeIdx++}`}
          className="mt-4 mb-1.5 text-sm font-semibold"
          style={{ color: 'var(--text)' }}
        >
          {renderInline(line.slice(4), nodeIdx)}
        </h4>,
      )
      continue
    }

    
    if (/^[-*]\s/.test(line)) {
      listItems.push(line.slice(2).trimStart())
      continue
    }

    
    if (/^\d+\.\s/.test(line)) {
      listItems.push(line.replace(/^\d+\.\s/, '').trimStart())
      continue
    }

    
    if (line.trim() === '') {
      flushList()
      continue
    }

    
    flushList()
    nodes.push(
      <p
        key={`p-${nodeIdx++}`}
        className="text-sm leading-[1.78] mb-2"
        style={{ color: 'var(--text-muted)' }}
      >
        {renderInline(line, nodeIdx)}
      </p>,
    )
  }

  flushList()
  return nodes
}


interface MarkdownSectionProps {
  icon:        React.ElementType
  titleEn:     string
  titleEs:     string
  content:     string
  locale:      'en' | 'es'
  defaultOpen?: boolean
}

function MarkdownSection({
  icon: Icon,
  titleEn,
  titleEs,
  content,
  locale: l,
  defaultOpen = true,
}: MarkdownSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const nodes           = useMemo(() => parseMarkdown(content), [content])

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border:     '1px solid var(--border)',
        background: 'var(--bg-overlay)',
      }}
    >
      
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[color:var(--bg-raised)]"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5">
          <span
            className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-lg"
            style={{
              background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
              color:      'var(--brand)',
            }}
          >
            <Icon size={14} strokeWidth={2} />
          </span>
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--text)' }}
          >
            {l === 'es' ? titleEs : titleEn}
          </span>
        </span>
        <span style={{ color: 'var(--text-dim)', flexShrink: 0 }}>
          {open
            ? <ChevronUp  size={15} strokeWidth={1.75} />
            : <ChevronDown size={15} strokeWidth={1.75} />}
        </span>
      </button>

      
      {open && (
        <div
          className="px-4 pb-4 pt-1"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {nodes.length > 0
            ? nodes
            : (
              <p className="text-sm italic" style={{ color: 'var(--text-dim)' }}>
                {s.noContent}
              </p>
            )}
        </div>
      )}
    </div>
  )
}


interface ProblematicaCardProps {
  proyecto: Proyecto
}

export function ProblematicaCard({ proyecto }: ProblematicaCardProps) {
  const { t, locale } = useI18n()
  const s = t.simulations
  const l          = locale === 'es' ? 'es' : 'en'

  return (
    <div className="dc-card p-6 anim-fade-up delay-1">

     
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--brand)' }}
            >
              {s.businessCase}
            </span>

           
            {proyecto.generadoPorIa && (
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  background:  'color-mix(in srgb, var(--violet) 10%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--violet) 25%, var(--border))',
                  color:       'var(--violet)',
                }}
              >
                <Sparkles size={9} strokeWidth={2.5} />
                {s.aiGenerated}
              </span>
            )}
          </div>

          <h2
            className="font-display font-bold text-lg leading-snug"
            style={{ color: 'var(--text)' }}
          >
            {proyecto.titulo}
          </h2>
        </div>
      </div>

      
      {proyecto.stackUsado && proyecto.stackUsado.length > 0 && (
        <div className="mb-5">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'var(--text-dim)' }}
          >
            {s.teamStack}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {proyecto.stackUsado.map((tech) => (
              <span
                key={tech}
                className="rounded-md border px-2 py-0.5 text-[11px] font-medium font-mono"
                style={{
                  background:  'var(--bg-overlay)',
                  borderColor: 'var(--border)',
                  color:       'var(--text-muted)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      
      <div className="flex flex-col gap-3">

        <MarkdownSection
          icon={Building2}
          titleEn="Business Context"
          titleEs="Contexto de Negocio"
          content={proyecto.contextoNegocio}
          locale={l}
          defaultOpen={true}
        />

        <MarkdownSection
          icon={ListChecks}
          titleEn="MVP Requirements"
          titleEs="Requerimientos del MVP"
          content={proyecto.requerimientosMvp}
          locale={l}
          defaultOpen={false}
        />

        <MarkdownSection
          icon={ClipboardCheck}
          titleEn="Acceptance Criteria"
          titleEs="Criterios de Aceptación"
          content={proyecto.criteriosAceptacion}
          locale={l}
          defaultOpen={false}
        />

      </div>
    </div>
  )
}
