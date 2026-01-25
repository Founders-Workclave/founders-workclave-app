"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types/agencyProjectsNew";
import styles from "./styles.module.css";
import { ProjectRow } from "../projectRow";
import { ProjectCard } from "../projectCard";
import { Pagination } from "../pagination";
import EmptyProjectIcon from "@/svgs/emptyProject";
import Loader from "@/components/loader";

interface ProjectsPageProps {
  initialProjects: Project[];
  isLoading?: boolean;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({
  initialProjects,
  isLoading,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const filteredProjects = useMemo(() => {
    return initialProjects.filter(
      (project) =>
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialProjects, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage]);

  const handleSeeDetails = (projectId: string): void => {
    router.push(`/agency/${projectId}`);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader type="pulse" loading={isLoading} size={15} color="#5865F2" />
          <p>Loading Dashboard...</p>
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
        <h1 className={styles.title}>Recent projects</h1>
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

export default ProjectsPage;
