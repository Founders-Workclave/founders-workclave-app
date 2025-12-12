"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { countryCodes, SignupFormData } from "@/utils/data";
import ShowPassword from "@/svgs/showPassword";
import HidePassword from "@/svgs/hidePassword";

interface SignupFormProps {
  userType?: "Founder";
  onSubmit?: (data: SignupFormData) => void;
}

const SignupFormFounder: React.FC<SignupFormProps> = ({ onSubmit }) => {
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
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);

    /*
    // API intergation
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType: userType,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (onSubmit) {
          onSubmit(formData);
        }
        // Redirect to success page or dashboard
      } else {
        alert(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
    */

    setTimeout(() => {
      if (onSubmit) {
        onSubmit(formData);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
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
