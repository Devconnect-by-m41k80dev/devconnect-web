import { useI18n } from "@/app/i18n";
import { ProjectCardHeader } from "./ProjectCardHeader";
import { ProjectCardFooter } from "./ProjectCardFooter";
import Link from "next/link";
import { cn, truncate } from "@/app/lib/utils";
import { Project } from "@/app/types/entities";
import type { CSSProperties } from "react";
import { ProjectCardTechStack } from "./ProjectCardTechStack";

export interface ProjectCardProps {
  project: Project & { score?: number };
  className?: string;
  style?: CSSProperties;
}

export function ProjectCard({ project, className, style }: ProjectCardProps) {
  const { locale } = useI18n();
  console.log("CARD STATUS:", project.status, project.id);

  return (
    <Link
      href={`/projects/${project.id}`}
      className={cn(
        "dc-card-interactive flex flex-col p-5 no-underline",
        className,
      )}
      style={style}
    >
      <ProjectCardHeader
        title={project.title}
        status={project.status}
        locale={locale}
      />
      <p
        className="text-xs leading-relaxed mb-4 flex-1"
        style={{ color: "var(--text-muted)" }}
      >
        {truncate(project.description, 115)}
      </p>
      <ProjectCardTechStack techStack={project.techStack} />
      <ProjectCardFooter
        owner={project.owner}
        score={project.score}
        createdAt={project.createdAt}
        locale={locale}
      />
    </Link>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="dc-card p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3 justify-between">
        <div className="dc-skeleton h-4 w-3/5 rounded" />
        <div className="dc-skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="dc-skeleton h-3 w-full rounded" />
        <div className="dc-skeleton h-3 w-4/5 rounded" />
        <div className="dc-skeleton h-3 w-3/5 rounded" />
      </div>
      <div className="flex gap-1.5">
        {[44, 52, 38].map((w, i) => (
          <div key={i} className="dc-skeleton h-4 rounded-md" style={{ width: w }} />
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="dc-skeleton w-6 h-6 rounded-xl" />
          <div className="dc-skeleton h-3 w-20 rounded" />
        </div>
        <div className="dc-skeleton h-3 w-14 rounded" />
      </div>
    </div>
  )
}
