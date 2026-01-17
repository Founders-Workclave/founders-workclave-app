"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { ProjectManager } from "@/types/createPrjects";
import mockData from "../../../mocks/createProject.json";

interface TeamAssignmentProps {
  selectedManagerId: string;
  onSelect: (managerId: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const TeamAssignment: React.FC<TeamAssignmentProps> = ({
  selectedManagerId,
  onSelect,
  onSubmit,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const productManagers = mockData.productManagers as ProjectManager[];

  const filteredManagers = productManagers.filter((manager) =>
    manager.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    if (selectedManagerId) {
      onSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Team Assignment</h3>
        <p className={styles.subtitle}>
          Assign this project to a product manager
        </p>
      </div>

      <div className={styles.searchBox}>
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
      </div>

      <div className={styles.managerList}>
        {filteredManagers.map((manager) => (
          <div
            key={manager.id}
            className={styles.managerItem}
            onClick={() => onSelect(manager.id)}
          >
            <div className={styles.managerInfo}>
              <div className={styles.avatar}>{manager.initials}</div>
              <span className={styles.managerName}>{manager.name}</span>
            </div>
            <div className={styles.radioButton}>
              <input
                type="radio"
                checked={selectedManagerId === manager.id}
                onChange={() => onSelect(manager.id)}
                className={styles.radio}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button onClick={onBack} className={styles.backButton}>
          Back
        </button>
        <button
          onClick={handleCreateProject}
          disabled={!selectedManagerId}
          className={styles.createButton}
        >
          Create project
        </button>
      </div>
    </div>
  );
};

export default TeamAssignment;
