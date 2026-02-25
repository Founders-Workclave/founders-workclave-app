import {
  getAuthToken,
  handleSessionTimeout,
  isAuthError,
  updateUserProfile as updateUserInStorage,
  getCurrentUser as getUserFromStorage,
} from "@/lib/api/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

// Type definitions
export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  role: "admin" | "user" | "clients" | "manager";
  userType?: string;
  username: string;
  companyName?: string;
  phoneNumber?: string;
  countryCode?: string;
  profileImage?: string;
}

export interface LogoUploadResponse {
  message: string;
  logoUrl?: string;
  companyLogo?: string;
  image?: string;
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

/**
 * Convert relative URL to absolute URL
 */
const toAbsoluteUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

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
      console.log("Fetched user profile RAW:", response_data);
      const hasDataWrapper = response_data.data !== undefined;
      const data = hasDataWrapper ? response_data.data : response_data;
      console.log("Extracted data:", data);
      console.log("🖼️ Image fields from API:", {
        image: data.image,
        companyLogo: data.companyLogo,
        profileImage: data.profileImage,
      });

      const existingUser = getUserFromStorage() as UserProfile | null;

      let phoneNumber =
        data.phone || data.phoneNumber || existingUser?.phoneNumber || "";
      phoneNumber = phoneNumber.replace(/\s/g, "");

      const updatedProfile: Partial<UserProfile> = {
        firstName: data.firstName,
        lastName: data.lastName,
        name:
          data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : existingUser?.name,
        email: data.email || existingUser?.email,
        companyName: data.companyName || data.company,
        phoneNumber: phoneNumber || existingUser?.phoneNumber || "",
        id: existingUser?.id || data.id,
        role: existingUser?.role || data.role,
        userType: data.user || existingUser?.userType,
        username: existingUser?.username || data.username,
        // ✅ Check companyLogo first (uploaded logo), then image (profile pic)
        profileImage: toAbsoluteUrl(
          data.companyLogo ||
            data.image ||
            data.profileImage ||
            existingUser?.profileImage
        ),
      };

      console.log("Updated profile to store:", updatedProfile);
      this.updateUserProfile(updatedProfile);

      const finalUser = this.getUserProfile();
      console.log("Final user in storage after update:", finalUser);
      return finalUser as UserProfile;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error)
        throw new ApiError(`Network error: ${error.message}`);
      throw new ApiError("An unknown error occurred while fetching profile");
    }
  },

  /**
   * Update user profile in localStorage
   */
  updateUserProfile(updates: Partial<UserProfile>): void {
    updateUserInStorage(updates);

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

      if (updates.firstName?.trim())
        formData.append("firstName", updates.firstName.trim());
      if (updates.lastName?.trim())
        formData.append("lastName", updates.lastName.trim());
      if (updates.email?.trim()) formData.append("email", updates.email.trim());
      if (updates.company?.trim())
        formData.append("company", updates.company.trim());
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
      console.log("Success response:", response_data);

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
        companyName: responseData.company || updates.company,
        phoneNumber: cleanPhone,
      };

      this.updateUserProfile(updatedProfile);

      return this.getUserProfile() as UserProfile;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error)
        throw new ApiError(`Network error: ${error.message}`);
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

      const response = await fetch(`${API_BASE_URL}/agency/edit-logo/`, {
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

      const data: LogoUploadResponse = await response.json();
      console.log("🖼️ Upload logo response:", JSON.stringify(data));

      // ✅ Check all possible field names the API might return
      const imageUrl = data.logoUrl || data.companyLogo || data.image;
      if (imageUrl) {
        this.updateUserProfile({ profileImage: toAbsoluteUrl(imageUrl) });
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error)
        throw new ApiError(`Network error: ${error.message}`);
      throw new ApiError("An unknown error occurred while uploading logo");
    }
  },

  /**
   * Clear user profile from localStorage (logout)
   */
  clearUserProfile(): void {
    if (typeof window === "undefined") return;
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
