"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { milestoneService } from "@/lib/api/createProject/editMilestones";
import toast from "react-hot-toast";

export interface MilestoneData {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  status: string;
  price?: number;
  amount?: number;
  dueDate?: string;
  deadline?: string;
  deliverables?: Array<{ id: string; task: string }>;
}

interface EditableMilestoneCardProps {
  milestone: MilestoneData;
  onUpdate: () => void;
}

const EditableMilestoneCard: React.FC<EditableMilestoneCardProps> = ({
  milestone,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: milestone.title || milestone.name || "",
    description: milestone.description || "",
    price: milestone.price || milestone.amount || 0,
    dueDate: milestone.dueDate || milestone.deadline || "",
    deliverables: milestone.deliverables || [],
  });

  const isPending = milestone.status.toLowerCase() === "pending";
  const isInProgress = milestone.status.toLowerCase() === "in-progress";
  const isCompleted = milestone.status.toLowerCase() === "completed";

  const handleEdit = () => {
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      title: milestone.title || milestone.name || "",
      description: milestone.description || "",
      price: milestone.price || milestone.amount || 0,
      dueDate: milestone.dueDate || milestone.deadline || "",
      deliverables: milestone.deliverables || [],
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!formData.title.trim()) {
        toast.error("Title is required");
        return;
      }

      if (!formData.dueDate) {
        toast.error("Due date is required");
        return;
      }

      if (formData.price <= 0) {
        toast.error("Price must be greater than 0");
        return;
      }

      // Track which original deliverables were removed
      const originalIds = new Set(
        (milestone.deliverables || []).map((d) => d.id)
      );
      const currentIds = new Set(formData.deliverables.map((d) => d.id));

      const updatedDeliverables = formData.deliverables
        .filter((d) => d.task.trim() !== "")
        .map((d) => {
          if (d.id.startsWith("temp-")) {
            return { task: d.task, action: "create" as const };
          }
          return { id: d.id, task: d.task, action: "update" as const };
        });

      const deletedDeliverables = (milestone.deliverables || [])
        .filter((d) => !currentIds.has(d.id))
        .map((d) => ({ id: d.id, task: d.task, action: "delete" as const }));

      const apiData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        dueDate: formData.dueDate,
        deliverables: [...updatedDeliverables, ...deletedDeliverables],
      };

      toast.loading("Updating milestone...", { id: "milestone-update" });

      await milestoneService.editMilestone(milestone.id, apiData);

      toast.success("Milestone updated successfully!", {
        id: "milestone-update",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating milestone:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update milestone";
      toast.error(errorMessage, { id: "milestone-update" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);

      toast.loading("Marking milestone as completed...", {
        id: "milestone-complete",
      });

      await milestoneService.completeMilestone(milestone.id);

      toast.success("Milestone marked as completed!", {
        id: "milestone-complete",
      });

      onUpdate(); // Trigger parent refresh
    } catch (error) {
      console.error("Error completing milestone:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to complete milestone";
      toast.error(errorMessage, { id: "milestone-complete" });
    } finally {
      setIsCompleting(false);
    }
  };

  const addDeliverable = () => {
    setFormData({
      ...formData,
      deliverables: [
        ...formData.deliverables,
        { id: `temp-${Date.now()}`, task: "" },
      ],
    });
  };

  const updateDeliverable = (index: number, task: string) => {
    const updated = [...formData.deliverables];
    updated[index] = { ...updated[index], task };
    setFormData({ ...formData, deliverables: updated });
  };

  const removeDeliverable = (index: number) => {
    const updated = formData.deliverables.filter((_, i) => i !== index);
    setFormData({ ...formData, deliverables: updated });
  };

  const getStatusBadgeClass = () => {
    if (isCompleted) return styles.statusCompleted;
    if (isInProgress) return styles.statusInProgress;
    return styles.statusPending;
  };

  return (
    <div className={`${styles.milestoneCard} ${getStatusBadgeClass()}`}>
      <div className={styles.milestoneHeader}>
        <div className={styles.milestoneHeaderLeft}>
          <div className={styles.milestoneIcon}>
            {isCompleted && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
            {isInProgress && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            )}
            {isPending && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            )}
          </div>

          <div className={styles.milestoneTitleSection}>
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={styles.input}
                placeholder="Milestone title"
              />
            ) : (
              <h3 className={styles.milestoneTitle}>
                {milestone.title || milestone.name}
              </h3>
            )}
            <span className={`${styles.statusBadge} ${getStatusBadgeClass()}`}>
              {milestone.status}
            </span>
          </div>
        </div>

        <div className={styles.milestoneHeaderRight}>
          {!isCompleted && !isEditing && (
            <>
              <button
                onClick={handleEdit}
                className={styles.editButton}
                title="Edit milestone"
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

              {isPending && (
                <button
                  onClick={handleComplete}
                  className={styles.completeButton}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    "Completing..."
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Mark as Complete
                    </>
                  )}
                </button>
              )}
            </>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`${styles.chevron} ${
                isExpanded ? styles.chevronUp : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.milestoneContent}>
          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={styles.textarea}
                placeholder="Milestone description"
                rows={3}
              />
            ) : (
              <p className={styles.description}>{milestone.description}</p>
            )}
          </div>

          {/* Price and Due Date */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Amount</label>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className={styles.input}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              ) : (
                <p className={styles.amount}>
                  ${(milestone.price || milestone.amount || 0).toLocaleString()}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Due Date</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className={styles.input}
                />
              ) : (
                <p className={styles.dueDate}>
                  {milestone.dueDate || milestone.deadline}
                </p>
              )}
            </div>
          </div>

          {/* Deliverables */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Deliverables</label>
            {isEditing ? (
              <>
                {formData.deliverables.map((deliverable, index) => (
                  <div key={deliverable.id} className={styles.deliverableRow}>
                    <input
                      type="text"
                      value={deliverable.task}
                      onChange={(e) => updateDeliverable(index, e.target.value)}
                      className={styles.input}
                      placeholder="Enter deliverable"
                    />
                    <button
                      onClick={() => removeDeliverable(index)}
                      className={styles.removeButton}
                      type="button"
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
                  </div>
                ))}
                <button
                  onClick={addDeliverable}
                  className={styles.addButton}
                  type="button"
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
                  Add deliverable
                </button>
              </>
            ) : (
              <ul className={styles.deliverablesList}>
                {(milestone.deliverables || []).map((deliverable) => (
                  <li key={deliverable.id} className={styles.deliverableItem}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {deliverable.task}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className={styles.editActions}>
              <button
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={styles.saveButton}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableMilestoneCard;
