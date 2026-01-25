"use client";
import React from "react";
import styles from "./styles.module.css";
import type { Milestone } from "@/types/agencyMilestone";
import AdminMilestoneCard from "../milestoneCard";
import EditNew from "@/svgs/editNew";
import toast from "react-hot-toast";
import { useMilestones } from "@/hooks/useAgencyMilestones";
import AllLoading from "@/layout/Loader";

interface AdminMilestonesPageProps {
  projectId: string;
  initialMilestones?: Milestone[];
}

const AdminMilestonesPage: React.FC<AdminMilestonesPageProps> = ({
  projectId,
  initialMilestones = [],
}) => {
  const {
    milestones,
    isLoading,
    error,
    updateMilestoneProgress,
    markMilestoneComplete,
  } = useMilestones({
    projectId,
    initialMilestones,
  });

  const handleEditMilestone = (milestone: Milestone): void => {
    console.log("Edit milestone:", milestone);
    // TODO: Open edit modal/form
  };

  const handleMarkComplete = async (
    milestoneId: string | number
  ): Promise<void> => {
    try {
      await markMilestoneComplete(String(milestoneId));
      toast.success("Marked as Completed");
    } catch {
      toast.error("Error marking milestone as complete:");
    }
  };

  const handleUpdateProgress = async (
    milestoneId: string | number,
    progress: number
  ): Promise<void> => {
    try {
      await updateMilestoneProgress(String(milestoneId), progress);
    } catch {
      toast.error("Error updating milestone progress:");
    }
  };

  const handleEditMilestones = (): void => {
    console.log("Open bulk edit mode");
    // TODO: Implement bulk edit functionality
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
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Milestones</h1>
        </div>
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage} style={{ color: "red" }}>
            Error: {error}
          </p>
          <button
            className={styles.addButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Milestones</h1>
        </div>
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>
            No milestones found for this project.
          </p>
          <button className={styles.addButton} onClick={handleEditMilestones}>
            <EditNew />
            Add milestones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Milestones</h1>
        <button className={styles.editButton} onClick={handleEditMilestones}>
          <EditNew />
          Edit milestones
        </button>
      </div>

      <div className={styles.milestonesTimeline}>
        {milestones.map((milestone) => (
          <AdminMilestoneCard
            key={milestone.id}
            milestone={milestone}
            onEdit={handleEditMilestone}
            onMarkComplete={handleMarkComplete}
            onUpdateProgress={handleUpdateProgress}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminMilestonesPage;
