"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { Milestone } from "@/types/project";
import { MilestoneService } from "@/lib/api/milestoneService";
import MilestoneCard from "./milestoneCard";
import Loader from "../loader";

// API response type
interface APIDeliverable {
  task: string;
}

interface APIMilestone {
  id: string;
  title: string;
  description: string;
  price: string;
  dueDate: string;
  paid: boolean;
  completed: boolean;
  order: number;
  deliverables: APIDeliverable[];
  completedDate?: string | null;
  progress?: number;
  note?: string;
}

// API response wrapper
interface MilestonesResponse {
  message: string;
  project: string;
  milestones: APIMilestone[];
}

interface MilestonesPageProps {
  projectId?: string;
}

const MilestonesPage: React.FC<MilestonesPageProps> = ({ projectId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform API milestone to app Milestone type
  const transformMilestone = (apiMilestone: APIMilestone): Milestone => {
    // Derive status from paid and completed flags
    let status: "completed" | "in-progress" | "pending";
    if (apiMilestone.completed) {
      status = "completed";
    } else if (apiMilestone.paid) {
      status = "in-progress";
    } else {
      status = "pending";
    }

    return {
      id: parseInt(apiMilestone.id, 10) || 0,
      number: apiMilestone.order,
      title: apiMilestone.title,
      price: apiMilestone.price,
      paid: apiMilestone.paid,
      completed: apiMilestone.completed,
      order: apiMilestone.order,
      description: apiMilestone.description,
      dueDate: apiMilestone.dueDate,
      completedDate: apiMilestone.completedDate || null,
      payment: parseFloat(apiMilestone.price.replace(/,/g, "")) || 0,
      status: status,
      progress: apiMilestone.progress || 0,
      deliverables: apiMilestone.deliverables.map((d) => d.task),
      note: apiMilestone.note,
    };
  };

  useEffect(() => {
    const fetchMilestones = async () => {
      if (!projectId) {
        setError("Project ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await MilestoneService.getMilestones(projectId);

        // Handle response - could be array or wrapped object
        let apiMilestones: APIMilestone[];

        if (Array.isArray(response)) {
          // Direct array response - use unknown as intermediate type
          apiMilestones = response as unknown as APIMilestone[];
        } else if (
          response &&
          typeof response === "object" &&
          "milestones" in response
        ) {
          // Wrapped response with milestones property
          apiMilestones = (response as MilestonesResponse).milestones;
        } else {
          throw new Error("Invalid response format");
        }

        // Transform API data to app Milestone type
        const transformedData = apiMilestones.map(transformMilestone);
        setMilestones(transformedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load milestones"
        );
        console.error("Error fetching milestones:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestones();
  }, [projectId]);

  const handleViewDetails = (milestoneId: string | number) => {
    console.log("View details for milestone:", milestoneId);
    // TODO: Navigate to milestone details page or open modal
  };

  const handleRequestUpdate = (milestoneId: string | number) => {
    console.log("Request update for milestone:", milestoneId);
    // TODO: Implement update request functionality
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loader type="pulse" loading={isLoading} size={15} color="#5865F2" />
        <p>Loading milestones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Milestones</h1>
      </div>
      <div className={styles.milestonesTimeline}>
        {milestones.length > 0 ? (
          milestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              onViewDetails={() => handleViewDetails(milestone.id)}
              onRequestUpdate={() => handleRequestUpdate(milestone.id)}
            />
          ))
        ) : (
          <p className={styles.emptyMessage}>
            No milestones found for this project.
          </p>
        )}
      </div>
    </div>
  );
};

export default MilestonesPage;
