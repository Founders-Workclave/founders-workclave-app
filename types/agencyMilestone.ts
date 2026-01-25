// types/milestone.ts

export interface MilestoneDeliverable {
  task: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  price: string;
  dueDate: string;
  paid: boolean;
  completed: boolean;
  order: number;
  deliverables: MilestoneDeliverable[];
  // Optional fields that might be added locally or from API
  number?: number; // Display number for the milestone
  status?: "pending" | "in-progress" | "completed";
  completedDate?: string;
  progress?: number;
  note?: string;
}

export interface MilestonesResponse {
  message: string;
  project: string;
  milestones: Milestone[];
}

export interface UpdateMilestonePayload {
  title?: string;
  description?: string;
  price?: string;
  dueDate?: string;
  paid?: boolean;
  completed?: boolean;
  status?: "pending" | "in-progress" | "completed";
  progress?: number;
  completedDate?: string;
}

export interface MilestonesResponse {
  message: string;
  project: string;
  milestones: Milestone[];
}

export interface UpdateMilestonePayload {
  title?: string;
  description?: string;
  price?: string;
  dueDate?: string;
  paid?: boolean;
  completed?: boolean;
  status?: "pending" | "in-progress" | "completed";
  progress?: number;
  completedDate?: string;
}
