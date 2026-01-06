export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectsCount: number;
  joinedDate: string;
  status: "Active" | "Inactive";
}

export interface ProductManager {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  projectsCount: number;
  joinedDate: string;
  status: "Active" | "Inactive";
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  stage: string;
  progress: number;
  status: string;
  client?: string;
  pm?: string;
}

export interface PRD {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  description: string;
  createdDate: string;
  lastModified: string;
  duration: string;
  status: string;
  prdUrl: string;
}

export type UserRole = "Agency" | "Founder";
export type UserStatus = "Active" | "Inactive" | "Suspended";
export type UserPlan = "Starter" | "Professional" | "Enterprise";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency: string;
  joinedDate: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  projectsCount?: number;
  projects?: Project[];
  prds?: PRD[];
}

export interface Founder extends BaseUser {
  role: "Founder";
}

export interface Agency extends BaseUser {
  role: "Agency";
  plan: UserPlan;
  clients?: Client[];
  productManagers?: ProductManager[];
  pms: number;
  mrr: number;
}

export type User = Founder | Agency;

export interface UserData {
  users: User[];
}
