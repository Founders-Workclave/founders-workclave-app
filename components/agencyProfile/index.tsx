"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import MessageApp from "@/svgs/messageApp";
import DeleteUser from "@/svgs/deleteUser";
import AdminRevenue from "@/svgs/adminRevenue";
import AdminFounder from "@/svgs/adminFounders";

import AdminPrds from "@/svgs/adminPrds";

export interface Project {
  id: string;
  title: string;
  stage: string;
  progress: number;
  status: string;
  client?: string;
  pm?: string;
}

export interface PRD {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  description: string;
  createdDate: string;
  lastModified: string;
  duration: string;
  status: string;
  prdUrl: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectsCount: number;
  joinedDate: string;
  status: "Active" | "Inactive";
}

export interface ProductManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  projectsCount: number;
  joinedDate: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

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
  clients?: Client[];
  productManagers?: ProductManager[];
  pms: number;
  mrr: number;
  projects?: Project[];
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
            <p className={styles.statValue}>{agency.clients?.length || 0}</p>
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
            <>
              {agency.projects && agency.projects.length > 0 ? (
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Project Name</th>
                        <th>Stage</th>
                        <th>Client</th>
                        <th>PM</th>
                        <th>Progress</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agency.projects.map((project) => (
                        <tr key={project.id}>
                          <td>{project.title}</td>
                          <td>{project.stage}</td>
                          <td>{project.client || "N/A"}</td>
                          <td>{project.pm || "N/A"}</td>
                          <td>
                            <div className={styles.progressBar}>
                              <div
                                className={styles.progressFill}
                                style={{ width: `${project.progress}%` }}
                              />
                              <span className={styles.progressText}>
                                {project.progress}%
                              </span>
                            </div>
                          </td>
                          <td>
                            <span
                              className={styles.statusBadge}
                              style={{
                                backgroundColor:
                                  project.status === "Completed"
                                    ? "#ECFDF3"
                                    : "#EEF2FF",
                                color:
                                  project.status === "Completed"
                                    ? "#00B049"
                                    : "#5865F2",
                              }}
                            >
                              {project.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5865F2"
                      strokeWidth="1.5"
                    >
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    </svg>
                  </div>
                  <h3 className={styles.emptyTitle}>No Project Yet!</h3>
                  <p className={styles.emptyText}>No Project created yet</p>
                  <button className={styles.createButton}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create New
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "Clients" && (
            <>
              {agency.clients && agency.clients.length > 0 ? (
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>Client Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Projects</th>
                        <th>Joined Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agency.clients.map((client) => (
                        <tr key={client.id}>
                          <td>
                            <div className={styles.nameCell}>
                              <div className={styles.avatar}>
                                {client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              {client.name}
                            </div>
                          </td>
                          <td>{client.email}</td>
                          <td>{client.phone}</td>
                          <td>{client.company}</td>
                          <td>{client.projectsCount}</td>
                          <td>{client.joinedDate}</td>
                          <td>
                            <span
                              className={styles.statusBadge}
                              style={{
                                backgroundColor:
                                  client.status === "Active"
                                    ? "#ECFDF3"
                                    : "#F3F4F6",
                                color:
                                  client.status === "Active"
                                    ? "#00B049"
                                    : "#6B7280",
                              }}
                            >
                              {client.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5865F2"
                      strokeWidth="1.5"
                    >
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <h3 className={styles.emptyTitle}>No Clients Yet!</h3>
                  <p className={styles.emptyText}>No clients added yet</p>
                </div>
              )}
            </>
          )}

          {activeTab === "PM's" && (
            <>
              {agency.productManagers && agency.productManagers.length > 0 ? (
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>PM Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Projects</th>
                        <th>Joined Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agency.productManagers.map((pm) => (
                        <tr key={pm.id}>
                          <td>
                            <div className={styles.nameCell}>
                              <div className={styles.avatar}>
                                {pm.avatar ? (
                                  <Image
                                    src={pm.avatar}
                                    alt={pm.name}
                                    width={32}
                                    height={32}
                                  />
                                ) : (
                                  pm.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                )}
                              </div>
                              {pm.name}
                            </div>
                          </td>
                          <td>{pm.email}</td>
                          <td>{pm.phone}</td>
                          <td>{pm.role}</td>
                          <td>{pm.projectsCount}</td>
                          <td>{pm.joinedDate}</td>
                          <td>
                            <span
                              className={styles.statusBadge}
                              style={{
                                backgroundColor:
                                  pm.status === "Active"
                                    ? "#ECFDF3"
                                    : "#F3F4F6",
                                color:
                                  pm.status === "Active"
                                    ? "#00B049"
                                    : "#6B7280",
                              }}
                            >
                              {pm.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5865F2"
                      strokeWidth="1.5"
                    >
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <h3 className={styles.emptyTitle}>
                    No Product Managers Yet!
                  </h3>
                  <p className={styles.emptyText}>
                    No product managers added yet
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "PRDs" && (
            <>
              {agency.prds && agency.prds.length > 0 ? (
                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        <th>PRD Title</th>
                        <th>Project</th>
                        <th>Description</th>
                        <th>Created Date</th>
                        <th>Last Modified</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agency.prds.map((prd) => (
                        <tr key={prd.id}>
                          <td>{prd.title}</td>
                          <td>{prd.projectName}</td>
                          <td className={styles.descriptionCell}>
                            {prd.description}
                          </td>
                          <td>{prd.createdDate}</td>
                          <td>{prd.lastModified}</td>
                          <td>{prd.duration}</td>
                          <td>
                            <span
                              className={styles.statusBadge}
                              style={{
                                backgroundColor:
                                  prd.status === "Approved"
                                    ? "#ECFDF3"
                                    : prd.status === "Review"
                                    ? "#FEF3C7"
                                    : "#EEF2FF",
                                color:
                                  prd.status === "Approved"
                                    ? "#00B049"
                                    : prd.status === "Review"
                                    ? "#F59E0B"
                                    : "#5865F2",
                              }}
                            >
                              {prd.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#5865F2"
                      strokeWidth="1.5"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <h3 className={styles.emptyTitle}>No PRDs Yet!</h3>
                  <p className={styles.emptyText}>No PRDs generated yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyProfile;
