'use client'


import { useI18n }   from '@/app/i18n'
import {
  Palette,
  FileText,
  Code2,
  ShieldCheck,
  Rocket,
  Trophy,
  CheckCircle2,
  Lock,
} from 'lucide-react'



interface WeekItem {
  week:         number
  hito?:        1 | 2 | 3
  iconEl:       React.ReactNode
  titleEn:      string
  titleEs:      string
  descEn:       string
  descEs:       string
  accentVar:    '--brand' | '--accent' | '--violet'
  delayClass:   string
}

interface HitoSummary {
  number:     1 | 2 | 3
  labelEn:    string
  labelEs:    string
  deliverablesEn: string[]
  deliverablesEs: string[]
  accentVar:  '--brand' | '--accent' | '--violet'
}



const WEEKS: WeekItem[] = [
  {
    week: 1,
    hito: 1,
    iconEl: <Palette size={18} strokeWidth={1.75} />,
    titleEn: 'Week 1 — Design & Planning',
    titleEs: 'Semana 1 — Diseño y Planning',
    descEn:  'The team receives the AI-generated business case. The UX/UI Designer creates the Figma prototype and the PM writes the PRD. Milestone 1 unlocks when both are approved.',
    descEs:  'El equipo recibe el caso de negocio generado por IA. El UX/UI Designer crea el prototipo en Figma y el PM redacta el PRD. El Hito 1 se desbloquea cuando ambos son aprobados.',
    accentVar: '--brand',
    delayClass: 'delay-1',
  },
  {
    week: 2,
    iconEl: <Code2 size={18} strokeWidth={1.75} />,
    titleEn: 'Week 2 — Frontend Sprint',
    titleEs: 'Semana 2 — Sprint Frontend',
    descEn:  'Frontend Developers start implementing the approved Figma designs. The repository is set up and the first UI components are shipped.',
    descEs:  'Los Frontend Developers comienzan a implementar los diseños aprobados del Figma. Se inicializa el repositorio y se entregan los primeros componentes de UI.',
    accentVar: '--accent',
    delayClass: 'delay-2',
  },
  {
    week: 3,
    hito: 2,
    iconEl: <Code2 size={18} strokeWidth={1.75} />,
    titleEn: 'Week 3 — Backend + Integration (Milestone 2)',
    titleEs: 'Semana 3 — Backend + Integración (Hito 2)',
    descEn:  'Backend Developers build the API. QA Engineers validate coverage. Both repositories are submitted for admin review. Milestone 2 unlocks on approval.',
    descEs:  'Los Backend Developers construyen la API. Los QA Engineers validan la cobertura. Ambos repositorios se envían para revisión del Admin. El Hito 2 se desbloquea con la aprobación.',
    accentVar: '--accent',
    delayClass: 'delay-3',
  },
  {
    week: 4,
    iconEl: <ShieldCheck size={18} strokeWidth={1.75} />,
    titleEn: 'Week 4 — QA & Polish',
    titleEs: 'Semana 4 — QA y Pulido',
    descEn:  'Full integration testing, bug fixes, and deployment preparation. The team refines the product and prepares the live demo environment.',
    descEs:  'Testing de integración completo, corrección de bugs y preparación del despliegue. El equipo refina el producto y prepara el entorno para la demo en vivo.',
    accentVar: '--violet',
    delayClass: 'delay-4',
  },
  {
    week: 5,
    hito: 3,
    iconEl: <Rocket size={18} strokeWidth={1.75} />,
    titleEn: 'Week 5 — Demo Day & Awards (Milestone 3)',
    titleEs: 'Semana 5 — Demo Day y Premiación (Hito 3)',
    descEn:  'The team delivers the live demo. The Admin evaluates the MVP against the original acceptance criteria. Certificates are issued to all participants; the winner team gets the golden certificate.',
    descEs:  'El equipo entrega la demo en vivo. El Admin evalúa el MVP contra los criterios de aceptación originales. Se emiten certificados a todos los participantes; el equipo ganador recibe el certificado dorado.',
    accentVar: '--violet',
    delayClass: 'delay-5',
  },
]



const HITOS: HitoSummary[] = [
  {
    number:     1,
    labelEn:    'Milestone 1',
    labelEs:    'Hito 1',
    deliverablesEn: ['Figma prototype approved', 'PRD document approved'],
    deliverablesEs: ['Prototipo Figma aprobado', 'Documento PRD aprobado'],
    accentVar: '--brand',
  },
  {
    number:     2,
    labelEn:    'Milestone 2',
    labelEs:    'Hito 2',
    deliverablesEn: ['Frontend repo approved', 'Backend repo approved'],
    deliverablesEs: ['Repositorio Frontend aprobado', 'Repositorio Backend aprobado'],
    accentVar: '--accent',
  },
  {
    number:     3,
    labelEn:    'Milestone 3',
    labelEs:    'Hito 3',
    deliverablesEn: ['Live demo submitted & approved'],
    deliverablesEs: ['Demo en vivo enviada y aprobada'],
    accentVar: '--violet',
  },
]


