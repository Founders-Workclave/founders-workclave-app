import AgencyLayout from "@/layout/agency";
import styles from "./styles.module.css";
import AllClientsPage from "@/components/agencyClients";
import CreateButton from "@/components/addClientModal/openButton";

const AdminClient = () => {
  return (
    <>
      <AgencyLayout pageTitle="" pageText="">
        <div className={styles.header}>
          <div>
            <h2>Clients</h2>
          </div>
          <CreateButton buttonName="+ New Client" />
        </div>
        <AllClientsPage />
      </AgencyLayout>
    </>
  );
};

export default AdminClient;
