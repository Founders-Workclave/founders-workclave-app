import {
  ManagerDashboardResponse,
  ManagerStats,
  TransformedManagerProject,
  ManagerProjectDetails,
  ClientProjectDetails,
} from "@/types/managersDashbord";
import {
  transformManagerProjects,
  transformManagerProjectDetails,
  transformClientProjectDetails, // ← add this
} from "@/utils/managersTransformers";

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
      if (token) {
        return token;
      }
    }

    console.warn("⚠️ No auth token found in localStorage or sessionStorage");

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (
        possibleKeys.some((key) =>
          name.toLowerCase().includes(key.toLowerCase())
        )
      ) {
        return value;
      }
    }

    console.error("❌ No authentication token found anywhere!");
  }
  return null;
};

class ClientService {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async getDashboard(): Promise<{
    stats: ManagerStats;
    projects: TransformedManagerProject[];
  }> {
    const url = `${BASE_URL}/client/`;

    const token = getAuthToken();
    const fetchOptions: RequestInit = {
      method: "GET",
      headers: this.getHeaders(),
    };

    if (token) {
    } else {
      fetchOptions.credentials = "include";
    }

    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        if (response.status === 401 && token) {
          console.error("❌ Token appears to be invalid or expired");
          console.error("💡 Try logging out and logging back in");
        }
        throw new Error(
          `HTTP ${response.status}: ${response.statusText || "Request failed"}`
        );
      }

      const data: ManagerDashboardResponse = await response.json();
      return {
        stats: {
          activeProjects: data.activeProject,
        },
        projects: transformManagerProjects(data.projects),
      };
    } catch (error) {
      console.error("💥 Error fetching client dashboard:", error);
      console.error("💥 Error type:", error?.constructor?.name);
      console.error("💥 Error message:", (error as Error)?.message);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        const errorMessage =
          "❌ Network error: Unable to connect to the server.\n\n";
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      throw error instanceof Error
        ? error
        : new Error("Failed to fetch dashboard data");
    }
  }

  async getProjectDetails(projectId: string): Promise<ManagerProjectDetails> {
    const url = `${BASE_URL}/client/project/${projectId}/`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(
          `HTTP ${response.status}: ${response.statusText || "Request failed"}`
        );
      }

      const data = await response.json();
      return transformManagerProjectDetails(data);
    } catch (error) {
      console.error("💥 Error fetching project details:", error);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        const errorMessage =
          "❌ Network error: Unable to connect to the server.";
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      throw error instanceof Error
        ? error
        : new Error("Failed to fetch project details");
    }
  }

  async getClientProjectDetails(
    projectId: string
  ): Promise<ClientProjectDetails> {
    const url = `${BASE_URL}/client/project/${projectId}/`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(
          `HTTP ${response.status}: ${response.statusText || "Request failed"}`
        );
      }

      const data = await response.json();
      return transformClientProjectDetails(data);
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error("Network error: Unable to connect to the server.");
      }
      throw error instanceof Error
        ? error
        : new Error("Failed to fetch project details");
    }
  }
}

export const clientService = new ClientService();
