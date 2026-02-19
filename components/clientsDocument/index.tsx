"use client";
import React, { useEffect } from "react";
import styles from "@/components/agencyDocuments/styles.module.css";
import { Eye, Download, FileText } from "lucide-react";
import { useClientPRDs } from "@/hooks/useClientPrd";
import {
  getGoogleDriveDownloadUrl,
  getGoogleDrivePreviewUrl,
} from "@/utils/prdTransformer";
import AllLoading from "@/layout/Loader";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

interface ManagerDocumentsProps {
  projectId: string;
}

const ClientDocuments: React.FC<ManagerDocumentsProps> = ({ projectId }) => {
  const { prds, isLoading, error } = useClientPRDs({ projectId });

  useEffect(() => {
    console.log("📄 ManagerDocuments - projectId:", projectId);
    console.log("📄 ManagerDocuments - prds:", prds);
    console.log("📄 ManagerDocuments - isLoading:", isLoading);
    console.log("📄 ManagerDocuments - error:", error);
  }, [projectId, prds, isLoading, error]);

  const handleView = (documentUrl: string) => {
    const previewUrl = getGoogleDrivePreviewUrl(documentUrl);
    window.open(previewUrl, "_blank");
  };

  const handleDownload = (documentUrl: string, fileName: string) => {
    const downloadUrl = getGoogleDriveDownloadUrl(documentUrl);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName || "document.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Documents</h2>
        </div>
        <div className={styles.emptyState}>
          <AllLoading text="Loading PRDs..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load PRDs"
        message="We're having trouble loading your PRDs. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (prds.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Documents</h2>
        </div>
        <div className={styles.emptyState}>
          <p>No documents found for this project.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Documents</h2>
      </div>

      {/* List */}
      <div className={styles.list}>
        {prds.map((prd) => (
          <div key={prd.id} className={styles.card}>
            <div className={styles.left}>
              <div className={styles.iconBox}>
                <FileText size={18} />
              </div>

              <div>
                <p className={styles.title}>{prd.fileName}</p>
                <p className={styles.meta}>
                  {prd.fileType} • {prd.fileSize} • {prd.formattedDate}
                </p>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => handleView(prd.documentUrl)}
                title="View document"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() =>
                  handleDownload(
                    prd.documentUrl,
                    prd.fileName || "document.pdf"
                  )
                }
                title="Download document"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDocuments;
