"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";
import { countryCodes, SignupFounder } from "@/utils/data";
import { useSignup } from "@/hooks/userSignup";
import ShowPassword from "@/svgs/showPassword";
import HidePassword from "@/svgs/hidePassword";

interface SignupFormProps {
  userType?: "Founder";
  onSubmit?: (data: SignupFounder) => void;
}

const SignupFormFounder: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const router = useRouter();
  const { isLoading, error, success, signup, resetState } = useSignup();

  const [formData, setFormData] = useState<SignupFounder>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+234",
    password: "",
    agreedToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Handle successful registration
  useEffect(() => {
    if (success) {
      // Call parent onSubmit if provided
      if (onSubmit) {
        onSubmit(formData);
      }

      // Redirect to dashboard or success page after 2 seconds
      setTimeout(() => {
        router.push("/dashboard"); // or '/welcome' or '/verify-email'
      }, 2000);
    }
  }, [success, router, onSubmit, formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Clear error when user starts typing
    if (error) {
      resetState();
    }

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.agreedToTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    await signup(formData);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Success Message */}
        {success && (
          <div className={styles.successMessage}>
            ✓ Account created successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && <div className={styles.errorMessage}>⚠ {error}</div>}

        <div className={styles.inputGroup}>
          <div className={styles.nameInputs}>
            <div>
              <label htmlFor="firstName" className={styles.label}>
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={styles.label}>
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>

        {/* Phone Number */}
        <div className={styles.inputGroup}>
          <label htmlFor="phoneNumber" className={styles.label}>
            Phone Number
          </label>
          <div className={styles.phoneWrapper}>
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleInputChange}
              className={styles.countryCodeSelect}
              disabled={isLoading}
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className={`${styles.input} ${styles.phoneInput}`}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password (Min. of 8 characters)"
              className={styles.input}
              minLength={8}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeButton}
              aria-label="Toggle password visibility"
              disabled={isLoading}
            >
              {showPassword ? <ShowPassword /> : <HidePassword />}
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="agreedToTerms"
            name="agreedToTerms"
            checked={formData.agreedToTerms}
            onChange={handleInputChange}
            className={styles.checkbox}
            required
            disabled={isLoading}
          />
          <label htmlFor="agreedToTerms" className={styles.checkboxLabel}>
            I agree to the{" "}
            <Link href="/terms" className={styles.link}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className={styles.link}>
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SignupFormFounder;
