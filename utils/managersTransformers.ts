import {
  ManagerProject,
  TransformedManagerProject,
  ManagerProjectDetails,
} from "@/types/managersDashbord";

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

const parseProgress = (
  progressStr: string
): { current: number; total: number } => {
  const [current, total] = progressStr.split("/").map(Number);
  return { current: current || 0, total: total || 0 };
};

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

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "Not set";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const parseFeatureName = (feature: string): string => {
  if (typeof feature === "string" && feature.trim().startsWith("{")) {
    try {
      const json = feature.replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
      const parsed = JSON.parse(json) as { feature?: string };
      return parsed.feature || feature;
    } catch {
      return feature;
    }
  }
  return feature;
};

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

export const transformManagerProjects = (
  projects: ManagerProject[]
): TransformedManagerProject[] => {
  return projects.map(transformManagerProject);
};

export const transformManagerProjectDetails = (
  data: Record<string, unknown>
): ManagerProjectDetails => {
  const project = data.project as Record<string, unknown>;
  const nextMilestone = data.nextMilestone as Record<string, unknown> | null;

  const features = (
    (project.projectFeatures as { id: number; feature: string }[]) || []
  )
    .map((f) => ({
      id: String(f.id),
      name: parseFeatureName(f.feature),
    }))
    .filter((f) => Boolean(f.name));

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
      id: (project.client as string) || "",
      name: (project.clientName as string) || "",
      initials: getInitials((project.clientName as string) || ""),
    },
    productManager: project.managerName
      ? {
          id: (project.manager as string) || "",
          name: project.managerName as string,
          initials: getInitials(project.managerName as string),
        }
      : undefined,
  };
};
