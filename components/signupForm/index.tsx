"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";
import { countryCodes, SignupFormData } from "@/utils/data";
import { useSignup } from "@/hooks/userSignup";
import ShowPassword from "@/svgs/showPassword";
import HidePassword from "@/svgs/hidePassword";

interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => void;
}

const SignupFormAgency: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const router = useRouter();

  // Pass userType to the signup hook
  const { isLoading, error, success, signup, resetState } = useSignup({
    userType: "agency",
  });

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    countryCode: "+234",
    password: "",
    agreedToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle successful registration
  useEffect(() => {
    if (success) {
      console.log("✅ Agency signup successful, redirecting...");

      // Call parent onSubmit if provided
      if (onSubmit) {
        onSubmit(formData);
      }

      // Redirect to agency dashboard after short delay
      setTimeout(() => {
        router.push("/agency");
      }, 1500);
    }
  }, [success, router, onSubmit, formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Clear errors when user starts typing
    if (error || validationError) {
      resetState();
      setValidationError(null);
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

    // Clear previous errors
    setValidationError(null);
    resetState();

    // Validation
    if (!formData.firstName.trim()) {
      setValidationError("First name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      setValidationError("Last name is required");
      return;
    }

    if (!formData.email.trim()) {
      setValidationError("Email is required");
      return;
    }

    if (!formData.companyName.trim()) {
      setValidationError("Company name is required");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setValidationError("Phone number is required");
      return;
    }

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return;
    }

    if (!formData.agreedToTerms) {
      setValidationError(
        "Please agree to the Terms of Service and Privacy Policy"
      );
      return;
    }

    console.log("🔐 Submitting agency signup:", {
      email: formData.email,
      companyName: formData.companyName,
      userType: "agency",
    });

    // Call signup function from hook
    await signup(formData);
  };

  // Combine validation and API errors
  const displayError = validationError || error;

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Success Message */}
        {success && (
          <div className={styles.successMessage}>
            ✓ Agency account created successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Error Message */}
        {displayError && (
          <div className={styles.errorMessage}>⚠ {displayError}</div>
        )}

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
            placeholder="agency@example.com"
            className={styles.input}
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        {/* Company Name */}
        <div className={styles.inputGroup}>
          <label htmlFor="companyName" className={styles.label}>
            Company name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name"
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
              autoComplete="new-password"
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
          disabled={isLoading || !formData.agreedToTerms}
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

export default SignupFormAgency;
