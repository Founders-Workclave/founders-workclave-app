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
  const intentionalCloseRef = useRef<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications();
      const valid = data.filter((n) => n.id != null);
      setNotifications(valid);
      valid.forEach((n) => seenIdsRef.current.add(n.id));
    } catch (err) {
      console.warn("Background fetch: notifications unavailable", err);
      setError("service_unavailable");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleIncomingNotification = useCallback(
    (notification: Notification) => {
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

    intentionalCloseRef.current = false;

    const ws = new WebSocket(
      `wss://foundersapi.up.railway.app/ws/notifications/?token=${token}`
    );
    wsRef.current = ws;

    ws.onopen = () => {};

    ws.onmessage = (event: MessageEvent) => {
      try {
        const raw = JSON.parse(event.data as string) as Record<string, unknown>;
        const inner = (raw.message ?? raw) as Record<string, unknown>;
        const payload = (inner.notification ??
          inner) as NotificationApiResponse;

        if (!payload.id) return;

        const notification = mapApiNotificationToComponent(payload);
        handleIncomingNotification(notification);
      } catch (err) {
        console.error("❌ Failed to parse WS message:", err);
      }
    };

    // onerror always fires before onclose and gives no useful info beyond
    // "something went wrong" — onclose has the code and reason, so we
    // handle everything there and silence onerror entirely.
    ws.onerror = () => {};

    ws.onclose = (event: CloseEvent) => {
      wsRef.current = null;

      if (intentionalCloseRef.current) {
        // Closed by us (unmount / navigation / Fast Refresh) — do nothing
        return;
      }

      if (event.code !== 1000) {
        // Unexpected disconnect — log once and schedule reconnect
        console.warn(
          `⚠️ Notification WebSocket closed unexpectedly (code ${event.code}). Reconnecting in 5s...`
        );
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
      intentionalCloseRef.current = true;

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
      console.warn("Failed to mark notification as read:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = notifications
        .filter((n) => !n.isRead && n.id != null)
        .map((n) => n.id);

      if (unreadIds.length === 0) return;

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await notificationService.markAllAsRead(unreadIds);
    } catch (err) {
      await fetchNotifications();
      console.warn("Failed to mark all notifications as read:", err);
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
