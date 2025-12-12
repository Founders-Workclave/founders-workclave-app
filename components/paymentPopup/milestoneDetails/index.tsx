import React from "react";
import styles from "./styles.module.css";
import SmallCalender from "@/svgs/smallCalender";
import Payment from "@/svgs/payment";
import ListIcons from "@/svgs/listIcons";

interface MilestoneDetailsStepProps {
  milestone: {
    title: string;
    description: string;
    dueDate: string;
    amount: number;
    deliverables: string[];
  };
  onProceed: () => void;
}

const MilestoneDetailsStep: React.FC<MilestoneDetailsStepProps> = ({
  milestone,
  onProceed,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.popupDetails}>Milestone details</h2>
      <h2 className={styles.title}>{milestone.title}</h2>
      <p className={styles.description}>{milestone.description}</p>

      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <SmallCalender />
          <span>Due: {milestone.dueDate}</span>
        </div>

        <div className={styles.infoItem}>
          <Payment />
          <span>Amount: ${milestone.amount.toLocaleString()}</span>
        </div>
      </div>

      <div className={styles.deliverables}>
        <h3 className={styles.deliverablesTitle}>Deliverables</h3>
        <ul className={styles.deliverablesList}>
          {milestone.deliverables.map((deliverable, index) => (
            <li key={index} className={styles.deliverableItem}>
              <ListIcons />
              <span>{deliverable}</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onProceed} className={styles.proceedButton}>
        Make payment: ${milestone.amount.toLocaleString()}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
};

export default MilestoneDetailsStep;
