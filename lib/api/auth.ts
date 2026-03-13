interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  userType?: string;
  company?: string;
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
  role: "admin" | "user" | "clients" | "manager";
  firstName?: string;
  lastName?: string;
  phone?: string;
  userType?: string;
  profileImage?: string;
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

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

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

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const safeJsonParse = <T>(jsonString: string | null): T | null => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
};

export const getUser = (): UserInfo | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_KEY);
  return safeJsonParse<UserInfo>(userStr);
};

export const setUser = (user: UserInfo): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("profileUpdated", { detail: user }));
  } catch (error) {
    console.error("Failed to store user data:", error);
  }
};

export const clearUser = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_KEY);
    clearAuthTokens();
  } catch (error) {
    console.error("Failed to clear user data:", error);
  }
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === "admin";
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getUser();
};

export const getCurrentUser = (): UserInfo | null => {
  return getUser();
};

export const isUserType = (requiredType: string): boolean => {
  const user = getUser();
  if (!user) return false;
  const requiredLower = requiredType.toLowerCase();
  const userTypeLower = user.userType?.toLowerCase() || "founder";
  const roleLower = user.role?.toLowerCase();
  return userTypeLower === requiredLower || roleLower === requiredLower;
};

export const isClientUser = (): boolean => {
  const user = getUser();
  if (!user) return false;
  return (
    user.role?.toLowerCase() === "client" ||
    user.userType?.toLowerCase() === "client"
  );
};

export const isPMUser = (): boolean => {
  const user = getUser();
  if (!user) return false;
  return (
    user.role?.toLowerCase() === "manager" ||
    user.userType?.toLowerCase() === "manager"
  );
};

export const isAgencyUser = (): boolean => {
  const user = getUser();
  if (!user) return false;
  return (
    user.role?.toLowerCase() === "agency" ||
    user.userType?.toLowerCase() === "agency"
  );
};

export const isFounderUser = (): boolean => {
  const user = getUser();
  if (!user) return false;
  const userTypeLower = user.userType?.toLowerCase() || "founder";
  const roleLower = user.role?.toLowerCase();
  return (
    userTypeLower === "founder" ||
    roleLower === "founder" ||
    (roleLower === "user" && userTypeLower === "founder")
  );
};

export const getUserRedirectPath = (): string => {
  const user = getUser();
  if (!user) return "/login";
  const userType = user.userType?.toLowerCase();
  const role = user.role?.toLowerCase();
  switch (userType) {
    case "agency":
      return "/agency";
    case "manager":
    case "pm":
      return "/pm";
    case "client":
      return "/clients";
    case "founder":
      return "/founder";
    default:
      if (role === "admin") return "/admin";
      if (role === "pm") return "/pm";
      if (role === "client") return "/clients";
      return "/founder";
  }
};

export const getUserForDisplay = (): UserInfo | null => {
  const user = getUser();
  if (!user) return null;
  return {
    ...user,
    firstName: user.firstName || "User",
    lastName: user.lastName || "",
    name: user.name || user.firstName || user.email?.split("@")[0] || "User",
  };
};

export const getUserDisplayName = (): string => {
  const user = getUser();
  if (!user) return "User";
  if (user.name && user.name.trim() !== "") return user.name;
  if (user.firstName && user.firstName.trim() !== "") return user.firstName;
  if (user.username && user.username.trim() !== "") return user.username;
  if (user.email) return user.email.split("@")[0];
  return "User";
};

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

export const getUserProfileImage = (): string | null => {
  const user = getUser();
  return user?.profileImage || null;
};

