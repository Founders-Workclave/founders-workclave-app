"use client";
import styles from "./styles.module.css";
import { useClientData } from "@/hooks/useClientsData";
import ClientsDashboard from "../clientsDashboard";
import ClientsProjectsList from "../clientsDashboard/clientsProjectList";

const ClientsDashboardPage = () => {
  const { stats, projects, isLoading, error, refetch } = useClientData();

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
      <ClientsDashboard stats={stats} isLoading={isLoading} />

      <ClientsProjectsList
        initialProjects={projects}
        isLoading={isLoading}
        header="All Projects"
      />
    </div>
  );
};

export default ClientsDashboardPage;
