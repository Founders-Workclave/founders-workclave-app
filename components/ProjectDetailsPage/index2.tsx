"use client";
import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { ProjectService } from "@/lib/api/projectService";
import { Project, NextMilestoneData } from "@/types/project";
import styles from "./styles.module.css";
import ProjectProgress from "../projectDetail/projectProgress";
import ProblemStatement from "../projectDetail/problemStatement";
import KeyFeatures from "../projectDetail/keyfeatures";
import NextMilestone from "../projectDetail/nextMilestone";
import ProductManager from "../projectDetail/productManager";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";
import AllLoading from "@/layout/Loader";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://foundersapi.up.railway.app";

interface PageProps {
  params: {
    userId: string;
    projectId: string;
  };
}

export default function TabOneComponent({ params }: PageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [nextMilestone, setNextMilestone] = useState<NextMilestoneData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setIsMessageLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { project: projectData, nextMilestone: milestoneData } =
          await ProjectService.getProjectById(params.projectId);

        setProject(projectData);
        setNextMilestone(milestoneData);
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

  const handleMessagePM = async () => {
    if (!project?.projectManagerID) {
      console.error("No PM ID available");
      return;
    }

    try {
      setIsMessageLoading(true);
      const token = localStorage.getItem("access_token");

      const formData = new FormData();
      formData.append("userID", project.projectManagerID);

      const response = await fetch(`${API_BASE_URL}/chat/conversation/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const data = await response.json();
      const conversationId = data.conversationID;
      const userId = project.projectManagerID;

      router.push(
        `/founder/messages?conversationId=${conversationId}&userId=${userId}`
      );
    } catch (err) {
      console.error("Error starting conversation:", err);
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleViewFullPRD = () => {};

  if (isLoading) {
    return <AllLoading text="Loading project details..." />;
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load project"
        message="We're having trouble loading. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!project) {
    notFound();
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const projectProgress = {
    overall: project.progressPercentage || 0,
    milestonesCompleted: project.completedMilestone || 0,
    totalMilestones: project.totalMilestone || 0,
    daysLeftUntilDeadline: 0,
    documentTotal: 0,
  };

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
        <NextMilestone
          milestone={nextMilestone}
          walletBalance={parseFloat(project.paidBalance) || 0}
        />

        {project.projectManager && (
          <ProductManager
            manager={{
              name: project.projectManager,
              initials: getInitials(project.projectManager),
              avatar: null,
            }}
            onMessagePM={handleMessagePM}
          />
        )}
      </div>
    </div>
  );
}
