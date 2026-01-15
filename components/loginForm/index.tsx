"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { useLogin } from "@/hooks/useLogin";
import { getUser, isAdmin } from "@/lib/api/auth";
import ShowPassword from "@/svgs/showPassword";
import HidePassword from "@/svgs/hidePassword";
import Google from "@/svgs/google";

interface LoginFormProps {
  onSubmit?: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { isLoading, error, success, login, resetState } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Handle successful login with role-based routing
  useEffect(() => {
    if (success) {
      if (onSubmit) {
        onSubmit(formData.email);
      }

      // Wait for localStorage to be updated and verified
      const timer = setTimeout(() => {
        const user = getUser();

        console.log("🔄 Redirecting user:", {
          userId: user?.id,
          role: user?.role,
          isAdmin: isAdmin(),
          fullUser: user,
        });

        if (!user) {
          console.error("❌ No user found after successful login");
          return;
        }

        // Verify localStorage has the data
        const storedUser = localStorage.getItem("user");
        console.log("💾 Stored user (raw):", storedUser);

        // Redirect based on user role - use window.location for hard navigation
        if (user.role === "admin") {
          console.log("✅ Redirecting to admin dashboard");
          // Hard navigation to ensure fresh state
          window.location.href = "/admin";
        } else {
          // Redirect regular user to their personal dashboard
          const username =
            user.username || user.name.toLowerCase().replace(/\s+/g, ".");
          console.log("✅ Redirecting to user dashboard:", `/${username}`);
          window.location.href = `/${username}`;
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [success, onSubmit, formData.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Clear error when user starts typing
    if (error) {
      resetState();
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email.trim()) {
      resetState();
      return;
    }

    if (!formData.password) {
      resetState();
      return;
    }

    await login({
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.texts}>
        <h2>Welcome back👋</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Success Message */}
        {success && (
          <div className={styles.successMessage}>
            ✓ Login successful! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && <div className={styles.errorMessage}>⚠ {error}</div>}

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
            autoComplete="email"
          />
        </div>

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
              placeholder="Enter password"
              className={styles.input}
              required
              disabled={isLoading}
              autoComplete="current-password"
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

        <div className={styles.forgotPassword}>
          Forgot password?{" "}
          <Link href="/reset-password" className={styles.resetLink}>
            Reset it here
          </Link>
        </div>

        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading || !formData.email || !formData.password}
        >
          {isLoading ? "Logging in..." : "Login"}
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

        {/* login buttons */}
        <div className={styles.dividerAlt}>
          <span>OR</span>
        </div>
        <div className={styles.loginBtn}>
          <button
            type="button"
            className={styles.actionBtn}
            disabled={isLoading}
          >
            <Google />
            Continue with Google
          </button>
        </div>
        <div className={styles.signupText}>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className={styles.signupLink}>
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
