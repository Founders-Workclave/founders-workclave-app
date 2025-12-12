"use client";
import { useState } from "react";
import RecentProjects from "./recentProjects";
import mockProjectsData from "../../mocks/project.json";
import EmptyState from "./emptyState";

const ProjectComponet = () => {
  //   const [projects] = useState([]);
  const [projects] = useState(mockProjectsData);

  return (
    <div>{projects.length === 0 ? <EmptyState /> : <RecentProjects />}</div>
  );
};

export default ProjectComponet;
