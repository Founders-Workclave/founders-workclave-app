import { getAuthHeaders } from "../utils/auth";
import type { FounderApiResponse, FoundersListResponse } from "@/types/founder";

// Extended Founder type to include founderID
interface Founder {
  id: string;
  founderID?: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  status: string;
  agency?: string;
  firstName: string;
  lastName: string;
  projectsCount: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

interface FetchFoundersOptions {
  page?: number;
  limit?: number;
  search?: string;
}

interface FetchFoundersResult {
  success: boolean;
  message: string;
  founders: Founder[];
  totalPages: number;
  currentPage: number;
  totalFounders: number;
  error?: string;
}

interface ProjectFromAPI {
  id: string;
  name: string;
  description: string;
  progressPercentage: number;
  status: "ongoing" | "paused" | "completed";
  latest_milestone: string | null;
}

interface FounderProjectsResponse {
  message: string;
  founder: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    agency: string | null;
    role: string;
    dateJoined: string;
  };
  projects: ProjectFromAPI[];
}

/**
 * Transform API founder data to UI founder format
 */
const transformFounderData = (apiFounder: FounderApiResponse): Founder => {
  return {
    id: apiFounder.userId, // Use userId for API calls, not founderID
    founderID: apiFounder.founderID, // Keep founderID for reference
    name: `${apiFounder.firstName} ${apiFounder.lastName}`.trim() || "Unknown",
    email: apiFounder.email,
    phone: apiFounder.phone || "N/A",
    joinedDate: formatDate(apiFounder.dateJoined),
    status: apiFounder.active ? "Active" : "Inactive",
    agency: apiFounder.agency || undefined,
    firstName: apiFounder.firstName,
    lastName: apiFounder.lastName,
    projectsCount: 0,
  };
};

/**
 * Format ISO date string to readable format
 */
const formatDate = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

/**
 * Fetch all founders from the API
 */
