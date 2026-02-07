import {
  getAuthToken,
  handleSessionTimeout,
  isAuthError,
} from "@/lib/api/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

// Type definitions
export interface Payment {
  id: string;
  transactionID: string;
  projectName: string;
  clientName: string;
  amount: string;
  percentagePaid: number;
  paymentDate: string;
  progressPercentage: number;
  status: "ongoing" | "completed" | "pending";
}

export interface PaymentsResponse {
  message: string;
  paymentHistory: Payment[];
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const paymentService = {
  /**
   * Fetches the list of all payments
   */
  async getPayments(): Promise<PaymentsResponse> {
    try {
      const token = getAuthToken();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/agency/payments/`, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to fetch payments" }));

        // Handle authentication errors
        if (isAuthError(response.status)) {
          handleSessionTimeout();
          throw new ApiError(
            "Session expired. Please log in again.",
            response.status,
            errorData
          );
        }

        throw new ApiError(
          errorData.message || errorData.error || "Failed to fetch payments",
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

      throw new ApiError("An unknown error occurred while fetching payments");
    }
  },

  /**
   * Fetches a single payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment | null> {
    try {
      const response = await this.getPayments();
      const payment = response.paymentHistory.find((p) => p.id === paymentId);
      return payment || null;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while fetching payment");
    }
  },

  /**
   * Filters payments by status
   */
  async getPaymentsByStatus(status: Payment["status"]): Promise<Payment[]> {
    try {
      const response = await this.getPayments();
      return response.paymentHistory.filter((p) => p.status === status);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while filtering payments");
    }
  },

  /**
   * Filters payments by project name
   */
  async getPaymentsByProject(projectName: string): Promise<Payment[]> {
    try {
      const response = await this.getPayments();
      return response.paymentHistory.filter(
        (p) => p.projectName.toLowerCase() === projectName.toLowerCase()
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError(
        "An unknown error occurred while filtering payments by project"
      );
    }
  },
};
