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

interface PaymentTableRowProps {
  payment: Payment;
  onSeeDetails: (id: number) => void;
}

const PaymentTableRow: React.FC<PaymentTableRowProps> = ({
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
    <tr className={styles.tableRow}>
      <td className={styles.transactionId}>{payment.transactionId}</td>
      <td>{payment.date || "—"}</td>
      <td>{payment.projectName}</td>
      <td>
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
      </td>
      <td>
        <div className={styles.amountCell}>
          <span className={styles.amount}>
            {payment.currency === "NGN" ? "₦" : "$"}
            {payment.amount.toLocaleString()}
          </span>
          <span className={styles.percentagePaid}>
            {payment.percentagePaid}% paid
          </span>
        </div>
      </td>
      <td>
        <span
          className={`${styles.statusBadge} ${getStatusClass(payment.status)}`}
        >
          {formatStatus(payment.status)}
        </span>
      </td>
      <td>
        <button
          onClick={() => onSeeDetails(payment.id)}
          className={styles.detailsButton}
        >
          See Details
        </button>
      </td>
    </tr>
  );
};

export default PaymentTableRow;
