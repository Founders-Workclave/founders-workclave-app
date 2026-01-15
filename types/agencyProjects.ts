export interface Client {
  name: string;
  initials: string;
  email: string;
}

export interface Progress {
  current: number;
  total: number;
}

export interface Milestone {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
}

export interface ProjectProgress {
  overallCompletion: number;
  milestones: Milestone[];
}

export interface KeyFeature {
  id: string;
  name: string;
}

export type ProjectStatus = "In-Progress" | "Completed" | "Pending" | "On-Hold";

export interface Project {
  id: string;
  projectName: string;
  client: Client;
  totalProjectValue: number;
  amountPaid: number;
  percentPaid: number;
  progress: Progress;
  status: ProjectStatus;
  createdDate: string;
  lastUpdated: string;
  dueDate: string;
  timeline: string;
  startedAgo: string;
  totalBudget: number;
  budgetPaid: number;
  documents: number;
  lastDocumentUpload: string;
  projectProgress: ProjectProgress;
  problemStatement: string;
  keyFeatures: KeyFeature[];
  productManager?: {
    name: string;
    initials: string;
    email: string;
  };
}

export interface ProjectListResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
  totalProjects: number;
}

export interface ActionMenuItem {
  id: string;
  label: string;
  icon: string;
  action: "add-service" | "pause" | "terminate";
  variant?: "default" | "danger";
}
