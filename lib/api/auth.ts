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
  id: string;
  name: string;
  email: string;
  username: string;
  role: "admin" | "user";
  firstName?: string;
  lastName?: string;
  phone?: string;
  userType?: string;
}

interface ApiUserData {
  id?: string;
  userId?: string;
  email?: string;
  access?: string;
  refresh?: string;
  token?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  username?: string;
  role?: string;
  userType?: string;
  user_type?: string;
  user?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  phone?: string;
  phoneNumber?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: ApiUserData;
  access?: string;
  refresh?: string;
  userId?: string;
  id?: string;
  is_superuser?: boolean;
  is_staff?: boolean;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  error?: string;
  errors?: Record<string, string[]>;
  userType?: string;
  user_type?: string;
  user?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

const TOKEN_KEY = "access_token" as const;
const REFRESH_TOKEN_KEY = "refresh_token" as const;
const USER_KEY = "user" as const;

const ADMIN_EMAIL_PATTERNS = ["admin@", "superadmin@"];

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store authentication tokens securely
 */
export const setAuthTokens = (
  accessToken: string,
  refreshToken?: string
): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error("Failed to store auth tokens:", error);
  }
};

/**
 * Clear all authentication tokens
 */
export const clearAuthTokens = (): void => {
  if (typeof window === "undefined") return;

  const keysToRemove = [TOKEN_KEY, REFRESH_TOKEN_KEY, "token", "authToken"];
  keysToRemove.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  });
};

/**
 * Get authorization headers for API requests
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// USER MANAGEMENT

/**
 * Safely parse JSON with error handling
 */
const safeJsonParse = <T>(jsonString: string | null): T | null => {
  if (!jsonString) return null;

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
};

/**
 * Get current user from localStorage
 */
export const getUser = (): UserInfo | null => {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem(USER_KEY);
  return safeJsonParse<UserInfo>(userStr);
};

/**
 * Store user information in localStorage
 */
export const setUser = (user: UserInfo): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user data:", error);
  }
};

/**
 * Clear all user data and tokens
 */
export const clearUser = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(USER_KEY);
    clearAuthTokens();
  } catch (error) {
    console.error("Failed to clear user data:", error);
  }
};

/**
 * Check if current user is admin
 */
export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === "admin";
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getUser();
};

/**
 * Get current user (alias for getUser)
 */
export const getCurrentUser = (): UserInfo | null => {
  return getUser();
};

// USER TYPE VALIDATION - NEW FUNCTIONS

/**
 * Check if current user matches the required user type
 */
export const isUserType = (requiredType: string): boolean => {
  const user = getUser();
  if (!user) return false;

  // If no userType stored, assume founder (for backward compatibility)
  const currentUserType = user.userType || "founder";
  return currentUserType.toLowerCase() === requiredType.toLowerCase();
};

/**
 * Check if current user is an agency user
 */
export const isAgencyUser = (): boolean => {
  return isUserType("agency");
};

/**
 * Check if current user is a founder
 */
export const isFounderUser = (): boolean => {
  return isUserType("founder");
};

// USER DISPLAY UTILITIES

/**
 * Get user info with fallbacks for display purposes
 * Use this in your components instead of getUser() directly
 */
export const getUserForDisplay = (): UserInfo | null => {
  const user = getUser();
  if (!user) return null;

  // Ensure we always have display-friendly values
  return {
    ...user,
    firstName: user.firstName || "User",
    lastName: user.lastName || "",
    name: user.name || user.firstName || user.email?.split("@")[0] || "User",
  };
};

/**
 * Get user's display name with smart fallbacks
 */
export const getUserDisplayName = (): string => {
  const user = getUser();
  if (!user) return "User";

  // Priority: full name > first name > username > email prefix
  if (user.name && user.name.trim() !== "") return user.name;
  if (user.firstName && user.firstName.trim() !== "") return user.firstName;
  if (user.username && user.username.trim() !== "") return user.username;
  if (user.email) return user.email.split("@")[0];

  return "User";
};

/**
 * Get user's initials for avatar
 */
export const getUserInitials = (): string => {
  const user = getUser();
  if (!user) return "U";

  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  if (user.firstName) {
    return user.firstName.substring(0, 2).toUpperCase();
  }

  if (user.name && user.name.trim() !== "") {
    const parts = user.name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }

  return "U";
};

/**
 * Determine if user should have admin role based on API response
 */
