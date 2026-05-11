import { Project } from "@/app/types/entities";
import { Avatar } from "../ui/Avatar";
import { Calendar } from "lucide-react";
import { formatDate } from "@/app/lib/utils";

export function ProjectCardFooter({ owner, score, createdAt, locale }: { owner: Project['owner']; score?: number; createdAt: string; locale: string }) {
  return (
    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2 min-w-0">
        <Avatar fullName={owner.fullName} size="xs" />
        <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
          {owner.fullName}
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {score !== undefined && (
          <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
            ↑{score}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-dim)' }}>
          <Calendar size={10} />
          {formatDate(createdAt, locale)}
        </span>
      </div>
    </div>
  )
}