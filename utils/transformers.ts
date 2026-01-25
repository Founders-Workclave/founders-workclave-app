import type {
  ApiProject,
  Project,
  AgencyDashboardResponse,
  DashboardStats,
} from "@/types/agencyProjectsNew";

/**
 * Transform API project to UI project format
 */
export const transformProject = (apiProject: ApiProject): Project => {
  const totalValue = parseFloat(apiProject.projectValue);
  const paidBalance = parseFloat(apiProject.paidBalance);
  const percentPaid =
    totalValue > 0 ? Math.round((paidBalance / totalValue) * 100) : 0;

  const [current, total] = apiProject.progress
    .split("/")
    .map((num) => parseInt(num.trim(), 10));

  const statusMap: Record<string, Project["status"]> = {
    ongoing: "In-Progress",
    completed: "Completed",
    "on-hold": "On-Hold",
    pending: "Pending",
  };

  return {
    id: apiProject.id,
    projectName: apiProject.name,
    client: {
      id: apiProject.client,
      name: "Client Name", // You'll need to fetch this separately or include in API
    },
    totalProjectValue: totalValue,
    amountPaid: paidBalance,
    percentPaid,
    progress: {
      current,
      total,
    },
    status: statusMap[apiProject.status] || "Pending",
  };
};

/**
 * Transform dashboard response to stats format
 */
export const transformDashboardStats = (
  data: AgencyDashboardResponse
): DashboardStats[] => {
  return [
    {
      id: 1,
      label: "Active Projects",
      value: data.activeProject,
      icon: "projects",
      bgColor: "#E0F2FE",
    },
    {
      id: 2,
      label: "Total Clients",
      value: data.totalClients,
      icon: "clients",
      bgColor: "#FEF3C7",
    },
    {
      id: 3,
      label: "Monthly Revenue",
      value: `$${data.monthRevenue.toLocaleString()}`,
      icon: "dollar",
      bgColor: "#D1FAE5",
    },
    {
      id: 4,
      label: "Total PRDs",
      value: data.totalPRDS,
      icon: "document",
      bgColor: "#E9D5FF",
    },
  ];
};
