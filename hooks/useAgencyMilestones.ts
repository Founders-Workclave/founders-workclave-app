// hooks/useMilestones.ts
import { useState, useEffect, useCallback } from "react";
import { agencyService } from "@/lib/api/agencyService/agencyService";
import type { Milestone } from "@/types/agencyMilestone";
import { transformMilestones } from "@/utils/milestoneTransformers";

interface UseMilestonesParams {
  projectId: string;
  initialMilestones?: Milestone[];
}

interface UseMilestonesReturn {
  milestones: Milestone[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateMilestoneProgress: (
    milestoneId: string,
    progress: number
  ) => Promise<void>;
  markMilestoneComplete: (milestoneId: string) => Promise<void>;
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
}

export const useMilestones = ({
  projectId,
  initialMilestones = [],
}: UseMilestonesParams): UseMilestonesReturn => {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMilestones = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await agencyService.getProjectMilestones(projectId);
      const transformed = transformMilestones(response.milestones);
      setMilestones(transformed);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch milestones";
      setError(errorMessage);
      console.error("Error fetching milestones:", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const updateMilestoneProgress = useCallback(
    async (milestoneId: string, progress: number) => {
      try {
        await agencyService.updateMilestone(projectId, milestoneId, {
          progress,
        });

        setMilestones((prevMilestones) =>
          prevMilestones.map((m) => {
            if (m.id !== milestoneId) return m;

            const newProgress = progress;
            const newStatus = newProgress > 0 ? "in-progress" : m.status;

            return {
              ...m,
              progress: newProgress,
              status: newStatus,
            };
          })
        );
      } catch (err) {
        console.error("Error updating milestone progress:", err);
        throw err;
      }
    },
    [projectId]
  );

  const markMilestoneComplete = useCallback(
    async (milestoneId: string) => {
      try {
        await agencyService.updateMilestone(projectId, milestoneId, {
          completed: true,
          status: "completed",
          completedDate: new Date().toISOString(),
          progress: 100,
        });

        setMilestones((prevMilestones) =>
          prevMilestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  completed: true,
                  status: "completed" as const,
                  completedDate: new Date().toISOString(),
                  progress: 100,
                }
              : m
          )
        );
      } catch (err) {
        console.error("Error marking milestone as complete:", err);
        throw err;
      }
    },
    [projectId]
  );

  return {
    milestones,
    isLoading,
    error,
    refetch: fetchMilestones,
    updateMilestoneProgress,
    markMilestoneComplete,
    setMilestones,
  };
};
