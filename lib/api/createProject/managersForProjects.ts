import { getAuthToken } from "@/lib/api/auth";
import { ManagersListResponse, ApiErrorResponse } from "@/types/projectApi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const managerServiceForProjects = {
  /**
   * Fetches the list of product managers for project assignment
   */
  async getManagersList(): Promise<ManagersListResponse> {
    try {
      const token = getAuthToken();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/agency/managers-list/`, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to fetch managers" }));
        throw new ApiError(
          errorData.message || errorData.error || "Failed to fetch managers",
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while fetching managers");
    }
  },

  /**
   * Fetches a single manager by ID
   */
  async getManagerById(
    managerId: string
  ): Promise<ManagersListResponse["managers"][0] | null> {
    try {
      const response = await this.getManagersList();
      const manager = response.managers.find((m) => m.managerID === managerId);
      return manager || null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while fetching manager");
    }
  },
};
