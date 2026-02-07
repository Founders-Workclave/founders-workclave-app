"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import type { Milestone } from "@/types/agencyMilestone";
import AdminMilestoneCard from "../milestoneCard";

import EditNew from "@/svgs/editNew";
import toast from "react-hot-toast";
import { useMilestones } from "@/hooks/useAgencyMilestones";
import { MilestoneFormData } from "@/types/createPrjects";
import AllLoading from "@/layout/Loader";
import EditMilestoneModal from "@/components/createProject/editMilestoneModal";

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
    refetch,
  } = useMilestones({
    projectId,
    initialMilestones,
  });

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] =
    useState<MilestoneFormData | null>(null);
  const [modalMode, setModalMode] = useState<"edit" | "create">("edit");

  const handleEditMilestone = (milestone: Milestone): void => {
    // Transform Milestone to MilestoneFormData
    const formData: MilestoneFormData = {
      id: milestone.id.toString(),
      number: milestone.number || 1,
      title: milestone.title,
      description: milestone.description || "",
      amount: milestone.price?.toString() || "0",
      dueDate: milestone.dueDate || "",
      deliverables:
        milestone.deliverables?.map((d, index) => ({
          id:
            (typeof d === "object" && "id" in d
              ? d.id?.toString()
              : undefined) || `temp-${Date.now()}-${index}`,
          task: typeof d === "string" ? d : d.task,
        })) || [],
    };

    setSelectedMilestone(formData);
    setModalMode("edit");
    setIsEditModalOpen(true);
  };

  const handleCreateMilestone = (): void => {
    setSelectedMilestone(null);
    setModalMode("create");
    setIsEditModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsEditModalOpen(false);
    setSelectedMilestone(null);
  };

  const handleModalSuccess = (): void => {
    toast.success(
      modalMode === "create"
        ? "Milestone created successfully"
        : "Milestone updated successfully"
    );
    refetch(); // Refetch milestones after successful edit
  };

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

  const handleUpdateProgress = async (
    milestoneId: string | number,
    progress: number
  ): Promise<void> => {
    try {
      await updateMilestoneProgress(String(milestoneId), progress);
    } catch {
      toast.error("Error updating milestone progress");
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
          <button className={styles.addButton} onClick={handleCreateMilestone}>
            <EditNew />
            Add milestones
          </button>
        </div>

        {/* Create Milestone Modal */}
        <EditMilestoneModal
          projectId={projectId}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
          mode="create"
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Milestones</h1>
        <button className={styles.editButton} onClick={handleCreateMilestone}>
          <EditNew />
          Add milestone
        </button>
      </div>

      <div className={styles.milestonesTimeline}>
        {milestones.map((milestone) => (
          <AdminMilestoneCard
            key={milestone.id}
            milestone={milestone}
            onEdit={() => handleEditMilestone(milestone)}
            onMarkComplete={handleMarkComplete}
            onUpdateProgress={handleUpdateProgress}
          />
        ))}
      </div>

      {/* Edit/Create Milestone Modal */}
      <EditMilestoneModal
        milestone={
          modalMode === "edit" ? selectedMilestone ?? undefined : undefined
        }
        projectId={projectId}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        mode={modalMode}
      />
    </div>
  );
};

export default AdminMilestonesPage;
