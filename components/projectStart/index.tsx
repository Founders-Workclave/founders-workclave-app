import React from "react";
import styles from "./styles.module.css";
import SettingsTwo from "@/svgs/settingsTwo";
import Link from "next/link";
import FounderProjectModal from "../founderProjectModal";

const ProjectStart = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contain}>
        <div className={styles.content}>
          <div className={styles.texts}>
            <span>
              <h2>
                <SettingsTwo /> Start a New Project
              </h2>
              <div className={styles.otherTextsMobile}>
                <p>Average Response</p>
                <h3>24 Hours</h3>
              </div>
            </span>

            <p>
              Have a product idea? Let our AI consultant guide you through a
              structured conversation to create a comprehensive Product
              Requirement Document in minutes.
            </p>
          </div>
          <div className={styles.otherTexts}>
            <p>Average Response</p>
            <h3>24 Hours</h3>
          </div>
        </div>
        <div className={styles.btnContainer}>
          <FounderProjectModal />
        </div>
      </div>
    </div>
  );
};

export default ProjectStart;
