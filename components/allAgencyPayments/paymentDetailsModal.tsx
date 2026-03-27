import React, { useEffect } from "react";
import styles from "./paymentDetailModal.module.css";

interface Payment {
  id: number;
  transactionId: string;
  date: string | null;
  projectName: string;
  progress: {
    percentage: number;
  };
  amount: number;
  currency: string;
  percentagePaid: number;
  status: "completed" | "in-progress" | "pending";
  paymentMethod: string | null;
  paymentDate: string | null;
  clientName?: string;
}

interface PaymentDetailModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen || !payment) return null;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "successful":
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
      .join(" ");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <h2 className={styles.modalTitle}>Payment Details</h2>
            <span
              className={`${styles.statusBadge} ${getStatusClass(
                payment.status
              )}`}
            >
              {formatStatus(payment.status)}
            </span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Amount Hero */}
        <div className={styles.amountHero}>
          <p className={styles.amountLabel}>Amount Paid</p>
          <p className={styles.amountValue}>
            {payment.currency === "NGN" ? "₦" : "$"}
            {payment.amount.toLocaleString()}
          </p>
          <p className={styles.amountSub}>
            {payment.percentagePaid.toFixed(0)}% of total
          </p>
        </div>

        {/* Details Grid */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Transaction ID</span>
            <span className={styles.detailValue} title={payment.transactionId}>
              {payment.transactionId}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Date</span>
            <span className={styles.detailValue}>{payment.date || "—"}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Project Name</span>
            <span className={styles.detailValue}>{payment.projectName}</span>
          </div>

          {payment.clientName && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Client</span>
              <span className={styles.detailValue}>{payment.clientName}</span>
            </div>
          )}

          {payment.paymentMethod && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Payment Method</span>
              <span className={styles.detailValue}>
                {payment.paymentMethod}
              </span>
            </div>
          )}

          {payment.paymentDate && (
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Payment Date</span>
              <span className={styles.detailValue}>{payment.paymentDate}</span>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.detailLabel}>Milestone Progress</span>
            <span className={styles.progressPercent}>
              {payment.progress.percentage}%
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${payment.progress.percentage}%` }}
            />
          </div>
          <p className={styles.progressSub}>
            {payment.progress.percentage}% of milestones completed
          </p>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailModal;
