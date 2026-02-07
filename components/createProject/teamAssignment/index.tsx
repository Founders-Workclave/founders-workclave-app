"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { ProjectManager } from "@/types/createPrjects";
import { managerServiceForProjects } from "@/lib/api/createProject/managersForProjects";
import AllLoading from "@/layout/Loader";

interface TeamAssignmentProps {
  selectedManagerId: string;
  onSelect: (managerId: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const TeamAssignment: React.FC<TeamAssignmentProps> = ({
  selectedManagerId,
  onSelect,
  onSubmit,
  onBack,
  isSubmitting = false,
  mode = "create",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [productManagers, setProductManagers] = useState<ProjectManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isReadOnly = mode === "edit";

  useEffect(() => {
    fetchManagers();
  }, []);

  // FIXED: Log selection state for debugging
  useEffect(() => {
    console.log("🔍 TeamAssignment Debug:");
    console.log("  - selectedManagerId:", selectedManagerId);
    console.log("  - selectedManagerId type:", typeof selectedManagerId);
    console.log(
      "  - Available manager IDs:",
      productManagers.map((m) => ({ id: m.id, type: typeof m.id }))
    );
  }, [selectedManagerId, productManagers]);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await managerServiceForProjects.getManagersList();

      // Transform API response to ProjectManager type
      const transformedManagers: ProjectManager[] = response.managers.map(
        (manager) => {
          const nameParts = manager.manager.split(" ");
          const initials = nameParts
            .map((part) => part.charAt(0).toUpperCase())
            .join("")
            .slice(0, 2);

          return {
            // FIXED: Ensure ID is always a string
            id: String(manager.managerID),
            name: manager.manager,
            email: "", // Not provided by API
            initials: initials,
          };
        }
      );

      setProductManagers(transformedManagers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch managers");
      console.error("Error fetching managers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredManagers = productManagers.filter((manager) =>
    manager.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitProject = () => {
    if (selectedManagerId && !isSubmitting) {
      onSubmit();
    }
  };

  // FIXED: Properly check if manager is selected with string comparison
  const isManagerSelected = (managerId: string): boolean => {
    return String(selectedManagerId) === String(managerId);
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return mode === "edit" ? "Updating..." : "Creating...";
    }
    return mode === "edit" ? "Update project" : "Create project";
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Team Assignment</h3>
          <p className={styles.subtitle}>
            Assign this project to a product manager
          </p>
        </div>
        <div className={styles.loadingState}>
          <AllLoading text="Loading product managers..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Team Assignment</h3>
          <p className={styles.subtitle}>
            Assign this project to a product manager
          </p>
        </div>
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={fetchManagers} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerWithBadge}>
          <h3 className={styles.title}>Team Assignment</h3>
          {isReadOnly && (
            <div className={styles.readOnlyBadge}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Read-only
            </div>
          )}
        </div>
        <p className={styles.subtitle}>
          {isReadOnly
            ? "Review assigned product manager (cannot be changed here)"
            : "Assign this project to a product manager"}
        </p>
      </div>

      {isReadOnly && (
        <div className={styles.infoMessage}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>
            Product manager assignment cannot be changed when editing a project.
            This is for review only.
          </p>
        </div>
      )}

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
          disabled={isSubmitting || isReadOnly}
        />
      </div>

      <div className={styles.managerList}>
        {filteredManagers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No product managers found</p>
          </div>
        ) : (
          filteredManagers.map((manager) => {
            const isSelected = isManagerSelected(manager.id);

            return (
              <div
                key={manager.id}
                className={`${styles.managerItem} ${
                  isReadOnly ? styles.readOnlyItem : ""
                } ${isSelected ? styles.managerItemSelected : ""}`}
                onClick={() =>
                  !isSubmitting && !isReadOnly && onSelect(manager.id)
                }
                style={{
                  cursor:
                    isSubmitting || isReadOnly ? "not-allowed" : "pointer",
                  opacity: isReadOnly && !isSelected ? 0.5 : 1,
                }}
              >
                <div className={styles.managerInfo}>
                  <div className={styles.avatar}>{manager.initials}</div>
                  <span className={styles.managerName}>{manager.name}</span>
                </div>
                <div className={styles.radioButton}>
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() =>
                      !isSubmitting && !isReadOnly && onSelect(manager.id)
                    }
                    className={styles.radio}
                    disabled={isSubmitting || isReadOnly}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className={styles.footer}>
        <button
          onClick={onBack}
          className={styles.backButton}
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          onClick={handleSubmitProject}
          disabled={!selectedManagerId || isSubmitting}
          className={styles.createButton}
        >
          {getSubmitButtonText()}
        </button>
      </div>
    </div>
  );
};

export default TeamAssignment;
