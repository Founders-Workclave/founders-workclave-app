export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency: string;
  joinedDate: string;
  role: "Founder" | "Agency";
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
  projects: Array<{
    id: string | number;
    title: string;
    stage: string;
    progress: number;
    status: "In-Progress" | "Completed" | "Pending";
  }>;
  prds: Array<{
    id: string;
    title: string;
    projectId: string;
    projectName: string;
    createdDate: string;
    lastModified: string;
    status: "Draft" | "Review" | "Approved" | "Published";
  }>;
}
