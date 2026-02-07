"use client";
import React from "react";
import styles from "./styles.module.css";
import { ManagerStats } from "@/types/managersDashbord";

import AdminProjects from "@/svgs/adminProjects";

interface ManagerDashboardProps {
  stats: ManagerStats;
  isLoading?: boolean;
}

const ClientsDashboard: React.FC<ManagerDashboardProps> = ({
  stats,
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className={styles.loadingContainer}></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.iconContainer}>
            <AdminProjects />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Active Projects</p>
            <h3 className={styles.statValue}>{stats.activeProjects}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsDashboard;
