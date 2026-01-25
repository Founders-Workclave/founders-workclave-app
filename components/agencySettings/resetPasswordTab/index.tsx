"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import PasswordInput from "../passwordInput";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordTab: React.FC = () => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<PasswordData>>({});

  const handleChange = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordData> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        console.log("Password reset successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reset password</h2>

      <PasswordInput
        label="Current password"
        placeholder="Enter current password"
        value={passwordData.currentPassword}
        onChange={(value) => handleChange("currentPassword", value)}
        error={errors.currentPassword}
      />

      <PasswordInput
        label="New password"
        placeholder="Enter current password"
        value={passwordData.newPassword}
        onChange={(value) => handleChange("newPassword", value)}
        error={errors.newPassword}
      />

      <PasswordInput
        label="Confirm password"
        placeholder="Repeat password"
        value={passwordData.confirmPassword}
        onChange={(value) => handleChange("confirmPassword", value)}
        error={errors.confirmPassword}
      />

      <button className={styles.saveButton} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default ResetPasswordTab;
