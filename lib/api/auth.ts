interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  userType?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SendOtpPayload {
  email: string;
}

interface VerifyOtpPayload {
  otp: string;
}

interface ResetPasswordPayload {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserInfo {
  id?: string;
  name: string;
  email: string;
  username?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id?: string;
    userId?: string;
    email?: string;
    token?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
  error?: string;
  errors?: Record<string, string[]>;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const fullPhoneNumber = `${payload.countryCode}${payload.phoneNumber}`;

      const requestBody = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: fullPhoneNumber,
        password: payload.password,
      };

      // Build URL with query parameter if userType is provided
      const url = payload.userType
        ? `${API_BASE_URL}/register/?user_type=${payload.userType.toLowerCase()}`
        : `${API_BASE_URL}/register/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 500));

        return {
          success: false,
          message: `Server error (${response.status}). The backend may be down or misconfigured.`,
          error: `HTTP ${response.status}: Server returned HTML instead of JSON`,
        };
      }

      const data = await response.json();
      console.log("Registration response:", response.status, data);

      if (response.status === 400 && data.errors) {
        const errorMessages = Object.entries(data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("\n");

        return {
          success: false,
          message: errorMessages || "Validation failed",
          error: errorMessages,
          errors: data.errors,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || `Error: ${response.status}`,
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      // After successful registration, store user info
      if (data.data || data) {
        const emailUsername = payload.email.split("@")[0];
        const userData = {
          id: data.data?.userId || data.userId,
          name: `${payload.firstName} ${payload.lastName}`,
          email: payload.email,
          username: emailUsername,
        };
        setUser(userData);

        if (data.data?.token || data.token) {
          localStorage.setItem("token", data.data?.token || data.token);
        }
      }

      return {
        success: true,
        message: data.message || "Registration successful",
        data: data.data || data,
      };
    } catch (error) {
      console.error("Registration error:", error);

      if (error instanceof Error) {
        return {
          success: false,
          message: "Network error: " + error.message,
          error: error.message,
        };
      }

      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        error: "Unknown error",
      };
    }
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const requestBody = {
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      };

      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 500));

        return {
          success: false,
          message: `Server error (${response.status}). The backend may be down.`,
          error: `HTTP ${response.status}: Server returned HTML instead of JSON`,
        };
      }

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.status === 400 && data.errors) {
        const errorMessages = Object.entries(data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("\n");

        return {
          success: false,
          message: errorMessages || "Validation failed",
          error: errorMessages,
          errors: data.errors,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || "Invalid email or password",
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        message: data.message || "Login successful",
        data: data.data || data,
      };
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof Error) {
        return {
          success: false,
          message: "Network error: " + error.message,
          error: error.message,
        };
      }

      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        error: "Unknown error",
      };
    }
  },

  // Send OTP to email for password reset
  sendOtp: async (payload: SendOtpPayload): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/send-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: payload.email.trim().toLowerCase() }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 500));

        return {
          success: false,
          message: `Server error (${response.status}). The backend may be down.`,
          error: `HTTP ${response.status}: Server returned HTML instead of JSON`,
        };
      }

      const data = await response.json();
      console.log("Send OTP response:", response.status, data);

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message || data.error || "Failed to send verification code",
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        message: data.message || "Verification code sent successfully",
        data: data.data || data,
      };
    } catch (error) {
      console.error("Send OTP error:", error);

      if (error instanceof Error) {
        return {
          success: false,
          message: "Network error: " + error.message,
          error: error.message,
        };
      }

      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        error: "Unknown error",
      };
    }
  },

  // Verify OTP
  verifyOtp: async (payload: VerifyOtpPayload): Promise<AuthResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/verify-otp/${payload.otp}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 500));

        return {
          success: false,
          message: `Server error (${response.status}). The backend may be down.`,
          error: `HTTP ${response.status}: Server returned HTML instead of JSON`,
        };
      }

      const data = await response.json();
      console.log("Verify OTP response:", response.status, data);

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message ||
            data.error ||
            "Invalid or expired verification code",
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        message: data.message || "Verification code verified successfully",
        data: data.data || data,
      };
    } catch (error) {
      console.error("Verify OTP error:", error);

      if (error instanceof Error) {
        return {
          success: false,
          message: "Network error: " + error.message,
          error: error.message,
        };
      }

      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        error: "Unknown error",
      };
    }
  },

  // Reset password with OTP
  resetPassword: async (
    payload: ResetPasswordPayload
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/change-password/otp/${payload.otp}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword1: payload.newPassword,
            newPassword2: payload.confirmPassword,
          }),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 500));

        return {
          success: false,
          message: `Server error (${response.status}). The backend may be down.`,
          error: `HTTP ${response.status}: Server returned HTML instead of JSON`,
        };
      }

      const data = await response.json();
      console.log("Reset password response:", response.status, data);

      if (response.status === 400 && data.errors) {
        const errorMessages = Object.entries(data.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(", ")}`
          )
          .join("\n");

        return {
          success: false,
          message: errorMessages || "Validation failed",
          error: errorMessages,
          errors: data.errors,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || "Failed to reset password",
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        message: data.message || "Password reset successfully",
        data: data.data || data,
      };
    } catch (error) {
      console.error("Reset password error:", error);

      if (error instanceof Error) {
        return {
          success: false,
          message: "Network error: " + error.message,
          error: error.message,
        };
      }

      return {
        success: false,
        message: "An unexpected error occurred. Please try again.",
        error: "Unknown error",
      };
    }
  },
};

// Utility functions to manage user info in localStorage
export const getUser = (): UserInfo | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: UserInfo) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};
