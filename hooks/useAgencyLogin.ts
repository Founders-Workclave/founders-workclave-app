import { useState } from "react";
import { authApi } from "@/lib/api/auth";

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  userType?: string;
}

interface UseRegisterOptions {
  userType?: string;
}

export const useRegister = (options?: UseRegisterOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (payload: Omit<RegisterPayload, "userType">) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log(
        "📝 useRegister: Calling API with userType:",
        options?.userType
      );

      // Add userType to the payload
      const fullPayload: RegisterPayload = {
        ...payload,
        userType: options?.userType,
      };

      const response = await authApi.register(fullPayload);

      if (response.success) {
        console.log("✅ useRegister: Registration successful");
        setSuccess(true);
        setError(null);
        return response;
      } else {
        console.error("❌ useRegister: Registration failed:", response.message);
        setError(response.message || "Registration failed");
        setSuccess(false);
        return response;
      }
    } catch (err) {
      console.error("❌ useRegister: Exception occurred:", err);
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
    register,
    resetState,
  };
};

// Specialized hooks for different user types
export const useAgencyRegister = () => {
  return useRegister({ userType: "agency" });
};

export const useFounderRegister = () => {
  return useRegister({ userType: "founder" });
};
