import React from "react";
import styles from "./styles.module.css";

interface ProblemStatementProps {
  statement: string;
  onViewFullPRD: () => void;
}

const ProblemStatement: React.FC<ProblemStatementProps> = ({
  statement,
  onViewFullPRD,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Problem Statement</h2>
        <button onClick={onViewFullPRD} className={styles.viewLink}>
          View Full PRD
        </button>
      </div>
      <p className={styles.statement}>{statement}</p>
    </div>
  );
};

export default ProblemStatement;
