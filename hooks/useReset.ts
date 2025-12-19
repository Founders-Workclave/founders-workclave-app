import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import toast from "react-hot-toast";

/**
 * Hook for sending OTP to email
 * This is the first step in password reset flow
 */
export const useSendOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendOtp = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Show loading toast
    const loadingToast = toast.loading("Sending verification code...");

    try {
      const response = await authApi.sendOtp({ email });

      if (response.success) {
        setSuccess(true);
        setError(null);
        toast.success(response.message || "Verification code sent!", {
          id: loadingToast,
        });
        return { success: true, message: response.message };
      } else {
        const errorMsg = response.message || "Failed to send verification code";
        setError(errorMsg);
        setSuccess(false);
        toast.error(errorMsg, {
          id: loadingToast,
        });
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      setSuccess(false);
      toast.error(errorMessage, {
        id: loadingToast,
      });
      return { success: false, message: errorMessage };
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
    sendOtp,
    resetState,
  };
};

/**
 * Hook for verifying OTP
 * This validates the OTP code before allowing password reset
 */
export const useVerifyOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const verifyOtp = async (otp: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const loadingToast = toast.loading("Verifying code...");

    try {
      const response = await authApi.verifyOtp({ otp });

      if (response.success) {
        setSuccess(true);
        setError(null);
        toast.success(response.message || "Code verified successfully!", {
          id: loadingToast,
        });
        return { success: true, message: response.message };
      } else {
        const errorMsg =
          response.message || "Invalid or expired verification code";
        setError(errorMsg);
        setSuccess(false);
        toast.error(errorMsg, {
          id: loadingToast,
        });
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      setSuccess(false);
      toast.error(errorMessage, {
        id: loadingToast,
      });
      return { success: false, message: errorMessage };
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
    verifyOtp,
    resetState,
  };
};

/**
 * Hook for resetting password
 * This is the final step that actually changes the password
 */
export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (
    otp: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Client-side validation
    if (newPassword !== confirmPassword) {
      const errorMessage = "Passwords do not match";
      setError(errorMessage);
      setIsLoading(false);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }

    if (newPassword.length < 8) {
      const errorMessage = "Password must be at least 8 characters long";
      setError(errorMessage);
      setIsLoading(false);
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }

    const loadingToast = toast.loading("Resetting password...");

    try {
      const response = await authApi.resetPassword({
        otp,
        newPassword,
        confirmPassword,
      });

      if (response.success) {
        setSuccess(true);
        setError(null);
        toast.success(response.message || "Password reset successfully!", {
          id: loadingToast,
        });
        return { success: true, message: response.message };
      } else {
        const errorMsg = response.message || "Failed to reset password";
        setError(errorMsg);
        setSuccess(false);
        toast.error(errorMsg, {
          id: loadingToast,
        });
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      setSuccess(false);
      toast.error(errorMessage, {
        id: loadingToast,
      });
      return { success: false, message: errorMessage };
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
    resetPassword,
    resetState,
  };
};
