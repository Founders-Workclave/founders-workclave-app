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

export const agencyTerminateService = {
  /**
   * Terminate a project
   */
  async terminateProject(projectId: string): Promise<{ message: string }> {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      const url = `${API_BASE_URL}/agency/project/${projectId}/terminate/`;
      console.log("🚀 Terminating project:", projectId);
      console.log("📍 API URL:", url);
      console.log("🔑 Token present:", !!token);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Empty body for POST request
      }).catch((fetchError) => {
        console.error("🔥 Fetch failed:", fetchError);
        throw new Error(
          `Failed to fetch: ${fetchError.message || "Network error"}`
        );
      });

      console.log("📊 Response status:", response.status);
      console.log("📊 Response ok:", response.ok);

      if (!response.ok) {
        let errorData: ApiErrorResponse;

        try {
          errorData = await response.json();
          console.error("❌ API Error response:", errorData);
        } catch (jsonError) {
          console.error("❌ Could not parse error response:", jsonError);
          errorData = {
            message: `Server error: ${response.status} ${response.statusText}`,
          };
        }

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
          errorData.message ||
            errorData.error ||
            `Failed to terminate project (${response.status})`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      console.log("✅ Terminate project API response:", data);
      return data;
    } catch (error) {
      console.error("🔥 Terminate project error:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        // More specific error messages
        if (error.message.includes("Failed to fetch")) {
          throw new ApiError(
            "Network error: Unable to connect to server. Please check your internet connection."
          );
        }
        throw new ApiError(`Error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while terminating project");
    }
  },
};