export const fetchFounders = async (
  options: FetchFoundersOptions = {}
): Promise<FetchFoundersResult> => {
  try {
    const { page = 1, limit = 10, search = "" } = options;

    console.log("🔵 Fetching founders...", { page, limit, search });

    const response = await fetch(`${API_BASE_URL}/superadmin/founders/`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Founders fetch failed:", response.status, errorText);

      return {
        success: false,
        message: `Failed to fetch founders: ${response.status}`,
        founders: [],
        totalPages: 0,
        currentPage: page,
        totalFounders: 0,
        error: errorText,
      };
    }

    const data: FoundersListResponse = await response.json();
    console.log("🟢 Founders fetched successfully:", data);
    console.log("📝 First founder raw data:", data.founders[0]); // Debug: see raw founder structure

    // Transform API data to UI format
    let founders = data.founders.map(transformFounderData);
    console.log("🔄 Transformed founders:", founders.slice(0, 2)); // Debug: see transformed data

    // Apply search filter if provided
    if (search.trim()) {
      const query = search.toLowerCase();
      founders = founders.filter(
        (founder: Founder) =>
          founder.name.toLowerCase().includes(query) ||
          founder.email.toLowerCase().includes(query) ||
          founder.phone.includes(query) ||
          (founder.agency && founder.agency.toLowerCase().includes(query))
      );
    }

    // Calculate pagination
    const totalFounders = founders.length;
    const totalPages = Math.ceil(totalFounders / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFounders = founders.slice(startIndex, endIndex);

    return {
      success: true,
      message: data.message || "Founders fetched successfully",
      founders: paginatedFounders,
      totalPages: totalPages || 1,
      currentPage: page,
      totalFounders,
    };
  } catch (error) {
    console.error("❌ Error fetching founders:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? `Network error: ${error.message}`
          : "An unexpected error occurred",
      founders: [],
      totalPages: 0,
      currentPage: 1,
      totalFounders: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Fetch a single founder by ID with their projects
 */
export const fetchFounderById = async (
  founderId: string
): Promise<{
  success: boolean;
  founder?: Founder;
  projects?: unknown[];
  error?: string;
}> => {
  try {
    console.log("🔵 Fetching founder by ID with projects:", founderId);

    const response = await fetch(
      `${API_BASE_URL}/superadmin/founder/${founderId}/projects/`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch {
        errorText = await response.text();
      }
      console.error("❌ Founder fetch failed:", response.status, errorText);

      // Return error but don't fail completely - we'll use fallback data
      return {
        success: false,
        error: `API Error: ${errorText}`,
      };
    }

    const data: FounderProjectsResponse = await response.json();
    console.log("🟢 Founder with projects fetched:", data);

    // Transform founder data
    const founder: Founder = {
      id: data.founder.id,
      name: `${data.founder.firstName} ${data.founder.lastName}`.trim(),
      email: data.founder.email,
      phone: data.founder.phone || "N/A",
      joinedDate: formatDate(data.founder.dateJoined),
      status: "Active", // You might need to get this from another source
      agency: data.founder.agency || undefined,
      firstName: data.founder.firstName,
      lastName: data.founder.lastName,
      projectsCount: data.projects.length,
    };

    // Transform projects to match UI format
    const projects = data.projects.map((project) => {
      let status: "In-Progress" | "Completed" | "Pending" = "Pending";

      if (project.status === "ongoing") {
        status = "In-Progress";
      } else if (project.status === "completed") {
        status = "Completed";
      } else if (project.status === "paused") {
        status = "Pending";
      }

      return {
        id: project.id, // Keep as string UUID
        title: project.name,
        stage: project.latest_milestone || "Not Started",
        progress: project.progressPercentage,
        status: status,
      };
    });

    console.log("🟢 Transformed projects:", projects);

    return {
      success: true,
      founder,
      projects,
    };
  } catch (error) {
    console.error("❌ Error fetching founder:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Activate a founder account
 */
export const activateFounder = async (
  founderId: string
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    console.log("🔵 Activating founder:", founderId);

    const response = await fetch(
      `${API_BASE_URL}/activate-user/${founderId}/`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Activation failed:", response.status, errorText);

      return {
        success: false,
        message: "Failed to activate founder",
        error: errorText,
      };
    }

    const data = await response.json();
    console.log("🟢 Founder activated successfully:", data);

    return {
      success: true,
      message: data.message || "Founder activated successfully",
    };
  } catch (error) {
    console.error("❌ Error activating founder:", error);

    return {
      success: false,
      message: "Failed to activate founder",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Deactivate a founder account
 */
export const deactivateFounder = async (
  founderId: string
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    console.log("🔵 Deactivating founder:", founderId);

    const response = await fetch(
      `${API_BASE_URL}/deactivate-user/${founderId}/`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Deactivation failed:", response.status, errorText);

      return {
        success: false,
        message: "Failed to deactivate founder",
        error: errorText,
      };
    }

    const data = await response.json();
    console.log("🟢 Founder deactivated successfully:", data);

    return {
      success: true,
      message: data.message || "Founder deactivated successfully",
    };
  } catch (error) {
    console.error("❌ Error deactivating founder:", error);

    return {
      success: false,
      message: "Failed to deactivate founder",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Update founder status (activate/deactivate)
 */
export const updateFounderStatus = async (
  founderId: string,
  active: boolean
): Promise<{ success: boolean; message: string; error?: string }> => {
  if (active) {
    return activateFounder(founderId);
  } else {
    return deactivateFounder(founderId);
  }
};

/**
 * Delete founder
 */
export const deleteFounder = async (
  founderId: string
): Promise<{ success: boolean; message: string; error?: string }> => {
  try {
    console.log("🔵 Deleting founder:", founderId);

    const response = await fetch(
      `${API_BASE_URL}/superadmin/founders/${founderId}/`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Delete failed:", response.status, errorText);

      return {
        success: false,
        message: "Failed to delete founder",
        error: errorText,
      };
    }

    const data = await response.json();
    console.log("🟢 Founder deleted successfully:", data);

    return {
      success: true,
      message: data.message || "Founder deleted successfully",
    };
  } catch (error) {
    console.error("❌ Error deleting founder:", error);

    return {
      success: false,
      message: "Failed to delete founder",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
