"use client";

import { useI18n } from "@/app/i18n";
import { Mail, Building2, Users, TrendingUp } from "lucide-react";

export function Sponsors() {
  const { t } = useI18n();

  const benefits = [
    { icon: Building2, text: t.landing.sponsorsBenefit1 },
    { icon: Users, text: t.landing.sponsorsBenefit2 },
    { icon: TrendingUp, text: t.landing.sponsorsBenefit3 },
  ];

  return (
    <section
      id="sponsors"
      className="py-20 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="dc-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="anim-fade-up">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold mb-6"
              style={{
                background: "color-mix(in srgb, var(--accent) 8%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--accent) 24%, transparent)",
                color: "var(--accent)",
              }}
            >
              <Building2 size={12} /> Sponsors
            </div>

            <h2
              className="font-display text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: "var(--text)" }}
            >
              {t.landing.sponsorsTitle}
            </h2>
            <p
              className="text-base leading-relaxed mb-8 max-w-md"
              style={{ color: "var(--text-muted)" }}
            >
              {t.landing.sponsorsSub}
            </p>

            <ul className="space-y-3 mb-8">
              {benefits.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background:
                        "color-mix(in srgb, var(--accent) 12%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon size={13} />
                  </div>
                  {text}
                </li>
              ))}
            </ul>

            <a
              href="mailto:contact@devconnect.dev"
              className="dc-btn-ghost inline-flex gap-2 py-2.5 px-6 text-sm"
            >
              <Mail size={15} /> {t.landing.sponsorsCta}
            </a>
          </div>

          <div className="anim-fade-up delay-2">
            <div
              className="rounded-2xl border p-8"
              style={{
                background: "var(--bg-raised)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-6 text-center"
                style={{ color: "var(--text-dim)" }}
              >
                Your brand here
              </p>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-xl border flex items-center justify-center text-xs font-mono"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--bg-overlay)",
                      color: "var(--text-dim)",
                      borderStyle: "dashed",
                    }}
                  >
                    logo
                  </div>
                ))}
              </div>
              <p
                className="text-xs text-center mt-6"
                style={{ color: "var(--text-dim)" }}
              >
                Become a sponsor →{" "}
                <a
                  href="mailto:contact@devconnect.dev"
                  className="hover:underline transition-colors"
                  style={{ color: "var(--accent)" }}
                >
                  contact@devconnect.dev
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
