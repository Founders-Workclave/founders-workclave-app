"use client";
import { useState, useEffect, useCallback } from "react";
import type { Milestone } from "@/types/agencyMilestone";

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

interface UseManagerMilestonesReturn {
  milestones: Milestone[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markMilestoneComplete: (milestoneId: string) => Promise<void>;
}

export const useManagerMilestones = (
  projectId: string
): UseManagerMilestonesReturn => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = (): HeadersInit => {
    const token = getAuthToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const fetchMilestones = useCallback(async () => {
    if (!projectId) {
      setError("Project ID is required");
      setIsLoading(false);
      return;
    }

    const url = `${BASE_URL}/manager/project/${projectId}/milestones/`;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Milestones error response:", errorText);
        throw new Error(
          `HTTP ${response.status}: ${response.statusText || "Request failed"}`
        );
      }

      const data = await response.json();
      console.log("📦 Manager milestones received:", data);

      const sorted: Milestone[] = (data.milestones || []).sort(
        (a: Milestone, b: Milestone) => a.order - b.order
      );

      setMilestones(sorted);
    } catch (err) {
      console.error("💥 Error fetching manager milestones:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch milestones"
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const markMilestoneComplete = useCallback(
    async (milestoneId: string): Promise<void> => {
      const url = `${BASE_URL}/manager/project/milestone/${milestoneId}/completed/`;

      const response = await fetch(url, {
        method: "POST",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Mark complete error:", errorText);
        throw new Error(
          `HTTP ${response.status}: ${response.statusText || "Request failed"}`
        );
      }

      // Optimistically update the milestone status in state
      setMilestones((prev) =>
        prev.map((m) =>
          String(m.id) === milestoneId
            ? { ...m, status: "completed", progress: 100 }
            : m
        )
      );
    },
    []
  );

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  return {
    milestones,
    isLoading,
    error,
    refetch: fetchMilestones,
    markMilestoneComplete,
  };
};
