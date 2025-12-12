"use client";
import documentsData from "../../mocks/projectDocuments.json";
import styles from "./styles.module.css";
import DocumentCard from "./documentsCard";
import DocEmpty from "@/svgs/docEmpty";

interface PageProps {
  params: {
    userId: string;
    projectId: string;
  };
}

const DocumentsPage = ({}: PageProps) => {
  const handleViewDocument = (documentId: number) => {
    console.log("View document:", documentId);
    const doc = documentsData.documents.find((d) => d.id === documentId);
    if (doc) {
      window.open(doc.url, "_blank");
    }
  };

  const handleDownloadDocument = (documentId: number) => {
    console.log("Download document:", documentId);
    const doc = documentsData.documents.find((d) => d.id === documentId);
    if (doc) {
      const link = window.document.createElement("a");
      link.href = doc.url;
      link.download = `${doc.title}.${doc.type.toLowerCase()}`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Documents</h1>
        {/* <p className={styles.subtitle}>
          {documentsData.documents.length} document
          {documentsData.documents.length !== 1 ? "s" : ""} available
        </p> */}
      </div>

      <div className={styles.documentsList}>
        {documentsData.documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onView={handleViewDocument}
            onDownload={handleDownloadDocument}
          />
        ))}
      </div>

      {documentsData.documents.length === 0 && (
        <div className={styles.emptyState}>
          <DocEmpty />
          <p className={styles.emptyText}>No document uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
