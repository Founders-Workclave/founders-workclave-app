"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import ShowPassword from "@/svgs/showPassword";
import Link from "next/link";
import HidePassword from "@/svgs/hidePassword";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };
  return (
    <div className={styles.otherContainer}>
      <div>
        <h2>Reset Password</h2>
        <p>Enter your new password and confirm</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <div className={styles.passwordWrapper}>
            <label htmlFor="password" className={styles.password}>
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (Min. of 8 characters)"
              className={styles.input}
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
          <div className={styles.passwordWrapper}>
            <label htmlFor="password" className={styles.password}>
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirm password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Repeat password"
              className={styles.input}
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
          <button type="submit" className={styles.loginButton}>
            Reset Password
          </button>
          <p className={styles.otherTexts}>
            Remembered your password? <Link href="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
