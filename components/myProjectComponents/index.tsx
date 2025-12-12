// components/myProjects/index.tsx
"use client";
import React, { useState } from "react";
import projectDataRaw from "../../mocks/project.json";
import styles from "./styles.module.css";
import ProjectComponet from "../projectComp";

interface Project {
  id: number;
  title: string;
  stage: string;
  progress: number;
  status: "In-Progress" | "Completed" | "Pending";
}

const MyProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const projectData = projectDataRaw as Project[];

  // Filter projects based on search query
  const filteredProjects = projectData.filter((project) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.stage.toLowerCase().includes(searchLower) ||
      project.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>All Projects</h1>
        {/* <p className={styles.subtitle}>
          {filteredProjects.length} project
          {filteredProjects.length !== 1 ? "s" : ""} found
        </p> */}
      </div>

      {/* Search Bar */}
      <div className={styles.searchWrapper}>
        <div className={styles.searchContainer}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.searchIcon}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length > 0 ? (
        <ProjectComponet />
      ) : (
        <div className={styles.emptyState}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p className={styles.emptyText}>
            {searchQuery
              ? `No projects found matching "${searchQuery}"`
              : "No projects available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