export const updateUserProfile = (updates: Partial<UserInfo>): void => {
  if (typeof window === "undefined") return;
  try {
    const currentUser = getUser();
    if (!currentUser) throw new Error("No user profile found");
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    window.dispatchEvent(
      new CustomEvent("profileUpdated", { detail: updates })
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const logout = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const handleSessionTimeout = (redirectUrl: string = "/login"): void => {
  logout();
  if (typeof window !== "undefined") {
    window.location.href = redirectUrl;
  }
};

export const isAuthError = (status?: number): boolean => {
  return status === 401 || status === 403;
};

export const setAuthData = (token: string, user: UserInfo): void => {
  if (typeof window === "undefined") return;
  try {
    setAuthTokens(token);
    setUser(user);
  } catch (error) {
    console.error("Error setting auth data:", error);
    throw error;
  }
};

const determineAdminRole = (data: AuthResponse, email: string): boolean => {
  if (
    data.is_superuser === true ||
    data.is_staff === true ||
    data.data?.is_superuser === true ||
    data.data?.is_staff === true
  ) {
    return true;
  }
  const roleFields = [data.data?.role, data.data?.userType];
  const adminRoleValues = ["admin", "superadmin", "administrator"];
  if (
    roleFields.some(
      (role) => role && adminRoleValues.includes(role.toLowerCase())
    )
  ) {
    return true;
  }
  const emailLower = email.toLowerCase();
  if (ADMIN_EMAIL_PATTERNS.some((pattern) => emailLower.includes(pattern))) {
    console.warn(
      "⚠️ Using email pattern for admin detection. Consider updating API to return role explicitly."
    );
    return true;
  }
  return false;
};

const extractNameFields = (data: AuthResponse, email: string) => {
  const firstName =
    data.data?.firstName ||
    data.data?.first_name ||
    data.firstName ||
    data.first_name ||
    "";
  const lastName =
    data.data?.lastName ||
    data.data?.last_name ||
    data.lastName ||
    data.last_name ||
    "";
  let displayName = data.data?.name || data.name;
  if (!displayName && (firstName || lastName)) {
    displayName = `${firstName} ${lastName}`.trim();
  }
  if (!displayName) {
    displayName = email.split("@")[0];
  }
  return { firstName, lastName, displayName };
};

// ─── Error helpers ────────────────────────────────────────────────────────────

const isDuplicateEmailMessage = (msg: string): boolean => {
  const lower = msg.toLowerCase();
  return (
    lower.includes("already exists") ||
    lower.includes("already registered") ||
    lower.includes("already taken") ||
    lower.includes("email taken") ||
    lower.includes("email in use")
  );
};

const friendlyEmailError =
  "An account with this email already exists. Please log in instead.";

/**
 * Parses a 400 error body from Django REST Framework.
 *
 * Handles both shapes:
 *   Root-level:  { "email": ["msg"] }          ← what this API returns
 *   Nested:      { "errors": { "email": [...] } }
 */
const parseErrorBody = (body: Record<string, unknown>): string => {
  // Use nested errors key if present, otherwise treat the whole body as the error map
  const source =
    body.errors &&
    typeof body.errors === "object" &&
    !Array.isArray(body.errors)
      ? (body.errors as Record<string, unknown>)
      : body;

  const messages: string[] = [];

  for (const [field, value] of Object.entries(source)) {
    // Skip scalar fields that aren't error lists (e.g. "success", "message")
    const list: string[] = Array.isArray(value)
      ? value.map(String)
      : typeof value === "string"
      ? [value]
      : [];

    for (const msg of list) {
      if (field === "email" && isDuplicateEmailMessage(msg)) {
        messages.push(friendlyEmailError);
      } else {
        messages.push(msg);
      }
    }
  }

  return messages.join(" ").trim();
};

// ─── API METHODS ──────────────────────────────────────────────────────────────

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const fullPhoneNumber = `${payload.countryCode}${payload.phoneNumber}`;

      if (fullPhoneNumber.includes("@")) {
        console.error(
          "❌ phoneNumber contains email value! Check form field names."
        );
        return {
          success: false,
          message: "Invalid phone number. Please re-enter your phone number.",
          error: "phoneNumber field received email value",
        };
      }

      const requestBody = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email.trim().toLowerCase(),
        phone: fullPhoneNumber,
        password: payload.password,
        ...(payload.company && { company: payload.company }),
      };

      const url = payload.userType
        ? `${API_BASE_URL}/register/?user_type=${encodeURIComponent(
            payload.userType.toLowerCase()
          )}`
        : `${API_BASE_URL}/register/`;

      console.log("🚀 Register URL:", url);
      console.log(
        "📦 Actual request body:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      console.log(
        "🔴 Raw API response:",
        response.status,
        JSON.stringify(data, null, 2)
      );

      // ── 400: parse root-level DRF errors e.g. { "email": ["..."] } ──────────
      if (response.status === 400) {
        const errorMessage = parseErrorBody(data as Record<string, unknown>);
        return {
          success: false,
          message:
            errorMessage || "Validation failed. Please check your details.",
          error: errorMessage,
        };
      }

      // ── Other non-2xx ─────────────────────────────────────────────────────
      if (!response.ok) {
        const rawMessage =
          data.message || data.error || `Request failed (${response.status})`;
        const friendlyMessage = isDuplicateEmailMessage(rawMessage)
          ? friendlyEmailError
          : rawMessage;
        return {
          success: false,
          message: friendlyMessage,
          error: friendlyMessage,
        };
      }

      // ── Success ───────────────────────────────────────────────────────────
      const accessToken =
        data.access || data.data?.access || data.data?.token || data.token;
      const refreshToken = data.refresh || data.data?.refresh;

      if (accessToken) {
        setAuthTokens(accessToken, refreshToken);
      }

      const userData: UserInfo = {
        id: data.data?.userId || data.userId || data.data?.id || data.id || "",
        firstName: payload.firstName,
        lastName: payload.lastName,
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email.trim().toLowerCase(),
        username: payload.email.split("@")[0],
        role: "user",
        phone: fullPhoneNumber,
        userType: payload.userType?.toLowerCase() || "founder",
      };

      setUser(userData);

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

  login: async (
    payload: LoginPayload,
    userType?: string
  ): Promise<AuthResponse> => {
    try {
      const requestBody = {
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      };

      const baseUrl = `${API_BASE_URL}/login/`;
      const url = userType
        ? `${baseUrl}?user_type=${encodeURIComponent(userType.toLowerCase())}`
        : baseUrl;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (response.status === 400) {
        const errorMessage = parseErrorBody(
          data as unknown as Record<string, unknown>
        );
        return {
          success: false,
          message: errorMessage || "Validation failed",
          error: errorMessage,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || data.error || "Invalid email or password",
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      const accessToken = data.access || data.data?.access || data.data?.token;
      const refreshToken = data.refresh || data.data?.refresh;

      if (!accessToken) {
        console.error("❌ No access token in response!");
        return {
          success: false,
          message: "Login failed: No access token received",
          error: "No access token in response",
        };
      }

      setAuthTokens(accessToken, refreshToken);

      const detectedUserType =
        data.user?.toLowerCase() ||
        data.data?.user?.toLowerCase() ||
        data.data?.userType?.toLowerCase() ||
        data.data?.user_type?.toLowerCase() ||
        data.userType?.toLowerCase() ||
        data.user_type?.toLowerCase() ||
        userType?.toLowerCase() ||
        "founder";

      const isAdminUser = determineAdminRole(data, requestBody.email);
      const role: "admin" | "user" = isAdminUser ? "admin" : "user";

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
        userType: detectedUserType,
        profileImage: existingUser?.profileImage,
      };

      setUser(userData);
      const verification = getUser();

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
        headers: { "Content-Type": "application/json" },
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
          headers: { "Content-Type": "application/json" },
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
          headers: { "Content-Type": "application/json" },
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

      if (response.status === 400) {
        const errorMessage = parseErrorBody(data as Record<string, unknown>);
        return {
          success: false,
          message:
            errorMessage || "Validation failed. Please check your details.",
          error: errorMessage,
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

export const clearAuth = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userData");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("expiresAt");
    sessionStorage.clear();
  } catch (error) {
    console.error("❌ Error clearing auth data:", error);
  }
};
