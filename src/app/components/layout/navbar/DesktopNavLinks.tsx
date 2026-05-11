'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/app/lib/utils'
import { Layers, Compass } from 'lucide-react'
import { useAuthStore } from '@/app/store/auth.store'
import { useI18n } from '@/app/i18n'

interface NavLink {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number }>
}

export function DesktopNavLinks() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStore()
  const { t } = useI18n()

  const links: NavLink[] = [
    { href: '/projects', label: t.nav.projects, icon: Layers },
    ...(isAuthenticated ? [{ href: '/discover', label: t.nav.discover, icon: Compass }] : []),
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className="hidden md:flex items-center gap-1">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
            isActive(href)
              ? 'bg-[--brand]/10 text-[--brand]'
              : 'text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]'
          )}
        >
          <Icon size={15} />
          {label}
        </Link>
      ))}
    </nav>
  )
}