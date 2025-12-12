"use client";
import React from "react";
import styles from "./styles.module.css";
import milestoneDataRaw from "../../mocks/projectMilestone.json";
import { ProjectMilestoneData } from "@/types/project";

interface PaymentTransaction {
  id: number;
  milestoneNumber: number;
  milestoneTitle: string;
  amount: number;
  date: string;
  method: "Wallet" | "Paystack" | "Stripe";
  status: "completed" | "pending" | "failed";
}

interface PaymentHistoryProps {
  projectId?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ projectId }) => {
  const project = milestoneDataRaw as ProjectMilestoneData;
  const totalProjectValue = project.milestones.reduce(
    (sum, milestone) => sum + milestone.payment,
    0
  );

  const paidAmount = project.milestones
    .filter((m) => m.status === "completed")
    .reduce((sum, milestone) => sum + milestone.payment, 0);

  const remainingAmount = totalProjectValue - paidAmount;

  // Generate payment transactions from completed milestones
  const paymentTransactions: PaymentTransaction[] = project.milestones
    .filter((m) => m.status === "completed" && m.completedDate)
    .map((milestone, index) => ({
      id: milestone.id,
      milestoneNumber: milestone.number,
      milestoneTitle: milestone.title,
      amount: milestone.payment,
      date: milestone.completedDate!,
      method: index % 2 === 0 ? "Wallet" : "Paystack", // Alternate payment methods for demo
      status: "completed" as const,
    }));

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
          {paymentTransactions.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No payment history yet</p>
            </div>
          ) : (
            paymentTransactions.map((transaction) => (
              <div key={transaction.id} className={styles.transactionCard}>
                <div className={styles.transactionLeft}>
                  <h4 className={styles.transactionTitle}>
                    Milestone {transaction.milestoneNumber}:{" "}
                    {transaction.milestoneTitle}
                  </h4>
                  <p className={styles.transactionMeta}>
                    {transaction.date} • {transaction.method}
                  </p>
                </div>

                <div className={styles.transactionRight}>
                  <span className={styles.transactionAmount}>
                    ${transaction.amount.toLocaleString()}
                  </span>
                  <span
                    className={`${styles.statusBadge} ${
                      styles[`status${transaction.status}`]
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
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
