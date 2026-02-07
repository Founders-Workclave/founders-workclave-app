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
  number?: number;
  status?: string;
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
  status?: string;
  progress?: number;
  completedDate?: string;
}
