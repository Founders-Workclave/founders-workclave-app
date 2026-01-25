// components/agencyDashboard/index.tsx
"use client";
import React from "react";
import styles from "./styles.module.css";
import AdminRevenue from "@/svgs/adminRevenue";
import AdminPrds from "@/svgs/adminPrds";
import AdminProjects from "@/svgs/adminProjects";
import StatsCard from "../adminDashboard/statsCard";
import AdminFounder from "@/svgs/adminFounders";
import type { DashboardStats } from "@/types/agencyProjectsNew";

interface AgencyDashboardProps {
  stats?: DashboardStats[];
  isLoading?: boolean;
}

export default function AgencyDashboard({
  stats = [],
  isLoading = false,
}: AgencyDashboardProps) {
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      projects: <AdminProjects />,
      clients: <AdminFounder />,
      dollar: <AdminRevenue />,
      document: <AdminPrds />,
      folder: <AdminProjects />,
    };
    return icons[iconName] || null;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonIcon} />
              <div className={styles.skeletonText} />
              <div className={styles.skeletonValue} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Additional safety check
  if (!stats || !Array.isArray(stats) || stats.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          <div className={styles.emptyState}>
            <p>No stats available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <StatsCard
            key={stat.id}
            icon={getIcon(stat.icon)}
            label={stat.label}
            value={stat.value}
            bgColor={stat.bgColor}
          />
        ))}
      </div>
    </div>
  );
}
