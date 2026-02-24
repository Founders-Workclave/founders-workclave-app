import {
  ManagersListResponse,
  PMDetailResponse,
  Manager,
} from "@/types/agencyPm";
import { getAuthToken } from "@/lib/api/auth";

const API_BASE_URL = "https://foundersapi.up.railway.app";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progressPercentage: number;
  status: string;
  latest_milestone: string;
}

export interface ManagerProjectsResponse {
  message: string;
  manager: Manager;
  projects: Project[];
}

export const managerService = {
  async getManagersList(): Promise<ManagersListResponse> {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(
        `${API_BASE_URL}/agency/managers-dashboard/`,
        {
          method: "GET",
          headers,
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          "Failed to fetch managers",
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error)
        throw new ApiError(`Network error: ${error.message}`);
      throw new ApiError("An unknown error occurred");
    }
  },

  async getPMById(id: string): Promise<Manager | null> {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(
        `${API_BASE_URL}/agency/managers-dashboard/`,
        {
          method: "GET",
          headers,
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          "Failed to fetch PM details",
          response.status,
          errorData
        );
      }

      const data: PMDetailResponse = await response.json();

      // Match against managerID (the UUID used in routing) not id
      const manager = data.managers.find((m) => m.managerID === id);
      return manager || null;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error)
        throw new ApiError(`Network error: ${error.message}`);
      throw new ApiError("An unknown error occurred");
    }
  },

  async getManagerProjects(
    managerId: string
  ): Promise<ManagerProjectsResponse> {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(
        `${API_BASE_URL}/agency/manager/${managerId}/projects/`,
        {
          method: "GET",
          headers,
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          "Failed to fetch manager projects",
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error)
        throw new ApiError(`Network error: ${error.message}`);
      throw new ApiError("An unknown error occurred");
    }
  },
};
