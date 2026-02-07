"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { Eye, Download, Trash2, Plus, FileText } from "lucide-react";
import { usePRDs } from "@/hooks/useAgencyPrds";
import {
  getGoogleDriveDownloadUrl,
  getGoogleDrivePreviewUrl,
} from "@/utils/prdTransformer";
import AllLoading from "@/layout/Loader";
import AgencyUploadPRDModal from "./agencyUpload";

interface AgencyDocumentsProps {
  projectId: string;
}

const AgencyDocuments: React.FC<AgencyDocumentsProps> = ({ projectId }) => {
  const { prds, isLoading, error, deletePRD, refetch } = usePRDs({ projectId });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    console.log("📄 AgencyDocuments - projectId:", projectId);
    console.log("📄 AgencyDocuments - prds:", prds);
    console.log("📄 AgencyDocuments - isLoading:", isLoading);
    console.log("📄 AgencyDocuments - error:", error);
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

  const handleDelete = async (prdId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    setDeletingId(prdId);
    try {
      await deletePRD(prdId);
    } catch (error) {
      console.error("Failed to delete PRD:", error);
      // Error handling could show a toast notification here
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpload = () => {
    console.log("Open upload modal");
    // TODO: Implement upload modal/functionality
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
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Documents</h2>
        </div>
        <div className={styles.emptyState}>
          <p style={{ color: "red" }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (prds.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Documents</h2>
          <button className={styles.uploadBtn} onClick={handleUpload}>
            <Plus size={18} />
            Upload document
          </button>
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
        <button
          className={styles.uploadBtn}
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Plus size={18} />
          Upload document
        </button>
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
              <button
                className={styles.delete}
                onClick={() => handleDelete(prd.id)}
                disabled={deletingId === prd.id}
                title="Delete document"
              >
                {deletingId === prd.id ? (
                  <span style={{ fontSize: "12px" }}>...</span>
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      <AgencyUploadPRDModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={refetch}
        projectId={projectId}
      />
    </div>
  );
};

export default AgencyDocuments;
