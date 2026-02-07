import type { Milestone } from "@/types/agencyMilestone";

interface ApiMilestone {
  id: string;
  title: string;
  description: string;
  price: string;
  dueDate: string;
  paid: boolean;
  completed: boolean;
  order: number;
  deliverables: Array<{ task: string }>;
  completedDate?: string;
  progress?: number;
  note?: string;
  status?: string; // Add status from API if it exists
}

/**
 * Determines milestone status based on completion state and progress
 * Only used as fallback if API doesn't provide status
 */
const getMilestoneStatus = (completed: boolean, progress?: number): string => {
  if (completed) return "completed";
  if (progress !== undefined && progress > 0) return "in-progress";
  return "pending";
};

/**
 * Transforms a single milestone from API format to application format
 */
export const transformMilestone = (
  apiMilestone: ApiMilestone,
  index?: number
): Milestone => {
  // Use API status if available, otherwise determine from completion/progress
  const status =
    apiMilestone.status ||
    getMilestoneStatus(apiMilestone.completed, apiMilestone.progress);

  return {
    id: apiMilestone.id,
    title: apiMilestone.title,
    description: apiMilestone.description,
    price: apiMilestone.price,
    dueDate: apiMilestone.dueDate,
    paid: apiMilestone.paid,
    completed: apiMilestone.completed,
    order: apiMilestone.order,
    number: index !== undefined ? index + 1 : apiMilestone.order,
    deliverables: apiMilestone.deliverables.map((d) => ({ task: d.task })),
    status, // Pass through raw status
    completedDate: apiMilestone.completedDate,
    progress: apiMilestone.progress,
    note: apiMilestone.note,
  };
};

/**
 * Transforms an array of milestones from API format
 */
export const transformMilestones = (
  apiMilestones: ApiMilestone[]
): Milestone[] => {
  return apiMilestones
    .sort((a, b) => a.order - b.order)
    .map((milestone, index) => transformMilestone(milestone, index));
};
