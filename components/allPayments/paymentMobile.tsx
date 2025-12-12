import React from "react";
import styles from "./styles.module.css";

interface Payment {
  id: number;
  transactionId: string;
  date: string | null;
  projectName: string;
  milestoneNumber: number;
  milestoneTitle: string;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  amount: number;
  currency: string;
  percentagePaid: number;
  status: "completed" | "in-progress" | "pending";
}

interface PaymentMobileCardProps {
  payment: Payment;
  onSeeDetails: (id: number) => void;
}

const PaymentMobileCard: React.FC<PaymentMobileCardProps> = ({
  payment,
  onSeeDetails,
}) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return styles.statusCompleted;
      case "in-progress":
        return styles.statusInProgress;
      case "pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  };

  return (
    <div className={styles.mobileCard}>
      <div className={styles.mobileCardRow}>
        <span className={styles.mobileLabel}>Transaction ID</span>
        <span className={styles.mobileValue}>{payment.transactionId}</span>
      </div>

      <div className={styles.mobileCardRow}>
        <span className={styles.mobileLabel}>Date</span>
        <span className={styles.mobileValue}>{payment.date || "—"}</span>
      </div>

      <div className={styles.mobileCardRow}>
        <span className={styles.mobileLabel}>Project title</span>
        <span className={styles.mobileValue}>{payment.projectName}</span>
      </div>

      <div className={styles.mobileCardRow}>
        <span className={styles.mobileLabel}>Progress</span>
        <div className={styles.progressCell}>
          <span className={styles.progressText}>
            {payment.progress.current}/{payment.progress.total} Milestones
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${payment.progress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.mobileCardRow}>
        <span className={styles.mobileLabel}>Amount paid</span>
        <div className={styles.amountCell}>
          <span className={styles.amount}>
            {payment.currency === "NGN" ? "₦" : "$"}
            {payment.amount.toLocaleString()}
          </span>
          <span className={styles.percentagePaid}>
            {payment.percentagePaid}% paid
          </span>
        </div>
      </div>

      <div className={styles.mobileCardRow}>
        <span className={styles.mobileLabel}>Status</span>
        <span
          className={`${styles.statusBadge} ${getStatusClass(payment.status)}`}
        >
          {formatStatus(payment.status)}
        </span>
      </div>

      <button
        onClick={() => onSeeDetails(payment.id)}
        className={styles.mobileDetailsButton}
      >
        See Details
      </button>
    </div>
  );
};

export default PaymentMobileCard;
