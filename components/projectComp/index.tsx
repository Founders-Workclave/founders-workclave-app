"use client";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import RecentProjects from "./recentProjects";
import EmptyState from "./emptyState";
import { ProjectService } from "../../lib/api/projectService";
import { Project } from "@/types/project";
import Loader from "../loader";

const ProjectComponent = () => {
  // State management for projects, loading, and errors
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect runs when component mounts to fetch data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true); // Show loading state
        setError(null); // Clear any previous errors

        const data = await ProjectService.getUserProjects();
        setProjects(data);
      } catch (err) {
        // Handle any errors that occur during fetch
        setError(
          err instanceof Error ? err.message : "Failed to load projects"
        );
        console.error("Error fetching projects:", err);
      } finally {
        // Always set loading to false, whether success or failure
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

  // Show error state if fetch failed
  if (error) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "#e74c3c",
        }}
      >
        <h3>Error loading projects</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
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
