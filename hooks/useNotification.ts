"use client";
import { useState, useEffect, useCallback } from "react";
import { Notification } from "@/types/notification";
import notificationService from "@/lib/api/notification/notificationService";

interface UseNotificationsReturn {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

interface UseNotificationsOptions {
  autoFetch?: boolean;
  refetchInterval?: number;
}

/**
 * Custom hook to manage notifications
 * @param options - Configuration options
 * @returns Notification state and actions
 */
export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const { autoFetch = true, refetchInterval } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch notifications";
      setError(errorMessage);
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mark a single notification as read
   */
  const markAsRead = useCallback(async (id: string) => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );

      // Call API
      await notificationService.markAsRead(id);
    } catch (err) {
      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read";
      setError(errorMessage);
      console.error("Error marking notification as read:", err);
      throw err;
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);

      if (unreadIds.length === 0) {
        return;
      }

      // Optimistically update UI
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      // Call API
      await notificationService.markAllAsRead(unreadIds);
    } catch (err) {
      // Refetch to get correct state on error
      await fetchNotifications();

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read";
      setError(errorMessage);
      console.error("Error marking all notifications as read:", err);
      throw err;
    }
  }, [notifications, fetchNotifications]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [autoFetch, fetchNotifications]);

  /**
   * Set up polling if refetchInterval is provided
   */
  useEffect(() => {
    if (!refetchInterval) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, refetchInterval);

    return () => clearInterval(intervalId);
  }, [refetchInterval, fetchNotifications]);

  return {
    notifications,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}

export default useNotifications;
