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
}

export const useClientPRDs = ({
  projectId,
}: UseManagerPRDsParams): UseManagerPRDsReturn => {
  const [prds, setPRDs] = useState<PRD[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPRDs = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    const url = `${BASE_URL}/client/project/${projectId}/prds/`;

    setIsLoading(true);
    setError(null);

    try {
      console.log("📄 Fetching manager PRDs for project:", projectId);

      const token = getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ PRDs error response:", errorText);
        throw new Error(
          `HTTP ${response.status}: ${response.statusText || "Request failed"}`
        );
      }

      const data = await response.json();
      console.log("📄 Clients PRDs API response:", data);

      const transformed = transformPRDs(data.prds || []);
      console.log("📄 Transformed PRDs:", transformed);
      setPRDs(transformed);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch PRDs";
      setError(errorMessage);
      console.error("❌ Error fetching Clients PRDs:", err);
      setPRDs([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchPRDs();
  }, [fetchPRDs]);

  return {
    prds,
    isLoading,
    error,
    refetch: fetchPRDs,
  };
};
