"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import {
  CreateProjectProps,
  ProjectFormData,
  CreateProjectStep,
  MilestoneFormData,
} from "@/types/createPrjects";

import mockData from "../../mocks/createProject.json";
import SelectClient from "./selectClient";
import ProjectDetails from "./projectDetails";
import MilestonesPayments from "./milestonePayments";
import TeamAssignment from "./teamAssignment";

const CreateProjectModal: React.FC<CreateProjectProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState<CreateProjectStep>(1);
  const [formData, setFormData] = useState<ProjectFormData>({
    clientId: "",
    projectName: "",
    problemStatement: "",
    expectedTimeline: "",
    coreFeatures: ["", ""],
    prdFile: null,
    milestones: mockData.defaultMilestones as MilestoneFormData[],
    productManagerId: "",
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as CreateProjectStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as CreateProjectStep);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const updateFormData = (updates: Partial<ProjectFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Select client";
      case 2:
        return "Project details";
      case 3:
        return "Milestones & payments";
      case 4:
        return "Client information";
      default:
        return "";
    }
  };

  const getProgressWidth = () => {
    return `${(currentStep / 4) * 100}%`;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Create new project</h2>
            <p className={styles.subtitle}>
              Step {currentStep} of 4 | {getStepTitle()}
            </p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
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

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: getProgressWidth() }}
          />
        </div>

        <div className={styles.content}>
          {currentStep === 1 && (
            <SelectClient
              selectedClientId={formData.clientId}
              onSelect={(clientId) => updateFormData({ clientId })}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <ProjectDetails
              formData={formData}
              onUpdate={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <MilestonesPayments
              milestones={formData.milestones}
              onUpdate={(milestones) => updateFormData({ milestones })}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <TeamAssignment
              selectedManagerId={formData.productManagerId}
              onSelect={(productManagerId) =>
                updateFormData({ productManagerId })
              }
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
