import AgencyLayout from "@/layout/agency";
import styles from "./styles.module.css";
import Link from "next/link";
import AgencyDashboard from "@/components/agencyDashboard";
import ProjectsPage from "@/components/agencyProject/projectsList";

const AdminFounders = () => {
  return (
    <>
      <AgencyLayout pageTitle="" pageText="">
        <div className={styles.header}>
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back! Here&apos;s what&apos;s happening today</p>
          </div>
          <Link href="/some-path" className={styles.buttonLink}>
            + New Project
          </Link>
        </div>
        <AgencyDashboard />
        <ProjectsPage />
      </AgencyLayout>
    </>
  );
};

export default AdminFounders;
