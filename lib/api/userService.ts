import { getAuthHeaders } from "@/lib/utils/auth";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface UserProfileResponse {
  message: string;
  user: UserProfile;
}

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

interface PasswordChangeResponse {
  message: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class UserService {
  /**
   * Get current user profile
   * @returns Promise with user profile
   */
  static async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });

      if (response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data: UserProfileResponse = await response.json();
      return data.user;
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param profileData - Updated profile data (formdata)
   * @returns Promise with response message
   */
  static async updateUserProfile(
    profileData: FormData
  ): Promise<{ message: string }> {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`${API_BASE_URL}/user-edit/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: profileData,
      });

      if (response.status === 401) {
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
      return data;
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param passwordData - Current and new password
   * @returns Promise with response message
   */
  static async changePassword(
    passwordData: PasswordChangeRequest
  ): Promise<PasswordChangeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/change-password/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(passwordData),
      });

      if (response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to change password: ${response.statusText}`
        );
      }

      const data: PasswordChangeResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error in changePassword:", error);
      throw error;
    }
  }
}
