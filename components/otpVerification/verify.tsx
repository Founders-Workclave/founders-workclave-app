"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";
import { useVerifyOtp } from "@/hooks/useReset";

interface OTPVerificationProps {
  email?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email }) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Get email from session storage if not provided as prop
  const userEmail =
    email ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("reset_email") || ""
      : "");

  // Use the verify OTP hook
  const { isLoading, error, success, verifyOtp, resetState } = useVerifyOtp();

  useEffect(() => {
    // If no email found, redirect back to reset password page
    if (!userEmail) {
      router.push("/reset-password");
    }

    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, [userEmail, router]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Move to next input on arrow right
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const pastedArray = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];

    pastedArray.forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length === 6) {
      // Verify the OTP with the backend
      const result = await verifyOtp(otpValue);

      // If verification successful, redirect to password reset page
      if (result.success) {
        // Wait a moment for user to see success message
        setTimeout(() => {
          router.push(`/change-password/otp/${otpValue}`);
        }, 1500);
      }
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  // Reset state when component unmounts
  useEffect(() => {
    return () => resetState();
  }, [resetState]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Verify email</h1>
        <p className={styles.subtitle}>
          A code has been sent to your{" "}
          <span className={styles.email}>{userEmail || "email"}</span>.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`${styles.otpInput} ${digit ? styles.filled : ""}`}
                aria-label={`Digit ${index + 1}`}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Show error message if there's an error */}
          {error && (
            <p
              style={{
                color: "red",
                marginTop: "12px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          {/* Show success message */}
          {success && (
            <p
              style={{
                color: "green",
                marginTop: "12px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              Code verified! Redirecting...
            </p>
          )}

          <button
            type="submit"
            className={styles.verifyButton}
            disabled={!isComplete || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <p className={styles.loginText}>
          Didn&apos;t receive the code?{" "}
          <Link href="/reset-password" className={styles.loginLink}>
            Resend
          </Link>
        </p>

        <p className={styles.loginText} style={{ marginTop: "8px" }}>
          Remembered your password?{" "}
          <Link href="/login" className={styles.loginLink}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
