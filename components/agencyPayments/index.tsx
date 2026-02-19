"use client";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { agencyService } from "@/lib/api/agencyService/agencyService";
import type {
  ProjectPaymentsResponse,
  PaymentHistory,
} from "@/types/agencyPayments";
import AllLoading from "@/layout/Loader";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

interface AgencyPaymentsProps {
  projectId: string;
}

export default function AgencyPayments({ projectId }: AgencyPaymentsProps) {
  const [paymentsData, setPaymentsData] =
    useState<ProjectPaymentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!projectId) {
        setError("No project ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await agencyService.getProjectPayments(projectId);
        setPaymentsData(data);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to load payment history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [projectId]);

  const formatAmount = (amount: string): string => {
    const num = parseFloat(amount);
    return `$${num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusClass = (status: string): string => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
        return styles.statusCompleted;
      case "ongoing":
      case "in-progress":
        return styles.statusOngoing;
      case "pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  const formatStatus = (status: string): string => {
    const statusLower = status.toLowerCase();
    if (statusLower === "ongoing" || statusLower === "in-progress") {
      return "In Progress";
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <AllLoading text="Loading payment history..." />
      </div>
    );
  }

  if (error || !paymentsData) {
    return (
      <ServiceUnavailable
        title="Couldn't load payment history"
        message="We're having trouble fetching payment history. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.summary}>
        <div className={styles.card}>
          <h3>{formatAmount(paymentsData.projectValue)}</h3>
          <p>Total Project Value</p>
        </div>

        <div className={`${styles.card} ${styles.paid}`}>
          <h3>{formatAmount(paymentsData.paid)}</h3>
          <p>Paid</p>
        </div>

        <div className={`${styles.card} ${styles.remaining}`}>
          <h3>{formatAmount(paymentsData.remaining)}</h3>
          <p>Remaining</p>
        </div>
      </div>

      {/* Payment history */}
      <div className={styles.history}>
        <h4>Payment history</h4>

        {paymentsData.paymenthistory.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No payment history available</p>
          </div>
        ) : (
          <div className={styles.list}>
            {paymentsData.paymenthistory.map((payment: PaymentHistory) => (
              <div key={payment.id} className={styles.item}>
                <div>
                  <p className={styles.title}>
                    Milestone {payment.order}: {payment.milestoneName}
                  </p>
                  <p className={styles.meta}>
                    {formatDate(payment.paymentDate)} • {payment.paymentChannel}
                  </p>
                </div>

                <div className={styles.right}>
                  <span className={styles.amount}>
                    {formatAmount(payment.amount)}
                  </span>
                  <span
                    className={`${styles.status} ${getStatusClass(
                      payment.status
                    )}`}
                  >
                    {formatStatus(payment.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
