// components/paymentPopup/paymentModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import MilestoneDetailsStep from "../milestoneDetails/index";
import PaymentOptionsStep from "../paymentOption/index";
import styles from "./styles.module.css";

export interface MilestoneData {
  title: string;
  description: string;
  dueDate: string;
  amount: number;
  deliverables: string[];
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: MilestoneData;
  walletBalance: number;
  onPayWithWallet: () => void;
  onPayWithPaystack: () => void;
}

type Step = "milestone-details" | "payment-options";

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  milestone,
  walletBalance,
  onPayWithWallet,
  onPayWithPaystack,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("milestone-details");

  // Prevent body scroll when modal is open
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

  const handleProceedToPayment = () => {
    setCurrentStep("payment-options");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset to first step when closing
    setCurrentStep("milestone-details");
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
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

        <div className={styles.content}>
          {currentStep === "milestone-details" && (
            <MilestoneDetailsStep
              milestone={milestone}
              onProceed={handleProceedToPayment}
            />
          )}

          {currentStep === "payment-options" && (
            <PaymentOptionsStep
              walletBalance={walletBalance}
              onSelectWallet={onPayWithWallet}
              onSelectPaystack={onPayWithPaystack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
