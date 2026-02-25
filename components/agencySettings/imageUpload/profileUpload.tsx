"use client";
import { useState } from "react";

import { profileImageService, ApiError } from "@/lib/api/profileImageService";
import ImageUpload from ".";

interface ProfileUploadWithServiceProps {
  currentImage: string;
  userName: string;
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
  onUploadStart?: () => void;
}

const ProfileUploadWithService: React.FC<ProfileUploadWithServiceProps> = ({
  currentImage,
  userName,
  onUploadSuccess,
  onUploadError,
  onUploadStart,
}) => {
  const [previewImage, setPreviewImage] = useState<string>(currentImage);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (imageDataUrl: string) => {
    try {
      // Notify upload started
      if (onUploadStart) {
        onUploadStart();
      }

      setIsUploading(true);

      // Show preview immediately (optimistic update)
      setPreviewImage(imageDataUrl);

      console.log("🎨 Converting image to file...");

      // Convert base64 to File
      const file = await profileImageService.dataURLtoFile(
        imageDataUrl,
        "profile-image.jpg"
      );

      // Validate file
      const validation = profileImageService.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      console.log("📤 Uploading to API...");

      // Upload to server
      const response = await profileImageService.uploadProfileImage(file);

      console.log("✅ Upload successful:", response);

      // Update with server URL
      const imageUrl =
        response.imageUrl || response.image || response.profileImage || "";

      if (imageUrl) {
        setPreviewImage(imageUrl);

        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess(imageUrl);
        }
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);

      // Revert to original image on error
      setPreviewImage(currentImage);

      let errorMessage = "Failed to upload image";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      // Call error callback
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <ImageUpload
        currentImage={previewImage}
        onImageUpload={handleImageUpload}
        userName={userName}
      />

      {isUploading && (
        <div
          style={{
            textAlign: "left",
            marginTop: "8px",
            fontSize: "13px",
            color: "#3b82f6",
            fontWeight: "500",
            fontFamily: "inter",
          }}
        >
          Uploading image...
        </div>
      )}
    </>
  );
};

export default ProfileUploadWithService;
