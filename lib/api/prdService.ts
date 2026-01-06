import { getAuthHeaders } from "@/lib/utils/auth";

export interface PRD {
  id: number;
  description: string | null;
  documentUrl: string;
  uploadedAt: string;
  projectName?: string;
  projectId?: string;
}

interface PRDResponse {
  message: string;
  prds: PRD[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class PRDService {
  /**
   * Fetch all PRDs for a specific project
   * @param projectId - The project ID
   * @returns Promise with array of PRDs
   */
  static async getProjectPRDs(projectId: string): Promise<PRD[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/founder/project/${projectId}/prds/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch PRDs: ${response.statusText}`);
      }

      const data: PRDResponse = await response.json();
      return data.prds || [];
    } catch (error) {
      console.error("Error in getProjectPRDs:", error);
      throw error;
    }
  }

  /**
   * Fetch all PRDs for all user projects
   * @returns Promise with array of PRDs from all projects
   */
  static async getAllUserPRDs(): Promise<PRD[]> {
    try {
      // First, get all user projects
      const projectsResponse = await fetch(
        `${API_BASE_URL}/founder/projects/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          cache: "no-store",
        }
      );

      if (!projectsResponse.ok) {
        throw new Error("Failed to fetch projects");
      }

      const projectsData = await projectsResponse.json();
      const projects = projectsData.projects || [];

      // Fetch PRDs for each project
      const allPRDs: PRD[] = [];

      for (const project of projects) {
        try {
          const prds = await this.getProjectPRDs(project.id);
          // Add project info to each PRD
          const prdsWithProject = prds.map((prd) => ({
            ...prd,
            projectName: project.name,
            projectId: project.id,
          }));
          allPRDs.push(...prdsWithProject);
        } catch (error) {
          console.error(
            `Error fetching PRDs for project ${project.id}:`,
            error
          );
          // Continue with other projects even if one fails
        }
      }

      return allPRDs;
    } catch (error) {
      console.error("Error in getAllUserPRDs:", error);
      throw error;
    }
  }

  /**
   * Format date to readable format
   * @param dateStr - ISO date string
   * @returns Formatted date
   */
  static formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Get file name from Cloudinary URL
   * @param url - The Cloudinary URL
   * @returns Filename
   */
  static getFilenameFromUrl(url: string): string {
    try {
      const urlParts = url.split("/");
      const filenamePart = urlParts[urlParts.length - 1];
      const filename = filenamePart.split("_")[0];
      return filename || "PRD";
    } catch {
      return "PRD";
    }
  }

  /**
   * Download a PRD
   * @param url - The PRD URL
   * @param filename - The filename to save as
   */
  static downloadPRD(url: string, filename: string): void {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
