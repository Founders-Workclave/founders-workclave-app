// ============================================================================
// FILE: hooks/userSignup.ts - COMPLETE FILE (Updated)
// ============================================================================

import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { SignupFounder } from "@/utils/data";
import toast from "react-hot-toast";

interface UseSignupOptions {
  userType?: string; // 'agency' | 'founder'
}

interface UseSignupReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  signup: (data: SignupFounder) => Promise<void>;
  resetState: () => void;
}

/**
 * Universal signup hook that supports different user types
 * @param options - Optional configuration including userType
 */
export const useSignup = (options?: UseSignupOptions): UseSignupReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const signup = async (data: SignupFounder) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const loadingToast = toast.loading("Creating your account...");

    try {
      // Get userType from options or default to 'founder'
      const userType = options?.userType || "founder";

      console.log("🔐 useSignup: Creating account with userType:", userType);

      const payload = {
        firstName: String(data.firstName || ""),
        lastName: String(data.lastName || ""),
        email: String(data.email || ""),
        phoneNumber: String(data.phoneNumber || ""),
        countryCode: String(data.countryCode || "+234"),
        password: String(data.password || ""),
        userType: userType, // Pass userType to API
      };

      console.log("📤 Signup payload:", {
        email: payload.email,
        userType: payload.userType,
        hasPassword: !!payload.password,
      });

      const response = await authApi.register(payload);

      if (response.success) {
        setSuccess(true);

        const successMessage =
          userType === "agency"
            ? "Agency account created successfully!"
            : "Account created successfully!";

        toast.success(response.message || successMessage, {
          id: loadingToast,
        });

        console.log("✅ Signup successful:", {
          userType,
          hasToken: !!response.data?.token,
          userId: response.data?.userId || response.data?.id,
        });

        // Token is already stored by authApi.register
        // No need to manually store it here
      } else {
        const errorMsg = response.message || "Registration failed";
        setError(errorMsg);
        toast.error(errorMsg, {
          id: loadingToast,
        });
        console.error("❌ Signup failed:", errorMsg);
      }
    } catch (err) {
      const errorMsg = "Something went wrong. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg, {
        id: loadingToast,
      });
      console.error("❌ Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  };

  return { isLoading, error, success, signup, resetState };
};

/**
 * Convenience hook for agency signup
 * Automatically sets userType to 'agency'
 */
export const useAgencySignup = (): UseSignupReturn => {
  return useSignup({ userType: "agency" });
};

/**
 * Convenience hook for founder signup
 * Automatically sets userType to 'founder'
 */
export const useFounderSignup = (): UseSignupReturn => {
  return useSignup({ userType: "founder" });
};
