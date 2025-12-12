import React from "react";
import styles from "./styles.module.css";
import SettingsTwo from "@/svgs/settingsTwo";
import Link from "next/link";

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
                <p>Average Time</p>
                <h3>8mins</h3>
              </div>
            </span>

            <p>
              Have a product idea? Let our AI consultant guide you through a
              structured conversation to create a comprehensive Product
              Requirement Document in minutes.
            </p>
          </div>
          <div className={styles.otherTexts}>
            <p>Average Time</p>
            <h3>8mins</h3>
          </div>
        </div>
        <Link href="/" className={styles.actionBtn}>
          + Start AI consultation
        </Link>
      </div>
    </div>
  );
};

export default ProjectStart;
