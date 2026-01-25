import React from "react";
import styles from "./styles.module.css";
import AdminIconProject from "@/svgs/adminIconProject";

type ProjectStatus = "in-progress" | "completed";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  progress: number;
  status: ProjectStatus;
  description?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  subtitle,
  progress,
  status,
}) => {
  return (
    <div className={styles.projectCard}>
      <div className={styles.cardHeader}>
        <div className={styles.titleGroup}>
          <div className={styles.icon}>
            <AdminIconProject />
          </div>
          <div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
        </div>

        <span className={`${styles.status} ${styles[status]}`}>
          {status === "completed" ? "Completed" : "In-Progress"}
        </span>
      </div>

      <div className={styles.progressLabel}>
        <span>Progress</span>
        <span>{progress}%</span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProjectCard;
