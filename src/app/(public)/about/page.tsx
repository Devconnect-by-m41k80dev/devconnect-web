'use client'

import Link from 'next/link'
import { useI18n } from '@/app/i18n'
import { useModal } from '@/app/context/ModalContext'
import { Navbar } from '@/app/components/layout/Navbar'
import { Footer } from '@/app/components/layout/Footer'
import { ArrowRight,Layers, Users, Compass, Mail } from 'lucide-react'
import { SiGithub } from 'react-icons/si'

export default function AboutPage() {
  const { t } = useI18n()
  const { openAuth } = useModal()
  const s = t.about

  const values = [
    { icon: Layers,  title: s.v1Title, desc: s.v1Desc },
    { icon: Users,   title: s.v2Title, desc: s.v2Desc },
    { icon: Compass, title: s.v3Title, desc: s.v3Desc },
  ]

  return (
    <div className="dc-page">
      <Navbar />
      <main>

        
        <section className="dc-container pt-10 pb-20">
          <div className="mx-auto max-w-2xl text-center anim-fade-up">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: 'var(--text-dim)' }}
            >
              {s.label}
            </p>
            <h1
              className="font-display text-4xl sm:text-5xl font-bold mb-6 leading-[1.05]"
              style={{ color: 'var(--text)' }}
            >
              {s.headline}{' '}
              <span className="text-gradient">{s.headlineAccent}</span>
            </h1>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
              {s.sub}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => openAuth('register')}
                className="dc-btn-primary px-6 py-2.5 gap-2"
              >
                {t.landing.cta} <ArrowRight size={15} />
              </button>
              <a
                href="https://github.com/devconnect"
                target="_blank"
                rel="noopener noreferrer"
                className="dc-btn-ghost px-6 py-2.5 gap-2"
              >
                <SiGithub size={15} /> {s.viewGithub}
              </a>
            </div>
          </div>
        </section>

        
        <section className="border-t py-20" style={{ borderColor: 'var(--border)' }}>
          <div className="dc-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              
              <div className="anim-fade-up">
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-4"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {s.missionLabel}
                </p>
                <h2
                  className="font-display text-3xl font-bold mb-5"
                  style={{ color: 'var(--text)' }}
                >
                  {s.missionTitle}
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  {s.missionP1}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {s.missionP2}
                </p>
              </div>

             
              <div className="space-y-4 anim-fade-up delay-2">
                {values.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="dc-card p-5 flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: 'color-mix(in srgb, var(--brand) 12%, transparent)',
                        color: 'var(--brand)',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>
                        {title}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        
        <section className="py-20 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="dc-container">
            <div className="mx-auto max-w-xl text-center anim-fade-up">
              <h2
                className="font-display text-2xl font-bold mb-3"
                style={{ color: 'var(--text)' }}
              >
                {s.contactTitle}
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                {s.contactSub}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`mailto:${s.contactEmail}`}
                  className="dc-btn-ghost px-6 py-2.5 gap-2"
                >
                  <Mail size={15} /> {s.contactEmail}
                </a>
                <Link href="/#sponsors" className="dc-btn-primary px-6 py-2.5">
                  {s.sponsorCta}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
