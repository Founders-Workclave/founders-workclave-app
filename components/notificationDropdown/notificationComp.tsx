"use client";
import NotificationsDropdown from "./index";
import { useNotifications } from "@/hooks/useNotification";
import { useState } from "react";
import { getAuthToken } from "@/lib/api/auth";

export default function HeaderNotification() {
  const [token] = useState<string | undefined>(
    () => getAuthToken() ?? undefined
  );

  const { notifications, markAsRead, markAllAsRead } = useNotifications({
    autoFetch: true,
    token,
  });

  return (
    <NotificationsDropdown
      notifications={notifications}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
    />
  );
}
