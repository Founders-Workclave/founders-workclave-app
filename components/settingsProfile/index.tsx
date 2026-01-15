"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./styles.module.css";
import Image from "next/image";
import Photo from "@/svgs/photo";
import { UserService, UserProfile } from "@/lib/api/userService";
import Loader from "../loader";
import { useRouter } from "next/navigation";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

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

  const [passwords, setPasswords] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const loadProfile = () => {
      try {
        setIsLoading(true);

        // Get profile from localStorage (populated during login/signup)
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

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
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

  const handlePasswordSave = async () => {
    // Validate password fields
    if (!passwords.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!passwords.newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
    if (passwords.newPassword === passwords.currentPassword) {
      toast.error("New password must be different from current password!");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Changing password...");

    try {
      const response = await UserService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      toast.success(response.message || "Password changed successfully!", {
        id: loadingToast,
      });

      // Clear password fields
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Reset visibility toggles
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change password",
        { id: loadingToast }
      );
    } finally {
      setIsSaving(false);
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

  const hasPasswordChanges = () => {
    return (
      passwords.currentPassword !== "" ||
      passwords.newPassword !== "" ||
      passwords.confirmPassword !== ""
    );
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
        <h2 className={styles.sectionTitleTwo}>Reset password</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Current password</label>
          <div className={styles.passwordInput}>
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter current password"
              value={passwords.currentPassword}
              onChange={(e) =>
                handlePasswordChange("currentPassword", e.target.value)
              }
              className={styles.input}
              disabled={isSaving}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className={styles.eyeButton}
              aria-label={
                showCurrentPassword ? "Hide password" : "Show password"
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {showCurrentPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>New password</label>
          <div className={styles.passwordInput}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password (min. 8 characters)"
              value={passwords.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
              className={styles.input}
              disabled={isSaving}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className={styles.eyeButton}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {showNewPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Confirm password</label>
          <div className={styles.passwordInput}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat new password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
              className={styles.input}
              disabled={isSaving}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.eyeButton}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {showConfirmPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button
            onClick={handlePasswordSave}
            className={styles.saveButton}
            disabled={isSaving || !hasPasswordChanges()}
          >
            {isSaving ? "Saving..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
