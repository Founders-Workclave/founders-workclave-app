import { ApiResponse, ApiError } from "../../types/adminForms";
import { getAuthToken } from "@/lib/utils/auth";

/**
 * API Configuration
 * Replace baseURL with your actual API endpoint
 */
export const API_CONFIG = {
  baseURL:
    process.env.REACT_APP_API_BASE_URL || "https://foundersapi.up.railway.app",
  endpoints: {
    createProject: "/founder/create-project/",
    createMilestone: (projectId: string) =>
      `/founder/project/${projectId}/create-milestone/`,
    createDeliverable: (milestoneId: string) =>
      `/founder/project/milestone/${milestoneId}/create-deliverable/`,
    createFeature: (projectId: string) =>
      `/founder/project/${projectId}/create-feature/`,
    addPRD: (projectId: string) => `/founder/project/${projectId}/add-prd/`,
  },
};

export const apiService = {
  async request<T = Record<string, unknown>>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    data: unknown = null,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = getAuthToken();

      const config: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      if (data && method !== "GET") {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, config);

      let result: unknown;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (!response.ok) {
        const errorMessage = String(
          (result as Record<string, unknown>)?.message ||
            (result as Record<string, unknown>)?.error ||
            `HTTP ${response.status}: ${response.statusText}`
        );
        throw new Error(errorMessage);
      }

      return {
        success: true,
        data: result as T,
      };
    } catch (error) {
      const apiError: ApiError = {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        status: error instanceof Response ? error.status : undefined,
      };

      return {
        success: false,
        error: apiError.message,
      };
    }
  },

  /**
   * Create Project
   */
  async createProject(data: {
    name: string;
    description: string;
    projectValue: number;
    code: string;
  }): Promise<ApiResponse<{ id: string; name: string }>> {
    return this.request(API_CONFIG.endpoints.createProject, "POST", data);
  },

  /**
   * Create Milestone
   */
  async createMilestone(
    projectId: string,
    data: {
      title: string;
      description: string;
      price: number;
      dueDate: string;
    }
  ): Promise<ApiResponse<{ id: string; title: string }>> {
    return this.request(
      API_CONFIG.endpoints.createMilestone(projectId),
      "POST",
      data
    );
  },

  /**
   * Create Deliverable
   */
  async createDeliverable(
    milestoneId: string,
    data: {
      task: string[];
    }
  ): Promise<ApiResponse<{ id: string }>> {
    return this.request(
      API_CONFIG.endpoints.createDeliverable(milestoneId),
      "POST",
      data
    );
  },

  /**
   * Create Feature
   */
  async createFeature(
    projectId: string,
    data: {
      feature: string[];
    }
  ): Promise<ApiResponse<{ id: string }>> {
    return this.request(
      API_CONFIG.endpoints.createFeature(projectId),
      "POST",
      data
    );
  },

  /**
   * Add PRD
   */
  async addPRD(
    projectId: string,
    data: {
      document: string;
      description: string;
    }
  ): Promise<ApiResponse<{ id: string }>> {
    return this.request(API_CONFIG.endpoints.addPRD(projectId), "POST", data);
  },
};
