"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import PaymentsNew from "@/svgs/paymentsNew";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFundWithFlutterwave: (amount: number) => void;
  onFundWithPaystack: (amount: number) => void;
}

const FundWalletModal: React.FC<FundWalletModalProps> = ({
  isOpen,
  onClose,
  onFundWithFlutterwave,
  onFundWithPaystack,
}) => {
  const [amount, setAmount] = useState("");
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

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  const handleFlutterwaveClick = () => {
    const amountValue = parseFloat(amount);
    if (amountValue && amountValue > 0) {
      onFundWithFlutterwave(amountValue);
      handleClose();
    }
  };

  const handlePaystackClick = () => {
    const amountValue = parseFloat(amount);
    if (amountValue && amountValue > 0) {
      onFundWithPaystack(amountValue);
      handleClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Fund wallet</h2>
          <button onClick={handleClose} className={styles.closeButton}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
              min="0"
              step="0.01"
            />
          </div>

          <div className={styles.options}>
            <button
              onClick={handleFlutterwaveClick}
              className={styles.optionButton}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <PaymentsNew />

              <span className={styles.optionText}>Fund with flutterwave</span>
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

            <button
              onClick={handlePaystackClick}
              className={styles.optionButton}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              <PaymentsNew />
              <span className={styles.optionText}>Fund with paystack</span>
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
      </div>
    </div>
  );
};

export default FundWalletModal;
