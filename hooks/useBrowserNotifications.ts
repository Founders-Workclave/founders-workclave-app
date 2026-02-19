import { useEffect, useCallback, useRef } from "react";

export function useBrowserNotifications() {
  const permissionRef = useRef<NotificationPermission>("default");
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!("Notification" in window)) return;
    permissionRef.current = Notification.permission;

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        permissionRef.current = permission;
      });
    }
  }, []);

  const playSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      }

      const ctx = audioRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }s
      const playTone = (
        frequency: number,
        startTime: number,
        duration: number,
        gain: number
      ) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startTime);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playTone(880, now, 0.3, 0.3); // A5 - first chime
      playTone(1100, now + 0.15, 0.4, 0.2); // C#6 - second chime
    } catch (err) {
      console.warn("Could not play notification sound:", err);
    }
  }, []);

  const notify = useCallback(
    (
      title: string,
      options?: { body?: string; icon?: string; url?: string }
    ) => {
      if (!("Notification" in window)) return;
      if (permissionRef.current !== "granted") return;
      if (document.visibilityState === "visible") {
        // Still play sound even when tab is visible
        playSound();
        return;
      }

      playSound();

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
    [playSound]
  );

  return { notify };
}
