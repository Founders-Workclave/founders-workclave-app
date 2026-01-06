import React from "react";
import styles from "./styles.module.css";
import Prd from "@/svgs/prd";
import SmallCalender from "@/svgs/smallCalender";

interface PRD {
  id: number;
  description: string | null;
  documentUrl: string;
  uploadedAt: string;
}

interface PRDCardProps {
  prd: PRD;
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onDownload?: (id: number) => void;
}

const PRDCard: React.FC<PRDCardProps> = ({ prd, onView, onDownload }) => {
  // Extract filename from URL
  const getFilenameFromUrl = (url: string): string => {
    try {
      const parts = url.split("/");
      const lastPart = parts[parts.length - 1];
      // Remove the random suffix after underscore
      const filename = lastPart.split("_")[0];
      return filename || "Untitled Document";
    } catch {
      return "Untitled Document";
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  // Calculate relative time for "Modified" text
  const getRelativeTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        if (diffInHours === 0) {
          const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
          return diffInMinutes <= 1
            ? "just now"
            : `${diffInMinutes} minutes ago`;
        }
        return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
      } else if (diffInDays === 1) {
        return "yesterday";
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
      } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return months === 1 ? "1 month ago" : `${months} months ago`;
      } else {
        const years = Math.floor(diffInDays / 365);
        return years === 1 ? "1 year ago" : `${years} years ago`;
      }
    } catch {
      return "recently";
    }
  };

  const projectName = getFilenameFromUrl(prd.documentUrl);
  const createdDate = formatDate(prd.uploadedAt);
  const modifiedDate = getRelativeTime(prd.uploadedAt);
  const description = prd.description || "No description available";

  return (
    <div className={styles.card}>
      <Prd />
      <div className={styles.content}>
        <h3 className={styles.title}>{projectName}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <SmallCalender />
            <span>{createdDate}</span>
          </div>

          <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
            Completed
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
            {onDownload && (
              <button
                onClick={() => onDownload(prd.id)}
                className={styles.downloadButton}
              >
                Download
              </button>
            )}
          </div>
          <span className={styles.modifiedDate}>Modified {modifiedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PRDCard;
