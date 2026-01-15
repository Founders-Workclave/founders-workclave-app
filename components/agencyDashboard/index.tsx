import React from "react";
import styles from "./styles.module.css";
import AgencyStats from "../agencyStats";

const AgencyDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <AgencyStats />
    </div>
  );
};

export default AgencyDashboard;
