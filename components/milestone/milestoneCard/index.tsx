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

interface MilestoneCardProps {
  milestone: Milestone;
  onViewDetails?: () => void;
  onRequestUpdate?: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onViewDetails,
  onRequestUpdate,
}) => {
  const [showDeliverables, setShowDeliverables] = useState(false);

  // Use status directly from milestone data
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

  // Format date to readable format
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
                onClick={onViewDetails}
                className={styles.viewDetailsButton}
              >
                View details
              </button>
              <button
                onClick={onRequestUpdate}
                className={styles.requestUpdateButton}
              >
                Request update
              </button>
            </>
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

export default MilestoneCard;
