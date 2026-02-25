/* eslint-disable react-hooks/set-state-in-effect */
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

  const unlockAudio = useCallback(() => {
    if (audioUnlockedRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioRef.current) audioRef.current = new AudioCtx();

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
  }, []);

  useEffect(() => {
    window.addEventListener("touchstart", unlockAudio, { once: true });
    window.addEventListener("mousedown", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("mousedown", unlockAudio);
    };
  }, [unlockAudio]);

  // Also sync permission if another instance updated it
  useEffect(() => {
    if (permission === "unsupported") return;
    const live = Notification.permission;
    if (live !== permission) setPermission(live);
  }, [permission]);

  const requestPermission =
    useCallback(async (): Promise<IOSNotificationPermission> => {
      if (!("Notification" in window)) return "unsupported";
      if (Notification.permission === "granted") return "granted";

      unlockAudio();

      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
      } catch (err) {
        console.warn("Could not request notification permission:", err);
        return "denied";
      }
    }, [unlockAudio]);

  const playSound = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioRef.current) audioRef.current = new AudioCtx();

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
      const livePermission: IOSNotificationPermission = !(
        "Notification" in window
      )
        ? "unsupported"
        : Notification.permission;

      playSound();

      if (livePermission !== "granted") return;
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
    [playSound]
  );

  return {
    notify,
    playSound,
    requestPermission,
    permission,
    isSupported: permission !== "unsupported",
  };
}
