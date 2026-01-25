import type { PRD } from "@/types/agencyPrd";

/**
 * Extracts file ID from Google Drive URL
 */
const extractFileIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

/**
 * Converts Google Drive view URL to direct download URL
 */
export const getGoogleDriveDownloadUrl = (url: string): string => {
  const fileId = extractFileIdFromUrl(url);
  if (!fileId) return url;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Converts Google Drive view URL to preview URL
 */
export const getGoogleDrivePreviewUrl = (url: string): string => {
  const fileId = extractFileIdFromUrl(url);
  if (!fileId) return url;
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

/**
 * Determines file type from URL or description
 */
const getFileType = (url: string, description: string | null): string => {
  // Check URL for file extension
  const urlLower = url.toLowerCase();
  if (urlLower.includes(".pdf") || urlLower.includes("pdf")) return "PDF";
  if (urlLower.includes(".doc")) return "DOC";
  if (urlLower.includes(".docx")) return "DOCX";

  // Check description
  if (description) {
    const descLower = description.toLowerCase();
    if (descLower.includes("pdf")) return "PDF";
    if (descLower.includes("word") || descLower.includes("doc")) return "DOC";
  }

  // Default for Google Drive documents
  return "PDF";
};

/**
 * Generates a display name for the PRD
 */
const getFileName = (description: string | null, index: number): string => {
  if (description) return description;
  return `Product Requirements Document ${index > 0 ? `(${index + 1})` : ""}`;
};

/**
 * Formats the uploaded date
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Transforms a single PRD from API format to application format
 */
export const transformPRD = (apiPRD: PRD, index: number): PRD => {
  return {
    ...apiPRD,
    fileName: getFileName(apiPRD.description, index),
    fileType: getFileType(apiPRD.documentUrl, apiPRD.description),
    fileSize: "Unknown", // Google Drive doesn't provide size in URL
    formattedDate: formatDate(apiPRD.uploadedAt),
  };
};

/**
 * Transforms an array of PRDs from API format
 */
export const transformPRDs = (apiPRDs: PRD[]): PRD[] => {
  return apiPRDs.map((prd, index) => transformPRD(prd, index));
};
