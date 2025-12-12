"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import ShowPassword from "@/svgs/showPassword";
import Google from "@/svgs/google";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className={styles.container}>
      <div className={styles.texts}>
        {/* <Image src="/assets/logo-new.png" width={107} height={32} alt="logo" /> */}
        <h2>Welcome back👋</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className={styles.input}
            required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeButton}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <ShowPassword /> : <ShowPassword />}
            </button>
          </div>
        </div>

        <div className={styles.forgotPassword}>
          Forgot password?{" "}
          <Link href="/reset-password" className={styles.resetLink}>
            Reset it here
          </Link>
        </div>

        <button type="submit" className={styles.loginButton}>
          Login
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
          <Link href="#" className={styles.actionBtn}>
            <Google />
            Continue with Google
          </Link>
        </div>
        <div className={styles.signupText}>
          Don’t have an account?{" "}
          <Link href="/sign-up" className={styles.signupLink}>
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
