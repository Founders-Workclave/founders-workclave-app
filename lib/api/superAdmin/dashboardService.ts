import { getAuthToken } from "@/lib/api/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RecentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string | null;
  role: string;
  dateJoined: string;
}

export interface DashboardData {
  message: string;
  totalFounders: number;
  totalAgencys: number;
  monthRevenue: number;
  totalPRDS: number;
  activeProject: number;
  recentUsers: RecentUser[];
}

/**
 * Get SuperAdmin dashboard data
 */
export async function getSuperAdminDashboard(): Promise<DashboardData> {
  try {
    const token = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/superadmin/`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch dashboard data" }));

      throw new ApiError(
        errorData.message ||
          errorData.error ||
          "Failed to fetch dashboard data",
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(`Network error: ${error.message}`);
    }

    throw new ApiError(
      "An unknown error occurred while fetching dashboard data"
    );
  }
}
