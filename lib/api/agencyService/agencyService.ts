import { apiClient } from "../client";
import type {
  AgencyDashboardResponse,
  ProjectListResponse,
  ProjectDetailResponse,
} from "@/types/agencyProjectsNew";
import type {
  MilestonesResponse,
  UpdateMilestonePayload,
} from "@/types/agencyMilestone";
import type {
  PRDsResponse,
  UploadPRDPayload,
  AllPRDsResponse,
} from "@/types/agencyPrd";
import type { ProjectPaymentsResponse } from "@/types/agencyPayments";
import type { CreateProjectRequest } from "@/types/projectApi";

export const agencyService = {
  /**
   * Fetches the agency dashboard data
   */
  async getDashboard(): Promise<AgencyDashboardResponse> {
    return apiClient.get("/agency/");
  },

  /**
   * Fetches paginated list of projects
   */
  async getProjects(
    page: number = 1,
    limit: number = 10
  ): Promise<ProjectListResponse> {
    return apiClient.get("/agency/projects/", { params: { page, limit } });
  },

  /**
   * Fetches a single project by ID
   * 🚨 Backend requires TRAILING SLASH
   */
  async getProjectById(projectId: string): Promise<ProjectDetailResponse> {
    const id = projectId.trim();
    console.log("📋 Fetching project:", id);
    return apiClient.get(`/agency/project/${id}/`);
  },

  /**
   * Updates/edits an existing project
   * 🚨 Backend requires TRAILING SLASH
   */
  async updateProject(
    projectId: string,
    payload: CreateProjectRequest,
    prdFile?: File
  ): Promise<{ message: string; projectId: string }> {
    const id = projectId.trim();
    console.log("✏️ Updating project:", id);

    // If there's a PRD file, send as FormData (same as create)
    if (prdFile) {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      formData.append("document", prdFile);

      return apiClient.patch(`/agency/project/${id}/edit/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    // Otherwise, send as JSON
    return apiClient.patch(`/agency/project/${id}/edit/`, payload);
  },

  /**
   * Fetches milestones for a specific project
   */
  async getProjectMilestones(projectId: string): Promise<MilestonesResponse> {
    const id = projectId.trim();
    console.log("📋 Fetching milestones for project:", id);
    return apiClient.get(`/agency/project/${id}/milestones/`);
  },

  /**
   * Updates a specific milestone
   */
  async updateMilestone(
    projectId: string,
    milestoneId: string,
    payload: UpdateMilestonePayload
  ): Promise<MilestonesResponse> {
    const projId = projectId.trim();
    const milId = milestoneId.trim();
    console.log("📝 Updating milestone:", milId, "for project:", projId);
    return apiClient.patch(
      `/agency/project/${projId}/milestones/${milId}/`,
      payload
    );
  },

  /**
   * Fetches PRDs for a specific project
   */
  async getProjectPRDs(projectId: string): Promise<PRDsResponse> {
    const id = projectId.trim();
    console.log("📋 Fetching PRDs for project:", id);
    return apiClient.get(`/agency/project/${id}/prds/`);
  },

  /**
   * Uploads a PRD for a specific project
   */
  async uploadPRD(
    projectId: string,
    payload: UploadPRDPayload
  ): Promise<PRDsResponse> {
    const id = projectId.trim();
    console.log("📤 Uploading PRD for project:", id);
    return apiClient.post(`/agency/project/${id}/prds/`, payload);
  },

  /**
   * Deletes a PRD from a specific project
   */
  async deletePRD(
    projectId: string,
    prdId: number
  ): Promise<{ message: string }> {
    const id = projectId.trim();
    console.log("🗑️ Deleting PRD:", prdId, "for project:", id);
    return apiClient.delete(`/agency/project/${id}/prds/${prdId}/`);
  },

  /**
   * Searches projects by query string
   */
  async searchProjects(query: string): Promise<unknown> {
    return apiClient.get("/agency/projects/search/", { params: { q: query } });
  },

  /**
   * Fetches all PRDs across all projects
   */
  async getAllPRDs(): Promise<AllPRDsResponse> {
    console.log("📋 Fetching all PRDs");
    return apiClient.get("/agency/prds/");
  },

  /**
   * Fetches payment history for a specific project
   */
  async getProjectPayments(
    projectId: string
  ): Promise<ProjectPaymentsResponse> {
    const id = projectId.trim();
    console.log("💰 Fetching payment history for project:", id);
    return apiClient.get(`/agency/project/${id}/payments/`);
  },
};
