"use client";
import AgencyLayout from "@/layout/agency";
import styles from "./styles.module.css";
import CreateProjectButton from "@/components/createProjectButton";
import ProjectsPage from "@/components/agencyProject/projectsList";
import { useAgencyData } from "@/hooks/useAgencyData";

const AdminProjects = () => {
  const { projects, isLoading, refetch } = useAgencyData();

  return (
    <>
      <AgencyLayout pageTitle="" pageText="">
        <div className={styles.header}>
          <div>
            <h2>Projects</h2>
          </div>
          <CreateProjectButton onSuccess={refetch} />
        </div>
        <ProjectsPage
          initialProjects={projects}
          isLoading={isLoading}
          header="All Projects"
        />
      </AgencyLayout>
    </>
  );
};

export default AdminProjects;
