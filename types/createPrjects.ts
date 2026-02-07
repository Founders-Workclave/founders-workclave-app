export interface Client {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface ProjectManager {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface Deliverable {
  id: string;
  task: string;
}

export interface MilestoneFormData {
  id: string;
  number: number;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
  deliverables: Deliverable[];
}

export interface ProjectFormData {
  // Step 1: Client Selection
  clientId: string;

  // Step 2: Project Details
  projectName: string;
  problemStatement: string;
  expectedTimeline: string;
  coreFeatures: string[];
  prdFile: File | null;

  // Step 3: Milestones & Payments
  milestones: MilestoneFormData[];

  // Step 4: Team Assignment
  productManagerId: string;
}

export type CreateProjectStep = 1 | 2 | 3 | 4;

export interface CreateProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  mode?: "create" | "edit";
  projectId?: string;
  initialData?: ProjectFormData;
}

export interface ProjectFormData {
  clientId: string;
  projectName: string;
  problemStatement: string;
  expectedTimeline: string;
  coreFeatures: string[];
  featureIds?: Array<{ id: string; name: string }>;
  prdFile: File | null;
  milestones: MilestoneFormData[];
  productManagerId: string;
}

export interface CreateProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  mode?: "create" | "edit";
  projectId?: string;
  initialData?: ProjectFormData;
  initialStep?: CreateProjectStep; // NEW: Add this line
}
