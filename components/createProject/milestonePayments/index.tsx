"use client";
import React, { useState, useRef } from "react";
import styles from "./styles.module.css";
import { MilestoneFormData, Deliverable } from "@/types/createPrjects";
import EditMilestoneModal from "../editMilestoneModal";

interface MilestonesPaymentsProps {
  milestones: MilestoneFormData[];
  onUpdate: (milestones: MilestoneFormData[]) => void;
  onNext: () => void;
  onBack: () => void;
  mode?: "create" | "edit";
  onRefresh?: () => void;
}

const MilestonesPayments: React.FC<MilestonesPaymentsProps> = ({
  milestones,
  onUpdate,
  onNext,
  onBack,
  mode = "create",
  onRefresh,
}) => {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(
    null
  );
  const [editingMilestone, setEditingMilestone] =
    useState<MilestoneFormData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const idCounterRef = useRef(0);

  const isReadOnly = mode === "edit";

  const generateId = () => {
    idCounterRef.current += 1;
    return `item-${idCounterRef.current}`;
  };

  const updateMilestone = (
    milestoneId: string,
    updates: Partial<MilestoneFormData>
  ) => {
    if (isReadOnly) return;
    const updated = milestones.map((m) =>
      m.id === milestoneId ? { ...m, ...updates } : m
    );
    onUpdate(updated);
  };

  const toggleMilestone = (milestoneId: string) => {
    const isOpening = expandedMilestone !== milestoneId;
    setExpandedMilestone(isOpening ? milestoneId : null);

    // Auto-add first deliverable field if none exist
    if (isOpening && !isReadOnly) {
      const milestone = milestones.find((m) => m.id === milestoneId);
      if (milestone && milestone.deliverables.length === 0) {
        updateMilestone(milestoneId, {
          deliverables: [{ id: generateId(), task: "" }],
        });
      }
    }
  };

  const handleEditMilestone = (milestone: MilestoneFormData) => {
    setEditingMilestone(milestone);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingMilestone(null);
  };

  const handleEditSuccess = () => {
    if (onRefresh) onRefresh();
  };

  const addDeliverable = (milestoneId: string) => {
    if (isReadOnly) return;
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      const newDeliverable: Deliverable = {
        id: generateId(),
        task: "",
      };
      updateMilestone(milestoneId, {
        deliverables: [...milestone.deliverables, newDeliverable],
      });
    }
  };

  const updateDeliverable = (
    milestoneId: string,
    deliverableId: string,
    task: string
  ) => {
    if (isReadOnly) return;
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      const updatedDeliverables = milestone.deliverables.map((d) =>
        d.id === deliverableId ? { ...d, task } : d
      );
      updateMilestone(milestoneId, { deliverables: updatedDeliverables });
    }
  };

  const removeDeliverable = (milestoneId: string, deliverableId: string) => {
    if (isReadOnly) return;
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      const updatedDeliverables = milestone.deliverables.filter(
        (d) => d.id !== deliverableId
      );
      updateMilestone(milestoneId, { deliverables: updatedDeliverables });
    }
  };

  const addMilestone = () => {
    if (isReadOnly) return;
    const newMilestone: MilestoneFormData = {
      id: generateId(),
      number: milestones.length + 1,
      title: "",
      description: "",
      amount: "",
      dueDate: "",
      deliverables: [],
    };
    onUpdate([...milestones, newMilestone]);
  };

  const deleteMilestone = (milestoneId: string) => {
    if (isReadOnly) return;
    const filtered = milestones.filter((m) => m.id !== milestoneId);
    const renumbered = filtered.map((m, index) => ({
      ...m,
      number: index + 1,
    }));
    onUpdate(renumbered);
  };

  const getDeliverableTask = (deliverable: Deliverable | unknown): string => {
    if (typeof deliverable === "string") return deliverable;
    if (
      deliverable &&
      typeof deliverable === "object" &&
      "task" in deliverable
    ) {
      const d = deliverable as Deliverable;
      return typeof d.task === "string" ? d.task : "";
    }
    return "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerWithBadge}>
          <h3 className={styles.title}>Milestones & payments</h3>
          {isReadOnly && (
            <div className={styles.readOnlyBadge}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Read-only
            </div>
          )}
        </div>
        <p className={styles.subtitle}>
          {isReadOnly
            ? "Review milestones and payments (click edit button to modify)"
            : "Customize milestones and payment at each stage"}
        </p>
      </div>

      {isReadOnly && (
        <div className={styles.infoMessage}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>Click the Edit button on any milestone card to make changes.</p>
        </div>
      )}

      <div className={styles.milestonesList}>
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`${styles.milestoneCard} ${
              isReadOnly ? styles.readOnlyCard : ""
            }`}
          >
            <div
              className={styles.milestoneHeader}
              onClick={() => toggleMilestone(milestone.id)}
            >
              <div className={styles.milestoneHeaderLeft}>
                {index === 0 ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    className={styles.checkIcon}
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <span className={styles.milestoneNumber}>
                    {milestone.number}
                  </span>
                )}
                <span className={styles.milestoneTitle}>{milestone.title}</span>
              </div>

              <div className={styles.milestoneHeaderRight}>
                {isReadOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditMilestone(milestone);
                    }}
                    className={styles.editButton}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                )}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`${styles.chevron} ${
                    expandedMilestone === milestone.id ? styles.chevronUp : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {expandedMilestone === milestone.id && (
              <div className={styles.milestoneContent}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Milestone Name</label>
                  <input
                    type="text"
                    value={milestone.title}
                    onChange={(e) =>
                      updateMilestone(milestone.id, { title: e.target.value })
                    }
                    className={styles.input}
                    placeholder="Enter milestone name"
                    disabled={isReadOnly}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Milestone Description</label>
                  <textarea
                    value={milestone.description}
                    onChange={(e) =>
                      updateMilestone(milestone.id, {
                        description: e.target.value,
                      })
                    }
                    className={styles.textarea}
                    placeholder="What does this milestone cover?"
                    rows={3}
                    disabled={isReadOnly}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Amount</label>
                    <input
                      type="text"
                      value={milestone.amount}
                      onChange={(e) =>
                        updateMilestone(milestone.id, {
                          amount: e.target.value,
                        })
                      }
                      className={styles.input}
                      placeholder="Enter amount"
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Due date</label>
                    <div className={styles.dateInputWrapper}>
                      <input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) =>
                          updateMilestone(milestone.id, {
                            dueDate: e.target.value,
                          })
                        }
                        className={styles.dateInput}
                        disabled={isReadOnly}
                      />
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={styles.calendarIcon}
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Deliverables */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Deliverables</label>
                  {milestone.deliverables.map((deliverable) => (
                    <div key={deliverable.id} className={styles.deliverableRow}>
                      <input
                        type="text"
                        value={getDeliverableTask(deliverable)}
                        onChange={(e) =>
                          updateDeliverable(
                            milestone.id,
                            deliverable.id,
                            e.target.value
                          )
                        }
                        className={styles.input}
                        placeholder="Enter deliverable"
                        disabled={isReadOnly}
                      />
                      {/* Only show remove if more than one deliverable */}
                      {!isReadOnly && milestone.deliverables.length > 1 && (
                        <button
                          onClick={() =>
                            removeDeliverable(milestone.id, deliverable.id)
                          }
                          className={styles.removeButton}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  {!isReadOnly && (
                    <button
                      onClick={() => addDeliverable(milestone.id)}
                      className={styles.addButton}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add another deliverable
                    </button>
                  )}
                </div>

                {!isReadOnly && (
                  <button
                    onClick={() => deleteMilestone(milestone.id)}
                    className={styles.deleteButton}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete milestone
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isReadOnly && (
        <button onClick={addMilestone} className={styles.addMilestoneButton}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add another milestone
        </button>
      )}

      <div className={styles.footer}>
        <button onClick={onBack} className={styles.backButton}>
          Back
        </button>
        <button onClick={onNext} className={styles.proceedButton}>
          {isReadOnly ? "Next" : "Proceed"}
        </button>
      </div>

      {editingMilestone && (
        <EditMilestoneModal
          milestone={editingMilestone}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default MilestonesPayments;
