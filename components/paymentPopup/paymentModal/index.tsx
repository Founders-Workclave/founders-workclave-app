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

      if (!token) {
        throw new Error("No access token found. Please log in again.");
      }

      if (!milestone?.id) {
        throw new Error("Milestone ID is missing.");
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://foundersapi.up.railway.app";

      const url = `${baseUrl}/payment/milestone/${milestone.id}/initialize/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: milestone.amount,
          milestone_id: milestone.id,
        }),
      });

      const rawText = await response.text();
      console.log("=== SERVER RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Body:", rawText);

      if (!response.ok) {
        // Try to parse as JSON for a cleaner error message
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = JSON.parse(rawText);
          errorMessage =
            errorData.error ||
            errorData.detail ||
            errorData.message ||
            JSON.stringify(errorData);
        } catch {
          // rawText was not JSON — use it directly if it has content
          if (rawText) errorMessage = rawText;
        }
        throw new Error(errorMessage);
      }

      let data: { payment_link?: string; tx_ref?: string };
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error("Server returned an invalid response.");
      }

      if (!data.payment_link) {
        throw new Error("No payment link received from server.");
      }

      window.location.href = data.payment_link;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to initialize payment";
      setInitError(message);
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
