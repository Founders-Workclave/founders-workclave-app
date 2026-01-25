// types/agencyProjects.ts

export interface AgencyDashboardResponse {
  message: string;
  activeProject: number;
  totalClients: number;
  monthRevenue: number;
  totalPRDS: number;
  projects: ApiProject[];
}

export interface ApiProject {
  id: string;
  name: string;
  client: string;
  projectValue: string;
  paidBalance: string;
  progress: string; // "0/2" format
  status: "ongoing" | "completed" | "on-hold" | "pending";
}

// Transformed types for UI components
export interface Project {
  id: string;
  projectName: string;
  client: {
    id: string;
    name: string;
  };
  totalProjectValue: number;
  amountPaid: number;
  percentPaid: number;
  progress: {
    current: number;
    total: number;
  };
  status: "Completed" | "In-Progress" | "On-Hold" | "Pending";
}

export interface ProjectListResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
  totalProjects: number;
}

export interface DashboardStats {
  id: number;
  label: string;
  value: string | number;
  icon: string;
  bgColor: string;
}
export interface ProjectFeature {
  feature: string;
}

export interface ApiProjectDetail {
  id: string;
  agency: string;
  agencyName: string;
  name: string;
  description: string;
  manager: string;
  managerName: string;
  client: string;
  clientName: string;
  dateCreated: string;
  timeline: string;
  dueDate: string | null;
  updatedDate: string | null;
  projectValue: string;
  paidBalance: string;
  status: string;
  progressPercentage: number;
  completed: boolean;
  totalMilestone: number;
  completedMilestone: number;
  documents: number;
  projectFeatures: ProjectFeature[];
}

export interface ProjectDetailResponse {
  message: string;
  project: ApiProjectDetail;
}

export interface ProjectDetail {
  id: string;
  projectName: string;
  description: string;
  status: "Completed" | "In-Progress" | "On-Hold" | "Pending";
  client: {
    id: string;
    name: string;
    initials: string;
  };
  productManager: {
    id: string;
    name: string;
    initials: string;
  } | null;
  timeline: string;
  dueDate: string;
  startedAgo: string;
  lastUpdated: string;
  totalBudget: number;
  budgetPaid: number;
  documents: number;
  lastDocumentUpload: string;
  projectProgress: {
    overallCompletion: number;
    milestones: Array<{
      id: string;
      name: string;
      status: "completed" | "in-progress" | "pending";
    }>;
  };
  problemStatement: string;
  keyFeatures: Array<{
    id: string;
    name: string;
  }>;
}

export interface Milestone {
  id: string | number;
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
  price: string;
  paid: boolean;
  completed: boolean;
  order: number;
}
