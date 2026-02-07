export interface RegisterClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterClientResponse {
  message: string;
  client?: {
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
