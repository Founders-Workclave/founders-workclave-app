"use client";
import React, { useState, useEffect } from "react";
import MilestoneDetailsStep from "../milestoneDetails/index";
import PaymentOptionsStep from "../paymentOption/index";
import styles from "./styles.module.css";

export interface MilestoneData {
  id: string;
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
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

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
    setCurrentStep("milestone-details");
    setInitError(null);
    onClose();
  };

  const handlePayWithFlutterwave = async () => {
    try {
      setIsInitializing(true);
      setInitError(null);

      const token = localStorage.getItem("access_token");
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://foundersapi.up.railway.app";

      const response = await fetch(
        `${baseUrl}/payment/milestone/${milestone.id}/initialize/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || data.detail || "Failed to initialize payment"
        );
      }

      const data = await response.json();

      if (!data.payment_link) {
        throw new Error("No payment link received");
      }

      window.location.href = data.payment_link;
    } catch (err) {
      console.error("Payment initialization error:", err);
      setInitError(
        err instanceof Error ? err.message : "Failed to initialize payment"
      );
    } finally {
      setIsInitializing(false);
    }
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
              isInitializing={isInitializing}
              initError={initError}
              onSelectWallet={onPayWithWallet}
              onSelectPaystack={handlePayWithFlutterwave}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
