'use client'

import { useI18n }        from '@/app/i18n'
import { useModal }       from '@/app/context/ModalContext'
import { useAuthStore }   from '@/app/store/auth.store'
import { ShimmerBadge }   from '@/app/components/ui/ShimmerBadge'
import { GridPattern }    from '@/app/components/ui/GridPattern'
import Link               from 'next/link'
import { FaGithub }       from 'react-icons/fa'
import {
  ArrowRight,
  BriefcaseBusiness,
  Users,
  Trophy,
  ChevronDown,
} from 'lucide-react'

export function SimulacionesHero() {
  const { t, locale }      = useI18n()
  const s                  = t.simulations
  const { openAuth }       = useModal()
  const isAuthenticated    = useAuthStore((st) => st.isAuthenticated)

  const handleApply = () => {
    if (!isAuthenticated) { openAuth('register'); return }
    const el = document.getElementById('sim-cta')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const STATS = [
    { value: s.statWeeks,      label: locale === 'es' ? '5 sem'  : '5 wks'   },
    { value: s.statMilestones, label: '3'                                      },
    { value: s.statTeam,       label: '4–5'                                    },
    { value: s.statRemote,     label: '100%'                                   },
  ] as const

  const ROLE_PILLS = [
    { icon: BriefcaseBusiness, label: 'Frontend / Backend / Full Stack' },
    { icon: Users,             label: 'UX·UI Designer / PM / Scrum Master' },
    { icon: Trophy,            label: 'QA · Data · DevOps · Cloud' },
  ]

  return (
    <section className="relative overflow-hidden" aria-labelledby="sim-hero-heading" style={{ paddingTop: '6rem', paddingBottom: '5rem' }}>
      <GridPattern className="opacity-[0.035]" style={{ color: 'var(--brand)' }} />
      <div aria-hidden className="pointer-events-none absolute -top-56 -left-56 h-[720px] w-[720px] rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--brand) 9%, transparent), transparent 65%)', filter: 'blur(90px)' }} />
      <div aria-hidden className="pointer-events-none absolute top-32 right-0 h-[420px] w-[420px] rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 7%, transparent), transparent 65%)', filter: 'blur(70px)' }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-56 w-[700px] rounded-full" style={{ background: 'radial-gradient(ellipse, color-mix(in srgb, var(--violet) 5%, transparent), transparent 70%)', filter: 'blur(60px)' }} />

      <div className="dc-container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 anim-fade-up">
            <ShimmerBadge>{s.heroBadge}</ShimmerBadge>
          </div>
          <h1 id="sim-hero-heading" className="font-display font-bold tracking-tight mb-6 anim-fade-up delay-1" style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', lineHeight: '1.04' }}>
            <span className="block" style={{ color: 'var(--text)' }}>
              {s.heroHeadline1}{' '}<span className="text-gradient-hero">{s.heroHeadline2}</span>
            </span>
            <span className="block" style={{ color: 'var(--text)' }}>{s.heroHeadline3}</span>
          </h1>
          <p className="text-base sm:text-lg leading-[1.78] mb-10 mx-auto max-w-[560px] anim-fade-up delay-2" style={{ color: 'var(--text-muted)' }}>
            {s.heroSub}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-14 anim-fade-up delay-3">
            <button onClick={handleApply} className="dc-btn-primary px-8 py-3 text-base">
              {s.heroCtaPrimary}<ArrowRight size={17} strokeWidth={2} />
            </button>
            <a href="#sim-metodologia" className="dc-btn-ghost px-8 py-3 text-base">{s.heroCtaSecondary}</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden anim-fade-up delay-4" style={{ background: 'var(--border)', border: '1px solid var(--border)' }}>
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center gap-0.5 px-4 py-5" style={{ background: 'var(--bg-raised)' }}>
                <span className="font-display font-bold text-2xl sm:text-3xl tracking-tight" style={{ color: 'var(--brand)' }}>{stat.value}</span>
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2 anim-fade-up delay-5">
            {ROLE_PILLS.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', background: 'color-mix(in srgb, var(--bg-overlay) 60%, transparent)' }}>
                <Icon size={11} strokeWidth={2} style={{ color: 'var(--accent)' }} />{label}
              </span>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center gap-2 anim-fade-up delay-5">
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--text-dim)' }}>{s.heroScrollHint}</span>
            <a href="#sim-metodologia" aria-label={s.heroScrollHint} className="transition-transform duration-200 hover:-translate-y-0.5" style={{ color: 'var(--text-dim)' }}>
              <ChevronDown size={20} strokeWidth={1.5} className="animate-bounce" style={{ animationDuration: '2s' }} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
