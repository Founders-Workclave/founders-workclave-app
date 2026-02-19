"use client";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { ProjectService } from "@/lib/api/projectService";
import { Project } from "@/types/project";
import styles from "./styles.module.css";
import ProjectProgress from "../projectDetail/projectProgress";
import ProblemStatement from "../projectDetail/problemStatement";
import KeyFeatures from "../projectDetail/keyfeatures";
import NextMilestone from "../projectDetail/nextMilestone";
import ProductManager from "../projectDetail/productManager";
import Loader from "../loader";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

interface PageProps {
  params: {
    userId: string;
    projectId: string;
  };
}

export default function TabOneComponent({ params }: PageProps) {
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
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.projectId) {
      fetchProject();
    }
  }, [params.projectId]);

  const handleMessagePM = () => {
    console.log("Message PM clicked");
    // TODO: Implement messaging functionality
  };

  const handleViewFullPRD = () => {
    console.log("View full PRD clicked");
    // TODO: Navigate to full PRD view or open modal
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader type="pulse" loading={isLoading} size={15} color="#5865F2" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load "
        message="We're having trouble loading. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!project) {
    notFound();
  }

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Map API response to component structure
  const projectProgress = {
    overall: project.progressPercentage || 0,
    milestonesCompleted: project.completedMilestone || 0,
    totalMilestones: project.totalMilestone || 0,
    daysLeftUntilDeadline: 0, // TODO: Calculate from dueDate
    documentTotal: 0, // TODO: Get from documents API
  };

  // Extract features from projectFeatures array
  const keyFeatures = project.projectFeatures?.map((f) => f.feature) || [];

  return (
    <div className={styles.contentGrid}>
      <div className={styles.leftColumn}>
        <ProjectProgress progress={projectProgress} />

        {project.description && (
          <ProblemStatement
            statement={project.description}
            onViewFullPRD={handleViewFullPRD}
          />
        )}

        {keyFeatures.length > 0 && <KeyFeatures features={keyFeatures} />}
      </div>

      <div className={styles.rightColumn}>
        <NextMilestone />

        {project.projectManager && (
          <ProductManager
            manager={{
              name: project.projectManager,
              initials: getInitials(project.projectManager),
              avatar: null, // API doesn't provide avatar
            }}
            onMessagePM={handleMessagePM}
          />
        )}
      </div>
    </div>
  );
}
