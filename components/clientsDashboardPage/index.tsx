"use client";
import styles from "./styles.module.css";
import { useClientData } from "@/hooks/useClientsData";
import ClientsDashboard from "../clientsDashboard";
import ClientsProjectsList from "../clientsDashboard/clientsProjectList";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

const ClientsDashboardPage = () => {
  const { stats, projects, isLoading, error, refetch } = useClientData();

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
