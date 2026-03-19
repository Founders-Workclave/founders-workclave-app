"use client";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import RecentProjects from "./recentProjects";
import EmptyState from "./emptyState";
import { ProjectService } from "../../lib/api/projectService";
import { Project } from "@/types/project";
import Loader from "../loader";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

const ProjectComponent = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await ProjectService.getUserProjects();
        setProjects(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load projects"
        );
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader type="pulse" loading={isLoading} size={15} color="#5865F2" />
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load projects"
        message="We're having trouble loading your projects. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div>
      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <RecentProjects projects={projects} />
      )}
    </div>
  );
};

export default ProjectComponent;
