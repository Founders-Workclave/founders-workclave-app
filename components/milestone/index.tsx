"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { Milestone } from "@/types/project";
import { MilestoneService } from "@/lib/api/milestoneService";
import MilestoneCard from "./milestoneCard";
import ServiceUnavailable from "../errorBoundary/serviceUnavailable";
import AllLoading from "@/layout/Loader";

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
  status: string;
  deliverables: APIDeliverable[];
  completedDate?: string | null;
  progress?: number;
  note?: string;
}

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

  const transformMilestone = (apiMilestone: APIMilestone): Milestone => {
    let status: "completed" | "in-progress" | "pending";

    const apiStatus = apiMilestone.status?.toLowerCase().trim();

    if (apiMilestone.completed || apiStatus === "completed") {
      status = "completed";
    } else if (
      apiStatus === "in-progress" ||
      apiStatus === "in_progress" ||
      apiStatus === "active"
    ) {
      status = "in-progress";
    } else {
      status = "pending";
    }

    return {
      id: apiMilestone.id,
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
      status,
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
        let apiMilestones: APIMilestone[];

        if (Array.isArray(response)) {
          apiMilestones = response as unknown as APIMilestone[];
        } else if (
          response &&
          typeof response === "object" &&
          "milestones" in response
        ) {
          apiMilestones = (response as MilestonesResponse).milestones;
        } else {
          throw new Error("Invalid response format");
        }

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
  };

  const handleRequestUpdate = (milestoneId: string | number) => {
    console.log("Request update for milestone:", milestoneId);
  };

  if (isLoading) {
    return <AllLoading text="Loading milestones..." />;
  }

  if (error) {
    return (
      <ServiceUnavailable
        title="Couldn't load milestones"
        message="We're having trouble loading your milestones. Please try again."
        showRetry
        onRetry={() => window.location.reload()}
      />
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
