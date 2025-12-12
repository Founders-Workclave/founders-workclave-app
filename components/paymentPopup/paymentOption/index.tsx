import React from "react";
import styles from "./styles.module.css";
import PaymentsNew from "@/svgs/paymentsNew";

interface PaymentOptionsStepProps {
  walletBalance: number;
  onSelectWallet: () => void;
  onSelectPaystack: () => void;
}

const PaymentOptionsStep: React.FC<PaymentOptionsStepProps> = ({
  walletBalance,
  onSelectWallet,
  onSelectPaystack,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Choose payment option</h2>

      <div className={styles.options}>
        <button onClick={onSelectWallet} className={styles.optionCard}>
          <PaymentsNew />
          <div className={styles.optionContent}>
            <h3 className={styles.optionTitle}>Wallet</h3>
            <p className={styles.optionBalance}>
              Balance: ₦{walletBalance.toLocaleString()}
            </p>
          </div>

          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.arrowIcon}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <button onClick={onSelectPaystack} className={styles.optionCard}>
          <PaymentsNew />
          <div className={styles.optionContent}>
            <h3 className={styles.optionTitle}>Pay With Paystack</h3>
          </div>

          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.arrowIcon}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PaymentOptionsStep;
