"use client";

import { useI18n } from "@/app/i18n";
import { Heart, Server, Zap, Users } from "lucide-react";

export function Donate() {
  const { t } = useI18n();

  const whereItGoes = [
    { icon: Server, text: t.landing.donateWhere1 },
    { icon: Zap, text: t.landing.donateWhere2 },
    { icon: Users, text: t.landing.donateWhere3 },
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
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at bottom right, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%)",
            }}
          />

          <div className="relative grid lg:grid-cols-2 gap-0">
            <div className="p-10 lg:p-14">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background:
                    "color-mix(in srgb, var(--danger) 12%, transparent)",
                  color: "var(--danger)",
                }}
              >
                <Heart size={22} />
              </div>

              <h2
                className="font-display text-3xl font-bold mb-3"
                style={{ color: "var(--text)" }}
              >
                {t.landing.donateTitle}
              </h2>
              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: "var(--text-muted)" }}
              >
                {t.landing.donateSub}
              </p>

              <a
                href="https://www.buymeacoffee.com/m41k80"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 animate-[pulse_2.5s_infinite]"
                style={{
                  background: "#FFDD00",
                  color: "#000",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.15)";
                }}
              >
                ☕ {t.landing.donateCta}
              </a>
            </div>

            <div
              className="p-10 lg:p-14 border-t lg:border-t-0 lg:border-l"
              style={{ borderColor: "var(--border)" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-6"
                style={{ color: "var(--text-dim)" }}
              >
                Where your money goes
              </p>

              <ul className="space-y-5">
                {whereItGoes.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background:
                          "color-mix(in srgb, var(--accent) 10%, transparent)",
                        color: "var(--accent)",
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text)" }}
                      >
                        {text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="text-xs mt-8" style={{ color: "var(--text-dim)" }}>
                Every contribution, no matter the size, helps keep DevConnect
                free for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
