// components/agencyProject/projectRow/index.tsx
import React from "react";
import { Project } from "@/types/agencyProjectsNew";
import styles from "./styles.module.css";

interface ProjectRowProps {
  project: Project;
  onSeeDetails: (projectId: string) => void;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({
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
    <tr className={styles.row}>
      <td className={styles.cell}>
        <span className={styles.projectName}>{project.projectName}</span>
      </td>
      <td className={styles.cell}>
        <span className={styles.clientName}>{project.client.name}</span>
      </td>
      <td className={styles.cell}>
        <span className={styles.value}>
          {formatCurrency(project.totalProjectValue)}
        </span>
      </td>
      <td className={styles.cell}>
        <div className={styles.amountContainer}>
          <span className={styles.value}>
            {formatCurrency(project.amountPaid)}
          </span>
          <span className={styles.percentPaid}>
            {project.percentPaid}% paid
          </span>
        </div>
      </td>
      <td className={styles.cell}>
        <div className={styles.progressContainer}>
          <span className={styles.progressText}>
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
      </td>
      <td className={styles.cell}>
        <span
          className={`${styles.statusBadge} ${getStatusClass(project.status)}`}
        >
          {project.status}
        </span>
      </td>
      <td className={styles.cell}>
        <button
          className={styles.detailsButton}
          onClick={() => onSeeDetails(project.id)}
        >
          See Details
        </button>
      </td>
    </tr>
  );
};
