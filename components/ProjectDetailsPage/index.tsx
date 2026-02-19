"use client";
import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { ProjectService } from "@/lib/api/projectService";
import { Project } from "@/types/project";
import styles from "./styles.module.css";
import ProjectHeader from "@/components/projectDetail/projectHeader";
import ProjectTabs from "@/components/TabHeader";
import Loader from "../loader";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

interface PageProps {
  params: {
    userId: string;
    projectId: string;
  };
}

export default function ProjectDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await ProjectService.getProjectById(params.projectId);
        setProject(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load project";
        setError(errorMessage);
        console.error("Error fetching project:", err);

        // If unauthorized, redirect to login
        if (
          errorMessage.includes("Authentication failed") ||
          errorMessage.includes("log in")
        ) {
          setTimeout(() => router.push("/login"), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.projectId) {
      fetchProject();
    }
  }, [params.projectId, router]);

  const handleBack = () => {
    router.back();
  };

  const handleMessagePM = () => {
    console.log("Message PM clicked");
    // TODO: Implement messaging functionality
  };

  const handleDownloadPRD = async () => {
    console.log("Download PRD clicked");
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Please log in to download PRD");
        return;
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          "https://foundersapi.up.railway.app"
        }/founder/project/${params.projectId}/prds/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch PRD");
      }

      const documents = await response.json();

      if (documents.prds && documents.prds.length > 0) {
        window.open(documents.prds[0].documentUrl, "_blank");
      } else {
        alert("No PRD available for download");
      }
    } catch (error) {
      console.error("Error downloading PRD:", error);
      alert("Failed to download PRD");
    }
  };

  const handleProjectUpdated = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await ProjectService.getProjectById(params.projectId);
      setProject(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load project";
      setError(errorMessage);
      console.error("Error fetching project:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader type="pulse" loading={isLoading} size={15} color="#5865F2" />
        <p>Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load project details"
        message="We're having trouble loading your project details. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className={styles.pageContainer}>
      <ProjectHeader
        id={project.id}
        title={project.name}
        status={project.status}
        createdOn={formatDate(project.dateCreated)}
        lastUpdated={formatDate(project.updatedDate)}
        dueDate={project.dueDate ? formatDate(project.dueDate) : undefined}
        onBack={handleBack}
        onMessagePM={handleMessagePM}
        onDownloadPRD={handleDownloadPRD}
        onProjectUpdated={handleProjectUpdated}
      />
      <ProjectTabs params={{ userId: params.userId, projectId: project.id }} />
    </div>
  );
}
