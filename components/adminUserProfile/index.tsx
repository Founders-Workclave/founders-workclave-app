"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import MessageApp from "@/svgs/messageApp";
import DeleteUser from "@/svgs/deleteUser";
import StartProject from "@/svgs/startProject";
import Prd from "@/svgs/prd";
import PrdComp from "./prdcomp";

export interface Project {
  id: number;
  title: string;
  stage: string;
  progress: number;
  status: "In-Progress" | "Completed" | "Pending";
}

export interface PRD {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  createdDate: string;
  lastModified: string;
  status: "Draft" | "Review" | "Approved" | "Published";
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency: string;
  joinedDate: string;
  role: "Founder" | "Agency";
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
  projects: Project[];
  prds: PRD[];
}

// Updated User interface for the table to include projects and prds
export interface UserWithDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency: string;
  joinedDate: string;
  role: "Founder" | "Agency";
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
  title?: string;
  projects?: Project[];
  prds?: PRD[];
}

interface UserProfileProps {
  user: UserProfileData;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState<"projects" | "prds">("projects");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Completed":
      case "Approved":
      case "Published":
        return "#00B049";
      case "Inactive":
      case "Planning":
      case "Draft":
        return "#7B580C";
      case "Suspended":
      case "On Hold":
        return "#EB5757";
      case "In Progress":
      case "Review":
        return "#2563eb";
      default:
        return "#6b7280";
    }
  };
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
      {/* Back Button */}
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

      {/* Page Title */}
      <h1 className={styles.pageTitle}>User information</h1>

      {/* User Info Card */}
      <div className={styles.userInfoCard}>
        <div className={styles.userInfoContent}>
          {/* Avatar */}
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={80}
                  height={80}
                />
              ) : (
                <span className={styles.avatarInitials}>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              )}
            </div>
            <div
              className={styles.statusIndicator}
              style={{ backgroundColor: getStatusColor(user.status) }}
            />
          </div>

          {/* User Details */}
          <div className={styles.userDetails}>
            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userAgency}>{user.agency}</p>
            <p className={styles.userContact}>
              {user.email} | {user.phone}
            </p>
            <p className={styles.userMeta}>
              <span className={styles.premiumBadge}>Premium user</span>
            </p>
            <p className={styles.userJoined}>
              Date joined: <strong>{user.joinedDate}</strong>
            </p>
            <span className={styles.roleBadge}>{user.role}</span>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button className={styles.messageButton}>
              <MessageApp />
              Message
            </button>
            <button className={styles.deactivateButton}>
              <DeleteUser />
              Deactivate user
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "projects" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "prds" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("prds")}
        >
          PRDs
        </button>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {activeTab === "projects" && (
          <>
            {user.projects.length > 0 ? (
              <div className={styles.itemsList}>
                {user.projects.map((project: Project) => (
                  <div className={styles.projectCard} key={project.id}>
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
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <StartProject />
                </div>
                <h3 className={styles.emptyTitle}>No Project Yet!</h3>
                <p className={styles.emptyDescription}>
                  Assign a project to get started
                </p>
                <button className={styles.assignButton}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Assign New
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "prds" && (
          <>
            <PrdComp user={user} onBack={onBack} />
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
