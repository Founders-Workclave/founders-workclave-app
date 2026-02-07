import { getAuthToken } from "@/lib/api/auth";
import { ClientsListResponse, ApiErrorResponse } from "@/types/projectApi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const clientService = {
  /**
   * Fetches the list of clients
   */
  async getClientsList(): Promise<ClientsListResponse> {
    try {
      const token = getAuthToken();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/agency/clients-list/`, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to fetch clients" }));
        throw new ApiError(
          errorData.message || errorData.error || "Failed to fetch clients",
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while fetching clients");
    }
  },

  /**
   * Fetches a single client by ID
   */
  async getClientById(
    clientId: string
  ): Promise<ClientsListResponse["clients"][0] | null> {
    try {
      const response = await this.getClientsList();
      const client = response.clients.find((c) => c.clientID === clientId);
      return client || null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while fetching client");
    }
  },
};
