"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import {
  passwordService,
  ApiError,
  PasswordChangeRequest,
} from "@/lib/api/passwordService";

interface PasswordChangeComponentProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PasswordChangeComponent: React.FC<PasswordChangeComponentProps> = ({
  onSuccess,
  onError,
}) => {
  const [passwords, setPasswords] = useState<PasswordChangeRequest>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handlePasswordChange = (
    field: keyof PasswordChangeRequest,
    value: string
  ) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccessMessage(null);
    setValidationErrors([]);
  };

  const hasPasswordChanges = (): boolean => {
    return (
      passwords.currentPassword.trim() !== "" &&
      passwords.newPassword.trim() !== "" &&
      passwords.confirmPassword.trim() !== ""
    );
  };

  const validateForm = (): boolean => {
    // Check if passwords match
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match");
      return false;
    }

    // Validate password strength
    const validation = passwordService.validatePassword(passwords.newPassword);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setError("Password does not meet requirements");
      return false;
    }

    // Check if new password is different from current
    if (passwords.currentPassword === passwords.newPassword) {
      setError("New password must be different from current password");
      return false;
    }

    return true;
  };

  const handlePasswordSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);
      setValidationErrors([]);

      console.log("🔐 Submitting password change...");

      const response = await passwordService.changePassword(passwords);

      console.log("✅ Password changed successfully:", response);

      // Clear form
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccessMessage(response.message || "Password changed successfully!");

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error("❌ Error changing password:", err);

      let errorMessage = "Failed to change password";

      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Reset password</h2>

      {error && (
        <div className={styles.errorMessage}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className={styles.validationErrors}>
          <p className={styles.validationTitle}>Password requirements:</p>
          <ul>
            {validationErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <div className={styles.successMessage}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label}>Current password</label>
        <div className={styles.passwordInput}>
          <input
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Enter current password"
            value={passwords.currentPassword}
            onChange={(e) =>
              handlePasswordChange("currentPassword", e.target.value)
            }
            className={styles.input}
            disabled={isSaving}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className={styles.eyeButton}
            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {showCurrentPassword ? (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>New password</label>
        <div className={styles.passwordInput}>
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password (min. 8 characters)"
            value={passwords.newPassword}
            onChange={(e) =>
              handlePasswordChange("newPassword", e.target.value)
            }
            className={styles.input}
            disabled={isSaving}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className={styles.eyeButton}
            aria-label={showNewPassword ? "Hide password" : "Show password"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {showNewPassword ? (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Confirm password</label>
        <div className={styles.passwordInput}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repeat new password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              handlePasswordChange("confirmPassword", e.target.value)
            }
            className={styles.input}
            disabled={isSaving}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={styles.eyeButton}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {showConfirmPassword ? (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button
          onClick={handlePasswordSave}
          className={styles.saveButton}
          disabled={isSaving || !hasPasswordChanges()}
        >
          {isSaving ? "Changing..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default PasswordChangeComponent;
