import type {
  ApiProjectDetail,
  ProjectDetail,
} from "@/types/agencyProjectsNew";

const getInitials = (name: string | null): string => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

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

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Not set";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getLastDocumentUploadText = (documentCount: number): string => {
  if (documentCount === 0) return "No documents";
  if (documentCount === 1) return "1 document uploaded";
  return `${documentCount} documents uploaded`;
};

const parseFeatureName = (feature: unknown): string => {
  if (typeof feature === "string") {
    const trimmed = feature.trim();

    // Handle stringified empty array or empty-looking values
    if (trimmed === "[]" || trimmed === "" || trimmed === "null") {
      return "";
    }

    // Handle stringified array with values e.g. '["feature1"]'
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed) as unknown[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return String(parsed[0]);
        }
        return "";
      } catch {
        return trimmed;
      }
    }

    // Handle stringified Python dict e.g. "{'feature': 'something'}"
    if (trimmed.startsWith("{")) {
      try {
        const json = trimmed.replace(/'/g, '"').replace(/(\w+)\s*:/g, '"$1":');
        const parsed = JSON.parse(json) as { feature?: string };
        return parsed.feature || trimmed;
      } catch {
        return trimmed;
      }
    }

    return trimmed;
  }

  if (feature !== null && typeof feature === "object") {
    const obj = feature as Record<string, unknown>;
    if (typeof obj.feature === "string" && obj.feature.trim() !== "") {
      return obj.feature.trim();
    }
    if (typeof obj.name === "string" && obj.name.trim() !== "") {
      return obj.name.trim();
    }
  }

  return String(feature ?? "");
};

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
    status: apiProject.status,
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
      milestones: [],
    },
    problemStatement: apiProject.description,
    keyFeatures: (apiProject.projectFeatures ?? [])
      .map((f, index) => ({
        id: f.id != null ? String(f.id) : `feature-${index}`,
        name: parseFeatureName(f.feature as unknown),
      }))
      .filter((f) => f.name !== ""),
  };
};
