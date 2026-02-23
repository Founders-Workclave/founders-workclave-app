"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { ProjectFormData } from "@/types/createPrjects";
import CreateProjectModal from "../createProject";

interface CreateProjectButtonProps {
  onSuccess?: () => void;
}

export default function CreateProjectButton({
  onSuccess,
}: CreateProjectButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = (data: ProjectFormData) => {
    console.log("Project Data:", data);
    setIsModalOpen(false);
    if (onSuccess) onSuccess();
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className={styles.buttonLink}
      >
        + New Project
      </button>
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
