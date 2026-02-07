export interface PRD {
  document: string;
  project: string;
  client: string;
  status: string;
}

export interface AllPRDsResponse {
  message: string;
  prds: PRD[];
}
