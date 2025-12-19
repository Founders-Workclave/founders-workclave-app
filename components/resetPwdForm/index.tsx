"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import Link from "next/link";
import { useSendOtp } from "@/hooks/useReset";

const ResetComp = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  // Use the custom hook for sending OTP
  const { isLoading, error, success, sendOtp, resetState } = useSendOtp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    if (!email || !email.includes("@")) {
      return;
    }

    // Send OTP to the email
    const result = await sendOtp(email);

    // If successful, redirect to OTP verification page
    // Note: You'll need to store the email somewhere (like session storage)
    // so the next page knows which email to verify
    if (result && result.success) {
      // Store email temporarily for the next step
      sessionStorage.setItem("reset_email", email);

      // Redirect to OTP verification page after a brief delay
      setTimeout(() => {
        router.push("/reset-password/verify-otp");
      }, 1500);
    }
  };

  // Reset state when component unmounts
  useEffect(() => {
    return () => resetState();
  }, [resetState]);

  return (
    <div className={styles.otherContainer}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.email}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className={styles.input}
            required
            disabled={isLoading}
          />

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
              Verification code sent! Redirecting...
            </p>
          )}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send verification code"}
          </button>

          <p className={styles.otherTexts}>
            Remembered your password? <Link href="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetComp;
