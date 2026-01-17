"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { MilestoneFormData, Deliverable } from "@/types/createPrjects";

interface MilestonesPaymentsProps {
  milestones: MilestoneFormData[];
  onUpdate: (milestones: MilestoneFormData[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const MilestonesPayments: React.FC<MilestonesPaymentsProps> = ({
  milestones,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(
    null
  );

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestone(
      expandedMilestone === milestoneId ? null : milestoneId
    );
  };

  const updateMilestone = (
    milestoneId: string,
    updates: Partial<MilestoneFormData>
  ) => {
    const updated = milestones.map((m) =>
      m.id === milestoneId ? { ...m, ...updates } : m
    );
    onUpdate(updated);
  };

  const addDeliverable = (milestoneId: string) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      const newDeliverable: Deliverable = {
        id: `${Date.now()}`,
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
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      const updatedDeliverables = milestone.deliverables.map((d) =>
        d.id === deliverableId ? { ...d, task } : d
      );
      updateMilestone(milestoneId, { deliverables: updatedDeliverables });
    }
  };

  const removeDeliverable = (milestoneId: string, deliverableId: string) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      const updatedDeliverables = milestone.deliverables.filter(
        (d) => d.id !== deliverableId
      );
      updateMilestone(milestoneId, { deliverables: updatedDeliverables });
    }
  };

  const addMilestone = () => {
    const newMilestone: MilestoneFormData = {
      id: `${Date.now()}`,
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
    const filtered = milestones.filter((m) => m.id !== milestoneId);
    const renumbered = filtered.map((m, index) => ({
      ...m,
      number: index + 1,
    }));
    onUpdate(renumbered);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Milestones & payments</h3>
        <p className={styles.subtitle}>
          Customize milestones and payment at each stage
        </p>
      </div>

      <div className={styles.milestonesList}>
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className={styles.milestoneCard}>
            <div
              className={styles.milestoneHeader}
              onClick={() => toggleMilestone(milestone.id)}
            >
              <div className={styles.milestoneHeaderLeft}>
                {index === 0 && (
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
                )}
                {index !== 0 && (
                  <span className={styles.milestoneNumber}>
                    {milestone.number}
                  </span>
                )}
                <span className={styles.milestoneTitle}>{milestone.title}</span>
              </div>
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
                    placeholder={milestone.title}
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

                <div className={styles.formGroup}>
                  <label className={styles.label}>Deliverables</label>
                  {milestone.deliverables.map((deliverable) => (
                    <div key={deliverable.id} className={styles.deliverableRow}>
                      <input
                        type="text"
                        value={deliverable.task}
                        onChange={(e) =>
                          updateDeliverable(
                            milestone.id,
                            deliverable.id,
                            e.target.value
                          )
                        }
                        className={styles.input}
                        placeholder="Enter deliverables"
                      />
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
                    </div>
                  ))}

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
                </div>

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
              </div>
            )}
          </div>
        ))}
      </div>

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

      <div className={styles.footer}>
        <button onClick={onBack} className={styles.backButton}>
          Back
        </button>
        <button onClick={onNext} className={styles.proceedButton}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default MilestonesPayments;
