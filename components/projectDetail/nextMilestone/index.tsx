// components/projectDetail/NextMilestone.tsx
"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import PaymentModal from "@/components/paymentPopup/paymentModal";
import milestoneData from "../../../mocks/projectMilestone.json";
import { ProjectMilestoneData, Milestone } from "@/types/project";
import Milestones from "@/svgs/milestones";

const NextMilestone = () => {
  const [isOpen, setIsOpen] = useState(false);

  const project = milestoneData as unknown as ProjectMilestoneData;
  const nextMilestone: Milestone | undefined = project.milestones.find(
    (m) => m.status === "in-progress" || m.status === "pending"
  );

  if (!nextMilestone) {
    return (
      <div className={styles.container}>
        <p className={styles.noMilestone}>No upcoming milestone.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Milestones />
      </div>
      <h3 className={styles.title}>Next Milestone</h3>
      <p className={styles.description}>{nextMilestone.title}</p>

      <button onClick={() => setIsOpen(true)} className={styles.viewButton}>
        View details
      </button>

      <PaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        milestone={{
          title: nextMilestone.title,
          description: nextMilestone.description,
          dueDate: nextMilestone.dueDate,
          amount: nextMilestone.payment,
          deliverables: nextMilestone.deliverables,
        }}
        walletBalance={project.walletBalance}
        onPayWithWallet={() => {
          console.log("Wallet payment");
          setIsOpen(false);
        }}
        onPayWithPaystack={() => {
          console.log("Paystack payment");
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default NextMilestone;
