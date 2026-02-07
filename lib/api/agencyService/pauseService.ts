import {
  getAuthToken,
  handleSessionTimeout,
  isAuthError,
} from "@/lib/api/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const agencyPauseService = {
  /**
   * Pause a project
   */
  async pauseProject(projectId: string): Promise<{ message: string }> {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      const response = await fetch(
        `${API_BASE_URL}/agency/project/${projectId}/pause/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to pause project" }));

        // Handle authentication errors
        if (isAuthError(response.status)) {
          handleSessionTimeout();
          throw new ApiError(
            "Session expired. Please log in again.",
            response.status,
            errorData
          );
        }

        throw new ApiError(
          errorData.message || errorData.error || "Failed to pause project",
          response.status,
          errorData
        );
      }

      const data = await response.json();
      console.log("✅ Pause project API response:", data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while pausing project");
    }
  },

  /**
   * Resume a paused project
   */
  async resumeProject(projectId: string): Promise<{ message: string }> {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      const response = await fetch(
        `${API_BASE_URL}/agency/project/${projectId}/resume/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to resume project" }));

        // Handle authentication errors
        if (isAuthError(response.status)) {
          handleSessionTimeout();
          throw new ApiError(
            "Session expired. Please log in again.",
            response.status,
            errorData
          );
        }

        throw new ApiError(
          errorData.message || errorData.error || "Failed to resume project",
          response.status,
          errorData
        );
      }

      const data = await response.json();
      console.log("✅ Resume project API response:", data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while resuming project");
    }
  },
};
