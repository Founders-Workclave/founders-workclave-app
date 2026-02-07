"use client";
import { useState, useEffect, useCallback } from "react";
import { clientService } from "@/lib/api/clientsService/clientsService";
import { ManagerProjectDetails } from "@/types/managersDashbord";

interface UseManagerProjectDetailsReturn {
  project: ManagerProjectDetails | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useManagerProjectDetails = (
  projectId: string
): UseManagerProjectDetailsReturn => {
  const [project, setProject] = useState<ManagerProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setError("Project ID is required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await clientService.getProjectDetails(projectId);
      setProject(data);
    } catch (err) {
      console.error("Error fetching project details:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch project details"
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    isLoading,
    error,
    refetch: fetchProject,
  };
};
