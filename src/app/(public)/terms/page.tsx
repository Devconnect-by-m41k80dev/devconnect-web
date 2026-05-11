'use client'

import Link from 'next/link'
import { useI18n } from '@/app/i18n'
import { Navbar } from '@/app/components/layout/Navbar'
import { Footer } from '@/app/components/layout/Footer'

const LAST_UPDATED = 'January 1, 2025'

export default function TermsPage() {
  const { t } = useI18n()
  const s = t.terms

  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <div className="mx-auto max-w-3xl">

         
          <div className="mb-12">
            <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-dim)' }}>
              {s.label}
            </p>
            <h1 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              {s.title}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {s.lastUpdated}: {LAST_UPDATED}
            </p>
          </div>

          <div className="space-y-10">
            <Section title={s.s1Title}>{s.s1Body}</Section>
            <Section title={s.s2Title}>{s.s2Body}</Section>
            <Section title={s.s3Title}>{s.s3Body}</Section>
            <Section title={s.s4Title}>{s.s4Body}</Section>
            <Section title={s.s5Title}>{s.s5Body}</Section>

            <Section title={s.s6Title}>
              {s.s6Body}{' '}
              <Link href="/privacy" className="hover:underline" style={{ color: 'var(--brand)' }}>
                {s.s6Link}
              </Link>
              {s.s6BodyEnd}
            </Section>

            <Section title={s.s7Title}>{s.s7Body}</Section>
            <Section title={s.s8Title}>{s.s8Body}</Section>
            <Section title={s.s9Title}>{s.s9Body}</Section>

            <Section title={s.s10Title}>
              {s.s10Body}{' '}
              <a
                href={`mailto:${s.contactEmail}`}
                className="hover:underline break-all"
                style={{ color: 'var(--brand)' }}
              >
                {s.contactEmail}
              </a>
              .
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
        {title}
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {children}
      </p>
    </section>
  )
}
