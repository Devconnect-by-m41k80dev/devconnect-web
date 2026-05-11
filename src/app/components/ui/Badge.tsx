import {
  cn,
  PROJECT_STATUS_CONFIG,
  APPLICATION_STATUS_CONFIG,
} from "@/app/lib/utils";

import type { Locale } from "@/app/i18n";
import { ApplicationStatus, ProjectStatus } from "@/app/types/enums";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  locale?: Locale;
  className?: string;
}

export function ProjectStatusBadge({
  status,
  locale = "en",
  className,
}: ProjectStatusBadgeProps) {
  
  const normalizedStatus = (status ?? "")
    .toString()
    .trim()
    .toLowerCase() as ProjectStatus;

  
  const cfg =
    PROJECT_STATUS_CONFIG[normalizedStatus] ??
    PROJECT_STATUS_CONFIG.idea;

  return (
    <span className={cn("dc-badge", cfg.className, className)}>
      {locale === "es" ? cfg.labelEs : cfg.labelEn}
    </span>
  );
}

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  locale?: Locale;
  className?: string;
}

export function ApplicationStatusBadge({
  status,
  locale = "en",
  className,
}: ApplicationStatusBadgeProps) {
  const cfg =
    APPLICATION_STATUS_CONFIG[status] ??
    APPLICATION_STATUS_CONFIG.pending;

  return (
    <span className={cn("dc-badge", cfg.className, className)}>
      {locale === "es" ? cfg.labelEs : cfg.labelEn}
    </span>
  );
}