'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Layers, Compass, Plus } from 'lucide-react'
import { useAuthStore } from '@/app/store/auth.store'
import { useI18n } from '@/app/i18n'
import { cn } from '@/app/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onLoginClick?: () => void
  onRegisterClick?: () => void
}

export function MobileMenu({ isOpen, onClose, onLoginClick, onRegisterClick }: MobileMenuProps) {
  const { isAuthenticated } = useAuthStore()
  const { t } = useI18n()
  const pathname = usePathname()

  const links = [
    { href: '/projects', label: t.nav.projects, icon: Layers },
    ...(isAuthenticated ? [{ href: '/discover', label: t.nav.discover, icon: Compass }] : []),
  ]

  if (!isOpen) return null

  return (
    <div
      className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-start pt-24"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl border p-5 flex flex-col gap-2 shadow-2xl"
        style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-[--brand]/10 text-[--brand]'
                : 'text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]'
            )}
          >
            <Icon size={16} /> {label}
          </Link>
        ))}

        {!isAuthenticated ? (
          <div
            className="flex flex-col gap-2 pt-3 mt-1 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              className="dc-btn-ghost w-full text-sm py-2"
              onClick={() => {
                onLoginClick?.()
                onClose()
              }}
            >
              {t.nav.login}
            </button>
            <button
              className="dc-btn-primary w-full text-sm py-2"
              onClick={() => {
                onRegisterClick?.()
                onClose()
              }}
            >
              {t.nav.register}
            </button>
          </div>
        ) : (
          <div className="pt-2 mt-1 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link
              href="/projects/new"
              onClick={onClose}
              className="dc-btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2"
            >
              <Plus size={14} /> {t.projects.createNew}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
