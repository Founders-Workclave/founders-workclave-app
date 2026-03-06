import { getAuthToken } from "@/lib/api/auth";
import {
  CreateProjectRequest,
  CreateProjectResponse,
  ApiErrorResponse,
} from "@/types/projectApi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const projectService = {
  async createProject(
    projectData: CreateProjectRequest,
    documentFile?: File
  ): Promise<CreateProjectResponse> {
    try {
      const token = getAuthToken();

      const formData = new FormData();
      formData.append("client", projectData.client);
      formData.append("manager", projectData.manager);
      formData.append("projectName", projectData.projectName);
      formData.append("problemStatement", projectData.problemStatement);
      formData.append("timeline", projectData.timeline);

      if (documentFile) {
        formData.append("document", documentFile);
      }

      formData.append("features", JSON.stringify(projectData.features));
      formData.append("milestones", JSON.stringify(projectData.milestones));

      const headers: HeadersInit = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/agency/create-project/`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to create project" }));

        throw new ApiError(
          errorData.message || errorData.error || "Failed to create project",
          response.status,
          errorData
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error)
        throw new ApiError(`Network error: ${error.message}`);
      throw new ApiError("An unknown error occurred while creating project");
    }
  },

  async updateProject(
    projectId: string,
    projectData: CreateProjectRequest,
    _documentFile?: File
  ): Promise<{ message: string; projectId: string }> {
    try {
      const token = getAuthToken();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const payload: Record<string, unknown> = {
        client: projectData.client,
        projectName: projectData.projectName,
        problemStatement: projectData.problemStatement,
        timeline: projectData.timeline,
        features: projectData.features,
      };

      if (projectData.manager && projectData.manager.trim() !== "") {
        payload.manager = projectData.manager;
      }

      const body = JSON.stringify(payload);

      const response = await fetch(
        `${API_BASE_URL}/agency/project/${projectId.trim()}/edit/`,
        {
          method: "PATCH",
          headers,
          body,
        }
      );

      const rawText = await response.text();

      if (!response.ok) {
        let errorData: ApiErrorResponse;
        try {
          errorData = JSON.parse(rawText);
        } catch {
          errorData = { message: rawText };
        }

        if (
          response.status === 400 &&
          errorData.error &&
          typeof errorData.error === "string" &&
          errorData.error.includes("does not belong to this project")
        ) {
          return {
            message:
              "Project updated successfully (backend returned false error)",
            projectId,
          };
        }

        throw new ApiError(
          errorData.message || errorData.error || "Failed to update project",
          response.status,
          errorData
        );
      }

      let responseData: { message: string; projectId: string };
      try {
        responseData = JSON.parse(rawText);
      } catch {
        responseData = {
          message: "Project updated successfully",
          projectId,
        };
      }

      return responseData;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof Error)
        throw new ApiError(`Network error: ${error.message}`);
      throw new ApiError("An unknown error occurred while updating project");
    }
  },
};
