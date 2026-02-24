"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import BackBlack from "@/svgs/backBlack";
import MessageApp from "@/svgs/messageApp";
import DeleteUser from "@/svgs/deleteUser";
import EmptyProjectIcon from "@/svgs/emptyProject";
import ProjectCard from "./projectCard";
import AssignProjectModal from "../assignProjectModal";
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
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";
import { getAuthToken } from "@/lib/utils/auth";
import toast from "react-hot-toast";

interface ClientDetailProps {
  params?: { id: string };
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
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const transformApiProject = (apiProject: ApiProject): ClientProject => ({
    id: apiProject.id,
    projectName: apiProject.name,
    description: apiProject.description,
    status: apiProject.status === "completed" ? "completed" : "in-progress",
    progress: apiProject.progressPercentage,
    latestMilestone: apiProject.latest_milestone,
  });

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
        const clientData = await fetchClientById(id);
        if (!clientData) {
          setError("Client not found");
          setLoading(false);
          return;
        }
        setClient(clientData);
        setProjectsLoading(true);
        try {
          const projectsData = await fetchClientProjects(clientData.clientID);
          setProjects(projectsData.projects.map(transformApiProject));
        } catch (projectError) {
          console.error("Error loading projects:", projectError);
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

  const handleBack = () => router.back();

  const handleMessageClient = async () => {
    if (!client?.clientID) {
      toast.error("Client information not available");
      return;
    }
    try {
      setIsStartingConversation(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("userID", client.clientID);
      const response = await fetch(`${baseUrl}/chat/conversation/`, {
        method: "POST",
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to start conversation");
      const data = await response.json();
      router.push(`/agency/messages?conversationId=${data.conversationID}`);
    } catch (err) {
      console.error("Error starting conversation:", err);
      toast.error("Failed to start conversation");
    } finally {
      setIsStartingConversation(false);
    }
  };

  const handleDeactivateUser = async () => {
    if (!client?.clientID) return;
    const action = client.active ? "deactivate" : "activate";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${client.clientName}?`
    );
    if (!confirmed) return;
    try {
      setIsDeactivating(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";
      const token = getAuthToken();
      const response = await fetch(
        `${baseUrl}/deactivate-user/${client.clientID}/`,
        {
          method: "POST",
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        }
      );
      if (!response.ok) throw new Error(`Failed to ${action} user`);
      toast.success(`${client.clientName} has been ${action}d successfully`);
      router.push("/agency/clients");
    } catch (err) {
      console.error(`Error ${action}ing user:`, err);
      toast.error(`Failed to ${action} user. Please try again.`);
    } finally {
      setIsDeactivating(false);
    }
  };

  const getInitials = (name: string): string => {
    const names = name.split(" ");
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
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
      <ServiceUnavailable
        title="Couldn't load client information"
        message="We're having trouble fetching client information. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <button onClick={handleBack} className={styles.backButton}>
        <BackBlack />
        Back
      </button>

      <h1 className={styles.pageTitle}>Client information</h1>

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
            disabled={isStartingConversation}
          >
            <MessageApp />
            {isStartingConversation ? "Starting..." : "Message client"}
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className={styles.assignButton}
          >
            Assign project
          </button>
          <button
            onClick={handleDeactivateUser}
            className={styles.deactivateButton}
            disabled={isDeactivating}
          >
            <DeleteUser />
            {isDeactivating
              ? "Processing..."
              : client.active
              ? "Deactivate user"
              : "Activate user"}
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
              onClick={() => setShowAssignModal(true)}
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

      {showAssignModal && (
        <AssignProjectModal onClose={() => setShowAssignModal(false)} />
      )}
    </div>
  );
};

export default ClientInformationPage;
