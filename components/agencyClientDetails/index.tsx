"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import BackBlack from "@/svgs/backBlack";
import MessageApp from "@/svgs/messageApp";
import DeleteUser from "@/svgs/deleteUser";
import EmptyProjectIcon from "@/svgs/emptyProject";
import ProjectCard from "./projectCard";
import {
  fetchClientById,
  fetchClientProjects,
} from "@/lib/api/agencyService/clientService";
import type {
  ApiClient,
  ClientProject,
  ApiProject,
} from "@/types/agencyClients";
import AllLoading from "@/layout/Loader";

interface ClientDetailProps {
  params?: {
    id: string;
  };
  clientId?: string;
}

const ClientInformationPage: React.FC<ClientDetailProps> = ({
  params,
  clientId,
}) => {
  const id = clientId || params?.id || "";
  const router = useRouter();

  const [client, setClient] = useState<ApiClient | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);

  const transformApiProject = (apiProject: ApiProject): ClientProject => {
    return {
      id: apiProject.id,
      projectName: apiProject.name,
      description: apiProject.description,
      status: apiProject.status === "completed" ? "completed" : "in-progress",
      progress: apiProject.progressPercentage,
      latestMilestone: apiProject.latest_milestone,
    };
  };

  useEffect(() => {
    const loadClientData = async () => {
      if (!id) {
        setError("No client ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch client details
        const clientData = await fetchClientById(id);

        if (!clientData) {
          setError("Client not found");
          setLoading(false);
          return;
        }

        setClient(clientData);

        // Fetch client projects using clientID
        setProjectsLoading(true);
        try {
          const projectsData = await fetchClientProjects(clientData.clientID);
          const transformedProjects =
            projectsData.projects.map(transformApiProject);
          setProjects(transformedProjects);
        } catch (projectError) {
          console.error("Error loading projects:", projectError);
          // Don't set error, just leave projects empty
        } finally {
          setProjectsLoading(false);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load client";
        setError(errorMessage);
        console.error("Error loading client:", err);
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleMessageClient = () => {
    console.log("Message client:", id);
  };

  const handleAssignProject = () => {
    console.log("Assign project to client:", id);
  };

  const handleDeactivateUser = () => {
    console.log("Deactivate user:", id);
  };

  const getInitials = (name: string): string => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <AllLoading text="Loading client information..." />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className={styles.pageContainer}>
        <button onClick={handleBack} className={styles.backButton}>
          <BackBlack />
          Back
        </button>
        <div className={styles.errorState}>
          <p>Error: {error || "Client not found"}</p>
          <button onClick={() => router.push("/agency/clients")}>
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Back Button */}
      <button onClick={handleBack} className={styles.backButton}>
        <BackBlack />
        Back
      </button>

      {/* Page Title */}
      <h1 className={styles.pageTitle}>Client information</h1>

      {/* Client Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileLeft}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {getInitials(client.clientName)}
            </div>
            <div className={styles.statusIndicator}></div>
          </div>
          <div className={styles.profileInfo}>
            <h2 className={styles.clientName}>{client.clientName}</h2>
            <div className={styles.contactInfo}>
              <a href={`mailto:${client.email}`} className={styles.email}>
                {client.email}
              </a>
              <span className={styles.separator}>|</span>
              <a href={`tel:${client.phone}`} className={styles.phone}>
                {client.phone}
              </a>
            </div>
            <div className={styles.joinedDate}>
              Date joined: {formatDate(client.dateJoined)}
            </div>
          </div>
        </div>

        <div className={styles.profileActions}>
          <button
            onClick={handleMessageClient}
            className={styles.messageButton}
          >
            <MessageApp />
            Message client
          </button>
          <button onClick={handleAssignProject} className={styles.assignButton}>
            Assign project
          </button>
          <button
            onClick={handleDeactivateUser}
            className={styles.deactivateButton}
          >
            <DeleteUser />
            {client.active ? "Deactivate user" : "Activate user"}
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className={styles.projectsCard}>
        {projectsLoading ? (
          <div className={styles.loadingState}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <EmptyProjectIcon />
            </div>
            <h3 className={styles.emptyTitle}>No Project Yet!</h3>
            <p className={styles.emptyDescription}>
              Assign a project to get started
            </p>
            <button
              onClick={handleAssignProject}
              className={styles.assignProjectLink}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3.33334V12.6667"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.33331 8H12.6666"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Assign project
            </button>
          </div>
        ) : (
          <div className={styles.projectsList}>
            <h2 className={styles.projectsTitle}>Projects</h2>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.projectName}
                subtitle={project.latestMilestone}
                progress={project.progress}
                status={project.status}
                description={project.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientInformationPage;
