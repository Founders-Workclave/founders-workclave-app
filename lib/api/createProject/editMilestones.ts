import { getAuthToken } from "@/lib/api/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const milestoneService = {
  /**
   * Create a new milestone for a project
   * POST /agency/project/{project_id}/add-milestone/
   */
  async createMilestone(
    projectId: string,
    data: {
      title: string;
      description: string;
      price: number;
      dueDate: string;
      deliverables: Array<{ id: string; task: string }>;
    }
  ): Promise<unknown> {
    try {
      const token = getAuthToken();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const idString = String(projectId).trim();

      console.log("➕ Creating new milestone:", {
        projectId: idString,
        data: data,
      });

      const response = await fetch(
        `${API_BASE_URL}/agency/project/${idString}/add-milestone/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to create milestone" }));

        console.error("❌ Create milestone failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });

        throw new ApiError(
          errorData.message || errorData.error || "Failed to create milestone",
          response.status,
          errorData
        );
      }

      const responseData = await response.json();
      console.log("✅ Milestone created successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("💥 Exception in createMilestone:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while creating milestone");
    }
  },

  /**
   * Mark milestone as completed
   * POST /agency/project/milestone/{milestone_id}/completed/
   */
  async completeMilestone(
    milestoneId: string | number,
    projectId?: string
  ): Promise<unknown> {
    try {
      const token = getAuthToken();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const idString = String(milestoneId).trim();

      console.log("🔍 Completing milestone:", {
        originalId: milestoneId,
        idType: typeof milestoneId,
        stringId: idString,
        projectId: projectId,
        url: `${API_BASE_URL}/agency/project/milestone/${idString}/completed/`,
      });

      const response = await fetch(
        `${API_BASE_URL}/agency/project/milestone/${idString}/completed/`,
        {
          method: "POST",
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to mark milestone as completed" }));

        console.error("❌ Complete milestone failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });

        throw new ApiError(
          errorData.message ||
            errorData.error ||
            "Failed to complete milestone",
          response.status,
          errorData
        );
      }

      const responseData = await response.json();
      console.log("✅ Milestone completed successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("💥 Exception in completeMilestone:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError(
        "An unexpected error occurred while completing milestone"
      );
    }
  },

  /**
   * Edit/Update a milestone
   * PATCH /agency/project/milestone/{milestone_id}/edit/
   */
  async editMilestone(
    milestoneId: string | number,
    data: {
      title: string;
      description: string;
      price: number;
      dueDate: string;
      deliverables: Array<{ id: string; task: string }>;
    }
  ): Promise<unknown> {
    try {
      const token = getAuthToken();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // FIXED: Ensure milestoneId is string
      const idString = String(milestoneId).trim();

      console.log("🔧 Editing milestone:", {
        originalId: milestoneId,
        idType: typeof milestoneId,
        stringId: idString,
        data: data,
      });

      const response = await fetch(
        `${API_BASE_URL}/agency/project/milestone/${idString}/edit/`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to edit milestone" }));

        console.error("❌ Edit milestone failed:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });

        throw new ApiError(
          errorData.message || errorData.error || "Failed to edit milestone",
          response.status,
          errorData
        );
      }

      const responseData = await response.json();
      console.log("✅ Milestone edited successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("💥 Exception in editMilestone:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError(
        "An unexpected error occurred while editing milestone"
      );
    }
  },
};
