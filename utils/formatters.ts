export const STATUS_DISPLAY: Record<string, string> = {
  ongoing: "Ongoing",
  "in-progress": "In Progress",
  in_progress: "In Progress",
  completed: "Completed",
  paused: "Paused",
  pending: "Pending",
  active: "Active",
  "on-hold": "On Hold",
  on_hold: "On Hold",
  terminated: "Terminated",
  cancelled: "Cancelled",
  canceled: "Canceled",
};

export const formatStatus = (status: string | undefined): string => {
  if (!status) return "Unknown";

  // Check if we have a direct mapping
  const mapped = STATUS_DISPLAY[status.toLowerCase()];
  if (mapped) return mapped;

  // Otherwise, convert to title case and replace hyphens/underscores with spaces
  return status
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return `$${numAmount.toLocaleString()}`;
};
