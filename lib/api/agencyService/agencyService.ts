// api/services/agencyService.ts
import { apiClient } from "../client";
import type {
  AgencyDashboardResponse,
  ProjectListResponse,
} from "@/types/agencyProjectsNew";
import type {
  MilestonesResponse,
  UpdateMilestonePayload,
} from "@/types/agencyMilestone";
import type { PRDsResponse, UploadPRDPayload } from "@/types/agencyPrd";
import type { ProjectDetailResponse } from "@/types/agencyProjectsNew";

export const agencyService = {
  async getDashboard(): Promise<AgencyDashboardResponse> {
    return apiClient.get("/agency/");
  },

  async getProjects(
    page: number = 1,
    limit: number = 10
  ): Promise<ProjectListResponse> {
    return apiClient.get("/agency/projects/", { params: { page, limit } });
  },

  /**
   * 🚨 Backend requires TRAILING SLASH
   */
  async getProjectById(projectId: string): Promise<ProjectDetailResponse> {
    const id = projectId.trim();
    console.log("📋 Fetching project:", id);
    return apiClient.get(`/agency/project/${id}/`);
  },

  async getProjectMilestones(projectId: string): Promise<MilestonesResponse> {
    const id = projectId.trim();
    console.log("📋 Fetching milestones for project:", id);
    return apiClient.get(`/agency/project/${id}/milestones/`);
  },

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

  async getProjectPRDs(projectId: string): Promise<PRDsResponse> {
    const id = projectId.trim();
    console.log("📋 Fetching PRDs for project:", id);
    return apiClient.get(`/agency/project/${id}/prds/`);
  },

  async uploadPRD(
    projectId: string,
    payload: UploadPRDPayload
  ): Promise<PRDsResponse> {
    const id = projectId.trim();
    console.log("📤 Uploading PRD for project:", id);
    return apiClient.post(`/agency/project/${id}/prds/`, payload);
  },

  async deletePRD(
    projectId: string,
    prdId: number
  ): Promise<{ message: string }> {
    const id = projectId.trim();
    console.log("🗑️ Deleting PRD:", prdId, "for project:", id);
    return apiClient.delete(`/agency/project/${id}/prds/${prdId}/`);
  },

  async searchProjects(query: string): Promise<unknown> {
    return apiClient.get("/agency/projects/search/", { params: { q: query } });
  },
};