const determineAdminRole = (data: AuthResponse, email: string): boolean => {
  // Check explicit admin flags from API
  if (
    data.is_superuser === true ||
    data.is_staff === true ||
    data.data?.is_superuser === true ||
    data.data?.is_staff === true
  ) {
    return true;
  }

  // Check role fields
  const roleFields = [data.data?.role, data.data?.userType];
  const adminRoleValues = ["admin", "superadmin", "administrator"];

  if (
    roleFields.some(
      (role) => role && adminRoleValues.includes(role.toLowerCase())
    )
  ) {
    return true;
  }

  // Fallback: Check email patterns (less secure, use only if API doesn't provide role)
  const emailLower = email.toLowerCase();
  if (ADMIN_EMAIL_PATTERNS.some((pattern) => emailLower.includes(pattern))) {
    console.warn(
      "⚠️ Using email pattern for admin detection. Consider updating API to return role explicitly."
    );
    return true;
  }

  return false;
};

/**
 * Extract name fields from API response with multiple fallback strategies
 */
const extractNameFields = (data: AuthResponse, email: string) => {
  // Try to get firstName from multiple possible locations
  const firstName =
    data.data?.firstName ||
    data.data?.first_name ||
    data.firstName ||
    data.first_name ||
    "";

  // Try to get lastName from multiple possible locations
  const lastName =
    data.data?.lastName ||
    data.data?.last_name ||
    data.lastName ||
    data.last_name ||
    "";

  // Try to get full name
  let displayName = data.data?.name || data.name;

  if (!displayName && (firstName || lastName)) {
    // Construct name from first/last if not provided
    displayName = `${firstName} ${lastName}`.trim();
  }

  if (!displayName) {
    // Ultimate fallback to email username
    displayName = email.split("@")[0];
  }

  return { firstName, lastName, displayName };
};

