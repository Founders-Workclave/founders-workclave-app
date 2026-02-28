"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";
import {
  milestoneService,
  ApiError,
} from "@/lib/api/createProject/editMilestones";
import { MilestoneFormData, Deliverable } from "@/types/createPrjects";

interface EditMilestoneModalProps {
  milestone?: MilestoneFormData;
  projectId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "edit" | "create";
}

const EditMilestoneModal: React.FC<EditMilestoneModalProps> = ({
  milestone,
  projectId,
  isOpen,
  onClose,
  onSuccess,
  mode = "edit",
}) => {
  const getDefaultMilestone = useCallback(
    (): MilestoneFormData => ({
      id: "",
      number: 1,
      title: "",
      description: "",
      amount: "",
      dueDate: "",
      deliverables: [{ id: `temp-${Date.now()}`, task: "" }],
    }),
    []
  );

  const [formData, setFormData] = useState<MilestoneFormData>(
    milestone || getDefaultMilestone()
  );
  const [deletedDeliverables, setDeletedDeliverables] = useState<Deliverable[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "create") {
      setFormData(getDefaultMilestone());
      setDeletedDeliverables([]);
    } else if (milestone) {
      // Deduplicate deliverables by task text before setting form data
      const uniqueDeliverables = milestone.deliverables.filter(
        (deliverable, index, self) =>
          index ===
          self.findIndex((d) => d.task.trim() === deliverable.task.trim())
      );

      setFormData({
        ...milestone,
        deliverables:
          uniqueDeliverables.length > 0
            ? uniqueDeliverables
            : [{ id: `temp-${Date.now()}`, task: "" }],
      });
      setDeletedDeliverables([]);
    }
    setError(null);
  }, [milestone, mode, getDefaultMilestone]);

  const handleInputChange = (
    field: keyof MilestoneFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeliverableChange = (id: string, task: string) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) =>
        d.id === id ? { ...d, task } : d
      ),
    }));
  };

  const addDeliverable = () => {
    const newDeliverable: Deliverable = {
      id: `temp-${Date.now()}`,
      task: "",
    };
    setFormData((prev) => ({
      ...prev,
      deliverables: [...prev.deliverables, newDeliverable],
    }));
  };

  const removeDeliverable = (id: string) => {
    const deliverable = formData.deliverables.find((d) => d.id === id);

    if (deliverable && !id.startsWith("temp-")) {
      setDeletedDeliverables((prev) => [...prev, deliverable]);
    }

    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((d) => d.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const validDeliverables = formData.deliverables.filter(
        (d) => d.task.trim() !== ""
      );

      if (mode === "create") {
        if (!projectId) {
          throw new Error("Project ID is required for creating milestones");
        }

        await milestoneService.createMilestone(projectId, {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.amount) || 0,
          dueDate: formData.dueDate,
          deliverables: validDeliverables.map((d) => ({
            task: d.task,
            action: "create" as const,
          })),
        });
      } else {
        if (!milestone?.id) {
          throw new Error("Milestone ID is required for editing");
        }

        const updatedDeliverables = validDeliverables.map((d) => {
          if (d.id.startsWith("temp-")) {
            return { task: d.task, action: "create" as const };
          }
          return { id: d.id, task: d.task, action: "update" as const };
        });

        const deletedPayload = deletedDeliverables.map((d) => ({
          id: d.id,
          task: d.task,
          action: "delete" as const,
        }));

        await milestoneService.editMilestone(milestone.id, {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.amount) || 0,
          dueDate: formData.dueDate,
          deliverables: [...updatedDeliverables, ...deletedPayload],
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          `Failed to ${
            mode === "create" ? "create" : "update"
          } milestone. Please try again.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === "create" ? "Add New Milestone" : "Edit Milestone"}
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            disabled={isSubmitting}
          >
            <svg
              width="24"
              height="24"
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

        {error && (
          <div className={styles.errorMessage}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Milestone Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={styles.input}
              placeholder="Enter milestone name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={styles.textarea}
              placeholder="What does this milestone cover?"
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Amount <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className={styles.input}
                placeholder="0.00"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Due Date <span className={styles.required}>*</span>
              </label>
              <div className={styles.dateInputWrapper}>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className={styles.dateInput}
                  required
                  disabled={isSubmitting}
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Deliverables</label>
            <div className={styles.deliverablesContainer}>
              {formData.deliverables.map((deliverable, index) => (
                <div key={deliverable.id} className={styles.deliverableRow}>
                  <input
                    type="text"
                    value={
                      typeof deliverable === "string"
                        ? deliverable
                        : deliverable.task
                    }
                    onChange={(e) =>
                      handleDeliverableChange(deliverable.id, e.target.value)
                    }
                    className={styles.input}
                    placeholder={`Deliverable ${index + 1}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => removeDeliverable(deliverable.id)}
                    className={styles.removeButton}
                    disabled={
                      isSubmitting || formData.deliverables.length === 1
                    }
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
            </div>

            <button
              type="button"
              onClick={addDeliverable}
              className={styles.addButton}
              disabled={isSubmitting}
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
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className={styles.spinner}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" opacity="0.25" />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      opacity="0.75"
                      strokeLinecap="round"
                    />
                  </svg>
                  {mode === "create" ? "Creating..." : "Saving..."}
                </>
              ) : mode === "create" ? (
                "Create Milestone"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMilestoneModal;
