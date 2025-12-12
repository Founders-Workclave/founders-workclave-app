import React from "react";
import styles from "./styles.module.css";
import EmptyMessage from "@/svgs/emptyMessage";

const EmptyState: React.FC = () => {
  return (
    <div className={styles.container}>
      <EmptyMessage />
      <h2 className={styles.title}>No Recent Chat</h2>
    </div>
  );
};

export default EmptyState;
