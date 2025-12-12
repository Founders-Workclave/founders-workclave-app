"use client";
import { notFound } from "next/navigation";
import projectsDataRaw from "../../mocks/projectdetail.json";
import styles from "./styles.module.css";
import ProjectHeader from "../projectDetail/projectHeader";
import { ProjectDetailsTypes as ProjectDetail } from "../../types/project";
import ProjectTabs from "../TabHeader";

interface PageProps {
  params: {
    userId: string;
    projectId: string;
  };
}

export default function Page({ params }: PageProps) {
  const projectsData = projectsDataRaw as unknown as ProjectDetail[];
  const projectIdStr = params?.projectId || "1";
  const projectId = parseInt(projectIdStr, 10);

  // Find the specific project by ID
  const project = projectsData.find((p) => p.id === projectId);

  if (!project) {
    notFound();
  }

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const handleMessagePM = () => {
    console.log("Message PM clicked");
  };

  const handleDownloadPRD = () => {
    console.log("Download PRD clicked");
  };

  const handlePauseProject = () => {
    console.log("Pause project clicked");
  };

  const handleTerminateProject = () => {
    console.log("Terminate project clicked");
  };

  return (
    <div className={styles.pageContainer}>
      <ProjectHeader
        id={String(project.id)}
        title={project.title}
        status={project.status}
        createdOn={project.createdOn}
        lastUpdated={project.lastUpdated}
        dueDate={project.dueDate}
        onBack={handleBack}
        onMessagePM={handleMessagePM}
        onDownloadPRD={handleDownloadPRD}
        onPauseProject={handlePauseProject}
        onTerminateProject={handleTerminateProject}
      />
      <ProjectTabs params={params} />
    </div>
  );
}
