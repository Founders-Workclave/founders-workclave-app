"use client";
import { notFound } from "next/navigation";
import projectsDataRaw from "../../mocks/projectdetail.json";
import styles from "./styles.module.css";
import ProjectProgress from "../projectDetail/projectProgress";
import ProblemStatement from "../projectDetail/problemStatement";
import KeyFeatures from "../projectDetail/keyfeatures";
import NextMilestone from "../projectDetail/nextMilestone";
import ProductManager from "../projectDetail/productManager";
import { ProjectDetailsTypes as ProjectDetail } from "../../types/project";

interface PageProps {
  params: {
    userId: string;
    projectId: string;
  };
}

export default function TabOneComponent({ params }: PageProps) {
  const projectsData = projectsDataRaw as unknown as ProjectDetail[];
  const projectIdStr = params?.projectId || "1";
  const projectId = parseInt(projectIdStr, 10);
  const project = projectsData.find((p) => p.id === projectId);

  if (!project) {
    notFound();
  }

  const handleMessagePM = () => {
    console.log("Message PM clicked");
  };

  const handleViewFullPRD = () => {
    console.log("View full PRD clicked");
  };

  return (
    <div className={styles.contentGrid}>
      <div className={styles.leftColumn}>
        <ProjectProgress progress={project.progress} />
        <ProblemStatement
          statement={project.problemStatement}
          onViewFullPRD={handleViewFullPRD}
        />
        <KeyFeatures features={project.keyFeatures} />
      </div>

      <div className={styles.rightColumn}>
        {/* NextMilestone is self-contained - no props needed */}
        <NextMilestone />
        <ProductManager
          manager={project.productManager}
          onMessagePM={handleMessagePM}
        />
      </div>
    </div>
  );
}
