import { useEffect, useCallback, useRef, useState } from "react";

type IOSNotificationPermission = NotificationPermission | "unsupported";

function getInitialPermission(): IOSNotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export function useBrowserNotifications() {
  const [permission, setPermission] =
    useState<IOSNotificationPermission>(getInitialPermission);
  const audioRef = useRef<AudioContext | null>(null);
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    const unlock = () => {
      try {
        if (audioUnlockedRef.current) return;
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioCtx) return;

        if (!audioRef.current) {
          audioRef.current = new AudioCtx();
        }
        const ctx = audioRef.current;
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        ctx.resume().then(() => {
          audioUnlockedRef.current = true;
        });
      } catch {
        // ignore
      }
    };

    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("mousedown", unlock, { once: true });
    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("mousedown", unlock);
    };
  }, []);

  useEffect(() => {
    if (permission === "unsupported") {
      console.warn(
        "Notifications not supported. On iOS, add the app to your Home Screen to enable them."
      );
      return;
    }

    // Only request if still in the default/undecided state
    if (permission === "default") {
      Notification.requestPermission().then((p) => setPermission(p));
    }
  }, [permission]);

  const playSound = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioCtx) return;
      if (!audioRef.current) {
        audioRef.current = new AudioCtx();
      }

      const ctx = audioRef.current;

      const fire = () => {
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
          gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + duration
          );
          oscillator.start(startTime);
          oscillator.stop(startTime + duration);
        };

        const now = ctx.currentTime;
        playTone(880, now, 0.3, 0.3);
        playTone(1100, now + 0.15, 0.4, 0.2);
      };

      if (ctx.state === "suspended") {
        ctx.resume().then(fire);
      } else {
        fire();
      }
    } catch (err) {
      console.warn("Could not play notification sound:", err);
    }
  }, []);

  const notify = useCallback(
    (
      title: string,
      options?: { body?: string; icon?: string; url?: string }
    ) => {
      if (permission === "unsupported") {
        console.warn(
          "Push notifications are not supported in this browser. " +
            "On iOS, install the app to your Home Screen and reopen it."
        );
        return;
      }

      if (permission !== "granted") {
        console.warn("Notification permission not granted:", permission);
        return;
      }

      playSound();

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
    [permission, playSound]
  );

  return { notify, isSupported: permission !== "unsupported", permission };
}
