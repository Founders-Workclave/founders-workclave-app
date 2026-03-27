import {
  getAuthToken,
  handleSessionTimeout,
  isAuthError,
  updateUserProfile as updateUserInStorage,
  getCurrentUser as getUserFromStorage,
} from "@/lib/api/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export interface ProfileImageUploadResponse {
  message: string;
  image?: string;
  profileImage?: string;
  imageUrl?: string;
  url?: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  detail?: string;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const profileImageService = {
  /**
   * Upload profile image for any user type
   * PATCH /profile-image-edit/
   */
  async uploadProfileImage(
    imageFile: File
  ): Promise<ProfileImageUploadResponse> {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new ApiError("Authentication required", 401);
      }

      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${API_BASE_URL}/profile-image-edit/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to upload profile image" }));

        console.error("❌ Upload failed:", errorData);

        if (isAuthError(response.status)) {
          handleSessionTimeout();
          throw new ApiError(
            "Session expired. Please log in again.",
            response.status,
            errorData
          );
        }

        throw new ApiError(
          errorData.message ||
            errorData.error ||
            errorData.detail ||
            "Failed to upload profile image",
          response.status,
          errorData
        );
      }

      const responseData = await response.json();

      const data = responseData.data || responseData;
      const imageUrl =
        data.image ||
        data.profileImage ||
        data.imageUrl ||
        data.url ||
        responseData.image ||
        responseData.profileImage ||
        responseData.imageUrl ||
        responseData.url;

      // Update localStorage with new profile image
      if (imageUrl) {
        const currentUser = getUserFromStorage();
        if (currentUser) {
          updateUserInStorage({ profileImage: imageUrl });
          // Dispatch event for other components
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("profileImageUpdated", {
                detail: { imageUrl },
              })
            );
          }
        }
      }

      return {
        message: data.message || "Profile image uploaded successfully",
        image: imageUrl,
        profileImage: imageUrl,
        imageUrl: imageUrl,
        url: imageUrl,
      };
    } catch (error) {
      console.error("💥 Exception in uploadProfileImage:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError(
        "An unknown error occurred while uploading profile image"
      );
    }
  },

  /**
   * Get current profile image from localStorage
   */
  getCurrentProfileImage(): string | null {
    const user = getUserFromStorage();
    return user?.profileImage || null;
  },

  /**
   * Validate image file before upload
   */
  validateImageFile(file: File): {
    isValid: boolean;
    error?: string;
  } {
    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Please upload a valid image file (JPG, PNG, or WebP)",
      };
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "Image size must be less than 5MB",
      };
    }

    return { isValid: true };
  },

  /**
   * Convert base64 data URL to File object
   */
  async dataURLtoFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  },
};
