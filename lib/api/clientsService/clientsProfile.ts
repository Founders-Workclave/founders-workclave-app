import {
  getAuthToken,
  handleSessionTimeout,
  isAuthError,
  updateUserProfile as updateUserInStorage,
  getCurrentUser as getUserFromStorage,
} from "@/lib/api/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  role: "admin" | "user" | "clients" | "manager";
  userType?: string;
  username: string;
  company?: string;
  phoneNumber?: string;
  countryCode?: string;
  profileImage?: string;
}

export interface LogoUploadResponse {
  message: string;
  logoUrl?: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const profileService = {
  /**
   * Get user profile from localStorage
   */
  getUserProfile(): UserProfile | null {
    return getUserFromStorage();
  },

  /**
   * Fetch user profile from server using /user/ endpoint
   */
  async fetchUserProfile(): Promise<UserProfile> {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      const response = await fetch(`${API_BASE_URL}/user/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to fetch profile" }));

        if (isAuthError(response.status)) {
          handleSessionTimeout();
          throw new ApiError(
            "Session expired. Please log in again.",
            response.status,
            errorData
          );
        }

        throw new ApiError(
          errorData.message || errorData.error || "Failed to fetch profile",
          response.status,
          errorData
        );
      }

      const response_data = await response.json();

      const hasDataWrapper = response_data.data !== undefined;
      const data = hasDataWrapper ? response_data.data : response_data;

      const existingUser = getUserFromStorage() as UserProfile | null;

      // Parse phone number to remove spaces and separate country code
      let phoneNumber =
        data.phone || data.phoneNumber || existingUser?.phoneNumber || "";
      phoneNumber = phoneNumber.replace(/\s/g, "");

      const profileImage =
        data.image ||
        data.profileImage ||
        data.logo ||
        data.logoUrl ||
        data.companyLogo ||
        data.avatar ||
        response_data.image ||
        response_data.logo ||
        existingUser?.profileImage;

      // Update localStorage with fetched data
      const updatedProfile: Partial<UserProfile> = {
        firstName: data.firstName,
        lastName: data.lastName,
        name:
          data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : existingUser?.name,
        email: data.email || existingUser?.email,
        company: data.company || data.company,
        phoneNumber: phoneNumber || existingUser?.phoneNumber || "",
        id: existingUser?.id || data.id,
        role: existingUser?.role || data.role,
        userType: data.user || existingUser?.userType,
        username: existingUser?.username || data.username,
        profileImage: profileImage, // Use the image we found
      };

      this.updateUserProfile(updatedProfile);

      const finalUser = this.getUserProfile();
      return finalUser as UserProfile;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while fetching profile");
    }
  },

  /**
   * Update user profile in localStorage
   */
  updateUserProfile(updates: Partial<UserProfile>): void {
    updateUserInStorage(updates);

    // Dispatch custom event to notify other components
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: updates,
        })
      );
    }
  },

  /**
   * Update user profile on server
   */
  async updateProfileOnServer(updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
  }): Promise<UserProfile> {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      const formData = new FormData();

      // Only append non-empty values
      if (updates.firstName?.trim())
        formData.append("firstName", updates.firstName.trim());
      if (updates.lastName?.trim())
        formData.append("lastName", updates.lastName.trim());
      if (updates.email?.trim()) formData.append("email", updates.email.trim());
      if (updates.company?.trim())
        formData.append("company", updates.company.trim());

      // Only send phone if it has more than just the country code
      if (updates.phone?.trim() && updates.phone.length > 5) {
        formData.append("phone", updates.phone.trim());
      }

      const response = await fetch(`${API_BASE_URL}/user/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to update profile" }));

        // Handle authentication errors
        if (isAuthError(response.status)) {
          handleSessionTimeout();
          throw new ApiError(
            "Session expired. Please log in again.",
            response.status,
            errorData
          );
        }

        throw new ApiError(
          errorData.message || errorData.error || "Failed to update profile",
          response.status,
          errorData
        );
      }

      const response_data = await response.json();

      const responseData = response_data.data || {};
      const cleanPhone = responseData.phone
        ? responseData.phone.replace(/\s/g, "")
        : updates.phone
        ? updates.phone.replace(/\s/g, "")
        : undefined;

      const updatedProfile: Partial<UserProfile> = {
        firstName: responseData.firstName || updates.firstName,
        lastName: responseData.lastName || updates.lastName,
        name:
          (responseData.firstName || updates.firstName) &&
          (responseData.lastName || updates.lastName)
            ? `${responseData.firstName || updates.firstName} ${
                responseData.lastName || updates.lastName
              }`
            : undefined,
        email: responseData.email || updates.email,
        company: responseData.company || updates.company,
        phoneNumber: cleanPhone,
      };

      this.updateUserProfile(updatedProfile);

      return this.getUserProfile() as UserProfile;
    } catch (error) {
      console.error("Update profile error:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while updating profile");
    }
  },

  /**
   * Upload company logo
   */
  async uploadLogo(logoFile: File): Promise<LogoUploadResponse> {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      const formData = new FormData();
      formData.append("logo", logoFile);

      const response = await fetch(`${API_BASE_URL}/client/edit-logo/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to upload logo" }));

        if (isAuthError(response.status)) {
          handleSessionTimeout();
          throw new ApiError(
            "Session expired. Please log in again.",
            response.status,
            errorData
          );
        }

        throw new ApiError(
          errorData.message || errorData.error || "Failed to upload logo",
          response.status,
          errorData
        );
      }

      const responseData = await response.json();

      const data = responseData.data || responseData;

      // Try to find the image URL in ALL possible fields
      const imageUrl =
        data.logoUrl ||
        data.logo ||
        data.image ||
        data.profileImage ||
        data.companyLogo ||
        data.url ||
        responseData.logoUrl ||
        responseData.logo ||
        responseData.image ||
        responseData.url;

      if (imageUrl) {
        this.updateUserProfile({ profileImage: imageUrl });
        return {
          message: data.message || "Logo uploaded successfully",
          logoUrl: imageUrl,
        };
      } else {
        console.warn("⚠️ No image URL found in upload response!");
        return {
          message: data.message || "Logo uploaded successfully",
        };
      }
    } catch (error) {
      console.error("❌ Logo upload error:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while uploading logo");
    }
  },

  /**
   * Clear user profile from localStorage (logout)
   */
  clearUserProfile(): void {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error clearing user profile from localStorage:", error);
    }
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated(): boolean {
    return this.getUserProfile() !== null;
  },
};
