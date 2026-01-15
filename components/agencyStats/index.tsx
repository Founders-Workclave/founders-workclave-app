"use client";
import React from "react";
import adminData from "@/mocks/agencyAdminStat.json";
import styles from "./styles.module.css";
import AdminRevenue from "@/svgs/adminRevenue";
import AdminPrds from "@/svgs/adminPrds";
import AdminProjects from "@/svgs/adminProjects";
import StatsCard from "../adminDashboard/statsCard";
import AdminFounder from "@/svgs/adminFounders";

export default function AgencyStats() {
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

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        {adminData.stats.map((stat) => (
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
