"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import { X } from "lucide-react";

interface ManagerUploadPRDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
}

const ManagerUploadPRDModal: React.FC<ManagerUploadPRDModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      const possibleKeys = [
        "authToken",
        "token",
        "access_token",
        "accessToken",
        "auth_token",
        "jwt",
        "jwtToken",
      ];

      for (const key of possibleKeys) {
        const token = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (token) return token;
      }
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("description", description);

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = `${BASE_URL}/manager/project/${projectId}/add-prd/`;

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to upload PRD");
      }

      const data = await response.json();
      console.log("✅ PRD uploaded:", data);

      // Reset form
      setFile(null);
      setDescription("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload PRD");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setDescription("");
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Upload Document</h2>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            disabled={isUploading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            {/* File input */}
            <div className={styles.field}>
              <label>Document</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={isUploading}
                className={styles.fileInput}
              />
              {file && <p className={styles.fileName}>{file.name}</p>}
            </div>

            {/* Description input */}
            <div className={styles.field}>
              <label>Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this document"
                rows={3}
                disabled={isUploading}
                className={styles.textarea}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className={styles.submitBtn}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerUploadPRDModal;
