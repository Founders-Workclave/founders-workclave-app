import {
  getAuthToken,
  handleSessionTimeout,
  isAuthError,
} from "@/lib/api/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeResponse {
  message: string;
  success?: boolean;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  detail?: string;
  oldPassword?: string[];
  newPassword1?: string[];
  newPassword2?: string[];
}

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const passwordService = {
  /**
   * Change user password
   * POST /change-password/
   */
  async changePassword(
    passwordData: PasswordChangeRequest
  ): Promise<PasswordChangeResponse> {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      console.log("🔐 Changing password...");

      const response = await fetch(`${API_BASE_URL}/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword1: passwordData.newPassword,
          newPassword2: passwordData.confirmPassword,
        }),
      });

      console.log("📡 Password change response status:", response.status);

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to change password" }));

        console.error("❌ Password change failed:", errorData);

        // Handle authentication errors
        if (isAuthError(response.status)) {
          handleSessionTimeout();
          throw new ApiError(
            "Session expired. Please log in again.",
            response.status,
            errorData
          );
        }

        // Handle specific field errors from Django REST framework
        if (errorData.oldPassword) {
          throw new ApiError(
            errorData.oldPassword[0] || "Current password is incorrect",
            response.status,
            errorData
          );
        }

        if (errorData.newPassword1) {
          throw new ApiError(
            errorData.newPassword1[0] || "Invalid new password",
            response.status,
            errorData
          );
        }

        if (errorData.newPassword2) {
          throw new ApiError(
            errorData.newPassword2[0] || "Password confirmation doesn't match",
            response.status,
            errorData
          );
        }

        throw new ApiError(
          errorData.message ||
            errorData.detail ||
            errorData.error ||
            "Failed to change password",
          response.status,
          errorData
        );
      }

      const data: PasswordChangeResponse = await response.json();
      console.log("✅ Password changed successfully:", data);

      return data;
    } catch (error) {
      console.error("💥 Exception in changePassword:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while changing password");
    }
  },

  /**
   * Validate password requirements
   */
  validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Check if passwords match
   */
  passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword && password.length > 0;
  },
};
