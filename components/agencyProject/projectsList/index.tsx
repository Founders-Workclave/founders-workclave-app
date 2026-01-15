"use client";
import React, { useState } from "react";
import mockData from "../../../mocks/agencyProjects.json";
import { ProjectListResponse } from "@/types/agencyProjects";
import styles from "./styles.module.css";
import { ProjectRow } from "../projectRow";
import { ProjectCard } from "../projectCard";
import { Pagination } from "../pagination";

const ProjectsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(3);

  const data = mockData as ProjectListResponse;

  const filteredProjects = data.projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSeeDetails = (projectId: string): void => {
    console.log("Navigate to project:", projectId);
    // Navigation logic here
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

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

      {/* Desktop Table View */}
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
            {filteredProjects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onSeeDetails={handleSeeDetails}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={styles.cardsContainer}>
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSeeDetails={handleSeeDetails}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProjectsPage;
