import React from "react";
import { Project } from "@/types/agencyProjectsNew";
import styles from "./styles.module.css";

interface ProjectCardProps {
  project: Project;
  onSeeDetails: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSeeDetails,
}) => {
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "Completed":
        return styles.statusCompleted;
      case "In-Progress":
        return styles.statusInProgress;
      case "On-Hold":
        return styles.statusOnHold;
      default:
        return styles.statusPending;
    }
  };

  const calculateProgress = () => {
    if (!project.progress || project.progress.total === 0) return 0;
    return (project.progress.current / project.progress.total) * 100;
  };

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <span className={styles.label}>Project Name</span>
        <span className={styles.value}>{project.projectName}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Client</span>
        <span className={styles.value}>{project.client.name}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Total project value</span>
        <span className={styles.value}>
          {formatCurrency(project.totalProjectValue)}
        </span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Amount paid</span>
        <div className={styles.amountPaidContainer}>
          <span className={styles.value}>
            {formatCurrency(project.amountPaid)}
          </span>
          <span className={styles.percentPaid}>
            {project.percentPaid}% paid
          </span>
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Progress</span>
        <div className={styles.progressContainer}>
          <span className={styles.value}>
            {project.progress?.current || 0}/{project.progress?.total || 0}{" "}
            Milestones
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Status</span>
        <span
          className={`${styles.statusBadge} ${getStatusClass(project.status)}`}
        >
          {project.status}
        </span>
      </div>

      <button
        className={styles.detailsButton}
        onClick={() => onSeeDetails(project.id)}
      >
        See Details
      </button>
    </div>
  );
};
