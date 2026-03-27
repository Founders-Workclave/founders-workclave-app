"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import Completed from "@/svgs/completed";
import InProgress from "@/svgs/inProgress";
import Pending from "@/svgs/pending";
import SmallCalender from "@/svgs/smallCalender";
import Payment from "@/svgs/payment";
import CompletedNew from "@/svgs/completedNew";
import ListIcons from "@/svgs/listIcons";
import { Milestone } from "@/types/project";
import PaymentModal from "@/components/paymentPopup/paymentModal";

interface MilestoneCardProps {
  milestone: Milestone;
  onViewDetails?: () => void;
  onRequestUpdate?: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone }) => {
  const [showDeliverables, setShowDeliverables] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const status = milestone.status;

  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return { text: "Completed", class: styles.statusCompleted };
      case "in-progress":
        return { text: "In-Progress", class: styles.statusInProgress };
      case "pending":
        return { text: "Pending", class: styles.statusPending };
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <Completed />;
      case "in-progress":
        return <InProgress />;
      case "pending":
        return <Pending />;
    }
  };

  const statusBadge = getStatusBadge();

  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/,/g, ""));
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconLine}>
        <div className={styles.iconWrapper}>{getStatusIcon()}</div>
        {milestone.order < 7 && <div className={styles.connectingLine} />}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.milestoneNumber}>
              Milestone {milestone.number}
            </span>
            <span className={`${styles.statusBadge} ${statusBadge?.class}`}>
              {statusBadge?.text}
            </span>
          </div>
        </div>

        <h3 className={styles.title}>{milestone.title}</h3>
        <p className={styles.description}>{milestone.description}</p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <SmallCalender />
            <span>Due: {formatDate(milestone.dueDate)}</span>
          </div>

          <div className={styles.metaItem}>
            <Payment />
            <span>
              Payment: ${parsePrice(milestone.price).toLocaleString()}
            </span>
          </div>

          {milestone.completedDate && (
            <div className={`${styles.metaItem} ${styles.completed}`}>
              <CompletedNew />
              <span>Completed: {formatDate(milestone.completedDate)}</span>
            </div>
          )}
        </div>

        {milestone.note && (
          <div className={styles.note}>
            <strong>Note:</strong> {milestone.note}
          </div>
        )}

        {/* Actions */}
        {milestone.deliverables.length > 0 && (
          <div className={styles.actions}>
            <button
              onClick={() => setShowDeliverables(!showDeliverables)}
              className={styles.viewDeliverablesButton}
            >
              View deliverables
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={
                  showDeliverables ? styles.chevronUp : styles.chevronDown
                }
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {status === "in-progress" && (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className={styles.viewDetailsButton}
              >
                Pay for milestone
              </button>
            )}
          </div>
        )}

        {/* Show pay button even if no deliverables */}
        {milestone.deliverables.length === 0 && status === "in-progress" && (
          <div className={styles.actions}>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className={styles.viewDetailsButton}
            >
              Pay for milestone
            </button>
          </div>
        )}

        {showDeliverables && milestone.deliverables.length > 0 && (
          <div className={styles.deliverables}>
            <ul className={styles.deliverablesList}>
              {milestone.deliverables.map((deliverable, index) => (
                <li key={index} className={styles.deliverableItem}>
                  <ListIcons />
                  <span>{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        milestone={{
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          dueDate: milestone.dueDate,
          amount: parsePrice(milestone.price),
          deliverables: milestone.deliverables,
        }}
        walletBalance={0}
        onPayWithWallet={() => {
          setIsPaymentModalOpen(false);
        }}
        onPayWithPaystack={() => {
          setIsPaymentModalOpen(false);
        }}
      />
    </div>
  );
};

export default MilestoneCard;
