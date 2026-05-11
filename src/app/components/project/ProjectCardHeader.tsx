import { Project } from "@/app/types/entities";
import { ProjectStatusBadge } from "../ui/Badge";
import { ArrowUpRight } from "lucide-react";
import { Locale } from "@/app/i18n";

export function ProjectCardHeader({
  title,
  status,
  locale,
}: {
  title: string;
  status: Project["status"];
  locale: Locale;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-3">
      <h3
        className="font-semibold text-sm leading-snug group-hover:text-[--brand] transition-colors duration-150"
        style={{ color: "var(--text)" }}
      >
        {title}
      </h3>
      <div className="flex items-center gap-2 flex-shrink-0">
        <ProjectStatusBadge status={status} locale={locale} />
        <ArrowUpRight
          size={14}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--brand)" }}
        />
      </div>
    </div>
  );
}
