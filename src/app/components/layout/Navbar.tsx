"use client";

import { useState, useEffect, FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { Menu, X, Layers, Compass, ChevronDown, Globe } from "lucide-react";
import { useI18n } from "@/app/i18n";
import { useAuthStore } from "@/app/store/auth.store";
import { useModal } from "@/app/context/ModalContext";

import { ThemeToggle } from "@/app/components/layout/navbar/ThemeToggle";
import { UserMenu } from "@/app/components/layout/navbar/UserMenu";
import { AuthButtons } from "@/app/components/layout/navbar/AuthButtons";
import { MobileMenu } from "@/app/components/layout/navbar/MobileMenu";
import { Logo } from "./navbar/Logo";

export const Navbar: FC = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { t, locale, setLocale } = useI18n();
  const { openAuth } = useModal();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const links = [
    { href: "/projects", label: t.nav.projects, icon: Layers },
    ...(isAuthenticated
      ? [{ href: "/discover", label: t.nav.discover, icon: Compass }]
      : []),
  ];

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled && "border-b backdrop-blur-xl",
        )}
        style={{
          background: scrolled
            ? "color-mix(in srgb, var(--bg) 88%, transparent)"
            : "transparent",
          borderColor: scrolled ? "var(--border)" : "transparent",
        }}
      >
        <div className="dc-container flex h-16 items-center justify-between gap-4">
          
          <Logo />

          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive(href)
                    ? "bg-[--brand]/10 text-[--brand]"
                    : "text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]",
                )}
              >
                <Icon size={15} /> {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
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
                    langOpen && "rotate-180",
                  )}
                />
              </button>

              {langOpen && (
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
                        setLangOpen(false);
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

            <ThemeToggle />

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <AuthButtons
                onLogin={() => openAuth("login")}
                onRegister={() => openAuth("register")}
              />
            )}

            <button
              className="md:hidden p-2 rounded-lg transition-colors text-[--text-muted] hover:bg-[--bg-overlay]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <MobileMenu
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onLoginClick={() => openAuth("login")}
          onRegisterClick={() => openAuth("register")}
        />
      </header>
    </>
  );
};
