"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Notification,
  NotificationApiResponse,
  mapApiNotificationToComponent,
} from "@/types/notification";
import notificationService from "@/lib/api/notification/notificationService";
import { useBrowserNotifications } from "./useBrowserNotifications";

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
  token?: string;
}

export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const { autoFetch = true, token } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { notify } = useBrowserNotifications();
  const seenIdsRef = useRef<Set<string>>(new Set());
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications();
      // Filter out any notifications with undefined/null ids
      const valid = data.filter((n) => n.id != null);
      setNotifications(valid);
      valid.forEach((n) => seenIdsRef.current.add(n.id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch notifications";
      setError(errorMessage);
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleIncomingNotification = useCallback(
    (notification: Notification) => {
      // Guard: skip if no valid id
      if (!notification.id) return;

      setNotifications((prev) => {
        const exists = prev.find((n) => n.id === notification.id);
        if (exists) return prev;
        return [notification, ...prev];
      });

      if (!seenIdsRef.current.has(notification.id)) {
        seenIdsRef.current.add(notification.id);
        if (!notification.isRead) {
          notify(notification.title ?? "New notification", {
            body: notification.description ?? "",
            url: notification.link ?? "/",
          });
        }
      }
    },
    [notify]
  );

  const connectWebSocket = useCallback(() => {
    if (!token) return;

    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    console.log("🔌 Connecting WebSocket...");

    const ws = new WebSocket(
      `wss://foundersapi.up.railway.app/ws/notifications/?token=${token}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Notification WebSocket connected");
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const raw = JSON.parse(event.data as string) as Record<string, unknown>;

        // The WS might send { notification: {...} } or the object directly
        // It also sends in API format (is_read, created_at) so we must map it
        const payload = (raw.notification ?? raw) as NotificationApiResponse;

        // Only process if it looks like a valid notification
        if (!payload.id) {
          console.warn("Received WS message without id, skipping:", payload);
          return;
        }

        const notification = mapApiNotificationToComponent(payload);
        handleIncomingNotification(notification);
      } catch (err) {
        console.error("Failed to parse notification WS message:", err);
      }
    };

    ws.onerror = () => {
      console.error("❌ Notification WebSocket error");
    };

    ws.onclose = (event: CloseEvent) => {
      console.log("🔴 WebSocket closed:", event.code);
      wsRef.current = null;
      if (event.code !== 1000) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      }
    };
  }, [token, handleIncomingNotification]);

  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [autoFetch, fetchNotifications]);

  useEffect(() => {
    if (!token) return;

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close(1000, "Component unmounted");
        wsRef.current = null;
      }
    };
  }, [token, connectWebSocket]);

  const markAsRead = useCallback(async (id: string) => {
    // Guard: don't call API with undefined id
    if (!id) return;
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      await notificationService.markAsRead(id);
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read";
      setError(errorMessage);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // Guard: filter out any undefined ids before calling API
      const unreadIds = notifications
        .filter((n) => !n.isRead && n.id != null)
        .map((n) => n.id);

      if (unreadIds.length === 0) return;

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await notificationService.markAllAsRead(unreadIds);
    } catch (err) {
      await fetchNotifications();
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read";
      setError(errorMessage);
      throw err;
    }
  }, [notifications, fetchNotifications]);

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
