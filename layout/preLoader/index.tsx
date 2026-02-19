"use client";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";

type PreloaderStyle = "bars" | "dots" | "spinner" | "progress" | "logo";

interface PreloaderProps {
  style?: PreloaderStyle;
  duration?: number; // milliseconds
}

export default function Preloader({
  style = "bars",
  duration = 2000,
}: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Hide preloader after duration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration]);

  if (!isLoading) return null;

  const renderPreloader = () => {
    switch (style) {
      case "bars":
        return (
          <div className={styles.barsContainer}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={styles.bar}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case "dots":
        return (
          <div className={styles.dotsContainer}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={styles.dot}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );

      case "spinner":
        return (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}>
              <div className={styles.spinnerInner}></div>
            </div>
          </div>
        );

      case "progress":
        return (
          <div className={styles.progressContainer}>
            <div className={styles.logoText}>LANDZILLE</div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className={styles.progressText}>
              {Math.min(Math.round(progress), 100)}%
            </div>
          </div>
        );

      case "logo":
        return (
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoL}>L</div>
              <div className={styles.logoCircle}></div>
            </div>
            <div className={styles.logoSubtext}>Loading your future...</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${styles.preloader} ${!isLoading ? styles.fadeOut : ""}`}>
      {renderPreloader()}
    </div>
  );
}
