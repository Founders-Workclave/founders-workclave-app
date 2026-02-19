"use client";
import React from "react";
import styles from "./styles.module.css";
import { useManagerData } from "@/hooks/useManagerData";
import ManagerDashboard from "../managersDashboard";
import ManagerProjectsList from "../managerProjectDetails/manageProjectList";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

const ManagerDashboardPage = () => {
  const { stats, projects, isLoading, error, refetch } = useManagerData();

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load dashboard"
        message="We're having trouble loading your dashboard. Please try again."
        showRetry
        onRetry={refetch}
      />
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
