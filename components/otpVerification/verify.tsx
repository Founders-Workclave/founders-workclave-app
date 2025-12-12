"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

interface OTPVerificationProps {
  email?: string;
  onVerify?: (otp: string) => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email = "einstein.oyakhilome@yahoo.com",
  onVerify,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
      setIsLoading(true);
      setTimeout(() => {
        if (onVerify) {
          onVerify(otpValue);
        }
        setIsLoading(false);
      }, 1000);
    }
  };
  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Verify email</h1>
        <p className={styles.subtitle}>
          A code has been sent to your{" "}
          <span className={styles.email}>{email}</span>.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
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

          <button
            type="submit"
            className={styles.verifyButton}
            disabled={!isComplete || isLoading}
          >
            {isLoading ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <p className={styles.loginText}>
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
