"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./styles.module.css";
import ShowPassword from "@/svgs/showPassword";
import Link from "next/link";
import HidePassword from "@/svgs/hidePassword";
import { useResetPassword } from "@/hooks/useReset";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const params = useParams();

  // Get the OTP from the URL params
  // Your route should be: /reset-password/[otp] or /change-password/otp/[otp]
  const otp = params?.otp as string;

  // Use the custom hook for resetting password
  const { isLoading, error, success, resetPassword, resetState } =
    useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Make sure we have the OTP
    if (!otp) {
      alert(
        "Invalid or missing verification code. Please start the process again."
      );
      router.push("/reset-password");
      return;
    }

    // Reset the password
    const result = await resetPassword(otp, password, confirmPassword);

    // If successful, redirect to login page after a brief delay
    if (result.success) {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  // Reset state when component unmounts
  useEffect(() => {
    return () => resetState();
  }, [resetState]);

  return (
    <div className={styles.otherContainer}>
      <div>
        <h2>Reset Password</h2>
        <p>Enter your new password and confirm</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          {/* Password Field */}
          <div className={styles.passwordWrapper}>
            <label htmlFor="password" className={styles.password}>
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (Min. of 8 characters)"
              className={styles.input}
              required
              disabled={isLoading}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeButton}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <ShowPassword /> : <HidePassword />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className={styles.passwordWrapper}>
            <label htmlFor="confirmPassword" className={styles.password}>
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className={styles.input}
              required
              disabled={isLoading}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.eyeButton}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <ShowPassword /> : <HidePassword />}
            </button>
          </div>

          {/* Show error message if there's an error */}
          {error && (
            <p
              className={styles.errorText}
              style={{ color: "red", marginTop: "8px" }}
            >
              {error}
            </p>
          )}

          {/* Show success message */}
          {success && (
            <p
              className={styles.successText}
              style={{ color: "green", marginTop: "8px" }}
            >
              Password reset successfully! Redirecting to login...
            </p>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          <p className={styles.otherTexts}>
            Remembered your password? <Link href="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
