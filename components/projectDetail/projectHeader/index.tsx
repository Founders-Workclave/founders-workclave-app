"use client";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import styles from "./styles.module.css";
import MessageApp from "@/svgs/messageApp";
import PrdDownload from "@/svgs/prdDownload";
import Pause from "@/svgs/pause";
import Terminate from "@/svgs/terminate";
import { ProjectService } from "@/lib/api/projectService";

interface ProjectHeaderProps {
  id: string;
  title: string;
  status: string;
  createdOn: string;
  lastUpdated: string;
  dueDate?: string;
  onBack: () => void;
  onMessagePM: () => void;
  onDownloadPRD: () => void;
  onProjectUpdated?: () => void; // Callback to refresh project data
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  id,
  title,
  status,
  createdOn,
  lastUpdated,
  dueDate,
  onBack,
  onMessagePM,
  onDownloadPRD,
  onProjectUpdated,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusClass = () => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, "-");
    switch (normalizedStatus) {
      case "in-progress":
        return styles.statusInProgress;
      case "completed":
        return styles.statusCompleted;
      case "pending":
      case "paused":
        return styles.statusPending;
      case "terminated":
        return styles.statusTerminated;
      default:
        return "";
    }
  };

  const handlePauseProject = async () => {
    setIsDropdownOpen(false);

    if (isProcessing) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to pause this project? Work will be temporarily suspended."
    );

    if (!confirmed) return;

    setIsProcessing(true);
    const loadingToast = toast.loading("Pausing project...");

    try {
      const response = await ProjectService.pauseProject(id);
      toast.success(response.message || "Project paused successfully", {
        id: loadingToast,
      });

      // Refresh project data
      if (onProjectUpdated) {
        onProjectUpdated();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to pause project",
        { id: loadingToast }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTerminateProject = async () => {
    setIsDropdownOpen(false);

    if (isProcessing) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to terminate this project? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsProcessing(true);
    const loadingToast = toast.loading("Terminating project...");

    try {
      const response = await ProjectService.terminateProject(id);
      toast.success(response.message || "Project terminated successfully", {
        id: loadingToast,
      });

      // Refresh project data or navigate away
      if (onProjectUpdated) {
        onProjectUpdated();
      } else {
        // Optionally navigate back to projects list after termination
        setTimeout(() => {
          onBack();
        }, 2000);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to terminate project",
        { id: loadingToast }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backButton}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{title}</h1>
            <span className={`${styles.statusBadge} ${getStatusClass()}`}>
              {status}
            </span>
          </div>
          <p className={styles.metadata}>
            Created on {createdOn} • Last updated {lastUpdated}
          </p>
          {dueDate && <p className={styles.dueDate}>Due: {dueDate}</p>}
        </div>

        <div className={styles.actions}>
          <button onClick={onMessagePM} className={styles.messageButton}>
            <MessageApp />
            Message PM
          </button>
          <button onClick={onDownloadPRD} className={styles.downloadButton}>
            <PrdDownload />
            Download PRD
          </button>

          <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <button
              className={styles.moreButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isProcessing}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8E98A8"
                strokeWidth="4"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <button
                  onClick={handlePauseProject}
                  className={styles.dropdownItem}
                  disabled={isProcessing}
                >
                  <div className={styles.dropdownIcon}>
                    <Pause />
                  </div>
                  <span className={styles.dropdownText}>Pause project</span>
                </button>

                <button
                  onClick={handleTerminateProject}
                  className={`${styles.dropdownItem} ${styles.dangerItem}`}
                  disabled={isProcessing}
                >
                  <div className={styles.dropdownIcon}>
                    <Terminate />
                  </div>
                  <span className={styles.dropdownText}>Terminate project</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
