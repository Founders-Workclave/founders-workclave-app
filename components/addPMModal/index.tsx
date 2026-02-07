"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import { pmService, ApiError } from "@/lib/api/agencyCreateUsers/pmService";
import type { RegisterPMRequest } from "@/types/createPMApi";

interface AddPMModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: PMFormData) => Promise<void> | void;
  onSuccess?: () => void;
}

export interface PMFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
}

const AddPMModal: React.FC<AddPMModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<PMFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+234",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PMFormData | "api", string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof PMFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    // Clear API error when user makes changes
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PMFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({}); // Clear all errors

    try {
      // If custom onSubmit is provided, use it
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Otherwise, use the default API call
        // Map form data to API request format
        const requestData: RegisterPMRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: `${formData.countryCode}${formData.phoneNumber}`, // Combine country code and phone
          password: formData.password,
        };

        await pmService.registerPM(requestData);
      }

      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        countryCode: "+234",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);

      // Handle API errors
      if (error instanceof ApiError) {
        // Try to map error to specific fields
        const errorMsg = error.message.toLowerCase();

        // Check for field-specific errors
        if (errorMsg.includes("email")) {
          setErrors({ email: error.message });
        } else if (errorMsg.includes("phone")) {
          setErrors({ phoneNumber: error.message });
        } else if (errorMsg.includes("password")) {
          setErrors({ password: error.message });
        } else if (errorMsg.includes("first name")) {
          setErrors({ firstName: error.message });
        } else if (errorMsg.includes("last name")) {
          setErrors({ lastName: error.message });
        }
        // Handle duplicate/conflict errors (409)
        else if (
          error.status === 409 ||
          errorMsg.includes("already exists") ||
          errorMsg.includes("duplicate")
        ) {
          // Default to email for duplicate errors since that's most common
          setErrors({
            api: error.message,
            email: "This email may already be registered",
          });
        } else {
          // Show as general API error if can't map to specific field
          setErrors({ api: error.message });
        }
      } else if (error instanceof Error) {
        setErrors({ api: error.message });
      } else {
        setErrors({ api: "An unexpected error occurred" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add new project manager</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* API Error Message */}
          {errors.api && (
            <div className={styles.apiError}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.33334V8.00001M8 10.6667H8.00667M14.6667 8.00001C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.31811 14.6667 1.33334 11.6819 1.33334 8.00001C1.33334 4.31811 4.31811 1.33334 8 1.33334C11.6819 1.33334 14.6667 4.31811 14.6667 8.00001Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{errors.api}</span>
            </div>
          )}

          {/* First Name */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>First name</label>
            <input
              type="text"
              className={`${styles.input} ${
                errors.firstName ? styles.inputError : ""
              }`}
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              disabled={isSubmitting}
            />
            {errors.firstName && (
              <span className={styles.errorText}>{errors.firstName}</span>
            )}
          </div>

          {/* Last Name */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Last name</label>
            <input
              type="text"
              className={`${styles.input} ${
                errors.lastName ? styles.inputError : ""
              }`}
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              disabled={isSubmitting}
            />
            {errors.lastName && (
              <span className={styles.errorText}>{errors.lastName}</span>
            )}
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email address</label>
            <input
              type="email"
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone number</label>
            <div className={styles.phoneInputWrapper}>
              <button
                type="button"
                className={styles.countrySelector}
                disabled={isSubmitting}
              >
                <span className={styles.flag}>🇳🇬</span>
                <span className={styles.code}>+234</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <input
                type="tel"
                className={`${styles.phoneInput} ${
                  errors.phoneNumber ? styles.inputError : ""
                }`}
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {errors.phoneNumber && (
              <span className={styles.errorText}>{errors.phoneNumber}</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                className={`${styles.passwordInput} ${
                  errors.password ? styles.inputError : ""
                }`}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isSubmitting}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  {showPassword ? (
                    <>
                      <path
                        d="M14.95 14.95C13.5237 16.0358 11.7734 16.6374 9.96667 16.6667C4.96667 16.6667 1.66667 10 1.66667 10C2.82593 7.84922 4.47278 6.02181 6.45 4.68333M8.25 3.43333C8.81389 3.30278 9.38889 3.23611 9.96667 3.23333C14.9667 3.23333 18.2667 10 18.2667 10C17.7555 10.9463 17.1407 11.8373 16.4333 12.6583M11.7667 11.7667C11.5378 12.0123 11.2617 12.2093 10.9546 12.3459C10.6474 12.4825 10.3157 12.556 9.97928 12.5619C9.64283 12.5678 9.30865 12.506 8.99675 12.3802C8.68485 12.2543 8.40181 12.067 8.16454 11.8297C7.92728 11.5925 7.73995 11.3094 7.61411 10.9975C7.48827 10.6856 7.42644 10.3514 7.43237 10.015C7.4383 9.67851 7.51186 9.34684 7.64846 9.03967C7.78506 8.7325 7.98203 8.45637 8.22767 8.22751"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.66667 1.66667L18.3333 18.3333"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M1.66667 10C1.66667 10 4.96667 3.33333 9.96667 3.33333C14.9667 3.33333 18.2667 10 18.2667 10C18.2667 10 14.9667 16.6667 9.96667 16.6667C4.96667 16.6667 1.66667 10 1.66667 10Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.96667 12.5C11.3474 12.5 12.4667 11.3807 12.4667 10C12.4667 8.61929 11.3474 7.5 9.96667 7.5C8.58596 7.5 7.46667 8.61929 7.46667 10C7.46667 11.3807 8.58596 12.5 9.96667 12.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`${styles.passwordInput} ${
                  errors.confirmPassword ? styles.inputError : ""
                }`}
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                disabled={isSubmitting}
              />
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                disabled={isSubmitting}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  {showConfirmPassword ? (
                    <>
                      <path
                        d="M14.95 14.95C13.5237 16.0358 11.7734 16.6374 9.96667 16.6667C4.96667 16.6667 1.66667 10 1.66667 10C2.82593 7.84922 4.47278 6.02181 6.45 4.68333M8.25 3.43333C8.81389 3.30278 9.38889 3.23611 9.96667 3.23333C14.9667 3.23333 18.2667 10 18.2667 10C17.7555 10.9463 17.1407 11.8373 16.4333 12.6583M11.7667 11.7667C11.5378 12.0123 11.2617 12.2093 10.9546 12.3459C10.6474 12.4825 10.3157 12.556 9.97928 12.5619C9.64283 12.5678 9.30865 12.506 8.99675 12.3802C8.68485 12.2543 8.40181 12.067 8.16454 11.8297C7.92728 11.5925 7.73995 11.3094 7.61411 10.9975C7.48827 10.6856 7.42644 10.3514 7.43237 10.015C7.4383 9.67851 7.51186 9.34684 7.64846 9.03967C7.78506 8.7325 7.98203 8.45637 8.22767 8.22751"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.66667 1.66667L18.3333 18.3333"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M1.66667 10C1.66667 10 4.96667 3.33333 9.96667 3.33333C14.9667 3.33333 18.2667 10 18.2667 10C18.2667 10 14.9667 16.6667 9.96667 16.6667C4.96667 16.6667 1.66667 10 1.66667 10Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.96667 12.5C11.3474 12.5 12.4667 11.3807 12.4667 10C12.4667 8.61929 11.3474 7.5 9.96667 7.5C8.58596 7.5 7.46667 8.61929 7.46667 10C7.46667 11.3807 8.58596 12.5 9.96667 12.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create project manager"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPMModal;
