import { useState, useEffect, useCallback } from "react";
import type { ProjectPaymentsResponse } from "@/types/agencyPayments";

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

interface UseManagerPaymentsReturn {
  paymentsData: ProjectPaymentsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useClientPayments = (
  projectId: string
): UseManagerPaymentsReturn => {
  const [paymentsData, setPaymentsData] =
    useState<ProjectPaymentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!projectId) {
      setError("No project ID provided");
      setIsLoading(false);
      return;
    }

    const url = `${BASE_URL}/client/project/${projectId}/payments/`;

    setIsLoading(true);
    setError(null);

    try {
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
        console.error("❌ Payments error response:", errorText);
        throw new Error(
          `HTTP ${response.status}: ${response.statusText || "Request failed"}`
        );
      }

      const data: ProjectPaymentsResponse = await response.json();
      setPaymentsData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load payment history";
      setError(errorMessage);
      console.error("❌ Error fetching client payments:", err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    paymentsData,
    isLoading,
    error,
    refetch: fetchPayments,
  };
};
