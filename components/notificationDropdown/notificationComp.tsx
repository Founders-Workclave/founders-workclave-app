"use client";
import NotificationsDropdown from "./index";
import { useNotifications } from "@/hooks/useNotification";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function HeaderNotification() {
  const { notifications, error, markAsRead, markAllAsRead } = useNotifications({
    autoFetch: true,
    refetchInterval: 30000,
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
