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

  // ------------------------------------------------------------------
  // Unlock AudioContext on first user gesture (iOS requirement).
  // Must happen in the same call stack as a tap/click.
  // ------------------------------------------------------------------
  const unlockAudio = useCallback(() => {
    if (audioUnlockedRef.current) return;
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
      // Play a zero-length silent buffer — this is what unlocks iOS audio
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

  // ------------------------------------------------------------------
  // Request permission — must be called from a user gesture (button tap).
  // Do NOT call this automatically in a useEffect on iOS.
  // ------------------------------------------------------------------
  const requestPermission =
    useCallback(async (): Promise<IOSNotificationPermission> => {
      if (permission === "unsupported") return "unsupported";
      if (permission === "granted") return "granted";

      // Unlock audio at the same time since we're inside a gesture
      unlockAudio();

      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
      } catch (err) {
        console.warn("Could not request notification permission:", err);
        return "denied";
      }
    }, [permission, unlockAudio]);

  // ------------------------------------------------------------------
  // Play chime — separated from notification permission so it works
  // even when the Notification API is unsupported (regular iOS Safari).
  // ------------------------------------------------------------------
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

      // iOS suspends AudioContext when the tab goes to background
      if (ctx.state === "suspended") {
        ctx.resume().then(fire);
      } else {
        fire();
      }
    } catch (err) {
      console.warn("Could not play notification sound:", err);
    }
  }, []);

  // ------------------------------------------------------------------
  // Main notify — plays sound always, shows popup only when allowed
  // ------------------------------------------------------------------
  const notify = useCallback(
    (
      title: string,
      options?: { body?: string; icon?: string; url?: string }
    ) => {
      // Always attempt sound — it works independently of notification permission
      playSound();

      if (permission === "unsupported" || permission !== "granted") return;
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

  return {
    notify,
    playSound,
    requestPermission,
    permission,
    isSupported: permission !== "unsupported",
  };
}
