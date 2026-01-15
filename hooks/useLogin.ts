import { useState } from "react";
import { authApi } from "@/lib/api/auth";

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

      if (response.success) {
        setSuccess(true);
        setError(null);
        return response;
      } else {
        setError(response.message || "Login failed");
        setSuccess(false);
        return response;
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";

      setError(errorMessage);
      setSuccess(false);

      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
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
