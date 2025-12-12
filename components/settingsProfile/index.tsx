"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Photo from "@/svgs/photo";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  avatar?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage = () => {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "Waren",
    lastName: "Waden",
    email: "Einstein.oyakhilome1@gmail.com",
    phone: "9045433344",
    countryCode: "+234",
    avatar: undefined,
  });

  const [passwords, setPasswords] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = () => {
    console.log("Saving profile:", profile);
    // Add your profile save logic here
    alert("Profile saved successfully!");
  };

  const handlePasswordSave = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    if (passwords.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    console.log("Changing password");
    // Add your password change logic here
    alert("Password changed successfully!");
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

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
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Last name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => handleProfileChange("lastName", e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone number</label>
          <div className={styles.phoneInput}>
            <div className={styles.countryCode}>
              <span className={styles.flag}>🇳🇬</span>
              <span>{profile.countryCode}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
              className={styles.phoneNumberInput}
            />
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button onClick={handleProfileSave} className={styles.saveButton}>
            Save Changes
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
              placeholder="Enter current password"
              value={passwords.newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
              className={styles.input}
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
          <button onClick={handlePasswordSave} className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
