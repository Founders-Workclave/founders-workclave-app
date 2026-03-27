import { useState, useEffect, useCallback } from "react";
import type { PRD } from "@/types/agencyPrd";
import { transformPRDs } from "@/utils/prdTransformer";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const possibleKeys = [
      "authToken",
      "token",
      "access_token",
      "accessToken",
      "auth_token",
      "jwt",
      "jwtToken",
    ];

    for (const key of possibleKeys) {
      const token = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (token) return token;
    }
  }
  return null;
};

interface UseManagerPRDsParams {
  projectId: string;
}

interface UseManagerPRDsReturn {
  prds: PRD[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deletePRD: (prdId: number) => Promise<void>;
}

export const useManagerPRDs = ({
  projectId,
}: UseManagerPRDsParams): UseManagerPRDsReturn => {
  const [prds, setPRDs] = useState<PRD[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = (): HeadersInit => {
    const token = getAuthToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const fetchPRDs = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/manager/project/${projectId}/prds/`,
        { method: "GET", headers: getHeaders() }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ PRDs error response:", errorText);
        throw new Error(
          `HTTP ${response.status}: ${response.statusText || "Request failed"}`
        );
      }

      const data = await response.json();
      const transformed = transformPRDs(data.prds || []);
      setPRDs(transformed);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch PRDs";
      setError(errorMessage);
      setPRDs([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchPRDs();
  }, [fetchPRDs]);

  const deletePRD = useCallback(
    async (prdId: number) => {
      try {
        const response = await fetch(
          `${BASE_URL}/manager/project/prd/${prdId}/delete/`,
          { method: "DELETE", headers: getHeaders() }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Delete PRD error:", errorText);
          throw new Error(
            `HTTP ${response.status}: ${
              response.statusText || "Failed to delete PRD"
            }`
          );
        }
        setPRDs((prev) => prev.filter((prd) => prd.id !== prdId));
      } catch (err) {
        console.error("❌ Error deleting manager PRD:", err);
        // Restore UI state on failure
        await fetchPRDs();
        throw err;
      }
    },
    [fetchPRDs]
  );

  return {
    prds,
    isLoading,
    error,
    refetch: fetchPRDs,
    deletePRD,
  };
};
