"use client";
import { useState, useEffect, useCallback } from "react";
import { clientService } from "@/lib/api/clientsService/clientsService";
import {
  ManagerStats,
  TransformedManagerProject,
} from "@/types/managersDashbord";

interface UseManagerDataReturn {
  stats: ManagerStats;
  projects: TransformedManagerProject[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useClientData = (): UseManagerDataReturn => {
  const [stats, setStats] = useState<ManagerStats>({
    activeProjects: 0,
  });
  const [projects, setProjects] = useState<TransformedManagerProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await clientService.getDashboard();

      setStats(data.stats);
      setProjects(data.projects);
    } catch (err) {
      console.error("Error in useManagerData:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    projects,
    isLoading,
    error,
    refetch: fetchData,
  };
};
