import {
  ManagerProject,
  TransformedManagerProject,
  ManagerProjectDetails,
} from "@/types/managersDashbord";

/**
 * Generate initials from a name
 */
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

/**
 * Parse progress string (e.g., "1/4" or "2/4") into object
 */
const parseProgress = (
  progressStr: string
): { current: number; total: number } => {
  const [current, total] = progressStr.split("/").map(Number);
  return {
    current: current || 0,
    total: total || 0,
  };
};

/**
 * Parses the stringified feature object from the API
 * e.g. "{'id': 1, 'feature': 'Inventory Management'}" → { id: "1", name: "Inventory Management" }
 */
const parseFeature = (
  featureStr: string
): { id: string; name: string } | null => {
  try {
    const json = featureStr.replace(/'/g, '"');
    const parsed = JSON.parse(json);
    return {
      id: String(parsed.id),
      name: parsed.feature as string,
    };
  } catch {
    return null;
  }
};

/**
 * Formats a date string into a human-readable "time ago" string
 */
const formatTimeAgo = (dateStr: string | null): string => {
  if (!dateStr) return "Unknown";
  const seconds = Math.floor(
    (new Date().getTime() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

/**
 * Formats a date string into a readable date (e.g. "Feb 5, 2026")
 */
const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "Not set";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Transform manager API project to UI project format
 */
export const transformManagerProject = (
  project: ManagerProject
): TransformedManagerProject => {
  const totalValue = parseFloat(project.projectValue);
  const paidValue = parseFloat(project.paidBalance);

  return {
    id: project.id,
    projectName: project.name,
    client: {
      id: project.client,
      name: project.client,
      initials: getInitials(project.client),
    },
    totalProjectValue: totalValue,
    amountPaid: paidValue,
    percentPaid: project.paymentPercentage,
    progress: parseProgress(project.progress),
    status: project.status,
  };
};

/**
 * Transform array of manager projects
 */
export const transformManagerProjects = (
  projects: ManagerProject[]
): TransformedManagerProject[] => {
  return projects.map(transformManagerProject);
};

/**
 * Transform manager API project details response to typed format
 * Matches the actual API response:
 * { message, project: { ... }, nextMilestone: { ... } }
 */
export const transformManagerProjectDetails = (
  data: Record<string, unknown>
): ManagerProjectDetails => {
  const project = data.project as Record<string, unknown>;
  const nextMilestone = data.nextMilestone as Record<string, unknown> | null;

  // Parse projectFeatures, filtering out any that fail to parse
  const features = (
    (project.projectFeatures as { id: number; feature: string }[]) || []
  )
    .map((f) => parseFeature(f.feature))
    .filter((f): f is { id: string; name: string } => f !== null);

  // Build milestones array from nextMilestone
  const milestones = nextMilestone
    ? [
        {
          id: nextMilestone.id as string,
          name: nextMilestone.title as string,
          status: (nextMilestone.completed ? "completed" : "in-progress") as
            | "completed"
            | "in-progress"
            | "pending",
        },
      ]
    : [];

  return {
    id: project.id as string,
    projectName: (project.name as string) || "",
    status: (project.status as string) || "",
    startedAgo: formatTimeAgo(project.dateCreated as string | null),
    lastUpdated: formatTimeAgo(project.updatedDate as string | null),
    dueDate: formatDate(project.dueDate as string | null),
    timeline: (project.timeline as string) || "",
    totalBudget: parseFloat((project.projectValue as string) || "0"),
    budgetPaid: parseFloat((project.paidBalance as string) || "0"),
    documents: (project.documents as number) || 0,
    lastDocumentUpload: "No uploads yet",
    projectProgress: {
      overallCompletion: (project.progressPercentage as number) || 0,
      milestones,
    },
    problemStatement: (project.description as string) || undefined,
    keyFeatures: features.length > 0 ? features : undefined,
    client: {
      name: (project.clientName as string) || "",
      initials: getInitials((project.clientName as string) || ""),
    },
    productManager: project.managerName
      ? {
          name: project.managerName as string,
          initials: getInitials(project.managerName as string),
        }
      : undefined,
  };
};
