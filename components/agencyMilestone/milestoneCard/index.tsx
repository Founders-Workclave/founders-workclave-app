"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { Milestone } from "@/types/project";
import Completed from "@/svgs/completed";
import InProgress from "@/svgs/inProgress";
import Pending from "@/svgs/pending";
import SmallCalender from "@/svgs/smallCalender";
import Payment from "@/svgs/payment";
import CompletedNew from "@/svgs/completedNew";
import ListIcons from "@/svgs/listIcons";

interface AdminMilestoneCardProps {
  milestone: Milestone;
  onEdit?: (milestone: Milestone) => void;
  onMarkComplete?: (milestoneId: string | number) => void;
  onUpdateProgress?: (milestoneId: string | number, progress: number) => void;
}

const AdminMilestoneCard: React.FC<AdminMilestoneCardProps> = ({
  milestone,
  onEdit,
  onMarkComplete,
}) => {
  const [showDeliverables, setShowDeliverables] = useState(false);

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

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(milestone);
    }
  };

  const handleMarkComplete = () => {
    if (onMarkComplete) {
      onMarkComplete(milestone.id);
    }
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
            <span className={`${styles.statusBadge} ${statusBadge.class}`}>
              {statusBadge.text}
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

        {status === "in-progress" && milestone.progress !== undefined && (
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Progress</span>
              <span className={styles.progressPercentage}>
                {milestone.progress}%
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${milestone.progress}%` }}
              />
            </div>
          </div>
        )}

        {milestone.note && (
          <div className={styles.note}>
            <strong>Note:</strong> {milestone.note}
          </div>
        )}

        {/* Admin Action Buttons */}
        <div className={styles.actions}>
          {status === "completed" && milestone.deliverables.length > 0 && (
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
          )}

          {status === "in-progress" && (
            <>
              <button
                onClick={handleEditClick}
                className={styles.editMilestoneButton}
              >
                Edit milestone
              </button>
              <button
                onClick={handleMarkComplete}
                className={styles.markCompleteButton}
              >
                Mark as completed
              </button>
            </>
          )}

          {status === "pending" && (
            <button
              onClick={handleEditClick}
              className={styles.editMilestoneButton}
            >
              Edit milestone
            </button>
          )}
        </div>

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
    </div>
  );
};

export default AdminMilestoneCard;
