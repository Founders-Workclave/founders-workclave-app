// Add this to your @/types/projectApi.ts or create a new file @/types/projectDetail.ts

export interface ProjectDetailClient {
  id: string;
  name: string;
  email?: string;
  initials: string;
  avatar?: string;
}

export interface ProjectDetailManager {
  id: string;
  name: string;
  email?: string;
  initials: string;
  avatar?: string;
}

export interface ProjectDetailMilestone {
  id: string;
  name: string;
  title?: string;
  description?: string;
  status: string;
  price?: number;
  amount?: number;
  dueDate?: string;
  deadline?: string;
  deliverables?: string[];
}

export interface ProjectDetailFeature {
  id: string;
  name: string;
}

export interface ProjectProgress {
  overallCompletion: number;
  milestones: ProjectDetailMilestone[];
}

export interface ProjectDetail {
  id: string;
  projectName: string;
  name?: string;
  status: string;
  problemStatement?: string;
  description?: string;
  timeline: string;
  expectedTimeline?: string;
  startedAgo: string;
  lastUpdated: string;
  dueDate: string;
  totalBudget: number;
  budgetPaid: number;
  documents: number;
  lastDocumentUpload: string;
  client: ProjectDetailClient;
  clientId?: string;
  productManager?: ProjectDetailManager;
  manager?: ProjectDetailManager;
  managerId?: string;
  productManagerId?: string;
  projectProgress: ProjectProgress;
  milestones?: ProjectDetailMilestone[];
  keyFeatures: ProjectDetailFeature[];
  features?: string[];
}
