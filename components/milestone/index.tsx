"use client";
import React from "react";
import styles from "./styles.module.css";
import milestoneDataRaw from "../../mocks/projectMilestone.json";
import { ProjectMilestoneData } from "@/types/project";
import MilestoneCard from "./milestoneCard";

interface MilestonesPageProps {
  projectId?: string;
}

const MilestonesPage: React.FC<MilestonesPageProps> = ({}) => {
  const project = milestoneDataRaw as ProjectMilestoneData;

  const handleViewDetails = (milestoneId: number) => {
    console.log("View details for milestone:", milestoneId);
  };

  const handleRequestUpdate = (milestoneId: number) => {
    console.log("Request update for milestone:", milestoneId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Milestones</h1>
      </div>
      <div className={styles.milestonesTimeline}>
        {project.milestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            onViewDetails={() => handleViewDetails(milestone.id)}
            onRequestUpdate={() => handleRequestUpdate(milestone.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MilestonesPage;
