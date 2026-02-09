export interface FounderApiResponse {
  userId: string;
  founderID: string;
  agency: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateJoined: string;
  active: boolean;
}

export interface FoundersListResponse {
  message: string;
  founders: FounderApiResponse[];
}

export interface Founder {
  founderID: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  status: "Active" | "Inactive" | "Suspended";
  avatar?: string;
  projectsCount?: number;
  agency?: string;
  firstName?: string;
  lastName?: string;
}
