import { Project, ApiProject } from "@/types/project";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://foundersapi.up.railway.app";

/**
 * Transform API project response to frontend Project type
 */
function transformProject(apiProject: ApiProject): Project {
  // Determine and format status properly
  let status: string = "Pending";

  if (apiProject.completed) {
    status = "Completed";
  } else if (apiProject.status) {
    const statusLower = apiProject.status.toLowerCase();

    // Map API status to display status
    switch (statusLower) {
      case "terminated":
        status = "Terminated";
        break;
      case "paused":
        status = "Paused";
        break;
      case "in-progress":
      case "in progress":
      case "active":
        status = "In-Progress";
        break;
      case "completed":
      case "done":
        status = "Completed";
        break;
      case "pending":
        status = "Pending";
        break;
      default:
        // Capitalize first letter of each word
        status = apiProject.status
          .split(/[\s-_]+/)
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join("-");
    }
  } else if (apiProject.progressPercentage > 0) {
    status = "In-Progress";
  }

  // Handle product_manager - it can be ProductManager object or undefined
  const projectManager =
    typeof apiProject.product_manager === "object" && apiProject.product_manager
      ? apiProject.product_manager.name || "Unassigned"
      : typeof apiProject.product_manager === "string"
      ? apiProject.product_manager
      : "Unassigned";

  return {
    id: apiProject.id,
    founder: apiProject.founder || "",
    name: apiProject.name,
    description: apiProject.description,
    dateCreated: apiProject.dateCreated || apiProject.created_at || "",
    projectManager: projectManager,
    dueDate: apiProject.due_date ?? null,
    updatedDate: apiProject.updated_at || apiProject.dateCreated || "",
    projectValue: apiProject.projectValue || "0",
    paidBalance: apiProject.paidBalance || "0",
    status: status,
    progressPercentage: apiProject.progressPercentage || 0,
    completed: apiProject.completed || false,
    totalMilestone: apiProject.totalMilestone || 0,
    completedMilestone: apiProject.completedMilestone || 0,
    projectFeatures: apiProject.projectFeatures || [],
    latestMilestone: apiProject.latest_milestone,
  };
}
/**
 * Refreshes the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      const newAccessToken = data.access;
      localStorage.setItem("access_token", newAccessToken);
      return newAccessToken;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
  }

  return null;
}

/**
 * Makes an authenticated API request with automatic token refresh
 */
async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      throw new Error("Authentication failed. Please log in again.");
    }

    // Retry request with new token
    const retryResponse = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
        ...options.headers,
      },
      cache: "no-store",
    });

    if (!retryResponse.ok) {
      throw new Error(
        `API Error: ${retryResponse.status} ${retryResponse.statusText}`
      );
    }

    return retryResponse;
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response;
}

export class ProjectService {
  /**
   * Fetches all projects for the logged-in user
   */
  static async getUserProjects(): Promise<Project[]> {
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/founder/projects/`
      );

      const data = await response.json();

      // Extract projects array from various possible response structures
      let projectsArray: ApiProject[] = [];

      if (Array.isArray(data)) {
        projectsArray = data;
      } else if (data.projects && Array.isArray(data.projects)) {
        projectsArray = data.projects;
      } else if (data.data && Array.isArray(data.data)) {
        projectsArray = data.data;
      } else if (data.results && Array.isArray(data.results)) {
        projectsArray = data.results;
      } else {
        console.warn("Unexpected API response format:", data);
        return [];
      }

      return projectsArray.map(transformProject);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      throw error;
    }
  }

  /**
   * Fetches a single project by ID
   */
  static async getProjectById(projectId: string): Promise<Project> {
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/founder/project/${projectId}/`
      );

      const data = await response.json();

      // Extract project from response
      let apiProject: ApiProject;

      if (data.project) {
        apiProject = data.project;
      } else if (data.data) {
        apiProject = data.data;
      } else {
        apiProject = data;
      }

      return transformProject(apiProject);
    } catch (error) {
      console.error("Failed to fetch project:", error);
      throw error;
    }
  }

  /**
   * Pause a project
   * @param projectId - The project ID
   * @returns Promise with response message
   */
  static async pauseProject(projectId: string): Promise<{ message: string }> {
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/founder/pause/project/${projectId}/`,
        {
          method: "POST",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in pauseProject:", error);
      throw error;
    }
  }

  /**
   * Terminate a project
   * @param projectId - The project ID
   * @returns Promise with response message
   */
  static async terminateProject(
    projectId: string
  ): Promise<{ message: string }> {
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/founder/terminate/project/${projectId}/`,
        {
          method: "POST",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in terminateProject:", error);
      throw error;
    }
  }
}
