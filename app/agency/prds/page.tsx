import AgencyLayout from "@/layout/agency";
import styles from "./styles.module.css";
// import AllPRDsPage from "@/components/agencyPRD";
// import ProjectStart from "@/components/projectStart";
import ComingSoon from "@/components/comingSoon";

const AdminPRDS = () => {
  return (
    <>
      <AgencyLayout pageTitle="" pageText="">
        <div className={styles.header}>
          {/* <div>
            <h2>AI PRDs</h2>
          </div> */}
        </div>
        <ComingSoon />
        {/* <ProjectStart />
        <AllPRDsPage /> */}
      </AgencyLayout>
    </>
  );
};

export default AdminPRDS;
