"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./styles.module.css";
import {
  CreateProjectProps,
  ProjectFormData,
  CreateProjectStep,
} from "@/types/createPrjects";
import { projectService } from "@/lib/api/createProject/project";
import {
  transformProjectFormToApiRequest,
  validateProjectForm,
} from "@/utils/createProjectTransformers";

import SelectClient from "./selectClient";
import ProjectDetails from "./projectDetails";
import MilestonesPayments from "./milestonePayments";
import TeamAssignment from "./teamAssignment";

const getDefaultFormData = (): ProjectFormData => ({
  clientId: "",
  projectName: "",
  problemStatement: "",
  expectedTimeline: "",
  coreFeatures: ["", ""],
  featureIds: undefined,
  prdFile: null,
  milestones: [
    {
      id: "1",
      number: 1,
      title: "Idea Consultation & PRD Generation",
      description: "",
      amount: "",
      dueDate: "",
      deliverables: [],
    },
    {
      id: "2",
      number: 2,
      title: "PRD Review & Technical Planning",
      description: "",
      amount: "",
      dueDate: "",
      deliverables: [],
    },
    {
      id: "3",
      number: 3,
      title: "Design & System Architecture",
      description: "",
      amount: "",
      dueDate: "",
      deliverables: [],
    },
  ],
  productManagerId: "",
});

interface ExtendedCreateProjectProps extends CreateProjectProps {
  initialStep?: CreateProjectStep; // NEW: Allow starting at specific step
}

const CreateProjectModal: React.FC<ExtendedCreateProjectProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  projectId,
  initialData,
  initialStep = 1, // NEW: Default to step 1
}) => {
  const [currentStep, setCurrentStep] =
    useState<CreateProjectStep>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize formData based on mode and initialData
  const [formData, setFormData] = useState<ProjectFormData>(() => {
    if (mode === "edit" && initialData) {
      console.log("🎯 Initializing edit mode with data:", initialData);
      return initialData;
    }
    return getDefaultFormData();
  });

  // Update form data when modal opens in edit mode or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        console.log("🔄 Edit mode - Setting form data:", initialData);
        setFormData(initialData);
      } else if (mode === "create") {
        console.log("✨ Create mode - Using default data");
        setFormData(getDefaultFormData());
      }
    }
  }, [isOpen, mode, initialData]);

  // Reset to initial step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep); // Use initialStep instead of hardcoded 1
      setSubmitError(null);
    }
  }, [isOpen, initialStep]);

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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      console.log("📤 Submitting form data:", formData);

      // Validate form data
      const validation = validateProjectForm(formData);
      if (!validation.isValid) {
        setSubmitError(validation.errors.join(", "));
        toast.error("Please fix the validation errors");
        return;
      }

      // Transform form data to API request format
      const apiRequest = transformProjectFormToApiRequest(formData);
      console.log("📦 API Request payload:", apiRequest);

      // Enhanced debugging for features
      console.log("🔍 DEBUG - Features detail:");
      console.log("  - formData.coreFeatures:", formData.coreFeatures);
      console.log("  - formData.featureIds:", formData.featureIds);
      console.log("  - apiRequest.features:", apiRequest.features);
      console.log("  - Features validation:");
      apiRequest.features.forEach((f, i) => {
        console.log(`    Feature ${i}:`, {
          id: f.id,
          idType: typeof f.id,
          isNumber: typeof f.id === "number",
          isValidNumber: !isNaN(Number(f.id)) && Number(f.id) > 0,
          feature: f.feature,
        });
      });

      // Determine if we're creating or updating
      const isEditMode = mode === "edit" && projectId;

      if (isEditMode) {
        // UPDATE MODE: Only update project basic info (not milestones)
        toast.loading("Updating project details...", { id: "project-action" });

        const response = await projectService.updateProject(
          projectId,
          apiRequest,
          formData.prdFile || undefined
        );

        toast.success("Project details updated successfully!", {
          id: "project-action",
          duration: 4000,
        });

        console.log("Project updated successfully:", response);
      } else {
        // CREATE MODE: Create project with all data including milestones
        toast.loading("Creating project...", { id: "project-action" });
        const response = await projectService.createProject(
          apiRequest,
          formData.prdFile || undefined
        );

        toast.success("🎉 Project created successfully!", {
          id: "project-action",
          duration: 4000,
        });

        console.log("Project created successfully:", response);
      }

      // Call parent onSubmit callback
      onSubmit(formData);

      // Close modal
      onClose();

      // Reset form
      resetForm();
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} project:`,
        error
      );
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to ${mode === "edit" ? "update" : "create"} project`;
      setSubmitError(errorMessage);
      toast.error(errorMessage, { id: "project-action" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(getDefaultFormData());
    setCurrentStep(initialStep); // Reset to initialStep
    setSubmitError(null);
  };

  const updateFormData = (updates: Partial<ProjectFormData>) => {
    console.log("🔧 Updating form data with:", updates);
    setFormData((prev) => {
      const updated = { ...prev, ...updates };
      console.log("📋 Updated form data:", updated);
      return updated;
    });
  };

  const getModalTitle = () => {
    return mode === "edit" ? "Edit project details" : "Create new project";
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Select client";
      case 2:
        return "Project details";
      case 3:
        return mode === "edit"
          ? "Milestones (view only)"
          : "Milestones & payments";
      case 4:
        return "Assign manager";
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
            <h2 className={styles.title}>{getModalTitle()}</h2>
            <p className={styles.subtitle}>
              Step {currentStep} of 4 | {getStepTitle()}
            </p>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
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

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: getProgressWidth() }}
          />
        </div>

        {submitError && (
          <div className={styles.errorBanner}>
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
            <span>{submitError}</span>
            <button onClick={() => setSubmitError(null)}>×</button>
          </div>
        )}

        <div className={styles.content}>
          {currentStep === 1 && (
            <SelectClient
              selectedClientId={formData.clientId}
              onSelect={(clientId) => updateFormData({ clientId })}
              onNext={handleNext}
              mode={mode}
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
              mode={mode}
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
              isSubmitting={isSubmitting}
              mode={mode}
            />
          )}
        </div>

        {isSubmitting && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <p>
              {mode === "edit"
                ? "Updating project details..."
                : "Creating project..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProjectModal;
