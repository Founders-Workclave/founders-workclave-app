"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./styles.module.css";
import { useLogin } from "@/hooks/useAgencyLogin";
import { getUser, isAdmin, isAuthenticated, clearUser } from "@/lib/api/auth";
import ShowPassword from "@/svgs/showPassword";
import HidePassword from "@/svgs/hidePassword";
import Google from "@/svgs/google";

interface LoginFormProps {
  onSubmit?: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine user type based on the current URL path
  const isAgencyLogin = pathname?.includes("/agency");
  const userType = isAgencyLogin ? "agency" : undefined;

  // Pass userType to useLogin hook
  const { isLoading, error, success, login, resetState } = useLogin({
    userType,
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userTypeError, setUserTypeError] = useState<string | null>(null);

  // Redirect if already authenticated with correct user type
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      const currentUserType = user?.userType?.toLowerCase();

      console.log("👤 Already authenticated, checking user type...", {
        currentUserType,
        isAgencyLogin,
        expectedType: isAgencyLogin ? "agency" : "founder",
      });

      // If user type matches the login page, redirect to dashboard
      if (isAgencyLogin && currentUserType === "agency") {
        router.replace("/agency");
      } else if (!isAgencyLogin && currentUserType !== "agency") {
        if (user?.role === "admin") {
          router.replace("/admin");
        } else {
          const username =
            user?.username || user?.name.toLowerCase().replace(/\s+/g, ".");
          router.replace(`/${username}`);
        }
      }
      // If user type doesn't match, let them log out and log in with correct account
    }
  }, [isAgencyLogin, router]);

  // Handle successful login with user type validation
  useEffect(() => {
    if (success) {
      // Wait for localStorage to be updated
      const timer = setTimeout(() => {
        const user = getUser();

        if (!user) {
          console.error("❌ No user found after successful login");
          setUserTypeError("Login failed. Please try again.");
          return;
        }

        // CRITICAL: Validate user type matches the login page
        const userUserType = user.userType?.toLowerCase() || "founder";
        const expectedUserType = isAgencyLogin ? "agency" : "founder";

        console.log("🔍 User type validation:", {
          userUserType,
          expectedUserType,
          isAgencyLogin,
          match: userUserType === expectedUserType,
          fullUser: user,
        });

        // If user type doesn't match, show error and logout
        if (userUserType !== expectedUserType) {
          console.error("❌ Wrong user type for this login page");

          const errorMessage = isAgencyLogin
            ? "This account is not registered as an agency account."
            : "This appears to be an agency account.";

          setUserTypeError(errorMessage);
          clearUser();
          resetState();
          return;
        }

        // Clear any previous user type errors
        setUserTypeError(null);

        // Verify localStorage has the data
        const storedUser = localStorage.getItem("user");
        console.log("💾 Stored user (raw):", storedUser);

        console.log("🔄 Redirecting user:", {
          userId: user.id,
          role: user.role,
          userType: user.userType,
          isAdmin: isAdmin(),
          isAgencyLogin,
        });

        // Trigger onSubmit callback if provided
        if (onSubmit) {
          onSubmit(formData.email);
        }

        // Redirect based on login type and role
        if (isAgencyLogin) {
          console.log("✅ Redirecting to agency dashboard");
          window.location.href = "/agency";
        } else if (user.role === "admin") {
          console.log("✅ Redirecting to admin dashboard");
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
  }, [success, onSubmit, formData.email, isAgencyLogin, userType, resetState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Clear errors when user starts typing
    if (error || userTypeError) {
      resetState();
      setUserTypeError(null);
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setUserTypeError(null);
    resetState();

    // Basic validation
    if (!formData.email.trim()) {
      setUserTypeError("Please enter your email address");
      return;
    }

    if (!formData.password) {
      setUserTypeError("Please enter your password");
      return;
    }

    console.log("🔐 Submitting login:", {
      email: formData.email,
      isAgencyLogin,
      userType,
      endpoint: userType ? `login/?user_type=${userType}` : "login/",
    });

    await login({
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  // Combine error messages
  const displayError = userTypeError || error;

  return (
    <div className={styles.container}>
      <div className={styles.texts}>
        <h2>Welcome back{isAgencyLogin ? " 🏢" : "👋"}</h2>
        {isAgencyLogin && <p className={styles.subtitle}>Agency Portal</p>}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Success Message */}
        {success && !userTypeError && (
          <div className={styles.successMessage}>
            ✓ Login successful! Redirecting...
          </div>
        )}

        {/* Error Message */}
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
            placeholder={
              isAgencyLogin ? "agency@example.com" : "Enter email address"
            }
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
          <Link
            href={isAgencyLogin ? "/agency/reset-password" : "/reset-password"}
            className={styles.resetLink}
          >
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
          <Link
            href={isAgencyLogin ? "/sign-up/agency" : "/sign-up"}
            className={styles.signupLink}
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
