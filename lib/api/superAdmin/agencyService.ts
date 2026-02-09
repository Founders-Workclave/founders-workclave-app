import { getAuthToken } from "@/lib/api/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Get all agencies (for superadmin)
 */
export async function getAllAgencies() {
  try {
    const token = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/superadmin/agencies/`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch agencies" }));

      throw new ApiError(
        errorData.message || errorData.error || "Failed to fetch agencies",
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

    throw new ApiError("An unknown error occurred while fetching agencies");
  }
}

/**
 * Get projects for a specific agency (for superadmin)
 */
export async function getAgencyProjects(agencyId: string) {
  try {
    const token = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/superadmin/agency/${agencyId}/projects/`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch projects" }));

      throw new ApiError(
        errorData.message || errorData.error || "Failed to fetch projects",
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

    throw new ApiError("An unknown error occurred while fetching projects");
  }
}

/**
 * Get clients for a specific agency (for superadmin)
 */
export async function getAgencyClients(agencyId: string) {
  try {
    const token = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/superadmin/agency/${agencyId}/clients/`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch clients" }));

      throw new ApiError(
        errorData.message || errorData.error || "Failed to fetch clients",
        response.status,
        errorData
      );
    }

    const data = await response.json();

    // Validate response structure - API returns clientList, not clients
    if (!data || !data.clientList || !Array.isArray(data.clientList)) {
      console.error("API returned unexpected structure:", data);
      throw new ApiError(
        "Invalid response structure from server",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(`Network error: ${error.message}`);
    }

    throw new ApiError("An unknown error occurred while fetching clients");
  }
}

/**
 * Get managers for a specific agency (for superadmin)
 */
export async function getAgencyManagers(agencyId: string) {
  try {
    const token = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/superadmin/agency/${agencyId}/managers/`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch managers" }));

      throw new ApiError(
        errorData.message || errorData.error || "Failed to fetch managers",
        response.status,
        errorData
      );
    }

    const data = await response.json();

    // Validate response structure - API returns managerList, not managers
    if (!data || !data.managerList || !Array.isArray(data.managerList)) {
      console.error("API returned unexpected structure:", data);
      throw new ApiError(
        "Invalid response structure from server",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(`Network error: ${error.message}`);
    }

    throw new ApiError("An unknown error occurred while fetching managers");
  }
}
