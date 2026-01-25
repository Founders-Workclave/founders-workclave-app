import AgencyLayout from "@/layout/agency";
import styles from "./styles.module.css";
import AllPRDsPage from "@/components/agencyPRD";
import ProjectStart from "@/components/projectStart";

const AdminPRDS = () => {
  return (
    <>
      <AgencyLayout pageTitle="" pageText="">
        <div className={styles.header}>
          <div>
            <h2>PRDs</h2>
          </div>
        </div>
        <ProjectStart />
        <AllPRDsPage />
      </AgencyLayout>
    </>
  );
};

export default AdminPRDS;
