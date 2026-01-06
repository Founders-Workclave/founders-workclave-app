import React from "react";
import styles from "./styles.module.css";
import ViewDocuments from "@/svgs/viewDocument";
import DownloadDocuments from "@/svgs/downloadDocuments";
import { DocumentService } from "@/lib/api/documentService";

interface DocumentCardProps {
  document: {
    id: number;
    description: string | null;
    documentUrl: string;
    uploadedAt: string;
  };
  onView: (id: number) => void;
  onDownload: (id: number) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
}) => {
  // Format date to readable format
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get filename from URL
  const getTitle = (): string => {
    const filename = DocumentService.getFilenameFromUrl(document.documentUrl);
    return document.description || filename || `Document ${document.id}`;
  };

  // Get file type from URL
  const getFileType = (): string => {
    return DocumentService.getFileExtension(document.documentUrl);
  };

  // Get file extension icon color based on type
  const getFileTypeColor = (type: string): string => {
    const typeUpper = type.toUpperCase();
    switch (typeUpper) {
      case "PDF":
        return "#e74c3c";
      case "DOCX":
      case "DOC":
        return "#2980b9";
      case "XLSX":
      case "XLS":
        return "#27ae60";
      case "PNG":
      case "JPG":
      case "JPEG":
        return "#9b59b6";
      default:
        return "#95a5a6";
    }
  };

  const fileType = getFileType();

  return (
    <div className={styles.card}>
      <div
        className={styles.iconWrapper}
        style={{ color: getFileTypeColor(fileType) }}
      >
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
        <h3 className={styles.title}>{getTitle()}</h3>
        <div className={styles.meta}>
          <span>{fileType}</span>
          <span className={styles.separator}>•</span>
          <span>{formatDate(document.uploadedAt)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => onView(document.id)}
          className={styles.actionButton}
          aria-label="View document"
          title="View document"
        >
          <ViewDocuments />
        </button>

        <button
          onClick={() => onDownload(document.id)}
          className={styles.actionButton}
          aria-label="Download document"
          title="Download document"
        >
          <DownloadDocuments />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
