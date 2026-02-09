"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Project } from "@/types/agencyProjectsNew";
import styles from "./styles.module.css";
import EmptyProjectIcon from "@/svgs/emptyProject";
import Loader from "@/components/loader";
import { getAgencyProjects } from "@/lib/api/superAdmin/agencyService";
import { ProjectRow } from "../agencyProject/projectRow";
import { ProjectCard } from "../agencyProject/projectCard";
import { Pagination } from "../agencyProject/pagination";

interface AdminAgencyProjectsProps {
  agencyId: string;
  onProjectClick?: (projectId: string) => void;
}

const AdminAgencyProjects: React.FC<AdminAgencyProjectsProps> = ({
  agencyId,
  onProjectClick,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await getAgencyProjects(agencyId);

        // Transform API response to Project type
        const transformedProjects: Project[] = response.projectList.map(
          (project: {
            id: string;
            name: string;
            client: string;
            clientId: string;
            progress: string;
            projectValue: string;
            paidBalance: string;
            status: string;
            stage: string;
            pm: string;
          }) => {
            // Parse progress string like "2/5"
            let progressCurrent = 0;
            let progressTotal = 0;
            if (project.progress && typeof project.progress === "string") {
              const [current, total] = project.progress.split("/").map(Number);
              progressCurrent = current || 0;
              progressTotal = total || 0;
            }

            // Parse monetary values
            const projectValue = parseFloat(project.projectValue || "0");
            const paidBalance = parseFloat(project.paidBalance || "0");

            // Calculate percent paid
            const percentPaid =
              projectValue > 0
                ? Math.round((paidBalance / projectValue) * 100)
                : 0;

            return {
              id: project.id,
              projectName: project.name,
              client: {
                name: project.client || "N/A",
                id: project.clientId || "",
              },
              totalProjectValue: projectValue,
              amountPaid: paidBalance,
              percentPaid: percentPaid,
              progress: {
                current: progressCurrent,
                total: progressTotal,
              },
              status: project.status || "active",
              stage: project.stage || "In Progress",
              pm: project.pm || "N/A",
            };
          }
        );

        setProjects(transformedProjects);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [agencyId]);

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (project) =>
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage]);

  const handleSeeDetails = (projectId: string): void => {
    if (onProjectClick) {
      onProjectClick(projectId);
    }
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader type="pulse" loading={isLoading} size={15} color="#5865F2" />
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>Error loading projects: {error}</p>
        </div>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <EmptyProjectIcon />
          <p>No projects yet</p>
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>Clear search</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Agency Projects</h1>
      </div>

      <div className={styles.searchContainer}>
        <svg
          className={styles.searchIcon}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableHeaderCell}>Project Name</th>
              <th className={styles.tableHeaderCell}>Client</th>
              <th className={styles.tableHeaderCell}>Total project value</th>
              <th className={styles.tableHeaderCell}>Amount paid</th>
              <th className={styles.tableHeaderCell}>Progress</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onSeeDetails={handleSeeDetails}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.cardsContainer}>
        {paginatedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSeeDetails={handleSeeDetails}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AdminAgencyProjects;
