"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { Milestone } from "@/types/project";
import AdminMilestoneCard from "../milestoneCard";
import mockData from "@/mocks/projectMilestone.json";
import EditNew from "@/svgs/editNew";

interface MockMilestone {
  id: number;
  number: number;
  title: string;
  description: string;
  dueDate: string;
  completedDate: string | null;
  payment: number;
  status: string;
  progress: number;
  deliverables: string[];
  note?: string;
}

const AdminMilestonesPage: React.FC = () => {
  // Transform mock data to match Milestone type
  const transformedMilestones: Milestone[] = (
    mockData.milestones as MockMilestone[]
  ).map((m) => ({
    id: m.id,
    number: m.number,
    title: m.title,
    description: m.description,
    dueDate: m.dueDate,
    completedDate: m.completedDate,
    payment: m.payment,
    status: m.status as "completed" | "in-progress" | "pending",
    progress: m.progress,
    deliverables: m.deliverables,
    note: m.note,
    price: m.payment.toString(),
    paid: m.status !== "pending",
    completed: m.status === "completed",
    order: m.number,
  }));

  const [milestones, setMilestones] = useState<Milestone[]>(
    transformedMilestones
  );

  const handleEditMilestone = (milestone: Milestone): void => {
    console.log("Edit milestone:", milestone);
    // TODO: Open edit modal/form
  };

  const handleMarkComplete = (milestoneId: string | number): void => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              completed: true,
              status: "completed" as const,
              completedDate: new Date().toISOString(),
              progress: 100,
            }
          : m
      )
    );
  };

  const handleUpdateProgress = (
    milestoneId: string | number,
    progress: number
  ): void => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((m) => (m.id === milestoneId ? { ...m, progress } : m))
    );
  };

  const handleEditMilestones = (): void => {
    console.log("Open bulk edit mode");
    // TODO: Implement bulk edit functionality
  };

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
        {milestones.length > 0 ? (
          milestones.map((milestone) => (
            <AdminMilestoneCard
              key={milestone.id}
              milestone={milestone}
              onEdit={handleEditMilestone}
              onMarkComplete={handleMarkComplete}
              onUpdateProgress={handleUpdateProgress}
            />
          ))
        ) : (
          <p className={styles.emptyMessage}>
            No milestones found for this project.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminMilestonesPage;
