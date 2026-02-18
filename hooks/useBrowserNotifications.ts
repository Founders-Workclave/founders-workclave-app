import { useEffect, useCallback, useRef } from "react";

export function useBrowserNotifications() {
  const permissionRef = useRef<NotificationPermission>("default");

  useEffect(() => {
    if (!("Notification" in window)) return;
    permissionRef.current = Notification.permission;

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        permissionRef.current = permission;
      });
    }
  }, []);

  const notify = useCallback(
    (
      title: string,
      options?: { body?: string; icon?: string; url?: string }
    ) => {
      if (!("Notification" in window)) return;
      if (permissionRef.current !== "granted") return;
      if (document.visibilityState === "visible") return;

      const notification = new Notification(title, {
        body: options?.body,
        icon: options?.icon || "/favicon.ico",
        tag: "app-notification",
        renotify: true,
      } as NotificationOptions & { renotify: boolean });

      notification.onclick = () => {
        window.focus();
        if (options?.url) window.location.href = options.url;
        notification.close();
      };
    },
    []
  );

  return { notify };
}
