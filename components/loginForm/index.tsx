"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { useLogin } from "@/hooks/useLogin";
import { getUser, isAuthenticated, clearUser } from "@/lib/api/auth";
import ShowPassword from "@/svgs/showPassword";
import HidePassword from "@/svgs/hidePassword";
import Google from "@/svgs/google";

interface LoginFormProps {
  onSubmit?: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const router = useRouter();
  const { isLoading, error, success, login, resetState } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      console.log("=== ALREADY AUTHENTICATED CHECK ===");
      console.log("User object:", JSON.stringify(user, null, 2));

      const userType = user?.userType?.toLowerCase();
      const role = user?.role?.toLowerCase();

      console.log("Detected values:", {
        userType,
        role,
      });

      // Check userType first, then role
      if (userType === "agency") {
        console.log("→ Redirecting to /agency");
        router.replace("/agency");
      } else if (userType === "manager" || userType === "pm" || role === "pm") {
        console.log("→ Redirecting to /pm");
        router.replace("/pm");
      } else if (userType === "client" || role === "client") {
        console.log("→ Redirecting to /clients");
        router.replace("/clients");
      } else if (role === "admin") {
        console.log("→ Redirecting to /admin");
        router.replace("/admin");
      } else {
        // Only founders/regular users should go to /[username]
        const username =
          user?.username || user?.name?.toLowerCase().replace(/\s+/g, ".");
        console.log("→ Redirecting to /" + username);
        router.replace(`/${username}`);
      }
    }
  }, [router]);

  // Handle successful login
  useEffect(() => {
    if (success) {
      console.log("=== LOGIN SUCCESS - STARTING REDIRECT ===");

      const timer = setTimeout(() => {
        const user = getUser();

        console.log("User from localStorage:", JSON.stringify(user, null, 2));

        if (!user) {
          console.error("❌ No user found after successful login");
          setLoginError("Login failed. Please try again.");
          clearUser();
          resetState();
          return;
        }

        const userType = user.userType?.toLowerCase();
        const role = user.role?.toLowerCase();

        console.log("=== REDIRECT DECISION ===");
        console.log("userType:", userType);
        console.log("role:", role);

        setLoginError(null);

        if (onSubmit) {
          onSubmit(formData.email);
        }

        let redirectUrl = "";

        // Check userType first, then role
        if (userType === "agency") {
          redirectUrl = "/agency";
          console.log("✅ DECISION: Redirecting to /agency");
        } else if (
          userType === "manager" ||
          userType === "pm" ||
          role === "pm"
        ) {
          redirectUrl = "/pm";
          console.log("✅ DECISION: Redirecting to /pm");
        } else if (userType === "client" || role === "client") {
          redirectUrl = "/clients";
          console.log("✅ DECISION: Redirecting to /clients");
        } else if (role === "admin") {
          redirectUrl = "/admin";
          console.log("✅ DECISION: Redirecting to /admin");
        } else {
          // Only founders/regular users
          const username =
            user.username || user.name?.toLowerCase().replace(/\s+/g, ".");
          redirectUrl = `/${username}`;
          console.log("✅ DECISION: Redirecting to", redirectUrl);
        }

        console.log("=== EXECUTING REDIRECT TO:", redirectUrl, "===");
        console.log("Timestamp:", new Date().toISOString());

        window.location.href = redirectUrl;

        console.log("=== REDIRECT COMMAND SENT ===");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [success, onSubmit, formData.email, resetState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (error || loginError) {
      resetState();
      setLoginError(null);
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoginError(null);
    resetState();

    if (!formData.email.trim()) {
      setLoginError("Please enter your email address");
      return;
    }

    if (!formData.password) {
      setLoginError("Please enter your password");
      return;
    }

    console.log("🔐 Submitting login for:", formData.email);

    await login({
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  const displayError = loginError || error;

  return (
    <div className={styles.container}>
      <div className={styles.texts}>
        <h2>Welcome back 👋</h2>
        <p className={styles.subtitle}>Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {success && !loginError && (
          <div className={styles.successMessage}>
            ✓ Login successful! Redirecting...
          </div>
        )}

        {displayError && (
          <div className={styles.errorMessage}>⚠ {displayError}</div>
        )}

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
            placeholder="Enter your email address"
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
              placeholder="Enter your password"
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
