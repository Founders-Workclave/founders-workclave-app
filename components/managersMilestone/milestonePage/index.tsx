"use client";
import React, { useState } from "react";
import styles from "@/components/agencyMilestone/milestonePage/styles.module.css";
import { useManagerMilestones } from "@/hooks/useManagerMilestones";
import AllLoading from "@/layout/Loader";
import ManagerMilestoneCard from "../milestoneCard";
import ServiceUnavailable from "@/components/errorBoundary/serviceUnavailable";
import toast from "react-hot-toast";
import EditNew from "@/svgs/editNew";
import EditMilestoneModal from "@/components/createProject/editMilestoneModal";
import type { Milestone } from "@/types/agencyMilestone";
import { MilestoneFormData } from "@/types/createPrjects";

interface ManagerMilestonesPageProps {
  projectId: string;
}

const ManagerMilestonesPage: React.FC<ManagerMilestonesPageProps> = ({
  projectId,
}) => {
  const { milestones, isLoading, error, refetch, markMilestoneComplete } =
    useManagerMilestones(projectId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] =
    useState<MilestoneFormData | null>(null);
  const [modalMode, setModalMode] = useState<"edit" | "create">("edit");

  const handleEditMilestone = (milestone: Milestone): void => {
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
    refetch();
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
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>
            No milestones found for this project.
          </p>
          <button className={styles.addButton} onClick={handleCreateMilestone}>
            <EditNew />
            Add milestones
          </button>
        </div>

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
          <ManagerMilestoneCard
            key={milestone.id}
            milestone={milestone}
            onEdit={() => handleEditMilestone(milestone)}
            onMarkComplete={handleMarkComplete}
          />
        ))}
      </div>

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

export default ManagerMilestonesPage;
