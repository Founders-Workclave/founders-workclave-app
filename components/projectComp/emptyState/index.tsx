import React from "react";
import styles from "./styles.module.css";
import StartProject from "@/svgs/startProject";
import FounderProjectModal from "@/components/founderProjectModal";

const EmptyState = () => {
  return (
    <div className={styles.container}>
      <div className={styles.emptyBox}>
        <StartProject />
        <h2>No Project yet!</h2>
        <p>Start your first project to bring your ideas to life</p>
        <FounderProjectModal />
      </div>
    </div>
  );
};

export default EmptyState;
