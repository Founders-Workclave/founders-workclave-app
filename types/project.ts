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

export interface Milestone {
  id: string;
  title: string;
  price: string;
  paid: boolean;
  completed: boolean;
  order: number;
  description: string;
  dueDate: string;
  completedDate?: string | null;
  deliverables: string[]; // Changed from Array<{ task: string }>
  status: "completed" | "in-progress" | "pending";
  number: number;
  progress?: number;
  note?: string;
  payment: number;
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

export interface Project {
  id: string;
  founder: string;
  name: string;
  description: string;
  dateCreated: string;
  projectManager: string;
  dueDate: string | null;
  updatedDate: string;
  projectValue: string;
  paidBalance: string;
  status: string;
  progressPercentage: number;
  completed: boolean;
  totalMilestone: number;
  completedMilestone: number;
  projectFeatures: Array<{ feature: string }>;
  latestMilestone?: string | null;
}

export interface ApiProjectFeature {
  feature: string;
}

export interface ApiProject {
  id: string;
  founder?: string;
  name: string;
  description: string;
  dateCreated?: string;
  projectValue?: string;
  paidBalance?: string | null;
  status: string;
  progressPercentage: number;
  completed?: boolean;
  totalMilestone?: number;
  completedMilestone?: number;
  projectFeatures?: ApiProjectFeature[];
  created_at?: string;
  updated_at?: string;
  due_date?: string;
  latest_milestone?: string | null;
  problem_statement?: string;
  key_features?: string[];
  product_manager?: ProductManager;
}

export interface ProductManager {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}
