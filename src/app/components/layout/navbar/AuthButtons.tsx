'use client'

import { FC } from "react"
import { useAuthStore } from "@/app/store/auth.store"
import { useI18n } from "@/app/i18n"

interface AuthButtonsProps {
  onLogin?: () => void
  onRegister?: () => void
}

export const AuthButtons: FC<AuthButtonsProps> = ({ onLogin, onRegister }) => {
  const { isAuthenticated } = useAuthStore()
  const { t } = useI18n()

  if (isAuthenticated) return null

  return (
    <div className="hidden sm:flex items-center gap-2">
      <button
        onClick={onLogin}
        className="dc-btn-ghost py-2 px-4 text-sm"
      >
        {t.nav.login}
      </button>
      <button
        onClick={onRegister}
        className="dc-btn-primary py-2 px-4 text-sm"
      >
        {t.nav.register}
      </button>
    </div>
  )
}
