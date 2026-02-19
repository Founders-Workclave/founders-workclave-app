"use client";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import DocumentCard from "./documentsCard";
import DocEmpty from "@/svgs/docEmpty";
import { DocumentService, Document } from "@/lib/api/documentService";
import Loader from "../loader";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";

interface PageProps {
  params: {
    userId: string;
    projectId: string;
  };
}

const DocumentsPage = ({ params }: PageProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!params.projectId) {
        setError("Project ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await DocumentService.getDocuments(params.projectId);
        setDocuments(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load documents"
        );
        console.error("Error fetching documents:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [params.projectId]);

  const handleViewDocument = (documentId: number) => {
    const doc = documents.find((d) => d.id === documentId);
    if (doc) {
      window.open(doc.documentUrl, "_blank");
    }
  };

  const handleDownloadDocument = (documentId: number) => {
    const doc = documents.find((d) => d.id === documentId);
    if (doc) {
      const filename = DocumentService.getFilenameFromUrl(doc.documentUrl);
      const extension = DocumentService.getFileExtension(doc.documentUrl);
      DocumentService.downloadDocument(
        doc.documentUrl,
        `${filename}.${extension.toLowerCase()}`
      );
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loader type="pulse" loading={isLoading} size={15} color="#5865F2" />
        <p>Loading documents...</p>
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Documents</h1>
        {documents.length > 0 && (
          <p className={styles.subtitle}>
            {documents.length} document
            {documents.length !== 1 ? "s" : ""} available
          </p>
        )}
      </div>

      {documents.length > 0 ? (
        <div className={styles.documentsList}>
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={handleViewDocument}
              onDownload={handleDownloadDocument}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <DocEmpty />
          <p className={styles.emptyText}>No document uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
