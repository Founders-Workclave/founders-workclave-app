"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./styles.module.css";
import Image from "next/image";
import Photo from "@/svgs/photo";
import { UserService, UserProfile } from "@/lib/api/userService";
import Loader from "../loader";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [passwords, setPasswords] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await UserService.getUserProfile();
        setProfile(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load profile"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  const handleProfileSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    const loadingToast = toast.loading("Saving profile...");

    try {
      const formData = new FormData();
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phone", profile.phone);

      // Add avatar if changed
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await UserService.updateUserProfile(formData);
      toast.success(response.message || "Profile updated successfully!", {
        id: loadingToast,
      });

      // Refresh profile data
      const updatedProfile = await UserService.getUserProfile();
      setProfile(updatedProfile);
      setAvatarFile(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
        { id: loadingToast }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long!");
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

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
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
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (profile) {
          setProfile({ ...profile, avatar: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
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
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt="Profile"
                width={100}
                height={100}
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
            />
          </div>
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
          <button
            onClick={handleProfileSave}
            className={styles.saveButton}
            disabled={isSaving}
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
              placeholder="Enter new password"
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
              placeholder="Repeat password"
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
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
