"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { PaymentService, PaymentTransaction } from "@/lib/api/paymentService";
import Loader from "../loader";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

interface PaymentHistoryProps {
  projectId?: string;
}

interface PaymentData {
  projectValue: string;
  paid: string;
  remaining: string;
  paymentHistory: PaymentTransaction[];
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ projectId }) => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!projectId) {
        setError("Project ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await PaymentService.getPaymentHistory(projectId);
        setPaymentData({
          projectValue: data.projectValue,
          paid: data.paid,
          remaining: data.remaining,
          paymentHistory: data.paymentHistory,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load payment history"
        );
        console.error("Error fetching payment history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loader type="pulse" loading={isLoading} size={15} color="#5865F2" />
        <p>Loading payment history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load payment history"
        message="We're having trouble loading your payment history. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!paymentData) {
    return null;
  }

  const totalProjectValue = PaymentService.parseAmount(
    paymentData.projectValue
  );
  const paidAmount = PaymentService.parseAmount(paymentData.paid);
  const remainingAmount = PaymentService.parseAmount(paymentData.remaining);

  return (
    <div className={styles.container}>
      {/* Summary Cards */}
      <div className={styles.summaryCards}>
        <div className={`${styles.card} ${styles.totalCard}`}>
          <h3 className={styles.cardAmount}>
            ${totalProjectValue.toLocaleString()}
          </h3>
          <p className={styles.cardLabel}>Total Project Value</p>
        </div>

        <div className={`${styles.card} ${styles.paidCard}`}>
          <h3 className={styles.cardAmount}>${paidAmount.toLocaleString()}</h3>
          <p className={styles.cardLabel}>Paid</p>
        </div>

        <div className={`${styles.card} ${styles.remainingCard}`}>
          <h3 className={styles.cardAmount}>
            ${remainingAmount.toLocaleString()}
          </h3>
          <p className={styles.cardLabel}>Remaining</p>
        </div>
      </div>

      {/* Payment History */}
      <div className={styles.historySection}>
        <h2 className={styles.historyTitle}>Payment history</h2>

        <div className={styles.transactionsList}>
          {paymentData.paymentHistory.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No payment history yet</p>
            </div>
          ) : (
            paymentData.paymentHistory.map((transaction) => (
              <div key={transaction.id} className={styles.transactionCard}>
                <div className={styles.transactionLeft}>
                  <h4 className={styles.transactionTitle}>
                    {transaction.milestoneName}
                  </h4>
                  <p className={styles.transactionMeta}>
                    {PaymentService.formatDate(transaction.paymentDate)} •{" "}
                    {transaction.paymentChannel}
                  </p>
                </div>

                <div className={styles.transactionRight}>
                  <span className={styles.transactionAmount}>
                    $
                    {PaymentService.parseAmount(
                      transaction.amount
                    ).toLocaleString()}
                  </span>
                  <span
                    className={`${styles.statusBadge} ${styles.statuscompleted}`}
                  >
                    Completed
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
