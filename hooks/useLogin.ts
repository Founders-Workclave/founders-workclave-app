import { useState } from "react";
import { authApi, setUser } from "@/lib/api/auth";

interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await authApi.login(payload);

      if (response.success && response.data) {
        // Store token if available
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        // Extract username from email (everything before @)
        const emailUsername = (response.data.email || payload.email).split(
          "@"
        )[0];

        // Construct user info - adjust based on your API response
        const userData = {
          id: response.data.userId || response.data.id || "unknown",
          name:
            response.data.firstName && response.data.lastName
              ? `${response.data.firstName} ${response.data.lastName}`
              : response.data.name || emailUsername,
          email: response.data.email || payload.email,
          username: emailUsername, // Add username field for URL routing
        };

        // Store user info in localStorage
        setUser(userData);
        setSuccess(true);
        setError(null);
      } else {
        setError(response.message || "Login failed");
        setSuccess(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    isLoading,
    error,
    success,
    login,
    resetState,
  };
};
