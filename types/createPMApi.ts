export interface RegisterPMRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterPMResponse {
  message: string;
  pm?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt?: string;
  };
}

export interface ApiErrorResponse {
  message: string;
  error?: string | Record<string, unknown>;
  detail?: string;
}
