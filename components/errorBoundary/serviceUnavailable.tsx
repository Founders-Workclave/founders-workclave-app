"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";

interface ServiceUnavailableProps {
  message?: string;
  title?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  minimal?: boolean;
}

export default function ServiceUnavailable({
  message,
  title,
  showRetry = false,
  onRetry,
  minimal = false,
}: ServiceUnavailableProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    await new Promise((r) => setTimeout(r, 800));
    onRetry();
    setIsRetrying(false);
  };

  if (minimal) {
    return (
      <div className={styles.minimal}>
        <span className={styles.minimalDot} />
        <p className={styles.minimalText}>
          {message ?? "Unable to load. Please try again later."}
        </p>
        {showRetry && onRetry && (
          <button
            className={styles.minimalRetry}
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h3 className={styles.title}>{title ?? "Service Unavailable"}</h3>

        <p className={styles.message}>
          {message ??
            "We're having trouble loading this content. Our team has been notified and is working on a fix."}
        </p>

        {showRetry && onRetry && (
          <button
            className={styles.retryButton}
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <span className={styles.spinner} />
                Retrying...
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Try Again
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
