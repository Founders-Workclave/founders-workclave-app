export interface NotificationApiResponse {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  link: string;
  user: string;
}

export interface MarkAsReadResponse {
  message: string;
}

// Component Types (matching your existing interface)
export interface Notification {
  id: string;
  type:
    | "milestone"
    | "document"
    | "payment"
    | "prd"
    | "wallet"
    | "consultation";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  amount?: number;
  link?: string;
}

// Helper function to determine notification type from title/message
export function determineNotificationType(
  title: string,
  message: string
): Notification["type"] {
  const lowerTitle = title.toLowerCase();
  const lowerMessage = message.toLowerCase();

  if (lowerTitle.includes("milestone") || lowerMessage.includes("milestone")) {
    return "milestone";
  }
  if (lowerTitle.includes("document") || lowerMessage.includes("document")) {
    return "document";
  }
  if (
    lowerTitle.includes("payment") ||
    lowerMessage.includes("payment") ||
    lowerTitle.includes("paid")
  ) {
    return "payment";
  }
  if (lowerTitle.includes("prd") || lowerMessage.includes("prd")) {
    return "prd";
  }
  if (lowerTitle.includes("wallet") || lowerMessage.includes("wallet")) {
    return "wallet";
  }
  if (
    lowerTitle.includes("consultation") ||
    lowerMessage.includes("consultation")
  ) {
    return "consultation";
  }

  // Default to document for project-related notifications
  if (lowerTitle.includes("project")) {
    return "document";
  }

  return "document"; // default fallback
}

// Helper function to format timestamp
export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  // For older dates, show the actual date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// Mapper function to convert API response to component format
export function mapApiNotificationToComponent(
  apiNotification: NotificationApiResponse
): Notification {
  return {
    id: apiNotification.id,
    type: determineNotificationType(
      apiNotification.title,
      apiNotification.message
    ),
    title: apiNotification.title,
    description: apiNotification.message,
    timestamp: formatTimestamp(apiNotification.created_at),
    isRead: apiNotification.is_read,
    link: apiNotification.link,
  };
}
