"use client";

import { Zap, Send, Users, GitBranch } from "lucide-react";
import { useI18n } from "@/app/i18n";

export function Features() {
  const { t } = useI18n();

  return (
    <section
      className="py-24 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="dc-container">
        <h2
          className="font-display text-3xl sm:text-4xl font-bold text-center mb-14"
          style={{ color: "var(--text)" }}
        >
          {t.landing.features}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Zap, title: t.landing.f1Title, desc: t.landing.f1Desc },
            { icon: Send, title: t.landing.f2Title, desc: t.landing.f2Desc },
            { icon: Users, title: t.landing.f3Title, desc: t.landing.f3Desc },
            {
              icon: GitBranch,
              title: t.landing.f4Title,
              desc: t.landing.f4Desc,
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`dc-card p-6 anim-fade-up delay-${i + 1}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background:
                    "color-mix(in srgb, var(--brand) 14%, transparent)",
                  color: "var(--brand)",
                }}
              >
                <Icon size={20} />
              </div>
              <h3
                className="font-semibold text-sm mb-2"
                style={{ color: "var(--text)" }}
              >
                {title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
