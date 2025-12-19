import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { SignupFounder } from "@/utils/data";
import toast from "react-hot-toast";

interface UseSignupReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  signup: (data: SignupFounder, userType?: string) => Promise<void>;
  resetState: () => void;
}

export const useSignup = (): UseSignupReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const signup = async (data: SignupFounder, userType: string = "founder") => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const loadingToast = toast.loading("Creating your account...");

    try {
      const payload = {
        firstName: String(data.firstName || ""),
        lastName: String(data.lastName || ""),
        email: String(data.email || ""),
        phoneNumber: String(data.phoneNumber || ""),
        countryCode: String(data.countryCode || "+234"),
        password: String(data.password || ""),
        userType: userType, //"founder" or "agency"
      };

      const response = await authApi.register(payload);

      if (response.success) {
        setSuccess(true);
        toast.success(response.message || "Account created successfully!", {
          id: loadingToast,
        });

        // Store token if provided
        if (response.data?.token) {
          localStorage.setItem("auth_token", response.data.token);
        }
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } else {
        const errorMsg = response.message || "Registration failed";
        setError(errorMsg);
        toast.error(errorMsg, {
          id: loadingToast,
        });
      }
    } catch (err) {
      const errorMsg = "Something went wrong. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg, {
        id: loadingToast,
      });
      console.error("Signup error:", err);
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
