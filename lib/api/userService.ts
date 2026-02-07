import { getAuthToken } from "@/lib/utils/auth";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class UserService {
  /**
   * Get current user profile from localStorage
   * This is populated during login/signup
   */
  static getCachedUserProfile(): UserProfile | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      // Map the stored user format to UserProfile format
      return {
        id: user.id || "",
        firstName: user.firstName || user.name?.split(" ")[0] || "",
        lastName:
          user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || undefined,
      };
    } catch {
      return null;
    }
  }

  /**
   * Update cached user data in localStorage
   */
  private static updateCachedUser(profile: UserProfile) {
    const user = {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      name: `${profile.firstName} ${profile.lastName}`.trim(),
      email: profile.email,
      username: profile.email.split("@")[0],
      phone: profile.phone,
      avatar: profile.avatar,
    };
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Clear all authentication data
   */
  private static clearAuth() {
    if (typeof window === "undefined") return;

    // Clear all possible token storage locations
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // Clear cookies
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  /**
   * Update user profile
   * @param profileData - Updated profile data (FormData)
   * @returns Promise with response message
   */
  static async updateUserProfile(
    profileData: FormData
  ): Promise<{ message: string; user?: UserProfile }> {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user-edit/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: profileData,
      });

      if (response.status === 401) {
        this.clearAuth();
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update profile: ${response.statusText}`
        );
      }

      const data = await response.json();

      // If response includes updated user, cache it
      if (data.user) {
        this.updateCachedUser(data.user);
      } else {
        // Update cache manually with form data
        const cached = this.getCachedUserProfile();
        if (cached) {
          const updatedProfile = {
            ...cached,
            firstName:
              (profileData.get("firstName") as string) || cached.firstName,
            lastName:
              (profileData.get("lastName") as string) || cached.lastName,
            phone: (profileData.get("phone") as string) || cached.phone,
          };
          this.updateCachedUser(updatedProfile);
        }
      }

      return data;
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      throw error;
    }
  }

  static logout() {
    this.clearAuth();
  }
}
