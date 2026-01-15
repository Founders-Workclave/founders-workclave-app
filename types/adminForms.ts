export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Alert Component Types
 */
export interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose?: () => void;
}

/**
 * Form Data Types
 */
export interface ProjectFormData {
  name: string;
  description: string;
  projectValue: string;
  code: string;
}

export interface MilestoneFormData {
  title: string;
  description: string;
  price: string;
  dueDate: string;
}

export interface DeliverableFormData {
  tasks: string[];
}

export interface FeatureFormData {
  features: string[];
}

export interface PRDFormData {
  document: string;
  description: string;
}

/**
 * Component Props Types
 */
export interface CreateProjectFormProps {
  onSuccess?: (data: ProjectCreationResponse) => void;
}

export interface CreateMilestoneFormProps {
  projectId: string | null;
  onSuccess?: (data: MilestoneCreationResponse) => void;
}

export interface CreateDeliverableFormProps {
  milestoneId: string | null;
  onSuccess?: (data: DeliverableCreationResponse) => void;
}

export interface CreateFeatureFormProps {
  projectId: string | null;
  onSuccess?: (data: FeatureCreationResponse) => void;
}

export interface AddPRDFormProps {
  projectId: string | null;
  onSuccess?: (data: PRDCreationResponse) => void;
}

export interface ProjectCreationResponse {
  id: string;
  name: string;
  description: string;
  projectValue?: number;
  project_value?: number;
  code: string;
}

export interface MilestoneCreationResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  dueDate: string;
}

export interface DeliverableCreationResponse {
  id: string;
  tasks: string[];
}

export interface FeatureCreationResponse {
  id: string;
  features: string[];
}

export interface PRDCreationResponse {
  id: string;
  document: string;
  description: string;
}
