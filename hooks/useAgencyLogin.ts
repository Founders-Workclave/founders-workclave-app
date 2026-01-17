import { useState } from "react";
import { authApi } from "@/lib/api/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface UseLoginOptions {
  userType?: string;
}

export const useLogin = (options?: UseLoginOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("🔐 useLogin: Calling API with userType:", options?.userType);

      // CRITICAL: Pass userType to the API call
      const response = await authApi.login(payload, options?.userType);

      if (response.success) {
        console.log("✅ useLogin: Login successful");
        setSuccess(true);
        setError(null);
        return response;
      } else {
        console.error("❌ useLogin: Login failed:", response.message);
        setError(response.message || "Login failed");
        setSuccess(false);
        return response;
      }
    } catch (err) {
      console.error("❌ useLogin: Exception occurred:", err);
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

export const useAgencyLogin = () => {
  return useLogin({ userType: "agency" });
};

export const useFounderLogin = () => {
  return useLogin({ userType: "founder" });
};
