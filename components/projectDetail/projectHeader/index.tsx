"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import MessageApp from "@/svgs/messageApp";
import PrdDownload from "@/svgs/prdDownload";
import Pause from "@/svgs/pause";
import Terminate from "@/svgs/terminate";

interface ProjectHeaderProps {
  id: string;
  title: string;
  status: string;
  createdOn: string;
  lastUpdated: string;
  dueDate: string;
  onBack: () => void;
  onMessagePM: () => void;
  onDownloadPRD: () => void;
  onPauseProject: () => void;
  onTerminateProject: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  status,
  createdOn,
  lastUpdated,
  dueDate,
  onBack,
  onMessagePM,
  onDownloadPRD,
  onPauseProject,
  onTerminateProject,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    switch (status.toLowerCase()) {
      case "in-progress":
        return styles.statusInProgress;
      case "completed":
        return styles.statusCompleted;
      case "pending":
        return styles.statusPending;
      default:
        return "";
    }
  };

  const handlePauseProject = () => {
    setIsDropdownOpen(false);
    onPauseProject();
  };

  const handleTerminateProject = () => {
    setIsDropdownOpen(false);
    onTerminateProject();
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
          <p className={styles.dueDate}>Due: {dueDate}</p>
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
                >
                  <div className={styles.dropdownIcon}>
                    <Pause />
                  </div>
                  <span className={styles.dropdownText}>Pause project</span>
                </button>

                <button
                  onClick={handleTerminateProject}
                  className={styles.dropdownItem}
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

      {/* <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.tabActive}`}>
          Overview
        </button>
        <button className={styles.tab}>Milestones</button>
        <button className={styles.tab}>Documents</button>
        <button className={styles.tab}>Payment</button>
      </div> */}
    </div>
  );
};

export default ProjectHeader;
