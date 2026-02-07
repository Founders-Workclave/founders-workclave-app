"use client";
import React from "react";
import styles from "./styles.module.css";
import { useManagerData } from "@/hooks/useManagerData";
import ManagerDashboard from "../managersDashboard";
import ManagerProjectsList from "../managerProjectDetails/manageProjectList";

const ManagerDashboardPage = () => {
  const { stats, projects, isLoading, error, refetch } = useManagerData();

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h3>Unable to load dashboard</h3>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={refetch}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ManagerDashboard stats={stats} isLoading={isLoading} />

      <ManagerProjectsList
        initialProjects={projects}
        isLoading={isLoading}
        header="All Projects"
      />
    </div>
  );
};

export default ManagerDashboardPage;
