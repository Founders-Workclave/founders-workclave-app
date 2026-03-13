import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { SignupFounder } from "@/utils/data";
import toast from "react-hot-toast";

interface UseSignupOptions {
  userType?: string;
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
      const userType = options?.userType || "founder";

      console.log("🔐 useSignup: Creating account with userType:", userType);

      const payload = {
        firstName: String(data.firstName || ""),
        lastName: String(data.lastName || ""),
        email: String(data.email || ""),
        company: String(data.company || ""),
        phoneNumber: String(data.phoneNumber || ""),
        countryCode: String(data.countryCode || "+234"),
        password: String(data.password || ""),
        userType: userType,
      };

      console.log("📤 Signup payload:", {
        email: payload.email,
        userType: payload.userType,
        company: payload.company,
        hasPassword: !!payload.password,
        phoneNumber: payload.phoneNumber,
        countryCode: payload.countryCode,
        firstName: payload.firstName,
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
      } else {
        // auth.ts already returns a friendly message — use it directly
        const errorMsg = response.message || "Registration failed";
        setError(errorMsg);
        toast.error(errorMsg, { id: loadingToast });
        console.error("❌ Signup failed:", errorMsg);
      }
    } catch (err: unknown) {
      // Fallback — authApi.register rarely throws, but handle it just in case
      let errorMsg = "Something went wrong. Please try again.";

      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message: unknown }).message === "string"
      ) {
        errorMsg = (err as { message: string }).message;
      }

      setError(errorMsg);
      toast.error(errorMsg, { id: loadingToast });
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

export const useAgencySignup = (): UseSignupReturn => {
  return useSignup({ userType: "agency" });
};

export const useFounderSignup = (): UseSignupReturn => {
  return useSignup({ userType: "founder" });
};
