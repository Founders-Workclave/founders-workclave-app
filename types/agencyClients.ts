// lib/types/client.ts
export interface ApiClient {
  clientID: string;
  id: string;
  clientName: string;
  email: string;
  phone: string;
  dateJoined: string;
  active: boolean;
}

export interface ClientsListResponse {
  message: string;
  clients: ApiClient[];
}

export interface Client {
  id: string;
  clientID: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  joinedDate: string;
  status: string;
  avatar: string | null;
}

export interface ClientListResponse {
  clients: Client[];
  totalPages: number;
  currentPage: number;
  totalClients: number;
  perPage: number;
}

// New project types
export interface ApiProject {
  id: string;
  name: string;
  description: string;
  progressPercentage: number;
  status: "ongoing" | "completed";
  latest_milestone: string;
}

export interface ClientProjectsResponse {
  message: string;
  client: ApiClient;
  projects: ApiProject[];
}

export interface ClientProject {
  id: string;
  projectName: string;
  description: string;
  status: "in-progress" | "completed";
  progress: number;
  latestMilestone: string;
}
