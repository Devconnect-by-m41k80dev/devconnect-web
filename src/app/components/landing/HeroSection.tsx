'use client'

import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/app/i18n'
import { useModal } from '@/app/context/ModalContext'
import Link from 'next/link'

export function HeroSection() {
  const { t } = useI18n()
  const { openAuth } = useModal()

  return (
    <section className="relative pt-36 pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-50 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: 'var(--brand)' }} />
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: 'var(--accent)' }} />

      <div className="dc-container relative">
        <div className="anim-fade-up mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ background: 'color-mix(in srgb, var(--brand) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--brand) 28%, transparent)', color: 'var(--brand)' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
            </span>
            {t.landing.badge}
          </span>
        </div>

        <h1 className="font-display font-bold tracking-tight leading-[1.05] mb-6 anim-fade-up delay-1" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
          <span className="text-gradient-hero">{t.landing.headline1}</span>
          <br />
          <span style={{ color: 'var(--text)' }}>{t.landing.headline2}</span>
        </h1>

        <p className="text-lg leading-relaxed mb-10 max-w-lg anim-fade-up delay-2" style={{ color: 'var(--text-muted)' }}>
          {t.landing.sub}
        </p>

        <div className="flex flex-wrap gap-3 anim-fade-up delay-3">
          <button
            onClick={() => openAuth('register')}
            className="dc-btn-primary px-7 py-3 text-base"
          >
            {t.landing.cta} <ArrowRight size={17} />
          </button>
          <Link href="/projects" className="dc-btn-ghost px-7 py-3 text-base">
            {t.landing.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
