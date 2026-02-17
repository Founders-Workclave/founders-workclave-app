/**
 * Get the current user's ID from localStorage or auth token
 */
export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;

  // Try to get from localStorage
  const userId =
    localStorage.getItem("userId") || localStorage.getItem("user_id");

  if (userId) {
    console.log("✅ Found userId in localStorage:", userId);
    return userId;
  }

  // Try to parse from auth token
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userIdFromToken = payload.user_id || payload.sub || payload.userId;

      if (userIdFromToken) {
        console.log("✅ Found userId in token:", userIdFromToken);
        return userIdFromToken;
      }
    } catch (error) {
      console.error("❌ Failed to parse token:", error);
    }
  }

  console.warn("⚠️ No userId found in localStorage or token");
  return null;
}

/**
 * Store the current user's ID
 */
export function setCurrentUserId(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("userId", userId);
  console.log("✅ Stored userId:", userId);
}
