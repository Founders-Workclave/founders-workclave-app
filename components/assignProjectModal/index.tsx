"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { getAuthToken } from "@/lib/utils/auth";
import toast from "react-hot-toast";

interface Project {
  id: string;
  name: string;
  client: string;
  status: string;
}

interface Manager {
  id: string;
  managerID: string;
  manager: string;
  created_at: string;
}

interface AssignProjectModalProps {
  onClose: () => void;
}

const AssignProjectModal: React.FC<AssignProjectModalProps> = ({ onClose }) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";
  const token = getAuthToken();
  const authHeaders = { ...(token && { Authorization: `Bearer ${token}` }) };

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");

  const [managers, setManagers] = useState<Manager[]>([]);
  const [managersLoading, setManagersLoading] = useState(true);
  const [selectedManager, setSelectedManager] = useState("");
  const [managerSearch, setManagerSearch] = useState("");
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const managerDropdownRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${baseUrl}/agency/projects-list/`, {
          headers: authHeaders,
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Failed to load projects");
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch(`${baseUrl}/agency/managers-list/`, {
          headers: authHeaders,
        });
        if (!response.ok) throw new Error("Failed to fetch managers");
        const data = await response.json();
        setManagers(data.managers || []);
      } catch (err) {
        console.error("Error fetching managers:", err);
        toast.error("Failed to load managers");
      } finally {
        setManagersLoading(false);
      }
    };
    fetchManagers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        managerDropdownRef.current &&
        !managerDropdownRef.current.contains(e.target as Node)
      ) {
        setShowManagerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredManagers = managers.filter((m) =>
    (m.manager ?? "").toLowerCase().includes(managerSearch.toLowerCase())
  );

  const handleSelectManager = (manager: Manager) => {
    setSelectedManager(manager.managerID);
    setManagerSearch(manager.manager);
    setShowManagerDropdown(false);
  };

  const handleSubmit = async () => {
    if (!selectedProject || !selectedManager) {
      toast.error("Please select both a project and a manager");
      return;
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("projectID", selectedProject);
      formData.append("managerID", selectedManager);
      const response = await fetch(
        `${baseUrl}/agency/assign-project-to-manager/`,
        {
          method: "POST",
          headers: authHeaders,
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Failed to assign project");
      const projectName =
        projects.find((p) => p.id === selectedProject)?.name || "Project";
      const managerName =
        managers.find((m) => m.managerID === selectedManager)?.manager ||
        "Manager";
      toast.success(`${projectName} assigned to ${managerName} successfully`);
      onClose();
    } catch (err) {
      console.error("Error assigning project:", err);
      toast.error("Failed to assign project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Assign Project</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Project Dropdown */}
          <div className={styles.field}>
            <label className={styles.label}>Select Project</label>
            {projectsLoading ? (
              <div className={styles.loadingField}>Loading projects...</div>
            ) : (
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Choose a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} — {project.client}
                    </option>
                  ))}
                </select>
                <span className={styles.chevron}>▾</span>
              </div>
            )}
          </div>

          {/* Manager Search */}
          <div className={styles.field}>
            <label className={styles.label}>Select Manager</label>
            {managersLoading ? (
              <div className={styles.loadingField}>Loading managers...</div>
            ) : (
              <div className={styles.searchWrapper} ref={managerDropdownRef}>
                <div className={styles.searchInputWrapper}>
                  <span className={styles.searchIcon}>🔍</span>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search managers by name or email..."
                    value={managerSearch}
                    onChange={(e) => {
                      setManagerSearch(e.target.value);
                      setSelectedManager("");
                      setShowManagerDropdown(true);
                    }}
                    onFocus={() => setShowManagerDropdown(true)}
                  />
                  {managerSearch && (
                    <button
                      className={styles.clearSearch}
                      onClick={() => {
                        setManagerSearch("");
                        setSelectedManager("");
                        setShowManagerDropdown(false);
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {showManagerDropdown && (
                  <div className={styles.dropdown}>
                    {filteredManagers.length === 0 ? (
                      <div className={styles.noResults}>No managers found</div>
                    ) : (
                      filteredManagers.map((manager) => (
                        <div
                          key={manager.id}
                          className={`${styles.dropdownItem} ${
                            selectedManager === manager.managerID
                              ? styles.dropdownItemSelected
                              : ""
                          }`}
                          onClick={() => handleSelectManager(manager)}
                        >
                          <div className={styles.managerAvatar}>
                            {manager.manager.substring(0, 2).toUpperCase()}
                          </div>
                          <div className={styles.managerInfo}>
                            <span className={styles.managerName}>
                              {manager.manager}
                            </span>
                          </div>
                          {selectedManager === manager.managerID && (
                            <span className={styles.checkmark}>✓</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className={styles.assignButton}
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedProject || !selectedManager}
          >
            {isSubmitting ? "Assigning..." : "Assign Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignProjectModal;
