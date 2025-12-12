import React from "react";
import styles from "./styles.module.css";
import DepositIcon from "@/svgs/depositIcon";

interface Transaction {
  id: number;
  type: string; // <-- fix
  amount: number;
  date: string;
  status: string;
  reference: string;
  description?: string;
}

interface TransactionItemProps {
  transaction: Transaction;
  currency?: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  currency = "NGN",
}) => {
  const getTypeIcon = () => {
    switch (transaction.type) {
      case "deposit":
        return <DepositIcon />;
      case "withdrawal":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        );
      case "payment":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        );
    }
  };

  const getStatusBadge = () => {
    switch (transaction.status) {
      case "completed":
        return (
          <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
            Completed
          </span>
        );
      case "processing":
        return (
          <span className={`${styles.statusBadge} ${styles.statusProcessing}`}>
            Processing
          </span>
        );
      case "failed":
        return (
          <span className={`${styles.statusBadge} ${styles.statusFailed}`}>
            Failed
          </span>
        );
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTypeLabel = () => {
    return transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
  };

  return (
    <div className={styles.item}>
      <div className={styles.iconWrapper}>{getTypeIcon()}</div>

      <div className={styles.content}>
        <h4 className={styles.title}>{getTypeLabel()}</h4>
        <p className={styles.amount}>{formatAmount(transaction.amount)}</p>
        {transaction.description && (
          <p className={styles.description}>{transaction.description}</p>
        )}
      </div>

      <div className={styles.right}>
        {getStatusBadge()}
        <p className={styles.date}>{transaction.date}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
