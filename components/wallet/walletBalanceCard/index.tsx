import React from "react";
import styles from "./styles.module.css";

interface WalletBalanceCardProps {
  balance: number;
  currency?: string;
  onFundWallet: () => void;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  currency = "NGN",
  onFundWallet,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className={styles.card}>
      <p className={styles.label}>Wallet Balance</p>
      <h2 className={styles.balance}>{formatCurrency(balance)}</h2>

      <button onClick={onFundWallet} className={styles.fundButton}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Fund wallet
      </button>
    </div>
  );
};

export default WalletBalanceCard;
