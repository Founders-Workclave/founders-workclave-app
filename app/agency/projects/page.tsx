import AgencyLayout from "@/layout/agency";
import styles from "./styles.module.css";
import CreateProjectButton from "@/components/createProjectButton";
import AllProjectsPage from "@/components/allAgenciesProject";

const AdminProjects = () => {
  return (
    <>
      <AgencyLayout pageTitle="" pageText="">
        <div className={styles.header}>
          <div>
            <h2>Projects</h2>
          </div>
          <CreateProjectButton />
        </div>
        <AllProjectsPage />
      </AgencyLayout>
    </>
  );
};

export default AdminProjects;
