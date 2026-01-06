import { Milestone } from "@/types/project";
import { getAuthHeaders } from "@/lib/utils/auth";

interface MilestoneResponse {
  message: string;
  project: string;
  milestones: Milestone[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class MilestoneService {
  /**
   * Fetch milestones for a specific project
   * @param projectId - The project ID
   * @returns Promise with array of milestones
   */
  static async getMilestones(projectId: string): Promise<Milestone[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/founder/project/${projectId}/milestones/`,
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
        throw new Error(`Failed to fetch milestones: ${response.statusText}`);
      }

      const data: MilestoneResponse = await response.json();
      return data.milestones;
    } catch (error) {
      console.error("Error in getMilestones:", error);
      throw error;
    }
  }

  /**
   * Get a single milestone by ID
   * @param projectId - The project ID
   * @param milestoneId - The milestone ID
   * @returns Promise with milestone data
   */
  static async getMilestoneById(
    projectId: string,
    milestoneId: string | number
  ): Promise<Milestone> {
    try {
      const milestones = await this.getMilestones(projectId);
      const milestone = milestones.find(
        (m) => m.id.toString() === milestoneId.toString()
      );

      if (!milestone) {
        throw new Error(`Milestone ${milestoneId} not found`);
      }

      return milestone;
    } catch (error) {
      console.error("Error in getMilestoneById:", error);
      throw error;
    }
  }
}
