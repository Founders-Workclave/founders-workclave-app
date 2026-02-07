export interface Manager {
  managerID: string;
  id: string;
  manager: string;
}

export interface ManagersListResponse {
  message: string;
  managers: Manager[];
}

export interface ProductManager {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  joinedDate: string;
  status: string;
  avatar: string | null;
}

export interface Manager {
  managerID: string;
  id: string;
  managerName: string;
  email: string;
  phone: string;
  dateJoined: string;
  active: boolean;
}

export interface ManagersDashboardResponse {
  message: string;
  managers: Manager[];
}

export interface PMDetailResponse {
  message: string;
  managers: Manager[];
}

export interface ProductManager {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  joinedDate: string;
  status: string;
  avatar: string | null;
}
