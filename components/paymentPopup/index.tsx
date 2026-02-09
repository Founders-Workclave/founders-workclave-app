"use client";
import React from "react";
import styles from "./styles.module.css";
import milestoneDataRaw from "../../mocks/projectMilestone.json";

interface PaymentTransaction {
  id: number | string;
  milestoneNumber: number;
  milestoneTitle: string;
  amount: number;
  date: string;
  method: "Wallet" | "Paystack" | "Stripe";
  status: "completed" | "pending" | "failed";
}

interface Milestone {
  id: number | string;
  number: number;
  title: string;
  payment: number;
  status: string;
  completedDate?: string;
}

interface Project {
  milestones: Milestone[];
}

interface PaymentHistoryProps {
  projectId?: string;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  projectId, // TODO: Use this when fetching real payment data from API
}) => {
  const project = milestoneDataRaw as Project;
  const totalProjectValue = project.milestones.reduce(
    (sum: number, milestone: Milestone) => sum + milestone.payment,
    0
  );

  const paidAmount = project.milestones
    .filter((m: Milestone) => m.status === "completed")
    .reduce((sum: number, milestone: Milestone) => sum + milestone.payment, 0);

  const remainingAmount = totalProjectValue - paidAmount;

  // Generate payment transactions from completed milestones
  const paymentTransactions: PaymentTransaction[] = project.milestones
    .filter((m: Milestone) => m.status === "completed" && m.completedDate)
    .map((milestone: Milestone, index: number) => ({
      id: milestone.id,
      milestoneNumber: milestone.number,
      milestoneTitle: milestone.title,
      amount: milestone.payment,
      date: milestone.completedDate!,
      method: index % 2 === 0 ? "Wallet" : "Paystack",
      status: "completed" as const,
    }));

  // Suppress unused variable warning
  console.log("Project ID for future API use:", projectId);

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
