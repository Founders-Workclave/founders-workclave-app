"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import PaymentModal from "@/components/paymentPopup/paymentModal";
import { NextMilestoneData } from "@/types/project";
import Milestones from "@/svgs/milestones";

interface NextMilestoneProps {
  milestone: NextMilestoneData | null;
  walletBalance?: number;
}

const NextMilestone = ({
  milestone,
  walletBalance = 0,
}: NextMilestoneProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!milestone) {
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
      <p className={styles.description}>{milestone.title}</p>

      <button onClick={() => setIsOpen(true)} className={styles.viewButton}>
        View details
      </button>

      <PaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        milestone={{
          title: milestone.title,
          description: milestone.description,
          dueDate: milestone.dueDate,
          amount: parseFloat(milestone.price) || 0,
          deliverables: milestone.deliverables.map((d) => d.task),
        }}
        walletBalance={walletBalance}
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
