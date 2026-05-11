"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useI18n } from "@/app/i18n";

export function LanguageDropdown() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm transition-colors duration-150 text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]"
      >
        <Globe size={15} />
        <span className="hidden sm:block font-mono text-xs uppercase">
          {locale}
        </span>
        <ChevronDown
          size={11}
          className={cn(
            "transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-32 rounded-xl border py-1 shadow-xl anim-scale-in"
          style={{
            background: "var(--bg-raised)",
            borderColor: "var(--border)",
          }}
        >
          {(["en", "es"] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors duration-100",
                locale === l
                  ? "font-semibold text-[--brand]"
                  : "text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]",
              )}
            >
              <span>{l === "en" ? "🇬🇧" : "🇪🇸"}</span>
              {l === "en" ? "English" : "Español"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
