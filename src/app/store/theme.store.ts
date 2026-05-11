'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
}

interface ThemeActions {
  setTheme: (theme: Theme) => void
  toggle:   () => void
}

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      theme: 'dark',

      setTheme: (theme) => {
        set({ theme })
        applyThemeToDOM(theme)
      },

      toggle: () => {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        applyThemeToDOM(next)
      },
    }),
    { name: 'dc-theme' }
  )
)

function applyThemeToDOM(theme: Theme): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  
  
  root.classList.add('theme-changing')
  root.classList.toggle('dark', theme === 'dark')
  setTimeout(() => root.classList.remove('theme-changing'), 350)
}
