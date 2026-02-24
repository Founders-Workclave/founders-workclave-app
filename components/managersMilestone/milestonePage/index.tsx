"use client";
import React from "react";
import styles from "@/components/agencyMilestone/milestonePage/styles.module.css";
import { useManagerMilestones } from "@/hooks/useManagerMilestones";
import AllLoading from "@/layout/Loader";
import ManagerMilestoneCard from "../milestoneCard";
import ServiceUnavailable from "@/components/errorBoundary/serviceUnavailable";
import toast from "react-hot-toast";

interface ManagerMilestonesPageProps {
  projectId: string;
}

const ManagerMilestonesPage: React.FC<ManagerMilestonesPageProps> = ({
  projectId,
}) => {
  const { milestones, isLoading, error, refetch, markMilestoneComplete } =
    useManagerMilestones(projectId);

  const handleMarkComplete = async (
    milestoneId: string | number
  ): Promise<void> => {
    try {
      await markMilestoneComplete(String(milestoneId));
      toast.success("Marked as Completed");
    } catch {
      toast.error("Error marking milestone as complete");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Milestones</h1>
        </div>
        <div className={styles.emptyState}>
          <AllLoading text="Loading Milestones..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load milestones"
        message="We're having trouble loading your milestones. Please try again."
        showRetry
        onRetry={refetch}
      />
    );
  }

  if (milestones.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Milestones</h1>
        </div>
        <p className={styles.emptyMessage}>
          No milestones found for this project.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Milestones</h1>
      </div>

      <div className={styles.milestonesTimeline}>
        {milestones.map((milestone) => (
          <ManagerMilestoneCard
            key={milestone.id}
            milestone={milestone}
            onMarkComplete={handleMarkComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default ManagerMilestonesPage;
