import React from "react";
import styles from "./styles.module.css";
import ViewDocuments from "@/svgs/viewDocument";
import DownloadDocuments from "@/svgs/downloadDocuments";

interface DocumentCardProps {
  document: {
    id: number;
    title: string;
    type: string;
    size: string;
    uploadDate: string;
    url: string;
  };
  onView: (id: number) => void;
  onDownload: (id: number) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{document.title}</h3>
        <div className={styles.meta}>
          <span>{document.type}</span>
          <span className={styles.separator}>•</span>
          <span>{document.size}</span>
          <span className={styles.separator}>•</span>
          <span>{document.uploadDate}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => onView(document.id)}
          className={styles.actionButton}
          aria-label="View document"
        >
          <ViewDocuments />
        </button>

        <button
          onClick={() => onDownload(document.id)}
          className={styles.actionButton}
          aria-label="Download document"
        >
          <DownloadDocuments />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
