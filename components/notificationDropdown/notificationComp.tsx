"use client";
import NotificationsDropdown from "./index";
import { useNotifications } from "@/hooks/useNotification";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAuthToken } from "@/lib/api/auth";

export default function HeaderNotification() {
  const [token] = useState<string | undefined>(
    () => getAuthToken() ?? undefined
  );

  const { notifications, error, markAsRead, markAllAsRead } = useNotifications({
    autoFetch: true,
    token,
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <NotificationsDropdown
      notifications={notifications}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
    />
  );
}
