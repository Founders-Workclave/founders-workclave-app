"use client";
import { useState } from "react";
import notificationsData from "../../mocks/notifications.json";
import NotificationsDropdown from "./index";
import { Notification } from "./index";

export default function HeaderNotification() {
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationsData.notifications as Notification[]
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <NotificationsDropdown
      notifications={notifications}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
    />
  );
}
