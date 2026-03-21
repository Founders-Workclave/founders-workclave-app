import React from "react";
import styles from "./styles.module.css";
import PaymentsNew from "@/svgs/paymentsNew";

interface PaymentOptionsStepProps {
  walletBalance: number;
  isInitializing: boolean;
  initError: string | null;
  onSelectWallet: () => void;
  onSelectPaystack: () => void;
}

const PaymentOptionsStep: React.FC<PaymentOptionsStepProps> = ({
  walletBalance,
  isInitializing,
  initError,
  onSelectWallet,
  onSelectPaystack,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Choose payment option</h2>

      <div className={styles.options}>
        {/* Wallet — coming soon */}
        <button
          onClick={onSelectWallet}
          className={`${styles.optionCard} ${styles.optionCardDisabled}`}
          disabled
        >
          <PaymentsNew />
          <div className={styles.optionContent}>
            <div className={styles.optionTitleRow}>
              <h3 className={styles.optionTitle}>Wallet</h3>
              <span className={styles.comingSoonBadge}>Coming Soon</span>
            </div>
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

        {/* Flutterwave */}
        <button
          onClick={onSelectPaystack}
          className={styles.optionCard}
          disabled={isInitializing}
        >
          <PaymentsNew />
          <div className={styles.optionContent}>
            <h3 className={styles.optionTitle}>
              {isInitializing ? "Initializing..." : "Pay With Flutterwave"}
            </h3>
          </div>

          {isInitializing ? (
            <div className={styles.spinner} />
          ) : (
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
          )}
        </button>
      </div>

      {initError && <p className={styles.errorText}>{initError}</p>}
    </div>
  );
};

export default PaymentOptionsStep;
