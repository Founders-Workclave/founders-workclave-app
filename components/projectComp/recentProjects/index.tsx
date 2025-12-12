import styles from "./styles.module.css";
import mockProjectsData from "../../../mocks/project.json";
import Prd from "@/svgs/prd";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  stage: string;
  progress: number;
  status: "In-Progress" | "Completed" | "Pending";
}

const mockProjects: Project[] = mockProjectsData as Project[];

const RecentProjects = () => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return styles.statusCompleted;
      case "in-progress":
        return styles.statusInProgress;
      case "pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    return status;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Recent Projects</h2>

      <div className={styles.projectsList}>
        {mockProjects.map((project: Project) => (
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
                  {getStatusText(project.status)}
                </span>
              </div>

              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectPhase}>{project.stage}</p>

              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Progress</span>
                  <span className={styles.progressPercentage}>
                    {project.progress}%
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${project.progress}%` }}
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
