"use client";

import { Star, ArrowRight } from "lucide-react";
import { useI18n } from "@/app/i18n";
import { useModal } from "@/app/context/ModalContext";

export function CTABanner() {
  const { t } = useI18n();
  const { openAuth } = useModal();

  return (
    <section className="py-24">
      <div className="dc-container">
        <div
          className="relative rounded-3xl p-12 sm:p-16 text-center overflow-hidden border"
          style={{
            background: "var(--bg-raised)",
            borderColor: "var(--border)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center top, color-mix(in srgb, var(--brand) 18%, transparent), transparent 65%)",
            }}
          />
          <div className="relative">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand), var(--accent))",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <Star size={22} className="text-white" />
            </div>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: "var(--text)" }}
            >
              {t.landing.ctaBanner}
            </h2>
            <p
              className="text-base mb-8 max-w-sm mx-auto"
              style={{ color: "var(--text-muted)" }}
            >
              {t.landing.ctaBannerSub}
            </p>
            <button
              onClick={() => openAuth("register")}
              className="dc-btn-primary inline-flex px-8 py-3.5 text-base"
            >
              {t.landing.cta} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
