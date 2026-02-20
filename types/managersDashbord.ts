export interface ManagerProject {
  id: string;
  name: string;
  client: string;
  projectValue: string;
  paidBalance: string;
  progress: string;
  status: "in-progress" | "completed" | "paused" | "terminated" | "pending";
  paymentPercentage: number;
}

export interface ManagerDashboardResponse {
  message: string;
  activeProject: number;
  projects: ManagerProject[];
}

export interface ManagerStats {
  activeProjects: number;
}

// Transformed types for UI consumption
export interface TransformedManagerProject {
  id: string;
  projectName: string;
  client: {
    id: string;
    name: string;
    initials: string;
  };
  totalProjectValue: number;
  amountPaid: number;
  percentPaid: number;
  progress: {
    current: number;
    total: number;
  };
  status: string;
}

// Manager Project Details Types
export interface ManagerMilestone {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
}

export interface ManagerKeyFeature {
  id: string;
  name: string;
}

export interface ManagerProjectProgress {
  overallCompletion: number;
  milestones: ManagerMilestone[];
}

export interface ManagerProjectDetails {
  id: string;
  projectName: string;
  status: string;
  startedAgo: string;
  lastUpdated: string;
  dueDate: string;
  timeline: string;
  totalBudget: number;
  budgetPaid: number;
  documents: number;
  lastDocumentUpload: string;
  projectProgress: ManagerProjectProgress;
  problemStatement?: string;
  keyFeatures?: ManagerKeyFeature[];
  client: {
    id: string;
    name: string;
    initials: string;
  };
  productManager?: {
    id: string;
    name: string;
    initials: string;
  };
}
