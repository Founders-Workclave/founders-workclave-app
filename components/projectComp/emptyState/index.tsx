import React from "react";
import styles from "./styles.module.css";
import StartProject from "@/svgs/startProject";
import Link from "next/link";

const EmptyState = () => {
  return (
    <div className={styles.container}>
      <div className={styles.emptyBox}>
        <StartProject />
        <h2>No Project yet!</h2>
        <p>Start your first project to bring your ideas to life</p>
        <Link href="/" className={styles.actionBtn}>
          + Start AI consultation
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
