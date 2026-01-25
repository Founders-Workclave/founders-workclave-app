"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import BackBlack from "@/svgs/backBlack";
import MessageApp from "@/svgs/messageApp";
import DeleteUser from "@/svgs/deleteUser";
import EmptyProjectIcon from "@/svgs/emptyProject";
import { managerService, ApiError } from "@/lib/api/agencyService/pmService";
import { Manager } from "@/types/agencyPm";
import AllLoading from "@/layout/Loader";

interface PMProject {
  id: string;
  projectName: string;
  status: string;
  progress: {
    current: number;
    total: number;
  };
}

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
  const [projects] = useState<PMProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManager = async () => {
      if (!id) {
        setError("No manager ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const manager = await managerService.getPMById(id);

        if (!manager) {
          setError("Manager not found");
        } else {
          setPm(manager);
        }
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

    fetchManager();
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

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <AllLoading text="Loading..." />
      </div>
    );
  }

  if (error || !pm) {
    return (
      <div className={styles.pageContainer}>
        <button onClick={handleBack} className={styles.backButton}>
          <BackBlack />
          Back
        </button>
        <div className={styles.errorContainer}>
          <p>Error: {error || "Manager not found"}</p>
          <button onClick={() => router.push("/agency/pm")}>
            Back to Managers
          </button>
        </div>
      </div>
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
            {/* Projects will be displayed here when available */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PMInformationPage;
