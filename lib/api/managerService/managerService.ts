import {
  ManagerDashboardResponse,
  ManagerStats,
  TransformedManagerProject,
  ManagerProjectDetails,
} from "@/types/managersDashbord";
import {
  transformManagerProjects,
  transformManagerProjectDetails,
} from "@/utils/managersTransformers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

console.log("🔍 Manager Service - BASE_URL:", BASE_URL);
console.log("🔍 Manager Service - Environment check:", {
  hasWindow: typeof window !== "undefined",
  nodeEnv: process.env.NODE_ENV,
});

/**
 * Get authentication token from storage or cookies
 * Adjust this based on your auth implementation
 */
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
        console.log(
          `🔑 Found token in ${key}:`,
          token.substring(0, 20) + "..."
        );
        return token;
      }
    }

    console.warn("⚠️ No auth token found in localStorage or sessionStorage");
    console.log("📋 Checked keys:", possibleKeys);

    // Try to get from cookies as fallback
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (
        possibleKeys.some((key) =>
          name.toLowerCase().includes(key.toLowerCase())
        )
      ) {
        console.log(`🔑 Found token in cookie ${name}`);
        return value;
      }
    }

    console.error("❌ No authentication token found anywhere!");
  }
  return null;
};

class ManagerService {
  /**
   * Build headers with authentication
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("📋 Request headers:", headers);
    return headers;
  }

  /**
   * Fetch manager dashboard data
   */
  async getDashboard(): Promise<{
    stats: ManagerStats;
    projects: TransformedManagerProject[];
  }> {
    const url = `${BASE_URL}/manager/`;

    console.log("🚀 Fetching manager dashboard");
    console.log("📍 BASE_URL:", BASE_URL);
    console.log("📍 Full URL:", url);
    console.log("📍 URL is valid:", url.startsWith("http"));

    const token = getAuthToken();
    const fetchOptions: RequestInit = {
      method: "GET",
      headers: this.getHeaders(),
    };

    if (token) {
      console.log("🔐 Using token-based auth (no credentials)");
    } else {
      console.log("🍪 No token found, trying cookie-based auth");
      fetchOptions.credentials = "include";
    }

    try {
      console.log("⏳ Starting fetch...");
      console.log("📋 Fetch options:", fetchOptions);

      const response = await fetch(url, fetchOptions);

      console.log("✅ Response received");
      console.log("📊 Response status:", response.status);

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
      console.log("📦 Dashboard data received:", data);

      return {
        stats: {
          activeProjects: data.activeProject,
        },
        projects: transformManagerProjects(data.projects),
      };
    } catch (error) {
      console.error("💥 Error fetching manager dashboard:", error);
      console.error("💥 Error type:", error?.constructor?.name);
      console.error("💥 Error message:", (error as Error)?.message);

      // Provide more specific error messages
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        const errorMessage =
          "❌ Network error: Unable to connect to the server.";
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      throw error instanceof Error
        ? error
        : new Error("Failed to fetch dashboard data");
    }
  }

  /**
   * Fetch project details for a manager
   */
  async getProjectDetails(projectId: string): Promise<ManagerProjectDetails> {
    const url = `${BASE_URL}/manager/project/${projectId}/`;

    console.log("🚀 Fetching project details");
    console.log("📍 Full URL:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      console.log("✅ Response received");
      console.log("📊 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(
          `HTTP ${response.status}: ${response.statusText || "Request failed"}`
        );
      }

      const data = await response.json();
      console.log("📦 Project details received:", data);
      return transformManagerProjectDetails(data);
    } catch (error) {
      console.error("💥 Error fetching project details:", error);

      // Provide more specific error messages
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
}

export const managerService = new ManagerService();
