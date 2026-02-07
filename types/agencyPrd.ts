export interface PRD {
  id: number;
  description: string | null;
  documentUrl: string;
  uploadedAt: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  formattedDate?: string;
}

export interface PRDsResponse {
  message: string;
  prds: PRD[];
}

export interface UploadPRDPayload {
  description?: string;
  documentUrl: string;
}

export interface AllPRDsResponse {
  message: string;
  prds: never;
}
