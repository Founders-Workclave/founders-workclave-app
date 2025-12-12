"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import Link from "next/link";

const ResetComp = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };
  return (
    <div className={styles.otherContainer}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.email}>
            Email Address
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
          <button type="submit" className={styles.loginButton}>
            Send verification code
          </button>
          <p className={styles.otherTexts}>
            Remembered your password? <Link href="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetComp;
