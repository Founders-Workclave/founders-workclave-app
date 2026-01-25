"use client";
import AgencyLayout from "@/layout/agency";
import styles from "./styles.module.css";
import AgencyDashboard from "@/components/agencyDashboard";
import ProjectsPage from "@/components/agencyProject/projectsList";
import CreateProjectButton from "@/components/createProjectButton";
import { useAgencyData } from "@/hooks/useAgencyData";

const AdminFounders = () => {
  const { stats, projects, isLoading, error, refetch } = useAgencyData();

  if (error) {
    return (
      <AgencyLayout pageTitle="" pageText="">
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h3>Unable to load dashboard</h3>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={refetch}>
              Retry
            </button>
          </div>
        </div>
      </AgencyLayout>
    );
  }

  return (
    <AgencyLayout pageTitle="" pageText="">
      <div className={styles.header}>
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back! Here&apos;s what&apos;s happening today</p>
        </div>
        <CreateProjectButton />
      </div>

      <AgencyDashboard stats={stats} isLoading={isLoading} />

      <ProjectsPage initialProjects={projects} isLoading={isLoading} />
    </AgencyLayout>
  );
};

export default AdminFounders;
