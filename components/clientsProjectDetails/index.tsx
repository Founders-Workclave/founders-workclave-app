"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./styles.module.css";
import BackBlack from "@/svgs/backBlack";
import MessageApp from "@/svgs/messageApp";
import Timeline from "@/svgs/timeline";
import Budget from "@/svgs/budget";
import Document from "@/svgs/document";
import CheckPassive from "@/svgs/checkPassive";
import CheckActive from "@/svgs/checkActive";
import { useManagerProjectDetails } from "@/hooks/useClientProjectDetails";
import AllLoading from "@/layout/Loader";
import { formatStatus, formatCurrency } from "@/utils/formatters";
import WhiteMessage from "@/svgs/whiteMessage";
import { useClientMilestones } from "@/hooks/useClientMilestones";
import ClientMilestonesPage from "../clientMilestones/milestonePage";
import ClientDocuments from "../clientsDocument";
import ClientPayments from "../clientPayments";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

const ClientsProjectDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const { milestones } = useClientMilestones(projectId);
  const { project, isLoading, error, refetch } =
    useManagerProjectDetails(projectId);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const getStatusClass = (status: string | undefined): string => {
    if (!status) return styles.statusDefault;

    const normalizedStatus = status.toLowerCase();

    switch (normalizedStatus) {
      case "completed":
        return styles.statusCompleted;
      case "ongoing":
      case "in-progress":
      case "in_progress":
      case "active":
        return styles.statusInProgress;
      case "paused":
      case "on-hold":
      case "on_hold":
        return styles.statusPaused;
      case "terminated":
      case "cancelled":
      case "canceled":
        return styles.statusTerminated;
      case "pending":
        return styles.statusPending;
      default:
        return styles.statusDefault;
    }
  };

  const getMilestoneIcon = (status: string) => {
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
      <ServiceUnavailable
        title="Couldn't load projects"
        message="We're having trouble fetching projects. Please try again."
        showRetry
        onRetry={refetch}
      />
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
            <span
              className={`${styles.statusBadge} ${getStatusClass(
                project.status
              )}`}
            >
              {formatStatus(project.status)}
            </span>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.messageButton}>
              <WhiteMessage />
              Message client
            </button>
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
                      {project.projectProgress?.overallCompletion || 0}%
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${
                          project.projectProgress?.overallCompletion || 0
                        }%`,
                      }}
                    />
                  </div>
                  {milestones.length > 0 && (
                    <div className={styles.milestonesList}>
                      {milestones.slice(0, 5).map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`${styles.milestone} ${getMilestoneClass(
                            milestone.status || ""
                          )}`}
                        >
                          <span className={styles.milestoneIcon}>
                            {getMilestoneIcon(milestone.status || "")}
                          </span>
                          <span className={styles.milestoneName}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Problem Statement */}
                {project.problemStatement && (
                  <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Problem Statement</h2>
                      <button className={styles.linkButton}>
                        View Full PRD
                      </button>
                    </div>
                    <p className={styles.problemText}>
                      {project.problemStatement}
                    </p>
                  </div>
                )}

                {/* Key Features */}
                {project.keyFeatures && project.keyFeatures.length > 0 && (
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
                )}
              </div>
              <div className={styles.sidebar}>
                {/* Client Card */}
                {project.client && (
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
                )}
              </div>
            </div>
          )}

          {/* Milestones Tab Content */}
          {activeTab === "milestones" && (
            <ClientMilestonesPage projectId={projectId} />
          )}

          {/* Documents Tab Content */}
          {activeTab === "documents" && (
            <ClientDocuments projectId={projectId} />
          )}

          {/* Payment Tab Content */}
          {activeTab === "payment" && <ClientPayments projectId={projectId} />}
        </div>
      </div>
    </div>
  );
};

export default ClientsProjectDetailsPage;
