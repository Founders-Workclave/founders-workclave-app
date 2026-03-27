import { useState, useEffect, useCallback } from "react";
import { agencyService } from "@/lib/api/agencyService/agencyService";
import type { Milestone } from "@/types/agencyMilestone";
import { transformMilestones } from "@/utils/milestoneTransformers";
import { milestoneService } from "@/lib/api/createProject/editMilestones";

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
        await milestoneService.completeMilestone(milestoneId, projectId);
        setMilestones((prevMilestones) => {
          const sortedMilestones = [...prevMilestones].sort((a, b) => {
            const orderA = a.order || a.number || 0;
            const orderB = b.order || b.number || 0;
            return orderA - orderB;
          });

          const currentIndex = sortedMilestones.findIndex(
            (m) => String(m.id) === String(milestoneId)
          );

          return sortedMilestones.map((milestone, index) => {
            if (String(milestone.id) === String(milestoneId)) {
              return {
                ...milestone,
                status: "completed",
                progress: 100,
                completedDate: new Date().toISOString(),
              };
            }

            // Mark next milestone as in-progress if current one is completed
            if (index === currentIndex + 1 && milestone.status === "pending") {
              return {
                ...milestone,
                status: "in-progress",
                progress: 0,
              };
            }

            return milestone;
          });
        });

        // Add small delay to let backend process
        await new Promise((resolve) => setTimeout(resolve, 300));
        await fetchMilestones();
      } catch (err) {
        console.error("❌ Error marking milestone as complete:", err);
        if (err instanceof Error && err.message.includes("project ID")) {
          console.error(
            "💡 Hint: The API endpoint requires the project ID in the URL"
          );
        }
        await fetchMilestones();
        throw err;
      }
    },
    [projectId, fetchMilestones]
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
