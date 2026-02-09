"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { clearAuth } from "@/lib/api/auth";
import Logout from "@/svgs/logout";

interface LogoutButtonProps {
  variant?: "button" | "menu-item" | "icon-only";
  onLogoutStart?: () => void;
  onLogoutComplete?: () => void;
  redirectTo?: string;
  showConfirmation?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "button",
  onLogoutStart,
  onLogoutComplete,
  redirectTo = "/login",
  showConfirmation = false,
}) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call the onLogoutStart callback if provided
      if (onLogoutStart) {
        onLogoutStart();
      }

      console.log("🚪 Logging out user...");

      // Clear all authentication data
      clearAuth();

      if (typeof window !== "undefined") {
        // Clear localStorage items
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        // Clear sessionStorage
        sessionStorage.clear();

        // Dispatch custom logout event for other components to listen
        window.dispatchEvent(new CustomEvent("userLoggedOut"));
      }

      console.log("✅ User logged out successfully");

      if (onLogoutComplete) {
        onLogoutComplete();
      }

      // Small delay to ensure cleanup is complete
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Redirect to login page
      router.push(redirectTo);
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    } catch (error) {
      console.error("❌ Error during logout:", error);

      router.push(redirectTo);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleClick = () => {
    if (showConfirmation) {
      setShowConfirmModal(true);
    } else {
      handleLogout();
    }
  };

  const handleConfirmLogout = () => {
    setShowConfirmModal(false);
    handleLogout();
  };

  const handleCancelLogout = () => {
    setShowConfirmModal(false);
  };

  if (variant === "icon-only") {
    return (
      <>
        <button
          onClick={handleClick}
          className={`${styles.logoutButton} ${styles.iconOnly}`}
          disabled={isLoggingOut}
          title="Logout"
          aria-label="Logout"
        >
          {isLoggingOut ? (
            <svg
              className={styles.spinner}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" opacity="0.25" />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                opacity="0.75"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          )}
        </button>

        {showConfirmModal && (
          <ConfirmationModal
            onConfirm={handleConfirmLogout}
            onCancel={handleCancelLogout}
          />
        )}
      </>
    );
  }

  // Menu item variant
  if (variant === "menu-item") {
    return (
      <>
        <button
          onClick={handleClick}
          className={`${styles.logoutButton} ${styles.menuItem}`}
          disabled={isLoggingOut}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>

        {showConfirmModal && (
          <ConfirmationModal
            onConfirm={handleConfirmLogout}
            onCancel={handleCancelLogout}
          />
        )}
      </>
    );
  }

  // Default button variant
  return (
    <>
      <button
        onClick={handleClick}
        className={`${styles.logoutButton} ${styles.defaultButton}`}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <>
            <svg
              className={styles.spinner}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" opacity="0.25" />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                opacity="0.75"
                strokeLinecap="round"
              />
            </svg>
            <span className={styles.logoutText}>Logging out...</span>
          </>
        ) : (
          <>
            <Logout />
          </>
        )}
      </button>

      {showConfirmModal && (
        <ConfirmationModal
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </>
  );
};

// Confirmation Modal Component
const ConfirmationModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalIcon}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        <h3 className={styles.modalTitle}>Confirm Logout</h3>
        <p className={styles.modalMessage}>
          Are you sure you want to logout? You&apos;ll need to sign in again to
          access your account.
        </p>

        <div className={styles.modalActions}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutButton;
