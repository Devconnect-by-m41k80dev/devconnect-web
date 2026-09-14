'use client'
import Link            from 'next/link'
import { useI18n }     from '@/app/i18n'
import { Briefcase, Clock, Zap, Users, ArrowLeft } from 'lucide-react'
import { SiDiscord }   from 'react-icons/si'
import { ShimmerBadge } from '@/app/components/ui/ShimmerBadge'
import { TiltCard }    from '@/app/components/ui/TiltCard'
import { GridPattern } from '@/app/components/ui/GridPattern'

const DISCORD_URL = 'https://discord.gg/fRPSECNF'

export function SimulacionesHero() {
  const { t } = useI18n()
  const s = t.simulations

  return (
    <main>
      <section className="relative pt-8 pb-28 overflow-hidden">
        <GridPattern className="opacity-[0.03] text-[--brand]" />
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, color-mix(in srgb, var(--brand) 10%, transparent), transparent 65%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="dc-container relative">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs mb-10 transition-colors duration-150 hover:text-[--brand]"
            style={{ color: 'var(--text-dim)' }}
          >
            <ArrowLeft size={12} strokeWidth={2} /> Back to home
          </Link>

          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 anim-fade-up">
              <ShimmerBadge>
                <Clock size={11} strokeWidth={2} className="inline mr-1" />
                {s.badge}
              </ShimmerBadge>
            </div>

            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-7 anim-fade-up delay-1"
              style={{
                background: 'color-mix(in srgb, var(--brand) 12%, transparent)',
                color: 'var(--brand)',
                boxShadow: '0 0 0 10px color-mix(in srgb, var(--brand) 5%, transparent)',
              }}
            >
              <Briefcase size={28} strokeWidth={1.75} />
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-5 anim-fade-up delay-1"
              style={{ lineHeight: '1.05' }}
            >
              <span className="text-gradient-hero">{s.title}</span>
            </h1>

            <p
              className="text-base leading-[1.75] mb-10 anim-fade-up delay-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {s.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 anim-fade-up delay-3">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="dc-btn-primary px-7 py-3 text-base gap-2"
              >
                <SiDiscord size={17} /> {s.discordCta}
              </a>
              <Link href="/projects" className="dc-btn-ghost px-7 py-3 text-base">
                {s.browseProjects}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="dc-container pb-28">
        <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
          {[
            { icon: Zap,       title: t.simulations.f1Title, desc: t.simulations.f1Desc },
            { icon: Briefcase, title: t.simulations.f2Title, desc: t.simulations.f2Desc },
            { icon: Users,     title: t.simulations.f3Title, desc: t.simulations.f3Desc },
          ].map(({ icon: Icon, title, desc }, i) => (
            <TiltCard
              key={title}
              maxTilt={5}
              className={`group dc-card p-6 text-center cursor-default anim-fade-up delay-${i + 1}`}
            >
              <div
                className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: 'linear-gradient(90deg, transparent, var(--brand), transparent)' }}
              />
              <div
                className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                style={{ background: 'color-mix(in srgb, var(--brand) 10%, transparent)', color: 'var(--brand)' }}
              >
                <Icon size={18} strokeWidth={1.75} />
              </div>
              <p className="text-sm font-semibold mb-2 tracking-tight" style={{ color: 'var(--text)' }}>{title}</p>
              <p className="text-xs leading-[1.65]" style={{ color: 'var(--text-dim)' }}>{desc}</p>
            </TiltCard>
          ))}
        </div>
      </section>
    </main>
  )
}
