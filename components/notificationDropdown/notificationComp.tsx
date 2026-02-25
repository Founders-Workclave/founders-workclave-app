"use client";
import NotificationsDropdown from "./index";
import { useNotifications } from "@/hooks/useNotification";
import { useBrowserNotifications } from "@/hooks/useBrowserNotifications";
import { useState } from "react";
import { getAuthToken } from "@/lib/api/auth";

export default function HeaderNotification() {
  const [token] = useState<string | undefined>(
    () => getAuthToken() ?? undefined
  );

  const { requestPermission, permission, isSupported } =
    useBrowserNotifications();

  const { notifications, markAsRead, markAllAsRead } = useNotifications({
    autoFetch: true,
    token,
  });

  return (
    <div>
      {/* {!isSupported && (
        <p style={{ fontSize: "0.75rem", padding: "8px 16px", color: "#888" }}>
          To receive notifications on iOS, tap{" "}
          <strong>Share → Add to Home Screen</strong> and reopen the app.
        </p>
      )} */}

      {isSupported && permission !== "granted" && (
        <button
          onClick={requestPermission}
          style={{
            fontSize: "0.75rem",
            padding: "8px 16px",
            background: "none",
            border: "none",
            color: "#3b82f6",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Enable Notifications
        </button>
      )}

      <NotificationsDropdown
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    </div>
  );
}
