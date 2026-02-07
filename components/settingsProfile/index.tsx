"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./styles.module.css";
import Image from "next/image";
import Photo from "@/svgs/photo";
import { UserService, UserProfile } from "@/lib/api/userService";
import Loader from "../loader";
import { useRouter } from "next/navigation";
import PasswordChangeComponent from "../changePassword";

const SettingsPage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = () => {
      try {
        setIsLoading(true);

        const cached = UserService.getCachedUserProfile();

        if (!cached) {
          toast.error("No profile found. Please log in again.");
          router.push("/login");
          return;
        }

        setProfile(cached);
        setOriginalProfile(cached);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load profile";
        toast.error(errorMessage);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const hasProfileChanges = () => {
    if (!profile || !originalProfile) return false;
    return (
      profile.firstName !== originalProfile.firstName ||
      profile.lastName !== originalProfile.lastName ||
      profile.phone !== originalProfile.phone ||
      avatarFile !== null
    );
  };

  const handleProfileSave = async () => {
    if (!profile) return;

    // Validate inputs
    if (!profile.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!profile.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Saving profile...");

    try {
      const formData = new FormData();
      formData.append("firstName", profile.firstName.trim());
      formData.append("lastName", profile.lastName.trim());
      formData.append("phone", profile.phone.trim());

      // Add avatar if changed
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await UserService.updateUserProfile(formData);
      toast.success(response.message || "Profile updated successfully!", {
        id: loadingToast,
      });

      // Refresh profile data from localStorage (it was updated by the service)
      const updatedProfile = UserService.getCachedUserProfile();
      if (updatedProfile) {
        setProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
      }
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
        { id: loadingToast }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelProfile = () => {
    if (originalProfile) {
      setProfile(originalProfile);
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader type="pulse" loading={isLoading} size={15} color="#5865F2" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Failed to load profile</p>
          <button
            onClick={() => router.push("/login")}
            className={styles.saveButton}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Profile Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Profile</h2>
        </div>

        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            {avatarPreview || profile.avatar ? (
              <Image
                src={avatarPreview || profile.avatar!}
                alt="Profile"
                width={100}
                height={100}
                loading="eager"
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {getInitials(profile.firstName, profile.lastName)}
              </div>
            )}
            <label htmlFor="avatar-upload" className={styles.avatarEditButton}>
              <Photo />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className={styles.avatarInput}
              disabled={isSaving}
            />
          </div>
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>
              {profile.firstName} {profile.lastName}
            </h3>
            <p className={styles.userEmail}>{profile.email}</p>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>First name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => handleProfileChange("firstName", e.target.value)}
              className={styles.input}
              disabled={isSaving}
              placeholder="Enter first name"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Last name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => handleProfileChange("lastName", e.target.value)}
              className={styles.input}
              disabled={isSaving}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={profile.email}
            className={styles.input}
            disabled
            title="Email cannot be changed"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone number</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleProfileChange("phone", e.target.value)}
            className={styles.input}
            placeholder="+2349045433344"
            disabled={isSaving}
          />
        </div>

        <div className={styles.actionButtons}>
          {hasProfileChanges() && (
            <button
              onClick={handleCancelProfile}
              className={styles.cancelButton}
              disabled={isSaving}
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleProfileSave}
            className={styles.saveButton}
            disabled={isSaving || !hasProfileChanges()}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Reset Password Section */}
      <div className={styles.section}>
        <PasswordChangeComponent />
      </div>
    </div>
  );
};

export default SettingsPage;
