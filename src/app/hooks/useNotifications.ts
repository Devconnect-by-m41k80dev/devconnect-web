"use client";

import { useState, useEffect, useCallback } from "react";
import { projectsApi } from "@/app/lib/api";
import { Project, ProjectApplication } from "@/app/types/entities";
import { useNotificationsStore } from "../store/notifications.store";
import { ApplicationStatus } from "../types/enums";

export interface ProjectWithPendingApps {
  project: Project;
  applications: ProjectApplication[];
  pendingCount: number;
}

interface UseNotificationsResult {
  groups: ProjectWithPendingApps[];
  totalPending: number;
  loading: boolean;
  error: boolean;
  accept: (applicationId: string) => Promise<void>;
  reject: (applicationId: string) => Promise<void>;
  refetch: () => void;
}

export function useNotifications(
  userId: string | undefined,
): UseNotificationsResult {
  const [groups, setGroups] = useState<ProjectWithPendingApps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { decrement } = useNotificationsStore();

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(false);

    try {
      const res = await projectsApi.getAll({ limit: 100, page: 1 });
      const owned = res.data.filter((p) => p.owner.id === userId);

      if (owned.length === 0) {
        setGroups([]);
        return;
      }

      const settled = await Promise.allSettled(
        owned.map((p) =>
          projectsApi.getApplications(p.id, { limit: 50, page: 1 }),
        ),
      );

      const built: ProjectWithPendingApps[] = owned
        .map((project, i) => {
          const r = settled[i];
          const apps = r.status === "fulfilled" ? r.value.data : [];

          return {
            project,
            applications: apps,
            pendingCount: apps.filter(
              (a) => a.status === ApplicationStatus.PENDING,
            ).length,
          };
        })
        .sort((a, b) => b.pendingCount - a.pendingCount);

      setGroups(built);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const totalPending = groups.reduce((s, g) => s + g.pendingCount, 0);

  const updateStatus = useCallback(
    (applicationId: string, status: ApplicationStatus) => {
      setGroups((prev) =>
        prev.map((g) => {
          const updatedApps = g.applications.map((a) =>
            a.id === applicationId ? { ...a, status } : a,
          );

          return {
            ...g,
            applications: updatedApps,
            pendingCount: updatedApps.filter(
              (a) => a.status === ApplicationStatus.PENDING,
            ).length,
          };
        }),
      );
    },
    [],
  );

  const accept = useCallback(
    async (applicationId: string) => {
      await projectsApi.acceptApplication(applicationId);
      updateStatus(applicationId, ApplicationStatus.ACCEPTED);
      decrement(1);
    },
    [decrement, updateStatus],
  );

  const reject = useCallback(
    async (applicationId: string) => {
      await projectsApi.rejectApplication(applicationId);
      updateStatus(applicationId, ApplicationStatus.REJECTED);
      decrement(1);
    },
    [decrement, updateStatus],
  );

  return {
    groups,
    totalPending,
    loading,
    error,
    accept,
    reject,
    refetch: fetch,
  };
}
