"use client";
import { useState } from "react";
import styles from "./styles.module.css";

interface PasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          className={`${styles.input} ${error ? styles.error : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setShowPassword(!showPassword)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {showPassword ? (
              <>
                <path
                  d="M14.95 14.95C13.5237 16.0358 11.7734 16.6374 9.96667 16.6667C4.96667 16.6667 1.66667 10 1.66667 10C2.82593 7.84922 4.47278 6.02181 6.45 4.68333M8.25 3.43333C8.81389 3.30278 9.38889 3.23611 9.96667 3.23333C14.9667 3.23333 18.2667 10 18.2667 10C17.7555 10.9463 17.1407 11.8373 16.4333 12.6583M11.7667 11.7667C11.5378 12.0123 11.2617 12.2093 10.9546 12.3459C10.6474 12.4825 10.3157 12.556 9.97928 12.5619C9.64283 12.5678 9.30865 12.506 8.99675 12.3802C8.68485 12.2543 8.40181 12.067 8.16454 11.8297C7.92728 11.5925 7.73995 11.3094 7.61411 10.9975C7.48827 10.6856 7.42644 10.3514 7.43237 10.015C7.4383 9.67851 7.51186 9.34684 7.64846 9.03967C7.78506 8.7325 7.98203 8.45637 8.22767 8.22751"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M1.66667 1.66667L18.3333 18.3333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </>
            ) : (
              <>
                <path
                  d="M1.66667 10C1.66667 10 4.96667 3.33333 9.96667 3.33333C14.9667 3.33333 18.2667 10 18.2667 10C18.2667 10 14.9667 16.6667 9.96667 16.6667C4.96667 16.6667 1.66667 10 1.66667 10Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M9.96667 12.5C11.3474 12.5 12.4667 11.3807 12.4667 10C12.4667 8.61929 11.3474 7.5 9.96667 7.5C8.58596 7.5 7.46667 8.61929 7.46667 10C7.46667 11.3807 8.58596 12.5 9.96667 12.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </>
            )}
          </svg>
        </button>
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default PasswordInput;
