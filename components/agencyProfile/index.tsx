"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import MessageApp from "@/svgs/messageApp";
import DeleteUser from "@/svgs/deleteUser";
import AdminRevenue from "@/svgs/adminRevenue";
import AdminFounder from "@/svgs/adminFounders";
import AdminPrds from "@/svgs/adminPrds";
import AdminAgencyProjects from "../adminAgencyProjects";
import type { PRD, ProductManager } from "../../types/user";
import AdminAgencyClients from "../adminClientsList";
import AdminManagersPage from "../adminManagersList";
import EmptyPrd from "@/svgs/emptyprd";

export interface AgencyProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency: string;
  joinedDate: string;
  role: "Agency";
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
  plan: "Starter" | "Professional" | "Enterprise";
  productManagers?: ProductManager[];
  pms: number;
  mrr: number;
  prds?: PRD[];
}

interface AgencyProfileProps {
  agency: AgencyProfileData;
  onBack: () => void;
}

type TabType = "Projects" | "Clients" | "PM's" | "PRDs";

const AgencyProfile: React.FC<AgencyProfileProps> = ({ agency, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>("Projects");

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "Starter":
        return { bg: "#EEF2FF", color: "#3B82F6" };
      case "Professional":
        return { bg: "#F3E8FF", color: "#8B5CF6" };
      case "Enterprise":
        return { bg: "#FEF3C7", color: "#F59E0B" };
      default:
        return { bg: "#F3F4F6", color: "#6B7280" };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const planColors = getPlanBadgeColor(agency.plan);

  return (
    <div className={styles.profileContainer}>
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

      <h1 className={styles.pageTitle}>User information</h1>

      {/* User Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.userInfo}>
          <div className={styles.avatarSection}>
            <div className={styles.largeAvatar}>
              {agency.avatar ? (
                <Image
                  src={agency.avatar}
                  alt={agency.name}
                  width={120}
                  height={120}
                />
              ) : (
                <span className={styles.avatarInitials}>
                  {agency.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div
              className={styles.statusIndicator}
              style={{
                backgroundColor:
                  agency.status === "Active" ? "#00B049" : "#9CA3AF",
              }}
            />
          </div>

          <div className={styles.userDetails}>
            <h2 className={styles.userName}>{agency.name}</h2>
            <p className={styles.agencyName}>{agency.agency}</p>
            <p className={styles.contactInfo}>
              {agency.email} | {agency.phone}
            </p>
            <div className={styles.userMeta}>
              <span
                className={styles.planBadge}
                style={{
                  backgroundColor: planColors.bg,
                  color: planColors.color,
                }}
              >
                {agency.plan} user
              </span>
              <span className={styles.joinedDate}>
                Date joined: {agency.joinedDate}
              </span>
              <span
                className={styles.roleBadge}
                style={{
                  backgroundColor: "#EEF0FE",
                  color: "#5865F2",
                }}
              >
                {agency.role}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.messageButton}>
            <MessageApp />
            Message
          </button>
          <button className={styles.deactivateButton}>
            <DeleteUser />
            {agency.status === "Active" ? "Deactivate user" : "Activate user"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <AdminRevenue />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Monthly Recurring Revenue</p>
            <p className={styles.statValue}>{formatCurrency(agency.mrr)}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <AdminFounder />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Clients</p>
            <p className={styles.statValue}>0</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <AdminFounder />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>PM&apos;s</p>
            <p className={styles.statValue}>
              {agency.productManagers?.length || 0}
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <AdminPrds />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>PRD Generated</p>
            <p className={styles.statValue}>{agency.prds?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {(["Projects", "Clients", "PM's", "PRDs"] as TabType[]).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === "Projects" && (
            <AdminAgencyProjects agencyId={agency.id} />
          )}

          {activeTab === "Clients" && (
            <AdminAgencyClients agencyId={agency.id} />
          )}

          {activeTab === "PM's" && <AdminManagersPage agencyId={agency.id} />}

          {activeTab === "PRDs" && (
            <div className={styles.emptyState}>
              <EmptyPrd />
              <br />
              <h3 className={styles.emptyTitle}>No PRDs Yet!</h3>
              <p className={styles.emptyText}>No PRDs generated yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyProfile;
