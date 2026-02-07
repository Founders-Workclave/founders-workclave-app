export interface CreateProjectRequest {
  client: string;
  projectName: string;
  problemStatement: string;
  timeline: string;
  features: Array<{ id: number; feature: string }>; // Backend expects {id, feature} format
  milestones: MilestoneRequest[];
  manager: string;
}

export interface MilestoneRequest {
  title: string;
  description: string;
  price: number;
  dueDate: string;
  deliverables: string[];
}

// API Response Types
export interface CreateProjectResponse {
  message: string;
  project: {
    id: string;
    projectName: string;
    client: string;
    manager: string;
    status: string;
    createdAt: string;
  };
}

export interface ClientsListResponse {
  message: string;
  clients: ClientListItem[];
}

export interface ClientListItem {
  clientID: string;
  id: string;
  client: string;
}

export interface ManagersListResponse {
  message: string;
  managers: ManagerListItem[];
}

export interface ManagerListItem {
  managerID: string;
  id: string;
  manager: string;
}

// Error Response Type
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: unknown;
}

export interface ApiMilestone {
  id: string;
  title: string;
  description: string;
  price: number;
  dueDate: string;
  deliverables: string[];
}

export interface ApiClient {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiManager {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiProjectResponse {
  id: string;
  client: ApiClient;
  manager: ApiManager;
  projectName: string;
  problemStatement: string;
  timeline: string;
  features: string[];
  milestones: ApiMilestone[];
  status?: string;
  createdAt?: string;
  documentLink?: string;
}
