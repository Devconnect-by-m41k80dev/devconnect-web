'use client'

import Link from 'next/link'
import { useI18n } from '@/app/i18n'
import { Navbar } from '@/app/components/layout/Navbar'
import { Footer } from '@/app/components/layout/Footer'
import { SiDiscord } from 'react-icons/si'
import { Briefcase, Clock, Zap } from 'lucide-react'

const DISCORD_URL = 'https://discord.gg/5xEWnfJDjt'

export default function SimulacionesPage() {
  const { t } = useI18n()
  const s = t.simulations

  return (
    <div className="dc-page">
      <Navbar />
      <main>
        <section className="relative pt-16 pb-28 overflow-hidden">
          {/* Background decorations — same pattern as HeroSection */}
          <div className="absolute inset-0 bg-dots opacity-50 pointer-events-none" />
          <div
            className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ background: 'var(--brand)' }}
          />
          <div
            className="absolute top-20 right-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: 'var(--accent)' }}
          />

          <div className="dc-container relative">
            <div className="mx-auto max-w-2xl text-center anim-fade-up">

              {/* Badge */}
              <div className="mb-6 flex justify-center">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold"
                  style={{
                    background: 'color-mix(in srgb, var(--brand) 10%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--brand) 28%, transparent)',
                    color: 'var(--brand)',
                  }}
                >
                  <Clock size={12} />
                  {s.badge}
                </span>
              </div>

              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div
                  className="flex items-center justify-center rounded-2xl p-4"
                  style={{
                    background: 'color-mix(in srgb, var(--brand) 12%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--brand) 25%, transparent)',
                  }}
                >
                  <Briefcase size={36} style={{ color: 'var(--brand)' }} />
                </div>
              </div>

              {/* Heading */}
              <h1
                className="font-display text-4xl sm:text-5xl font-bold mb-6 leading-[1.05] anim-fade-up delay-1"
              >
                <span className="text-gradient-hero">{s.title}</span>
              </h1>

              {/* Description */}
              <p
                className="text-base leading-relaxed mb-10 anim-fade-up delay-2"
                style={{ color: 'var(--text-muted)' }}
              >
                {s.description}
              </p>

              {/* Discord CTA */}
              <div className="flex flex-wrap items-center justify-center gap-3 anim-fade-up delay-3">
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dc-btn-primary px-7 py-3 text-base gap-2"
                >
                  <SiDiscord size={18} />
                  {s.discordCta}
                </a>
                <Link href="/projects" className="dc-btn-ghost px-7 py-3 text-base">
                  {s.browseProjects}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature preview cards */}
        <section className="dc-container pb-24">
          <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            {[
              { icon: Zap, title: s.f1Title, desc: s.f1Desc },
              { icon: Briefcase, title: s.f2Title, desc: s.f2Desc },
              { icon: Clock, title: s.f3Title, desc: s.f3Desc },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="dc-card p-5 text-center opacity-80">
                <div
                  className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: 'color-mix(in srgb, var(--brand) 12%, transparent)',
                  }}
                >
                  <Icon size={18} style={{ color: 'var(--brand)' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
                  {title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
