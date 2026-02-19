"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import BackBlack from "@/svgs/backBlack";
import MessageApp from "@/svgs/messageApp";
import DeleteUser from "@/svgs/deleteUser";
import EmptyProjectIcon from "@/svgs/emptyProject";
import {
  managerService,
  ApiError,
  Project,
} from "@/lib/api/agencyService/pmService";
import { Manager } from "@/types/agencyPm";
import AllLoading from "@/layout/Loader";
import AdminIconProject from "@/svgs/adminIconProject";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

interface PMDetailProps {
  params?: {
    id: string;
  };
  pmId?: string;
}

const PMInformationPage: React.FC<PMDetailProps> = ({ params, pmId }) => {
  const id = pmId || params?.id || "";
  const router = useRouter();

  const [pm, setPm] = useState<Manager | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagerData = async () => {
      if (!id) {
        setError("No manager ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch manager details
        const manager = await managerService.getPMById(id);

        if (!manager) {
          setError("Manager not found");
          setIsLoading(false);
          return;
        }

        setPm(manager);

        // Fetch manager projects using managerID
        const projectsData = await managerService.getManagerProjects(
          manager.managerID
        );
        setProjects(projectsData.projects || []);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load manager details");
        }
        console.error("Error fetching manager:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagerData();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleMessagePM = () => {
    if (pm) {
      console.log("Message PM:", pm.id);
    }
  };

  const handleAssignProject = () => {
    if (pm) {
      console.log("Assign project to PM:", pm.id);
    }
  };

  const handleDeactivateUser = () => {
    if (pm) {
      console.log("Deactivate user:", pm.id);
    }
  };

  const getInitials = (name: string): string => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadgeClass = (status: string): string => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
        return styles.statusCompleted;
      case "ongoing":
        return styles.statusOngoing;
      case "in-progress":
        return styles.statusInProgress;
      default:
        return styles.statusDefault;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <AllLoading text="Loading..." />
      </div>
    );
  }

  if (error || !pm) {
    return (
      <ServiceUnavailable
        title="Couldn't load PM's information"
        message="We're having trouble fetching PM's information. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <button onClick={handleBack} className={styles.backButton}>
        <BackBlack />
        Back
      </button>
      <h1 className={styles.pageTitle}>PM information</h1>
      <div className={styles.profileCard}>
        <div className={styles.profileLeft}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>{getInitials(pm.managerName)}</div>
            <div className={styles.statusIndicator}></div>
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.pmName}>{pm.managerName}</h2>
            <div className={styles.contactInfo}>
              <a href={`mailto:${pm.email}`} className={styles.email}>
                {pm.email}
              </a>
              <span className={styles.separator}>|</span>
              <span className={styles.phone}>{pm.phone}</span>
            </div>
            <div className={styles.joinedDate}>
              Date joined: {formatDate(pm.dateJoined)}
            </div>
          </div>
        </div>

        <div className={styles.profileActions}>
          <button onClick={handleMessagePM} className={styles.messageButton}>
            <MessageApp />
            Message PM
          </button>
          <button onClick={handleAssignProject} className={styles.assignButton}>
            Assign project
          </button>
          <button
            onClick={handleDeactivateUser}
            className={styles.deactivateButton}
          >
            <DeleteUser />
            {pm.active ? "Deactivate user" : "Activate user"}
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className={styles.projectsCard}>
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <EmptyProjectIcon />
            </div>
            <h3 className={styles.emptyTitle}>No Project Yet!</h3>
            <p className={styles.emptyDescription}>
              Assign a project to get started
            </p>
            <button
              onClick={handleAssignProject}
              className={styles.assignProjectLink}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3.33334V12.6667"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.33331 8H12.6666"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Assign project
            </button>
          </div>
        ) : (
          <div className={styles.projectsList}>
            {projects.map((project) => (
              <div key={project.id} className={styles.projectItem}>
                <div className={styles.projectHeader}>
                  <AdminIconProject />
                  <div className={styles.projectContent}>
                    <div className={styles.projectTitleRow}>
                      <h4 className={styles.projectName}>{project.name}</h4>
                      <span
                        className={`${styles.statusBadge} ${getStatusBadgeClass(
                          project.status
                        )}`}
                      >
                        {project.status === "ongoing"
                          ? "In-Progress"
                          : project.status}
                      </span>
                    </div>
                    <p className={styles.projectMilestone}>
                      {project.latest_milestone}
                    </p>
                    <div className={styles.progressSection}>
                      <div className={styles.progressLabel}>Progress</div>
                      <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${project.progressPercentage}%` }}
                          />
                        </div>
                        <span className={styles.progressPercentage}>
                          {project.progressPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PMInformationPage;
