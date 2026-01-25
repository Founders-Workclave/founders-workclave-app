// utils/projectTransformers.ts
import type {
  ApiProjectDetail,
  ProjectDetail,
} from "@/types/agencyProjectsNew";

/**
 * Get initials from full name
 */
const getInitials = (name: string | null): string => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

/**
 * Calculate how long ago a date was
 */
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 30) return `${diffInDays} days ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return "1 month ago";
  if (diffInMonths < 12) return `${diffInMonths} months ago`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
};

/**
 * Format date to readable string
 */
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Not set";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Map API status to UI status
 */
const mapStatus = (status: string): ProjectDetail["status"] => {
  const statusMap: Record<string, ProjectDetail["status"]> = {
    ongoing: "In-Progress",
    completed: "Completed",
    "on-hold": "On-Hold",
    pending: "Pending",
  };
  return statusMap[status] || "Pending";
};

/**
 * Get last document upload text
 */
const getLastDocumentUploadText = (documentCount: number): string => {
  if (documentCount === 0) return "No documents";
  if (documentCount === 1) return "1 document uploaded";
  return `${documentCount} documents uploaded`;
};

/**
 * Transform API project detail to UI project detail
 */
export const transformProjectDetail = (
  apiProject: ApiProjectDetail
): ProjectDetail => {
  const totalValue = parseFloat(apiProject.projectValue);
  const paidBalance = parseFloat(apiProject.paidBalance);
  const documentCount = apiProject.documents || 0;

  return {
    id: apiProject.id,
    projectName: apiProject.name,
    description: apiProject.description,
    status: mapStatus(apiProject.status),
    client: {
      id: apiProject.client,
      name: apiProject.clientName,
      initials: getInitials(apiProject.clientName),
    },
    productManager:
      apiProject.manager && apiProject.managerName
        ? {
            id: apiProject.manager,
            name: apiProject.managerName,
            initials: getInitials(apiProject.managerName),
          }
        : null,
    timeline: apiProject.timeline,
    dueDate: formatDate(apiProject.dueDate),
    startedAgo: getTimeAgo(apiProject.dateCreated),
    lastUpdated: getTimeAgo(apiProject.updatedDate || apiProject.dateCreated),
    totalBudget: totalValue,
    budgetPaid: paidBalance,
    documents: documentCount,
    lastDocumentUpload: getLastDocumentUploadText(documentCount),
    projectProgress: {
      overallCompletion: apiProject.progressPercentage,
      milestones: [], // Will be populated from milestones endpoint
    },
    problemStatement: apiProject.description,
    keyFeatures: apiProject.projectFeatures.map((f, index) => ({
      id: `feature-${index}`,
      name: f.feature,
    })),
  };
};
