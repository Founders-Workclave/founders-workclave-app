import styles from "./styles.module.css";
import { Project } from "@/types/project";
import Prd from "@/svgs/prd";
import Link from "next/link";

interface RecentProjectsProps {
  projects: Project[];
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects }) => {
  const getStatusStyle = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, "-");
    switch (normalizedStatus) {
      case "ongoing":
        return styles.statusInProgress;
      case "completed":
        return styles.statusCompleted;
      case "in-progress":
        return styles.statusInProgress;
      case "pending":
        return styles.statusPending;
      case "paused":
        return styles.statusPaused;
      case "terminated":
        return styles.statusTerminated;
      default:
        return "";
    }
  };

  const getStage = (project: Project) => {
    // Use latest_milestone if available
    if (project.latestMilestone) {
      return `Milestone ${project.latestMilestone}`;
    }

    // Fallback to completedMilestone/totalMilestone if available
    if (project.totalMilestone > 0) {
      if (project.completedMilestone === 0) {
        return "Not started";
      }
      return `Milestone ${project.completedMilestone}/${project.totalMilestone}`;
    }

    // Default based on status
    return "Not started";
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Recent Projects</h2>

      <div className={styles.projectsList}>
        {projects.map((project: Project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className={styles.projectLinkWrapper}
          >
            <div className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <Prd />
                <span
                  className={`${styles.statusBadge} ${getStatusStyle(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              <h3 className={styles.projectTitle}>{project.name}</h3>
              <p className={styles.projectPhase}>{getStage(project)}</p>

              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Progress</span>
                  <span className={styles.progressPercentage}>
                    {project.progressPercentage}%
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${project.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
