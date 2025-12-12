export interface ProjectDetailsTypes {
  id: number;
  title: string;
  status: string;
  createdOn: string;
  lastUpdated: string;
  dueDate: string;
  progress: {
    overall: number;
    milestonesCompleted: number;
    totalMilestones: number;
    daysLeftUntilDeadline: number;
    documentTotal: number;
  };
  nextMilestone: {
    title: string;
    icon: string;
    description: string;
    dueDate: string;
    payment: number;
    deliverables: string[];
  };
  walletBalance: number;
  onViewDetails: () => void;

  problemStatement: string;
  keyFeatures: string[];
  productManager: {
    name: string;
    initials: string;
    avatar: string | null;
  };
}

// types/project.ts

export interface Milestone {
  id: number;
  number: number;
  title: string;
  description: string;
  dueDate: string;
  completedDate: string | null;
  payment: number;
  status: "completed" | "in-progress" | "pending";
  progress: number;
  deliverables: string[];
  note?: string;
}

export interface ProjectMilestoneData {
  projectId: number;
  projectTitle: string;
  walletBalance: number;
  milestones: Milestone[];
}

// For Payment Modal
export interface PaymentMilestoneData {
  title: string;
  description: string;
  dueDate: string;
  amount: number;
  deliverables: string[];
}
