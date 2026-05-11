"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useI18n } from "@/app/i18n";
import { SiGithub } from "react-icons/si";
import { Logo } from "./navbar/Logo";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

export function Footer() {
  const { t } = useI18n();

  const columns: FooterColumn[] = [
    {
      heading: t.footer.product,
      links: [
        { label: t.footer.projects, href: "/projects" },
        { label: t.footer.discover, href: "/discover" },
        { label: t.footer.about, href: "/about" },
      ],
    },
    {
      heading: t.footer.company,
      links: [
        { label: t.footer.about, href: "/about" },
        {
          label: t.footer.sponsors,
          href: "#sponsors",
        },
      ],
    },
    {
      heading: t.footer.legal,
      links: [
        { label: t.footer.terms, href: "/terms" },
        { label: t.footer.privacy, href: "/privacy" },
      ],
    },
    {
      heading: t.footer.community,
      links: [
        {
          label: t.footer.github,
          href: "https://github.com/Devconnect-by-m41k80dev",
          external: true,
        },
        {
          label: t.footer.donate,
          href: "https://buymeacoffee.com/m41k80",
          external: true,
        },
      ],
    },
  ];

  return (
    <footer
      className="border-t mt-24"
      style={{ borderColor: "var(--border)", background: "var(--bg-raised)" }}
    >
      <div className="dc-container py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            
            <Logo />

            <p
              className="text-xs leading-relaxed max-w-[180px]"
              style={{ color: "var(--text-dim)" }}
            >
              {t.footer.tagline}
            </p>
          </div>

          {columns.map(({ heading, links }) => (
            <div key={heading}>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--text-dim)" }}
              >
                {heading}
              </p>

              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    {link.href === "#sponsors" ? (
                      <button
                        onClick={() => {
                          const el = document.getElementById("sponsors");
                          if (el) {
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                        className="text-sm transition-colors hover:text-[--brand]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={
                          link.external ? "noopener noreferrer" : undefined
                        }
                        className="text-sm transition-colors hover:text-[--brand]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>

          <div className="flex items-center gap-4">
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "var(--text-dim)" }}
            >
              {t.footer.madeWith} <Heart size={11} className="text-red-400" />{" "}
              {t.footer.forOss}
            </span>

            <a
              href="https://github.com/Devconnect-by-m41k80dev"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg transition-colors hover:text-[--text] hover:bg-[--bg-overlay]"
              style={{ color: "var(--text-dim)" }}
              aria-label="GitHub"
            >
              <SiGithub size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}