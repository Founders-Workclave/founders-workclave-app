"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { ProjectFormData } from "@/types/createPrjects";
import mockData from "../../../mocks/createProject.json";

interface ProjectDetailsProps {
  formData: ProjectFormData;
  onUpdate: (updates: Partial<ProjectFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  formData,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const timelineOptions = mockData.timelineOptions;

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.coreFeatures];
    newFeatures[index] = value;
    onUpdate({ coreFeatures: newFeatures });
  };

  const handleAddFeature = () => {
    onUpdate({ coreFeatures: [...formData.coreFeatures, ""] });
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.coreFeatures.filter((_, i) => i !== index);
    onUpdate({ coreFeatures: newFeatures });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpdate({ prdFile: e.dataTransfer.files[0] });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpdate({ prdFile: e.target.files[0] });
    }
  };

  const isFormValid = () => {
    return (
      formData.projectName.trim() !== "" &&
      formData.problemStatement.trim() !== "" &&
      formData.expectedTimeline !== "" &&
      formData.coreFeatures.some((f) => f.trim() !== "")
    );
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Project details</h3>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Project Name</label>
          <input
            type="text"
            placeholder="Enter project name"
            value={formData.projectName}
            onChange={(e) => onUpdate({ projectName: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Problem statement</label>
          <textarea
            placeholder="Describe the problem you're trying to solve..."
            value={formData.problemStatement}
            onChange={(e) => onUpdate({ problemStatement: e.target.value })}
            className={styles.textarea}
            rows={4}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Expected Timeline</label>
          <select
            value={formData.expectedTimeline}
            onChange={(e) => onUpdate({ expectedTimeline: e.target.value })}
            className={styles.select}
          >
            <option value="">Select</option>
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Core features</label>
          <p className={styles.hint}>
            List the core features of this project. You can list more than one
          </p>

          {formData.coreFeatures.map((feature, index) => (
            <div key={index} className={styles.featureRow}>
              <div className={styles.featureNumber}>Feature {index + 1}</div>
              <input
                type="text"
                placeholder={index === 0 ? "Enter feat" : "Enter feature"}
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className={styles.input}
              />
              {formData.coreFeatures.length > 1 && (
                <button
                  onClick={() => handleRemoveFeature(index)}
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

          <button onClick={handleAddFeature} className={styles.addButton}>
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
            Add another feature
          </button>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Upload PRD</label>
          <div
            className={`${styles.uploadArea} ${
              dragActive ? styles.dragActive : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={styles.uploadIcon}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className={styles.uploadText}>
              Drop your documents here, or{" "}
              <label className={styles.uploadLink}>
                click to upload
                <input
                  type="file"
                  onChange={handleFileInput}
                  className={styles.fileInput}
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </p>
            {formData.prdFile && (
              <p className={styles.fileName}>{formData.prdFile.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button onClick={onBack} className={styles.backButton}>
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid()}
          className={styles.proceedButton}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