// API METHODS

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const fullPhoneNumber = `${payload.countryCode}${payload.phoneNumber}`;

      const requestBody = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email.trim().toLowerCase(),
        phone: fullPhoneNumber,
        password: payload.password,
      };

      const url = payload.userType
        ? `${API_BASE_URL}/register/?user_type=${encodeURIComponent(
            payload.userType.toLowerCase()
          )}`
        : `${API_BASE_URL}/register/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 500));

        return {
          success: false,
          message: `Server error (${response.status}). The backend may be down or misconfigured.`,
          error: `HTTP ${response.status}: Server returned HTML instead of JSON`,
        };
      }

      const data = await response.json();

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

      // Store tokens
      const accessToken =
        data.access || data.data?.access || data.data?.token || data.token;
      const refreshToken = data.refresh || data.data?.refresh;

      if (accessToken) {
        setAuthTokens(accessToken, refreshToken);
        console.log("🔑 Tokens stored after registration");
      }

      // Create user object with the data we sent
      const userData: UserInfo = {
        id: data.data?.userId || data.userId || data.data?.id || data.id || "",
        firstName: payload.firstName,
        lastName: payload.lastName,
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email.trim().toLowerCase(),
        username: payload.email.split("@")[0],
        role: "user",
        phone: fullPhoneNumber,
        userType: payload.userType?.toLowerCase() || "founder", // ADDED
      };

      setUser(userData);

      console.log("✅ Registration successful - User data saved:", userData);

      return {
        success: true,
        message: data.message || "Registration successful",
        data: data.data || data,
      };
    } catch (error) {
      console.error("❌ Registration error:", error);

      return {
        success: false,
        message:
          error instanceof Error
            ? `Network error: ${error.message}`
            : "An unexpected error occurred. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Universal login method that supports different user types
   * @param payload - Login credentials
   * @param userType - Optional user type (e.g., 'agency', 'founder')
   */
  // Add this updated login method to your authApi object in auth.ts

  login: async (
    payload: LoginPayload,
    userType?: string
  ): Promise<AuthResponse> => {
    try {
      const requestBody = {
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      };

      // Build URL - only add user_type if explicitly provided
      const baseUrl = `${API_BASE_URL}/login/`;
      const url = userType
        ? `${baseUrl}?user_type=${encodeURIComponent(userType.toLowerCase())}`
        : baseUrl;

      console.log(
        `🔐 Logging in${userType ? ` as ${userType}` : " (auto-detect)"}...`
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 500));

        return {
          success: false,
          message: `Server error (${response.status}). The backend may be down.`,
          error: `HTTP ${response.status}: Server returned HTML instead of JSON`,
        };
      }

      const data: AuthResponse = await response.json();

      // ADD DETAILED LOGGING TO SEE WHAT THE API RETURNS
      console.log("🔍 Full API Login Response:", {
        status: response.status,
        success: response.ok,
        data: data,
        dataObject: data.data,
        userType: data.userType,
        user_type: data.user_type,
        dataUserType: data.data?.userType,
        dataUser_type: data.data?.user_type,
      });

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

      // Extract tokens
      const accessToken = data.access || data.data?.access || data.data?.token;
      const refreshToken = data.refresh || data.data?.refresh;

      console.log("🔑 Tokens extracted:", {
        hasAccess: !!accessToken,
        hasRefresh: !!refreshToken,
      });

      if (!accessToken) {
        console.error("❌ No access token in response!");
        return {
          success: false,
          message: "Login failed: No access token received",
          error: "No access token in response",
        };
      }

      // Store tokens
      setAuthTokens(accessToken, refreshToken);

      // Extract user type from response - THIS IS CRITICAL
      // Try multiple possible locations where userType might be
      const detectedUserType =
        data.user?.toLowerCase() || // API returns "user": "Agency" or "user": "Founder"
        data.data?.user?.toLowerCase() ||
        data.data?.userType?.toLowerCase() ||
        data.data?.user_type?.toLowerCase() ||
        data.userType?.toLowerCase() ||
        data.user_type?.toLowerCase() ||
        userType?.toLowerCase() || // Use requested type as fallback
        "founder"; // Ultimate fallback

      console.log("🎯 Detected user type:", detectedUserType, "from:", {
        directUser: data.user,
        dataUser: data.data?.user,
        userType: data.userType,
        user_type: data.user_type,
      });

      // Determine user role
      const isAdminUser = determineAdminRole(data, requestBody.email);
      const role: "admin" | "user" = isAdminUser ? "admin" : "user";

      // Extract name fields
      const { firstName, lastName, displayName } = extractNameFields(
        data,
        requestBody.email
      );

      const existingUser = getUser();
      const finalFirstName = firstName || existingUser?.firstName || "";
      const finalLastName = lastName || existingUser?.lastName || "";
      const finalDisplayName =
        displayName ||
        (finalFirstName || finalLastName
          ? `${finalFirstName} ${finalLastName}`.trim()
          : "") ||
        existingUser?.name ||
        requestBody.email.split("@")[0];

      // Create user object with all available data
      const userData: UserInfo = {
        id:
          data.data?.userId ||
          data.data?.id ||
          data.userId ||
          data.id ||
          existingUser?.id ||
          "",
        firstName: finalFirstName,
        lastName: finalLastName,
        name: finalDisplayName,
        email: data.data?.email || requestBody.email,
        username: data.data?.username || requestBody.email.split("@")[0],
        role: role,
        phone:
          data.data?.phone || data.data?.phoneNumber || existingUser?.phone,
        userType: detectedUserType, // CRITICAL: Store the detected user type
      };

      setUser(userData);

      console.log("✅ Login successful - User data saved:", userData);

      // Verify data was stored correctly
      const verification = getUser();
      console.log("🔍 Verification - Data in localStorage:", verification);

      if (!verification || !verification.userType) {
        console.error("❌ WARNING: User data not stored correctly!");
      }

      return {
        success: true,
        message: data.message || "Login successful",
        data: data.data || data,
      };
    } catch (error) {
      console.error("❌ Login error:", error);

      return {
        success: false,
        message:
          error instanceof Error
            ? `Network error: ${error.message}`
            : "An unexpected error occurred. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

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
      if (!contentType?.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 500));

        return {
          success: false,
          message: `Server error (${response.status}). The backend may be down.`,
          error: `HTTP ${response.status}: Server returned HTML instead of JSON`,
        };
      }

      const data = await response.json();

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

      return {
        success: false,
        message:
          error instanceof Error
            ? `Network error: ${error.message}`
            : "An unexpected error occurred. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<AuthResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/verify-otp/${encodeURIComponent(payload.otp)}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 500));

        return {
          success: false,
          message: `Server error (${response.status}). The backend may be down.`,
          error: `HTTP ${response.status}: Server returned HTML instead of JSON`,
        };
      }

      const data = await response.json();

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

      return {
        success: false,
        message:
          error instanceof Error
            ? `Network error: ${error.message}`
            : "An unexpected error occurred. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  resetPassword: async (
    payload: ResetPasswordPayload
  ): Promise<AuthResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/change-password/otp/${encodeURIComponent(
          payload.otp
        )}/`,
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
      if (!contentType?.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse.substring(0, 500));

        return {
          success: false,
          message: `Server error (${response.status}). The backend may be down.`,
          error: `HTTP ${response.status}: Server returned HTML instead of JSON`,
        };
      }

      const data = await response.json();

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

      return {
        success: false,
        message:
          error instanceof Error
            ? `Network error: ${error.message}`
            : "An unexpected error occurred. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
