import { clsx, type ClassValue } from 'clsx'
import { ProjectStatus, ApplicationStatus } from "@/app/types/enums"

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max).trimEnd() + '…'
}


export function formatDate(
  iso?: string | Date | null,
  locale: string = "en"
): string {
  if (!iso) return "—";

  const date = new Date(iso);

  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}



export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { labelEn: string; labelEs: string; className: string }
> = {
  [ProjectStatus.IDEA]:     { labelEn: 'Idea',      labelEs: 'Idea',         className: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  [ProjectStatus.BUILDING]: { labelEn: 'Building',  labelEs: 'Construyendo', className: 'bg-blue-500/15   text-blue-400   border-blue-500/30'   },
  [ProjectStatus.MVP]:      { labelEn: 'MVP',       labelEs: 'MVP',          className: 'bg-amber-500/15  text-amber-400  border-amber-500/30'  },
  [ProjectStatus.LAUNCHED]: { labelEn: 'Launched',  labelEs: 'Lanzado',      className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
}

export const APPLICATION_STATUS_CONFIG: Record<
  ApplicationStatus,
  { labelEn: string; labelEs: string; className: string }
> = {
  [ApplicationStatus.PENDING]:  { labelEn: 'Pending',  labelEs: 'Pendiente', className: 'bg-amber-500/15  text-amber-400  border-amber-500/30'  },
  [ApplicationStatus.ACCEPTED]: { labelEn: 'Accepted', labelEs: 'Aceptado',  className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  [ApplicationStatus.REJECTED]: { labelEn: 'Rejected', labelEs: 'Rechazado', className: 'bg-red-500/15    text-red-400    border-red-500/30'    },
}
