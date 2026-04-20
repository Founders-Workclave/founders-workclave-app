import AgencyLayout from "@/layout/agency";
// import styles from "./styles.module.css";
// import AllPRDsPage from "@/components/agencyPRD";
// import ProjectStart from "@/components/projectStart";
import ComingSoon from "@/components/comingSoon";

const AdminPRDS = () => {
  return (
    <>
      <AgencyLayout pageTitle="AI PRDs" pageText="">
        <ComingSoon />
        {/* <ProjectStart /> */}
        {/* <AllPRDsPage /> */}
      </AgencyLayout>
    </>
  );
};

export default AdminPRDS;
