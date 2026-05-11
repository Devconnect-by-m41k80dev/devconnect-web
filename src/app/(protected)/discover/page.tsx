"use client";

import { useState, useEffect } from "react";
import { Compass, Zap } from "lucide-react";
import { useI18n } from "@/app/i18n";
import { Project } from "@/app/types/entities";
import { projectsApi } from "@/app/lib/api";
import { Navbar } from "@/app/components/layout/Navbar";
import {
  ProjectCard,
  ProjectCardSkeleton,
} from "@/app/components/project/ProjectCard";
import { Footer } from "@/app/components/layout/Footer";

export default function DiscoverPage() {
  const { t } = useI18n();
  const [projects, setProjects] = useState<(Project & { score: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi
      .discover()
      .then((res) => {
        setProjects(res);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <div className="dc-page-header anim-fade-up">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "color-mix(in srgb, var(--brand) 14%, transparent)",
                color: "var(--brand)",
              }}
            >
              <Compass size={20} />
            </div>
            <div>
              <h1 className="dc-page-title">{t.projects.discover}</h1>
              <p className="dc-page-header-sub">{t.projects.discoverSub}</p>
            </div>
          </div>
        </div>

        <div
          className="flex items-start gap-3 p-4 rounded-xl border mb-8 anim-fade-up delay-1"
          style={{
            background: "color-mix(in srgb, var(--accent) 6%, transparent)",
            borderColor: "color-mix(in srgb, var(--accent) 18%, transparent)",
          }}
        >
          <Zap
            size={15}
            className="flex-shrink-0 mt-0.5"
            style={{ color: "var(--accent)" }}
          />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Projects are ranked by match score. The score is calculated from
            your skills (+2 per match) and professional role (+1 if mentioned in
            the description).
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))
          ) : projects.length > 0 ? (
            projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                className={`anim-fade-up delay-${Math.min(i + 1, 5)}`}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <Compass
                size={36}
                className="mx-auto mb-3"
                style={{ color: "var(--text-dim)" }}
              />
              <p
                className="font-semibold mb-1"
                style={{ color: "var(--text)" }}
              >
                No matches yet
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Add more skills to your profile to get better recommendations.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
