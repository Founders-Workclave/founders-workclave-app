"use client";
import React, { JSX, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./styles.module.css";
import BackBlack from "@/svgs/backBlack";
import MessageApp from "@/svgs/messageApp";
import EditProject from "@/svgs/edit";
import MenuOthers from "@/svgs/menuOthers";
import Pause from "@/svgs/pause";
import DeleteUser from "@/svgs/deleteUser";
import Timeline from "@/svgs/timeline";
import Budget from "@/svgs/budget";
import Document from "@/svgs/document";
import CheckPassive from "@/svgs/checkPassive";
import CheckActive from "@/svgs/checkActive";
import AdminMilestonesPage from "@/components/agencyMilestone/milestonePage";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import AllLoading from "@/layout/Loader";
import AgencyDocuments from "@/components/agencyDocuments";
import AgencyPayments from "@/components/agencyPayments";

const ProjectDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const { project, isLoading, error, refetch } = useProjectDetails(projectId);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showActionsMenu, setShowActionsMenu] = useState<boolean>(false);

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const getMilestoneIcon = (status: string): JSX.Element => {
    if (status === "completed") return <CheckActive />;
    if (status === "in-progress") return <CheckPassive />;
    return <CheckPassive />;
  };

  const getMilestoneClass = (status: string): string => {
    if (status === "completed") return styles.milestoneCompleted;
    if (status === "in-progress") return styles.milestoneInProgress;
    return styles.milestonePending;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <AllLoading text="Loading Project..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error loading project</h2>
          <p>{error || "Project not found"}</p>
          <button onClick={refetch} className={styles.retryButton}>
            Retry
          </button>
          <button onClick={() => router.back()} className={styles.backButton}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerSection}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <BackBlack /> Back
        </button>
        <div className={styles.titleRow}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>{project.projectName}</h1>
            <span className={styles.statusBadge}>{project.status}</span>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.messageButton}>
              <MessageApp />
              Message client
            </button>

            <button className={styles.editButton}>
              <EditProject />
              Edit project
            </button>

            <button
              className={styles.menuButton}
              onClick={() => setShowActionsMenu(!showActionsMenu)}
            >
              <MenuOthers />
            </button>

            {showActionsMenu && (
              <div className={styles.actionsMenu}>
                <button className={styles.menuItem}>
                  <span>+</span>
                  Add new service
                </button>
                <button className={styles.menuItem}>
                  <Pause />
                  Pause project
                </button>
                <button
                  className={`${styles.menuItem} ${styles.menuItemDanger}`}
                >
                  <DeleteUser />
                  Terminate project
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.metaInfo}>
          <span>Created {project.startedAgo}</span>
          <span>•</span>
          <span>Last updated {project.lastUpdated}</span>
        </div>

        <div className={styles.dueDate}>Due: {project.dueDate}</div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>
              <Timeline /> Timeline
            </span>
            <span className={styles.statValue}>{project.timeline}</span>
            <span className={styles.statSubtext}>
              Started {project.startedAgo}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>
              <Budget /> Total Budget
            </span>
            <span className={styles.statValue}>
              {formatCurrency(project.totalBudget)}
            </span>
            <span className={styles.statSubtext}>
              {formatCurrency(project.budgetPaid)} paid
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>
              <Document /> Documents
            </span>
            <span className={styles.statValue}>{project.documents}</span>
            <span className={styles.statSubtext}>
              {project.lastDocumentUpload}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "overview" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "milestones" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("milestones")}
        >
          Milestones
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "documents" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("documents")}
        >
          Documents
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "payment" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("payment")}
        >
          Payment
        </button>
      </div>

      {/* Content Area */}
      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <div className={styles.overviewTab}>
              <div className={styles.colOne}>
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Project Progress</h2>
                  </div>
                  <div className={styles.overallGrid}>
                    <span className={styles.sectionSubtitle}>
                      Overall Completion
                    </span>
                    <span className={styles.completionBadge}>
                      {project.projectProgress.overallCompletion}%
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${project.projectProgress.overallCompletion}%`,
                      }}
                    />
                  </div>

                  {project.projectProgress.milestones.length > 0 && (
                    <div className={styles.milestonesList}>
                      {project.projectProgress.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`${styles.milestone} ${getMilestoneClass(
                            milestone.status
                          )}`}
                        >
                          <span className={styles.milestoneIcon}>
                            {getMilestoneIcon(milestone.status)}
                          </span>
                          <span className={styles.milestoneName}>
                            {milestone.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Problem Statement */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Problem Statement</h2>
                    <button className={styles.linkButton}>View Full PRD</button>
                  </div>
                  <p className={styles.problemText}>
                    {project.problemStatement}
                  </p>
                </div>

                {/* Key Features */}
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Key Features</h2>
                  <div className={styles.featuresGrid}>
                    {project.keyFeatures.map((feature) => (
                      <div key={feature.id} className={styles.featureItem}>
                        <span className={styles.featureIcon}>
                          <CheckPassive />
                        </span>
                        <span className={styles.featureName}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.sidebar}>
                {/* Client Card */}
                <div className={styles.card}>
                  <h3 className={styles.cardTitle}>Client</h3>
                  <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                      {project.client.initials}
                    </div>
                    <span className={styles.userName}>
                      {project.client.name}
                    </span>
                  </div>
                  <button className={styles.messageClientButton}>
                    <MessageApp />
                    Message client
                  </button>
                </div>

                {project.productManager && (
                  <div className={styles.projectManager}>
                    <div className={styles.card}>
                      <h3 className={styles.cardTitle}>Product Manager</h3>
                      <div className={styles.userProfile}>
                        <div className={styles.avatar}>
                          {project.productManager.initials}
                        </div>
                        <span className={styles.userName}>
                          {project.productManager.name}
                        </span>
                      </div>
                      <button className={styles.messagePMButton}>
                        <MessageApp />
                        Message PM
                      </button>
                      <button className={styles.unassignButton}>
                        Un-assign
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Milestones Tab Content */}
          {activeTab === "milestones" && (
            <AdminMilestonesPage projectId={projectId} />
          )}

          {/* Documents Tab Content */}
          {activeTab === "documents" && (
            <AgencyDocuments projectId={projectId} />
          )}

          {/* Payment Tab Content */}
          {activeTab === "payment" && <AgencyPayments />}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
