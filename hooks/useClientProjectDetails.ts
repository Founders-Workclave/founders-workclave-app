"use client";
import { useState, useEffect, useCallback } from "react";
import { clientService } from "@/lib/api/clientsService/clientsService";
import { ClientProjectDetails } from "@/types/managersDashbord";

interface UseClientProjectDetailsReturn {
  project: ClientProjectDetails | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useClientProjectDetails = (
  projectId: string
): UseClientProjectDetailsReturn => {
  const [project, setProject] = useState<ClientProjectDetails | null>(null);
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
      const data = await clientService.getClientProjectDetails(projectId);
      setProject(data);
    } catch (err) {
      console.error("Error fetching client project details:", err);
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
