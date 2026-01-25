// api/client.ts
import { getAuthToken } from "../api/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>;
  headers?: HeadersInit;
}

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/+$/, ""); // Remove trailing slash
  }

  private buildURL(endpoint: string, params?: Record<string, string | number>) {
    const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, ""); // Clean endpoint
    let url = `${this.baseURL}/${cleanEndpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) =>
        searchParams.append(k, String(v))
      );
      const query = searchParams.toString();
      if (query) url += `?${query}`;
    }

    return url;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    const data: unknown = isJson
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const error: ApiError = {
        message:
          isJson &&
          typeof data === "object" &&
          data !== null &&
          "message" in data
            ? (data as { message: string }).message
            : `Request failed with status ${response.status}`,
        status: response.status,
        data,
      };

      console.error("❌ API Error:", {
        status: response.status,
        url: response.url,
        data,
      });
      throw error;
    }

    console.log("✅ API Response:", {
      status: response.status,
      url: response.url,
    });
    return data as T;
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    console.log("🚀 GET:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { ...this.getHeaders(), ...options?.headers },
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    console.log("🚀 POST:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { ...this.getHeaders(), ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    console.log("🚀 PUT:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: { ...this.getHeaders(), ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    console.log("🚀 DELETE:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: { ...this.getHeaders(), ...options?.headers },
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    console.log("🚀 PATCH:", url);

    const response = await fetch(url, {
      method: "PATCH",
      headers: { ...this.getHeaders(), ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(BASE_URL);
