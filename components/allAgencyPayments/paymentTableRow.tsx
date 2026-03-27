import React from "react";
import styles from "./styles.module.css";

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
  status: "Successful" | "completed" | "in-progress" | "pending";
  paymentMethod: string | null;
  paymentDate: string | null;
  clientName?: string;
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
      case "successful":
        return styles.statusSuccessful;
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
      .join(" ");
  };

  const clipTransactionId = (id: string) => {
    if (id.length <= 16) return id;
    return `${id.slice(0, 8)}...${id.slice(-4)}`;
  };

  return (
    <tr className={styles.tableRow}>
      <td>
        <span className={styles.transactionId} title={payment.transactionId}>
          {clipTransactionId(payment.transactionId)}
        </span>
      </td>
      <td>{payment.date || "—"}</td>
      <td>{payment.projectName}</td>
      <td>
        <div className={styles.progressCell}>
          <span className={styles.progressText}>
            {payment.progress.percentage}% complete
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
            {payment.percentagePaid.toFixed(0)}% paid
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
