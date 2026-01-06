import { getAuthHeaders } from "@/lib/utils/auth";

export interface PaymentTransaction {
  id: string;
  amount: string;
  payerName: string;
  milestoneName: string;
  projectName: string;
  paymentDate: string;
  paymentChannel: string;
}

interface PaymentHistoryResponse {
  message: string;
  projectValue: string;
  paid: string;
  remaining: string;
  paymentHistory: PaymentTransaction[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class PaymentService {
  /**
   * Fetch payment history for a specific project
   * @param projectId - The project ID
   * @returns Promise with payment data
   */
  static async getPaymentHistory(
    projectId: string
  ): Promise<PaymentHistoryResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/founder/project/${projectId}/payment-history/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch payment history: ${response.statusText}`
        );
      }

      const data: PaymentHistoryResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error in getPaymentHistory:", error);
      throw error;
    }
  }

  /**
   * Parse amount string to number
   * @param amountStr - Amount as string (e.g., "500.000")
   * @returns Parsed number
   */
  static parseAmount(amountStr: string): number {
    return parseFloat(amountStr.replace(/,/g, ""));
  }

  /**
   * Format date to readable format
   * @param dateStr - ISO date string
   * @returns Formatted date
   */
  static formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}
