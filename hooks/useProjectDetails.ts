import { useState, useEffect, useCallback } from "react";
import { agencyService } from "@/lib/api/agencyService/agencyService";
import { transformProjectDetail } from "@/utils/projectTransformers";
import { transformMilestones } from "@/utils/milestoneTransformers";
import type { ProjectDetail } from "@/types/agencyProjectsNew";
import type { Milestone } from "@/types/agencyMilestone";

interface UseProjectDetailsReturn {
  project: ProjectDetail | null;
  milestones: Milestone[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProjectDetails = (
  projectId: string
): UseProjectDetailsReturn => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = useCallback(async () => {
    if (!projectId) {
      setError("Project ID is required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const projectResponse = await agencyService.getProjectById(projectId);

      const transformedProject = transformProjectDetail(
        projectResponse.project
      );
      setProject(transformedProject);
      try {
        const milestonesResponse = await agencyService.getProjectMilestones(
          projectId
        );

        const transformedMilestones = transformMilestones(
          milestonesResponse.milestones
        );
        setMilestones(transformedMilestones);
        if (transformedProject.projectProgress) {
          transformedProject.projectProgress.milestones =
            transformedMilestones.map((m) => ({
              id: m.id,
              name: m.title,
              status: m.status || "pending",
            }));
        }
      } catch (milestoneError) {
        console.warn("⚠️ Milestones not available:", milestoneError);
        setMilestones([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch project details";
      setError(errorMessage);
      console.error("❌ useProjectDetails error:", err);
      setProject(null);
      setMilestones([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  return {
    project,
    milestones,
    isLoading,
    error,
    refetch: fetchProjectDetails,
  };
};
