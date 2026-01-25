// hooks/useAgencyData.ts
import { useState, useEffect, useCallback } from "react";
import { agencyService } from "../lib/api/agencyService/agencyService";
import {
  transformProject,
  transformDashboardStats,
} from "@/utils/transformers";
import type { Project, DashboardStats } from "@/types/agencyProjectsNew";

interface UseAgencyDataReturn {
  projects: Project[];
  stats: DashboardStats[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAgencyData = (): UseAgencyDataReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await agencyService.getDashboard();

      // Transform projects
      const transformedProjects = data.projects.map(transformProject);
      setProjects(transformedProjects);

      // Transform stats
      const transformedStats = transformDashboardStats(data);
      setStats(transformedStats);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch agency data";
      setError(errorMessage);
      console.error("Error fetching agency data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    projects,
    stats,
    isLoading,
    error,
    refetch: fetchData,
  };
};

// Hook for paginated projects
interface UseProjectsParams {
  page?: number;
  limit?: number;
}

export const useProjects = ({
  page = 1,
  limit = 10,
}: UseProjectsParams = {}) => {
  const [data, setData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await agencyService.getProjects(page, limit);
      setData(response.projects);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch projects";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { data, isLoading, error, totalPages, refetch: fetchProjects };
};
