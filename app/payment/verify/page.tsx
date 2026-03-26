"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getUser } from "@/lib/api/auth";
import styles from "./styles.module.css";

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentStatus = searchParams.get("status");
  const status: "success" | "failed" | "loading" = paymentStatus
    ? paymentStatus === "successful" || paymentStatus === "completed"
      ? "success"
      : "failed"
    : "loading";

  const getRedirectPath = () => {
    const user = getUser();
    const role = user?.role?.toLowerCase();
    const userType = user?.userType?.toLowerCase();

    if (role === "clients" || userType === "client") return "/clients";
    if (role === "agency" || userType === "agency") return "/agency";
    return "/founder";
  };

  useEffect(() => {
    if (status === "success") {
      // Just show the success page — no auto-redirect
      return;
    }

    // Auto-redirect only for failed or loading states
    const timer = setTimeout(() => {
      router.push(getRedirectPath());
    }, 3000);

    return () => clearTimeout(timer);
  }, [status, router]);
  const handleGoHome = () => {
    router.push(getRedirectPath());
  };

  return (
    <div className={styles.container}>
      {status === "loading" && (
        <div className={styles.card}>
          <div className={styles.spinner} />
          <p className={styles.message}>Verifying payment...</p>
        </div>
      )}

      {status === "success" && (
        <div className={styles.card}>
          <h2 className={styles.title}>Payment Successful!</h2>
          <p className={styles.message}>
            Your milestone payment has been received.
          </p>
          <button className={styles.homeButton} onClick={handleGoHome}>
            Go to Dashboard
          </button>
        </div>
      )}
      {status === "failed" && (
        <div className={styles.card}>
          <div className={styles.failedIcon}>✕</div>
          <h2 className={styles.title}>Payment Failed</h2>
          <p className={styles.message}>
            Something went wrong with your payment. Redirecting you now...
          </p>
          <button className={styles.homeButton} onClick={handleGoHome}>
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
