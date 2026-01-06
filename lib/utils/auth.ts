/**
 * Get authentication token from storage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  // Try localStorage first
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken");

  if (token) {
    return token;
  }

  // Try cookies as fallback
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find(
    (row) =>
      row.startsWith("authToken=") ||
      row.startsWith("token=") ||
      row.startsWith("access_token=")
  );

  return tokenCookie ? tokenCookie.split("=")[1] : null;
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
