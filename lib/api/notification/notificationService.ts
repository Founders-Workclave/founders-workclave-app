import { getAuthToken } from "@/lib/api/auth";
import {
  MarkAsReadResponse,
  Notification,
  mapApiNotificationToComponent,
} from "@/types/notification";

/**
 * Notification Service (Workaround version)
 * Works around the API client stripping trailing slashes
 */

export const notificationService = {
  /**
   * Fetch all notifications for the logged-in user
   * @returns Promise<Notification[]>
   */
  async getNotifications(): Promise<Notification[]> {
    try {
      // Use a custom fetch to preserve trailing slash
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";
      const url = `${baseUrl}/notification/`;

      const token = getAuthToken();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await response.json();

      // Map API response to component format
      return data.map(mapApiNotificationToComponent);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      throw error;
    }
  },

  /**
   * Mark a specific notification as read
   * Workaround: Manually builds URL to preserve trailing slash
   * @param id - Notification ID
   * @returns Promise<MarkAsReadResponse>
   */
  async markAsRead(id: string): Promise<MarkAsReadResponse> {
    try {
      // Workaround: Use fetch directly to preserve trailing slash
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";
      const url = `${baseUrl}/notification/${id}/mark-read/`;

      const token = getAuthToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to mark as read: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   * @param notificationIds - Array of notification IDs to mark as read
   * @returns Promise<void>
   */
  async markAllAsRead(notificationIds: string[]): Promise<void> {
    try {
      // Execute all requests in parallel
      await Promise.all(notificationIds.map((id) => this.markAsRead(id)));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },
};

export default notificationService;
