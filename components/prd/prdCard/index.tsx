import React from "react";
import styles from "./styles.module.css";
import Prd from "@/svgs/prd";
import SmallCalender from "@/svgs/smallCalender";
import SmallTime from "@/svgs/smallTime";

interface PRD {
  id: number;
  projectName: string;
  description: string;
  createdDate: string;
  duration: string;
  status: "In-Progress" | "Completed";
  modifiedDate: string;
  prdUrl: string;
}

interface PRDCardProps {
  prd: PRD;
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onDownload?: (id: number) => void;
}

const PRDCard: React.FC<PRDCardProps> = ({
  prd,
  onView,
  onEdit,
  onDownload,
}) => {
  const isCompleted = prd.status === "Completed";

  return (
    <div className={styles.card}>
      <Prd />
      <div className={styles.content}>
        <h3 className={styles.title}>{prd.projectName}</h3>
        <p className={styles.description}>{prd.description}</p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <SmallCalender />
            <span>{prd.createdDate}</span>
          </div>

          <div className={styles.metaItem}>
            <SmallTime />
            <span>{prd.duration}</span>
          </div>

          <span
            className={`${styles.statusBadge} ${
              isCompleted ? styles.statusCompleted : styles.statusInProgress
            }`}
          >
            {prd.status}
          </span>
        </div>

        <div className={styles.footer}>
          <div className={styles.actions}>
            <button
              onClick={() => onView(prd.id)}
              className={styles.viewButton}
            >
              View
            </button>
            {isCompleted && onDownload ? (
              <button
                onClick={() => onDownload(prd.id)}
                className={styles.downloadButton}
              >
                Download
              </button>
            ) : (
              onEdit && (
                <button
                  onClick={() => onEdit(prd.id)}
                  className={styles.editButton}
                >
                  Edit
                </button>
              )
            )}
          </div>
          <span className={styles.modifiedDate}>
            Modified {prd.modifiedDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PRDCard;
