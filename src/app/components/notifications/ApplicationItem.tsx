"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { Avatar } from "@/app/components/ui/Avatar";
import { ApplicationStatusBadge } from "@/app/components/ui/Badge";
import { Spinner } from "@/app/components/ui/Spinner";
import { formatDate } from "@/app/lib/utils";
import { ProjectApplication } from "@/app/types/entities";
import { Locale } from "@/app/i18n";

interface ApplicationItemProps {
  application: ProjectApplication;
  locale: Locale;
  actionLoading: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  showProjectLink?: boolean;
}

export function ApplicationItem({
  application: app,
  locale,
  actionLoading,
  onAccept,
  onReject,
  showProjectLink = false,
}: ApplicationItemProps) {
  const isPending = app.status === "pending";
  const isProcessing = actionLoading === app.id;

  return (
    <div className="dc-card p-5">
      <div className="flex items-start gap-4">
        <Avatar
          fullName={app.user?.fullName ?? "?"}
          size="md"
          className="shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/users/${app.user?.id}`}
              className="font-semibold text-sm transition-colors hover:text-[--brand]"
              style={{ color: "var(--text)" }}
            >
              {app.user?.fullName}
            </Link>
            {app.user?.professionalRole && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background:
                    "color-mix(in srgb, var(--brand) 10%, transparent)",
                  color: "var(--brand)",
                }}
              >
                {app.user.professionalRole.name}
              </span>
            )}
            <span
              className="text-xs ml-auto shrink-0"
              style={{ color: "var(--text-dim)" }}
            >
              {formatDate(app.createdAt, locale)}
            </span>
          </div>

          {app.user?.skills && app.user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {app.user.skills.slice(0, 6).map((s) => (
                <span
                  key={s.id}
                  className="font-mono text-[10px] px-2 py-0.5 rounded border"
                  style={{
                    color: "var(--accent)",
                    borderColor:
                      "color-mix(in srgb, var(--accent) 22%, transparent)",
                    background:
                      "color-mix(in srgb, var(--accent) 6%, transparent)",
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          )}

          {app.message && (
            <p
              className="text-sm leading-relaxed p-3 rounded-xl mt-1"
              style={{
                background: "var(--bg-overlay)",
                color: "var(--text-muted)",
              }}
            >
             {app.message}
            </p>
          )}

          {showProjectLink && app.project && (
            <Link
              href={`/projects/${app.project.id}`}
              className="inline-flex items-center gap-1 text-xs mt-2 transition-colors hover:text-[--brand]"
              style={{ color: "var(--text-dim)" }}
            >
              → {app.project.title}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start pt-0.5">
          {isPending ? (
            <>
              <button
                onClick={() => onAccept(app.id)}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-50 hover:opacity-90 active:scale-95"
                style={{ background: "var(--success)" }}
              >
                {isProcessing ? <Spinner size="sm" /> : <Check size={13} />}{" "}
                Accept
              </button>
              <button
                onClick={() => onReject(app.id)}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 hover:border-[--danger] hover:text-[--danger] active:scale-95"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                }}
              >
                {isProcessing ? <Spinner size="sm" /> : <X size={13} />} Reject
              </button>
            </>
          ) : (
            <ApplicationStatusBadge status={app.status} locale={locale} />
          )}
        </div>
      </div>
    </div>
  );
}
