import AgencyLayout from "@/layout/agency";
import styles from "./styles.module.css";
import AllProductManagersPage from "@/components/agencyManager";
import CreateButton from "@/components/addPMModal/openButton";

const AdminPM = () => {
  return (
    <>
      <AgencyLayout pageTitle="" pageText="">
        <div className={styles.header}>
          <div>
            <h2>Product Managers</h2>
          </div>
          <CreateButton buttonName="+ New PM" />
        </div>
        <AllProductManagersPage />
      </AgencyLayout>
    </>
  );
};

export default AdminPM;
