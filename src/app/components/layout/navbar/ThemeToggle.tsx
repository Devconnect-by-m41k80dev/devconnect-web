"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/app/store/theme.store";
import { useI18n } from "@/app/i18n";

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  const { t } = useI18n();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg transition-colors duration-150 text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay] active:scale-90"
      aria-label={theme === "dark" ? t.common.lightMode : t.common.darkMode}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
