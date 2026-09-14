"use client";

import Link from "next/link";
import { useI18n } from "@/app/i18n";
import { Briefcase, ArrowRight, Clock, Zap, Users } from "lucide-react";

export function SimulationsTeaser() {
  const { t } = useI18n();
  const s = t.simulations;

  const features = [
    { icon: Zap,      text: s.f1Desc },
    { icon: Briefcase, text: s.f2Desc },
    { icon: Users,    text: s.f3Desc },
  ];

  return (
    <section
      className="py-20 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="dc-container">
        <div
          className="relative rounded-3xl border overflow-hidden"
          style={{
            background: "var(--bg-raised)",
            borderColor: "var(--border)",
          }}
        >
          {/* Brand gradient glow — same pattern as Donate/Sponsors */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at top left, color-mix(in srgb, var(--brand) 12%, transparent), transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at bottom right, color-mix(in srgb, var(--accent) 8%, transparent), transparent 55%)",
            }}
          />

          <div className="relative grid lg:grid-cols-2 gap-0">
            {/* Left column — main content */}
            <div className="p-10 lg:p-14">

              {/* "Próximamente" badge */}
              <div className="mb-6">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
                  style={{
                    background: "color-mix(in srgb, var(--brand) 10%, transparent)",
                    borderColor: "color-mix(in srgb, var(--brand) 28%, transparent)",
                    color: "var(--brand)",
                  }}
                >
                  <Clock size={11} />
                  {s.badge}
                </span>
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: "color-mix(in srgb, var(--brand) 12%, transparent)",
                  color: "var(--brand)",
                }}
              >
                <Briefcase size={22} />
              </div>

              <h2
                className="font-display text-3xl font-bold mb-3"
                style={{ color: "var(--text)" }}
              >
                {s.title}
              </h2>

              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: "var(--text-muted)" }}
              >
                {s.description}
              </p>

              <Link
                href="/simulaciones"
                className="dc-btn-primary px-6 py-3 gap-2 inline-flex"
              >
                {s.discordCta} <ArrowRight size={15} />
              </Link>
            </div>

            {/* Right column — feature list */}
            <div
              className="p-10 lg:p-14 border-t lg:border-t-0 lg:border-l"
              style={{ borderColor: "var(--border)" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-6"
                style={{ color: "var(--text-dim)" }}
              >
                {s.featuresLabel}
              </p>

              <ul className="space-y-5">
                {features.map(({ icon: Icon, text }, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: "color-mix(in srgb, var(--brand) 10%, transparent)",
                        color: "var(--brand)",
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <p
                      className="text-sm font-medium pt-2"
                      style={{ color: "var(--text)" }}
                    >
                      {text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
