import React from "react";
import styles from "./styles.module.css";

interface ProgressData {
  overall: number;
  milestonesCompleted: number;
  totalMilestones: number;
  daysLeftUntilDeadline: number;
  documentTotal: number;
}

interface ProjectProgressProps {
  progress: ProgressData;
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({ progress }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Project Progress</h2>
      <p className={styles.subtitle}>Overall Completion</p>

      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress.overall}%` }}
          />
        </div>
        <span className={styles.percentage}>{progress.overall}%</span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {progress.milestonesCompleted}/{progress.totalMilestones}
          </div>
          <div className={styles.statLabel}>Milestones Completed</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {progress.daysLeftUntilDeadline}
          </div>
          <div className={styles.statLabel}>Days left until deadline</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{progress.documentTotal}</div>
          <div className={styles.statLabel}>Document total file</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;
