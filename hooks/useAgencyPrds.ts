import { useState, useEffect, useCallback } from "react";
import { agencyService } from "@/lib/api/agencyService/agencyService";
import type { PRD, UploadPRDPayload } from "@/types/agencyPrd";
import { transformPRDs } from "@/utils/prdTransformer";

interface UsePRDsParams {
  projectId: string;
  initialPRDs?: PRD[];
}

interface UsePRDsReturn {
  prds: PRD[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  uploadPRD: (payload: UploadPRDPayload) => Promise<void>;
  deletePRD: (prdId: number) => Promise<void>;
}

export const usePRDs = ({
  projectId,
  initialPRDs = [],
}: UsePRDsParams): UsePRDsReturn => {
  const [prds, setPRDs] = useState<PRD[]>(initialPRDs);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPRDs = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await agencyService.getProjectPRDs(projectId);
      const transformed = transformPRDs(response.prds || []);
      setPRDs(transformed);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch PRDs";
      setError(errorMessage);
      console.error("❌ Error fetching PRDs:", err);
      // Set empty array on error instead of leaving stale data
      setPRDs([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchPRDs();
  }, [fetchPRDs]);

  const uploadPRD = useCallback(
    async (payload: UploadPRDPayload) => {
      try {
        setError(null);
        await agencyService.uploadPRD(projectId, payload);
        await fetchPRDs();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload PRD";
        setError(errorMessage);
        console.error("Error uploading PRD:", err);
        throw err;
      }
    },
    [projectId, fetchPRDs]
  );

  const deletePRD = useCallback(
    async (prdId: number) => {
      try {
        setError(null);
        await agencyService.deletePRD(projectId, prdId);
        setPRDs((prevPRDs) => prevPRDs.filter((prd) => prd.id !== prdId));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete PRD";
        setError(errorMessage);
        console.error("Error deleting PRD:", err);
        await fetchPRDs();
        throw err;
      }
    },
    [projectId, fetchPRDs]
  );

  return {
    prds,
    isLoading,
    error,
    refetch: fetchPRDs,
    uploadPRD,
    deletePRD,
  };
};
