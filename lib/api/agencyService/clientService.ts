import {
  ClientsListResponse,
  ClientProjectsResponse,
  ApiClient, // Import from the same place as the other types
} from "@/types/agencyClients";
import { getAuthToken } from "@/lib/api/auth";

const API_BASE_URL = "https://foundersapi.up.railway.app";

export class ClientServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ClientServiceError";
  }
}

export async function fetchClientsList(): Promise<ClientsListResponse> {
  try {
    const token = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/agency/clients-dashboard/`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new ClientServiceError(
          "Unauthorized: Please log in to access clients",
          401
        );
      }
      throw new ClientServiceError(
        `Failed to fetch clients: ${response.statusText}`,
        response.status
      );
    }

    const data: ClientsListResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ClientServiceError) {
      throw error;
    }
    throw new ClientServiceError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function fetchClientById(
  clientId: string
): Promise<ApiClient | null> {
  try {
    const response = await fetchClientsList();
    const client = response.clients.find(
      (c) => c.id === clientId || c.clientID === clientId
    );
    return client || null;
  } catch (error) {
    throw error;
  }
}

export async function fetchClientProjects(
  clientID: string
): Promise<ClientProjectsResponse> {
  try {
    const token = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/agency/client/${clientID}/projects/`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new ClientServiceError(
          "Unauthorized: Please log in to access projects",
          401
        );
      }
      throw new ClientServiceError(
        `Failed to fetch projects: ${response.statusText}`,
        response.status
      );
    }

    const data: ClientProjectsResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ClientServiceError) {
      throw error;
    }
    throw new ClientServiceError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
