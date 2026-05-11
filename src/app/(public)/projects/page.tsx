"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/app/i18n";
import { useAuthStore } from "@/app/store/auth.store";
import { projectsApi } from "@/app/lib/api";
import { Search, X, Plus, Compass, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { ProjectStatus } from "@/app/types/enums";
import { Project } from "@/app/types/entities";
import { GetProjectsDto } from "@/app/types/dtos";
import { useDebounce } from "@/app/hooks/useDebounce";
import { Navbar } from "@/app/components/layout/Navbar";
import { cn } from "@/app/lib/utils";
import {
  ProjectCard,
  ProjectCardSkeleton,
} from "@/app/components/project/ProjectCard";
import { Footer } from "@/app/components/layout/Footer";

const ALL_STATUSES = Object.values(ProjectStatus);

const COMMON_TECHS = [
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "NestJS",
  "Node.js",
  "Python",
  "Go",
  "Rust",
  "TypeScript",
  "PostgreSQL",
  "MongoDB",
];

export default function ProjectsPage() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuthStore();

  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<GetProjectsDto>({
    page: 1,
    limit: 12,
    status: "" as GetProjectsDto["status"],
    tech: "",
    search: "",
  });

  const debouncedSearch = useDebounce(filters.search ?? "", 380);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetProjectsDto = {
        ...filters,
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
        tech: filters.tech || undefined,
        page,
      };
      const res = await projectsApi.getAll(params);
      setProjects(res.data);
      setTotal(res.meta.total);
    } catch {
      setProjects([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = <K extends keyof GetProjectsDto>(
    key: K,
    value: GetProjectsDto[K],
  ) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({
      page: 1,
      limit: 12,
      status: "" as GetProjectsDto["status"],
      tech: "",
      search: "",
    });
  };

  const totalPages = Math.ceil(total / (filters.limit ?? 12));
  const hasFilters = !!(filters.status || filters.tech || filters.search);

  return (
    <div className="dc-page">
      <Navbar />
      <main className="dc-container">
        <div className="dc-page-header anim-fade-up">
          <div>
            <h1 className="dc-page-title">{t.projects.title}</h1>
            <p className="dc-page-header-sub">{t.projects.sub}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAuthenticated && (
              <Link
                href="/discover"
                className="dc-btn-ghost py-2 px-3.5 text-sm hidden sm:inline-flex gap-1.5"
              >
                <Compass size={14} /> {t.projects.discover}
              </Link>
            )}
            {isAuthenticated && (
              <Link
                href="/projects/new"
                className="dc-btn-primary py-2 px-3.5 text-sm gap-1.5"
              >
                <Plus size={14} />
                <span className="hidden sm:block">{t.projects.createNew}</span>
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-3 mb-5 anim-fade-up delay-1">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-dim)" }}
            />
            <input
              type="search"
              value={filters.search ?? ""}
              onChange={(e) => setFilter("search", e.target.value)}
              placeholder={t.projects.search}
              className="dc-input pl-9"
            />
            {filters.search && (
              <button
                onClick={() => setFilter("search", "")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-dim)" }}
              >
                <X size={13} />
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={cn(
              "dc-btn-ghost py-2.5 px-3.5 relative gap-2",
              filtersOpen && "border-[--brand] text-[--brand]",
            )}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:block text-sm">
              {t.projects.filterStatus}
            </span>
            {hasFilters && (
              <span
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-white text-[9px] flex items-center justify-center font-bold"
                style={{ background: "var(--brand)" }}
              >
                •
              </span>
            )}
          </button>
        </div>

        {filtersOpen && (
          <div className="dc-card p-5 mb-5 anim-scale-in">
            <div className="flex flex-wrap gap-6">
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-2.5"
                  style={{ color: "var(--text-dim)" }}
                >
                  {t.projects.filterStatus}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setFilter("status", "" as GetProjectsDto["status"])
                    }
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-100",
                      !filters.status
                        ? "text-white border-transparent"
                        : "border-[--border] text-[--text-muted] hover:border-[--brand] hover:text-[--brand]",
                    )}
                    style={
                      !filters.status ? { background: "var(--brand)" } : {}
                    }
                  >
                    {t.projects.allStatuses}
                  </button>
                  {ALL_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter("status", s)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-100",
                        filters.status === s
                          ? "text-white border-transparent"
                          : "border-[--border] text-[--text-muted] hover:border-[--brand] hover:text-[--brand]",
                      )}
                      style={
                        filters.status === s
                          ? { background: "var(--brand)" }
                          : {}
                      }
                    >
                      {t.status[s]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-2.5"
                  style={{ color: "var(--text-dim)" }}
                >
                  {t.projects.filterTech}
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_TECHS.map((tech) => (
                    <button
                      key={tech}
                      onClick={() =>
                        setFilter("tech", filters.tech === tech ? "" : tech)
                      }
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-100",
                        filters.tech === tech
                          ? "text-white border-transparent"
                          : "border-[--border] text-[--text-muted] hover:border-[--accent] hover:text-[--accent]",
                      )}
                      style={
                        filters.tech === tech
                          ? { background: "var(--accent)" }
                          : {}
                      }
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-xs flex items-center gap-1.5 hover:text-[--danger] transition-colors"
                style={{ color: "var(--text-dim)" }}
              >
                <X size={11} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {!loading && (
          <p className="text-xs mb-4" style={{ color: "var(--text-dim)" }}>
            {total} project{total !== 1 ? "s" : ""}
            {hasFilters ? " matching" : ""}
          </p>
        )}

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
              <Search
                size={36}
                className="mx-auto mb-3"
                style={{ color: "var(--text-dim)" }}
              />
              <p
                className="font-semibold mb-1"
                style={{ color: "var(--text)" }}
              >
                {t.projects.noResults}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {t.projects.noResultsSub}
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="dc-btn-ghost py-2 px-4 text-sm"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const n = i + 1;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={cn(
                    "w-9 h-9 rounded-lg text-sm font-medium transition-all duration-100",
                    page === n
                      ? "text-white"
                      : "text-[--text-muted] hover:bg-[--bg-overlay]",
                  )}
                  style={page === n ? { background: "var(--brand)" } : {}}
                >
                  {n}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="dc-btn-ghost py-2 px-4 text-sm"
            >
              Next →
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}