export function MetodologiaTimeline() {
  const { t, locale } = useI18n()
  const s             = t.simulations
  const l             = locale === 'es' ? 'es' : 'en'

  return (
    <section
      id="sim-metodologia"
      className="relative py-24 sm:py-32"
      aria-labelledby="metodologia-heading"
    >
      
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'var(--border)' }}
      />

      
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 60% 40% at 10% 50%,',
            '  color-mix(in srgb, var(--brand) 4%, transparent),',
            '  transparent 70%)',
          ].join(''),
        }}
      />

      <div className="dc-container relative">

        
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span
            className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--brand)' }}
          >
            {s.sectionLabel}
          </span>
          <h2
            id="metodologia-heading"
            className="font-display font-bold tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)', lineHeight: '1.1', color: 'var(--text)' }}
          >
            {s.title1}{' '}
            <span className="text-gradient-hero">{s.title2}</span>
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {s.sub}
          </p>
        </div>

       
        <div className="relative mx-auto max-w-2xl">

          
          <div
            aria-hidden
            className="absolute left-[1.625rem] sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2"
            style={{ background: 'var(--border)' }}
          />

          <div className="flex flex-col gap-0">
            {WEEKS.map((item, idx) => {
              const isHito  = item.hito !== undefined
              const isRight = idx % 2 === 1  

              return (
                <div
                  key={item.week}
                  className={`relative flex items-start gap-5 sm:gap-0 pb-10 anim-fade-up ${item.delayClass}`}
                >
                  
                  <div
                    className={[
                      'relative z-10 flex-shrink-0',
                      'flex items-center justify-center',
                      'rounded-full transition-shadow duration-300',
                      isHito
                        ? 'h-[3.25rem] w-[3.25rem] shadow-md'
                        : 'h-10 w-10 mt-0.5',
                      
                      'sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-0',
                    ].join(' ')}
                    style={{
                      background: isHito
                        ? `color-mix(in srgb, var(${item.accentVar}) 12%, var(--bg-raised))`
                        : 'var(--bg-raised)',
                      border: `${isHito ? '2px' : '1px'} solid ${
                        isHito
                          ? `color-mix(in srgb, var(${item.accentVar}) 35%, transparent)`
                          : 'var(--border)'
                      }`,
                      color: `var(${item.accentVar})`,
                      boxShadow: isHito
                        ? `0 0 18px color-mix(in srgb, var(${item.accentVar}) 22%, transparent)`
                        : 'none',
                    }}
                  >
                    {isHito ? <Trophy size={20} strokeWidth={1.75} /> : item.iconEl}
                  </div>

                  
                  <div
                    className={[
                      'w-full sm:w-[43%] rounded-2xl px-5 py-4',
                      
                      isRight
                        ? 'sm:ml-auto sm:mr-0'
                        : 'sm:ml-0 sm:mr-auto',
                     
                      'ml-0',
                    ].join(' ')}
                    style={{
                      background: 'var(--bg-raised)',
                      border: `1px solid ${
                        isHito
                          ? `color-mix(in srgb, var(${item.accentVar}) 22%, var(--border))`
                          : 'var(--border)'
                      }`,
                    }}
                  >
                    
                    <span
                      className="inline-block mb-2 text-[10px] font-semibold uppercase tracking-widest rounded-full px-2.5 py-0.5"
                      style={{
                        background: `color-mix(in srgb, var(${item.accentVar}) 10%, transparent)`,
                        color: `var(${item.accentVar})`,
                      }}
                    >
                      {s.weekLabel} {item.week}
                      {isHito ? ` · ${l === 'es' ? `Hito ${item.hito}` : `Milestone ${item.hito}`}` : ''}
                    </span>

                    
                    <h3
                      className="font-semibold text-sm sm:text-base leading-snug mb-1.5"
                      style={{ color: 'var(--text)' }}
                    >
                      {l === 'es' ? item.titleEs : item.titleEn}
                    </h3>

                    
                    <p
                      className="text-sm leading-[1.7]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {l === 'es' ? item.descEs : item.descEn}
                    </p>
                  </div>

                  
                  <div className="hidden sm:block sm:w-[43%]" />
                </div>
              )
            })}
          </div>
        </div>

        
        <div className="mt-20">
          <p
            className="text-center text-xs font-semibold uppercase tracking-widest mb-8"
            style={{ color: 'var(--text-dim)' }}
          >
            {s.hitosTitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {HITOS.map((hito) => (
              <div
                key={hito.number}
                className="relative rounded-2xl p-5 overflow-hidden"
                style={{
                  background: `color-mix(in srgb, var(${hito.accentVar}) 5%, var(--bg-raised))`,
                  border: `1px solid color-mix(in srgb, var(${hito.accentVar}) 22%, var(--border))`,
                }}
              >
                
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-3 -right-1 font-display font-black select-none"
                  style={{
                    fontSize: '6rem',
                    lineHeight: 1,
                    color: `color-mix(in srgb, var(${hito.accentVar}) 8%, transparent)`,
                  }}
                >
                  {hito.number}
                </span>

                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: `var(${hito.accentVar})` }}
                >
                  {l === 'es' ? hito.labelEs : hito.labelEn}
                </p>

                <ul className="flex flex-col gap-2 mb-4">
                  {(l === 'es' ? hito.deliverablesEs : hito.deliverablesEn).map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <CheckCircle2
                        size={14}
                        strokeWidth={2}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: `var(${hito.accentVar})` }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>

                <div
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {hito.number < 3
                    ? <Lock size={11} strokeWidth={2} />
                    : <Trophy size={11} strokeWidth={2} style={{ color: `var(${hito.accentVar})` }} />}
                  {hito.number < 3 ? s.hitoUnlock : s.hitoFinal}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'var(--border)' }}
      />
    </section>
  )
}
